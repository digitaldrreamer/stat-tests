import dotenv from 'dotenv';

dotenv.config();

// * Configuration
const ITERATIONS = 1000000; // 1 million iterations

// * Test object with multiple boolean properties
class ObjectWithBooleans {
    constructor() {
        this.isActive = false;
        this.isVerified = false;
        this.isPremium = false;
        this.isAdmin = false;
        this.canRead = false;
        this.canWrite = false;
        this.canDelete = false;
        this.canShare = false;
    }

    hasPermission(permission) {
        switch (permission) {
            case 'read': return this.canRead;
            case 'write': return this.canWrite;
            case 'delete': return this.canDelete;
            case 'share': return this.canShare;
            default: return false;
        }
    }
}

// * Test object with bitmask
class ObjectWithBitmask {
    constructor() {
        this.flags = 0;
    }

    // * Flag positions
    static FLAGS = {
        IS_ACTIVE: 1 << 0,    // 1
        IS_VERIFIED: 1 << 1,  // 2
        IS_PREMIUM: 1 << 2,   // 4
        IS_ADMIN: 1 << 3,     // 8
        CAN_READ: 1 << 4,     // 16
        CAN_WRITE: 1 << 5,    // 32
        CAN_DELETE: 1 << 6,   // 64
        CAN_SHARE: 1 << 7,    // 128
    };

    hasFlag(flag) {
        return (this.flags & flag) !== 0;
    }

    setFlag(flag, value) {
        if (value) {
            this.flags |= flag;
        } else {
            this.flags &= ~flag;
        }
    }
}

