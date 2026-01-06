import dotenv from 'dotenv';

dotenv.config();

// * Configuration
const OBJECT_COUNT = 100000; // 100k objects

// * Memory measurement helper (approximate)
const getMemoryUsage = () => {
    if (global.gc) {
        global.gc();
    }
    const usage = process.memoryUsage();
    return {
        heapUsed: usage.heapUsed,
        heapTotal: usage.heapTotal,
        external: usage.external,
        rss: usage.rss,
    };
};

// * Object with multiple boolean properties
class ObjectWithBooleans {
    constructor(id) {
        this.id = id;
        this.isActive = false;
        this.isVerified = false;
        this.isPremium = false;
        this.isAdmin = false;
        this.canRead = false;
        this.canWrite = false;
        this.canDelete = false;
        this.canShare = false;
        this.canManage = false;
        this.canInvite = false;
    }
}

// * Object with bitmask
class ObjectWithBitmask {
    constructor(id) {
        this.id = id;
        this.flags = 0; // Single number instead of 10 booleans
    }

    static FLAGS = {
        IS_ACTIVE: 1 << 0,
        IS_VERIFIED: 1 << 1,
        IS_PREMIUM: 1 << 2,
        IS_ADMIN: 1 << 3,
        CAN_READ: 1 << 4,
        CAN_WRITE: 1 << 5,
        CAN_DELETE: 1 << 6,
        CAN_SHARE: 1 << 7,
        CAN_MANAGE: 1 << 8,
        CAN_INVITE: 1 << 9,
    };
}

// * Array approach
class ObjectWithArray {
    constructor(id) {
        this.id = id;
        this.permissions = []; // Array of permission IDs
    }
}

