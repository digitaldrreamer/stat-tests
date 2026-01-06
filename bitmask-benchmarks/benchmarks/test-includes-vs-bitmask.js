import dotenv from 'dotenv';

dotenv.config();

// * Configuration
const ITERATIONS = 1000000; // 1 million iterations for statistical significance

// * Test data setup
const createArray = (size) => {
    return Array.from({ length: size }, (_, i) => i);
};

const createBitmask = (values) => {
    return values.reduce((mask, value) => mask | (1 << value), 0);
};

// * Benchmark: Array .includes() vs Bitmask & check
const benchmarkIncludesVsBitmask = () => {
    console.log('🔬 Benchmarking Array .includes() vs Bitmask & check...\n');
    console.log(`📊 Running ${ITERATIONS.toLocaleString()} iterations...\n`);

    // * Test scenario: Check if a value exists in a set
    const testValues = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    const checkValue = 25;

    // * Setup: Array approach
    const array = createArray(100);
    const arrayIncludes = array.includes(checkValue);

    // * Setup: Bitmask approach
    const bitmask = createBitmask(testValues);
    const bitmaskCheck = (bitmask & (1 << checkValue)) !== 0;

    // * Verify both approaches give same result
    if (arrayIncludes !== bitmaskCheck) {
        console.error('❌ Results mismatch!');
        process.exit(1);
    }

    const arrayTimes = [];
    const bitmaskTimes = [];

    // * Warm up
    for (let i = 0; i < 1000; i++) {
        array.includes(checkValue);
        (bitmask & (1 << checkValue)) !== 0;
    }

    // * Benchmark Array .includes()
    const arrayStart = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        const start = performance.now();
        array.includes(checkValue);
        arrayTimes.push(performance.now() - start);
    }
    const arrayTotal = performance.now() - arrayStart;

    // * Benchmark Bitmask & check
    const bitmaskStart = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        const start = performance.now();
        (bitmask & (1 << checkValue)) !== 0;
        bitmaskTimes.push(performance.now() - start);
    }
    const bitmaskTotal = performance.now() - bitmaskStart;

    // * Calculate statistics for Array .includes()
    const arraySorted = arrayTimes.sort((a, b) => a - b);
    const arrayAvg = arrayTimes.reduce((a, b) => a + b, 0) / arrayTimes.length;
    const arrayMin = arraySorted[0];
    const arrayMax = arraySorted[arraySorted.length - 1];
    const arrayMedian = arraySorted[Math.floor(arraySorted.length / 2)];
    const arrayP95 = arraySorted[Math.floor(arraySorted.length * 0.95)];
    const arrayP99 = arraySorted[Math.floor(arraySorted.length * 0.99)];

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

    console.log('📋 Array .includes():\n');
    console.log(`   Total time: ${arrayTotal.toFixed(2)}ms`);
    console.log(`   Average: ${arrayAvg.toFixed(4)}ms`);
    console.log(`   Median: ${arrayMedian.toFixed(4)}ms`);
    console.log(`   Min: ${arrayMin.toFixed(4)}ms`);
    console.log(`   Max: ${arrayMax.toFixed(4)}ms`);
    console.log(`   P95: ${arrayP95.toFixed(4)}ms`);
    console.log(`   P99: ${arrayP99.toFixed(4)}ms`);
    console.log(`   Operations/sec: ${((ITERATIONS / arrayTotal) * 1000).toFixed(2)}\n`);

    console.log('🔢 Bitmask & check:\n');
    console.log(`   Total time: ${bitmaskTotal.toFixed(2)}ms`);
    console.log(`   Average: ${bitmaskAvg.toFixed(4)}ms`);
    console.log(`   Median: ${bitmaskMedian.toFixed(4)}ms`);
    console.log(`   Min: ${bitmaskMin.toFixed(4)}ms`);
    console.log(`   Max: ${bitmaskMax.toFixed(4)}ms`);
    console.log(`   P95: ${bitmaskP95.toFixed(4)}ms`);
    console.log(`   P99: ${bitmaskP99.toFixed(4)}ms`);
    console.log(`   Operations/sec: ${((ITERATIONS / bitmaskTotal) * 1000).toFixed(2)}\n`);

    const speedup = arrayTotal / bitmaskTotal;
    console.log('⚡ Performance Comparison:\n');
    console.log(`   Bitmask is ${speedup.toFixed(2)}x faster than Array .includes()`);
    console.log(`   Time saved: ${(arrayTotal - bitmaskTotal).toFixed(2)}ms (${(((arrayTotal - bitmaskTotal) / arrayTotal) * 100).toFixed(1)}%)\n`);

    return {
        method: 'includes-vs-bitmask',
        iterations: ITERATIONS,
        array: {
            total: arrayTotal,
            avg: arrayAvg,
            median: arrayMedian,
            min: arrayMin,
            max: arrayMax,
            p95: arrayP95,
            p99: arrayP99,
            opsPerSec: (ITERATIONS / arrayTotal) * 1000,
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
    const results = benchmarkIncludesVsBitmask();
    console.log('✅ Benchmark complete!\n');
    process.exit(0);
} catch (err) {
    console.error('❌ Benchmark failed:', err);
    process.exit(1);
}