// * Benchmark: Multiple boolean properties vs single bitmask
const benchmarkBooleansVsBitmask = () => {
    console.log('🔬 Benchmarking Multiple boolean properties vs Single bitmask...\n');
    console.log(`📊 Running ${ITERATIONS.toLocaleString()} iterations...\n`);

    // * Setup test objects
    const objWithBooleans = new ObjectWithBooleans();
    objWithBooleans.isActive = true;
    objWithBooleans.isVerified = true;
    objWithBooleans.canRead = true;
    objWithBooleans.canWrite = true;

    const objWithBitmask = new ObjectWithBitmask();
    objWithBitmask.setFlag(ObjectWithBitmask.FLAGS.IS_ACTIVE, true);
    objWithBitmask.setFlag(ObjectWithBitmask.FLAGS.IS_VERIFIED, true);
    objWithBitmask.setFlag(ObjectWithBitmask.FLAGS.CAN_READ, true);
    objWithBitmask.setFlag(ObjectWithBitmask.FLAGS.CAN_WRITE, true);

    // * Verify both approaches work
    const boolResult = objWithBooleans.isActive && objWithBooleans.canRead;
    const bitmaskResult = objWithBitmask.hasFlag(ObjectWithBitmask.FLAGS.IS_ACTIVE) &&
        objWithBitmask.hasFlag(ObjectWithBitmask.FLAGS.CAN_READ);
    if (boolResult !== bitmaskResult) {
        console.error('❌ Results mismatch!');
        process.exit(1);
    }

    const booleanTimes = [];
    const bitmaskTimes = [];

    // * Warm up
    for (let i = 0; i < 1000; i++) {
        objWithBooleans.isActive && objWithBooleans.canRead;
        objWithBitmask.hasFlag(ObjectWithBitmask.FLAGS.IS_ACTIVE) &&
            objWithBitmask.hasFlag(ObjectWithBitmask.FLAGS.CAN_READ);
    }

    // * Benchmark: Check multiple boolean properties
    const booleanStart = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        const start = performance.now();
        const result = objWithBooleans.isActive &&
            objWithBooleans.isVerified &&
            objWithBooleans.canRead &&
            objWithBooleans.canWrite;
        booleanTimes.push(performance.now() - start);
    }
    const booleanTotal = performance.now() - booleanStart;

    // * Benchmark: Check bitmask flags
    const bitmaskStart = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        const start = performance.now();
        const result = objWithBitmask.hasFlag(ObjectWithBitmask.FLAGS.IS_ACTIVE) &&
            objWithBitmask.hasFlag(ObjectWithBitmask.FLAGS.IS_VERIFIED) &&
            objWithBitmask.hasFlag(ObjectWithBitmask.FLAGS.CAN_READ) &&
            objWithBitmask.hasFlag(ObjectWithBitmask.FLAGS.CAN_WRITE);
        bitmaskTimes.push(performance.now() - start);
    }
    const bitmaskTotal = performance.now() - bitmaskStart;

    // * Calculate statistics for Boolean properties
    const booleanSorted = booleanTimes.sort((a, b) => a - b);
    const booleanAvg = booleanTimes.reduce((a, b) => a + b, 0) / booleanTimes.length;
    const booleanMin = booleanSorted[0];
    const booleanMax = booleanSorted[booleanSorted.length - 1];
    const booleanMedian = booleanSorted[Math.floor(booleanSorted.length / 2)];
    const booleanP95 = booleanSorted[Math.floor(booleanSorted.length * 0.95)];
    const booleanP99 = booleanSorted[Math.floor(booleanSorted.length * 0.99)];

    // * Calculate statistics for Bitmask
    const bitmaskSorted = bitmaskTimes.sort((a, b) => a - b);
    const bitmaskAvg = bitmaskTimes.reduce((a, b) => a + b, 0) / bitmaskTimes.length;
    const bitmaskMin = bitmaskSorted[0];
    const bitmaskMax = bitmaskSorted[bitmaskSorted.length - 1];
    const bitmaskMedian = bitmaskSorted[Math.floor(bitmaskSorted.length / 2)];
    const bitmaskP95 = bitmaskSorted[Math.floor(bitmaskSorted.length * 0.95)];
    const bitmaskP99 = bitmaskSorted[Math.floor(bitmaskSorted.length * 0.99)];

    // * Display results
    console.log('📈 Results:\n');

    console.log('🔘 Multiple Boolean Properties:\n');
    console.log(`   Total time: ${booleanTotal.toFixed(2)}ms`);
    console.log(`   Average: ${booleanAvg.toFixed(4)}ms`);
    console.log(`   Median: ${booleanMedian.toFixed(4)}ms`);
    console.log(`   Min: ${booleanMin.toFixed(4)}ms`);
    console.log(`   Max: ${booleanMax.toFixed(4)}ms`);
    console.log(`   P95: ${booleanP95.toFixed(4)}ms`);
    console.log(`   P99: ${booleanP99.toFixed(4)}ms`);
    console.log(`   Operations/sec: ${((ITERATIONS / booleanTotal) * 1000).toFixed(2)}\n`);

    console.log('🔢 Single Bitmask:\n');
    console.log(`   Total time: ${bitmaskTotal.toFixed(2)}ms`);
    console.log(`   Average: ${bitmaskAvg.toFixed(4)}ms`);
    console.log(`   Median: ${bitmaskMedian.toFixed(4)}ms`);
    console.log(`   Min: ${bitmaskMin.toFixed(4)}ms`);
    console.log(`   Max: ${bitmaskMax.toFixed(4)}ms`);
    console.log(`   P95: ${bitmaskP95.toFixed(4)}ms`);
    console.log(`   P99: ${bitmaskP99.toFixed(4)}ms`);
    console.log(`   Operations/sec: ${((ITERATIONS / bitmaskTotal) * 1000).toFixed(2)}\n`);

    const speedup = booleanTotal / bitmaskTotal;
    console.log('⚡ Performance Comparison:\n');
    console.log(`   Bitmask is ${speedup.toFixed(2)}x faster than multiple booleans`);
    console.log(`   Time saved: ${(booleanTotal - bitmaskTotal).toFixed(2)}ms (${(((booleanTotal - bitmaskTotal) / booleanTotal) * 100).toFixed(1)}%)\n`);

    return {
        method: 'booleans-vs-bitmask',
        iterations: ITERATIONS,
        booleans: {
            total: booleanTotal,
            avg: booleanAvg,
            median: booleanMedian,
            min: booleanMin,
            max: booleanMax,
            p95: booleanP95,
            p99: booleanP99,
            opsPerSec: (ITERATIONS / booleanTotal) * 1000,
        },
        bitmask: {
            total: bitmaskTotal,
            avg: bitmaskAvg,
            median: bitmaskMedian,
            min: bitmaskMin,
            max: bitmaskMax,
            p95: bitmaskP95,
            p99: bitmaskP99,
            opsPerSec: (ITERATIONS / bitmaskTotal) * 1000,
        },
        speedup,
    };
};

try {
    const results = benchmarkBooleansVsBitmask();
    console.log('✅ Benchmark complete!\n');
    process.exit(0);
} catch (err) {
    console.error('❌ Benchmark failed:', err);
    process.exit(1);
}