// * Benchmark: Memory usage comparison
const benchmarkMemoryUsage = async () => {
    console.log('🔬 Benchmarking Memory Usage Comparison...\n');
    console.log(`📊 Creating ${OBJECT_COUNT.toLocaleString()} objects of each type...\n`);

    // * Measure baseline memory
    const baselineMemory = getMemoryUsage();
    console.log('📊 Baseline Memory:\n');
    console.log(`   Heap Used: ${(baselineMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Heap Total: ${(baselineMemory.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   RSS: ${(baselineMemory.rss / 1024 / 1024).toFixed(2)} MB\n`);

    // * Test 1: Multiple boolean properties
    console.log('🔘 Creating objects with multiple boolean properties...');
    const boolStartMemory = getMemoryUsage();
    const objectsWithBooleans = [];
    for (let i = 0; i < OBJECT_COUNT; i++) {
        const obj = new ObjectWithBooleans(i);
        obj.isActive = i % 2 === 0;
        obj.isVerified = i % 3 === 0;
        obj.canRead = i % 4 === 0;
        objectsWithBooleans.push(obj);
    }
    const boolEndMemory = getMemoryUsage();
    const boolMemoryUsed = boolEndMemory.heapUsed - boolStartMemory.heapUsed;
    const boolMemoryPerObject = boolMemoryUsed / OBJECT_COUNT;

    console.log(`   Heap Used: ${(boolMemoryUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Per Object: ${(boolMemoryPerObject).toFixed(2)} bytes\n`);

    // * Clear and wait for GC
    objectsWithBooleans.length = 0;
    if (global.gc) {
        global.gc();
    }
    await new Promise((resolve) => setTimeout(resolve, 100));

    // * Test 2: Single bitmask
    console.log('🔢 Creating objects with single bitmask...');
    const bitmaskStartMemory = getMemoryUsage();
    const objectsWithBitmask = [];
    for (let i = 0; i < OBJECT_COUNT; i++) {
        const obj = new ObjectWithBitmask(i);
        if (i % 2 === 0) obj.flags |= ObjectWithBitmask.FLAGS.IS_ACTIVE;
        if (i % 3 === 0) obj.flags |= ObjectWithBitmask.FLAGS.IS_VERIFIED;
        if (i % 4 === 0) obj.flags |= ObjectWithBitmask.FLAGS.CAN_READ;
        objectsWithBitmask.push(obj);
    }
    const bitmaskEndMemory = getMemoryUsage();
    const bitmaskMemoryUsed = bitmaskEndMemory.heapUsed - bitmaskStartMemory.heapUsed;
    const bitmaskMemoryPerObject = bitmaskMemoryUsed / OBJECT_COUNT;

    console.log(`   Heap Used: ${(bitmaskMemoryUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Per Object: ${(bitmaskMemoryPerObject).toFixed(2)} bytes\n`);

    // * Clear and wait for GC
    objectsWithBitmask.length = 0;
    if (global.gc) {
        global.gc();
    }
    await new Promise((resolve) => setTimeout(resolve, 100));

    // * Test 3: Array approach (for comparison)
    console.log('📋 Creating objects with array of permissions...');
    const arrayStartMemory = getMemoryUsage();
    const objectsWithArray = [];
    for (let i = 0; i < OBJECT_COUNT; i++) {
        const obj = new ObjectWithArray(i);
        if (i % 2 === 0) obj.permissions.push('isActive');
        if (i % 3 === 0) obj.permissions.push('isVerified');
        if (i % 4 === 0) obj.permissions.push('canRead');
        objectsWithArray.push(obj);
    }
    const arrayEndMemory = getMemoryUsage();
    const arrayMemoryUsed = arrayEndMemory.heapUsed - arrayStartMemory.heapUsed;
    const arrayMemoryPerObject = arrayMemoryUsed / OBJECT_COUNT;

    console.log(`   Heap Used: ${(arrayMemoryUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Per Object: ${(arrayMemoryPerObject).toFixed(2)} bytes\n`);

    // * Display comparison
    console.log('📈 Memory Usage Comparison:\n');
    console.log(`   Multiple Booleans: ${(boolMemoryUsed / 1024 / 1024).toFixed(2)} MB (${(boolMemoryPerObject).toFixed(2)} bytes/object)`);
    console.log(`   Single Bitmask:    ${(bitmaskMemoryUsed / 1024 / 1024).toFixed(2)} MB (${(bitmaskMemoryPerObject).toFixed(2)} bytes/object)`);
    console.log(`   Array:             ${(arrayMemoryUsed / 1024 / 1024).toFixed(2)} MB (${(arrayMemoryPerObject).toFixed(2)} bytes/object)\n`);

    const boolVsBitmask = boolMemoryUsed / bitmaskMemoryUsed;
    const boolVsArray = boolMemoryUsed / arrayMemoryUsed;
    const bitmaskVsArray = bitmaskMemoryUsed / arrayMemoryUsed;

    console.log('💾 Memory Efficiency:\n');
    console.log(`   Bitmask uses ${((1 - (1 / boolVsBitmask)) * 100).toFixed(1)}% less memory than multiple booleans`);
    console.log(`   Bitmask uses ${((1 - (1 / bitmaskVsArray)) * 100).toFixed(1)}% less memory than array`);
    console.log(`   Multiple booleans use ${((1 - (1 / boolVsArray)) * 100).toFixed(1)}% less memory than array\n`);

    const memorySaved = boolMemoryUsed - bitmaskMemoryUsed;
    console.log(`   Memory saved with bitmask: ${(memorySaved / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   For ${OBJECT_COUNT.toLocaleString()} objects: ${(memorySaved / OBJECT_COUNT).toFixed(2)} bytes per object\n`);

    return {
        method: 'memory-usage',
        objectCount: OBJECT_COUNT,
        multipleBooleans: {
            totalMB: boolMemoryUsed / 1024 / 1024,
            perObject: boolMemoryPerObject,
        },
        singleBitmask: {
            totalMB: bitmaskMemoryUsed / 1024 / 1024,
            perObject: bitmaskMemoryPerObject,
        },
        array: {
            totalMB: arrayMemoryUsed / 1024 / 1024,
            perObject: arrayMemoryPerObject,
        },
        savings: {
            mb: memorySaved / 1024 / 1024,
            perObject: memorySaved / OBJECT_COUNT,
            percentage: ((1 - (1 / boolVsBitmask)) * 100),
        },
    };
};

benchmarkMemoryUsage()
    .then((results) => {
        console.log('✅ Benchmark complete!\n');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Benchmark failed:', err);
        process.exit(1);
    });

