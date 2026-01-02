import http from 'http';
import dotenv from 'dotenv';

// * Load environment variables
dotenv.config();

// * Configuration
const ITERATIONS = 1000;
const SERVER_URL = 'http://localhost:3000';

// * Check server connectivity
const checkServer = async () => {
    return new Promise((resolve, reject) => {
        const req = http.request(`${SERVER_URL}/health`, { method: 'GET', timeout: 2000 }, (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                reject(new Error(`Server returned status ${res.statusCode}`));
            }
        });

        req.on('error', (err) => {
            reject(new Error(`Cannot connect to server: ${err.message}`));
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Server connection timeout'));
        });

        req.end();
    });
};

// * Benchmark function
const benchmarkHybrid = async () => {
    console.log('🔬 Benchmarking Hybrid authentication...\n');

    // * Check server is running
    try {
        await checkServer();
        console.log('✓ Server is running\n');
    } catch (err) {
        console.error('❌ Server connection failed:', err.message);
        console.error(`   Make sure the server is running on ${SERVER_URL}`);
        console.error('   Start it with: npm start (or bun start)\n');
        throw err;
    }

    console.log(`📊 Running ${ITERATIONS} requests...\n`);

    const fastPathTimes = [];
    const slowPathTimes = [];
    let successCount = 0;
    let errorCount = 0;
    let fastPathCount = 0;
    let slowPathCount = 0;
    let cookies = '';

    // * Setup: Create hybrid session first
    try {
        await new Promise((resolve, reject) => {
            const req = http.request(`${SERVER_URL}/api/setup/hybrid`, { method: 'POST', timeout: 5000 }, (res) => {
                const setCookies = res.headers['set-cookie'];
                if (setCookies) {
                    cookies = setCookies.map((c) => c.split(';')[0]).join('; ');
                }
                if (res.statusCode === 200) {
                    resolve();
                } else {
                    reject(new Error(`Setup failed with status ${res.statusCode}`));
                }
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Setup request timeout'));
            });
            req.end();
        });
    } catch (err) {
        console.error('❌ Failed to create hybrid session:', err.message);
        console.error('   Check that the database is set up: npm run setup:db\n');
        throw err;
    }

    if (!cookies) {
        console.error('❌ Failed to get cookies from server');
        throw new Error('Hybrid session setup failed - no cookies received');
    }

    // * Run benchmark
    const startTime = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
        const requestStart = performance.now();

        try {
            await new Promise((resolve, reject) => {
                const req = http.request(
                    `${SERVER_URL}/api/protected-hybrid`,
                    {
                        method: 'GET',
                        headers: {
                            'Cookie': cookies,
                        },
                    },
                    (res) => {
                        const requestEnd = performance.now();
                        const duration = requestEnd - requestStart;

                        if (res.statusCode === 200) {
                            successCount++;

                            // * Determine if it was fast or slow path
                            let data = '';
                            res.on('data', (chunk) => {
                                data += chunk;
                            });

                            res.on('end', () => {
                                try {
                                    const json = JSON.parse(data);
                                    if (json.method === 'hybrid-fast') {
                                        fastPathCount++;
                                        fastPathTimes.push(duration);
                                    } else if (json.method === 'hybrid-slow') {
                                        slowPathCount++;
                                        slowPathTimes.push(duration);
                                    }
                                } catch (e) {
                                    // * If we can't parse, assume fast path
                                    fastPathCount++;
                                    fastPathTimes.push(duration);
                                }
                                resolve();
                            });
                        } else {
                            errorCount++;
                            resolve();
                        }
                    }
                );

                req.on('error', (err) => {
                    errorCount++;
                    reject(err);
                });

                req.end();
            });
        } catch (err) {
            errorCount++;
        }
    }

    const totalTime = performance.now() - startTime;

    // * Calculate statistics for fast path
    const fastPathSorted = fastPathTimes.sort((a, b) => a - b);
    const fastPathAvg = fastPathTimes.length > 0
        ? fastPathTimes.reduce((a, b) => a + b, 0) / fastPathTimes.length
        : 0;
    const fastPathMin = fastPathSorted[0] || 0;
    const fastPathMax = fastPathSorted[fastPathSorted.length - 1] || 0;
    const fastPathMedian = fastPathSorted[Math.floor(fastPathSorted.length / 2)] || 0;
    const fastPathP95 = fastPathSorted[Math.floor(fastPathSorted.length * 0.95)] || 0;
    const fastPathP99 = fastPathSorted[Math.floor(fastPathSorted.length * 0.99)] || 0;

    // * Calculate statistics for slow path
    const slowPathSorted = slowPathTimes.sort((a, b) => a - b);
    const slowPathAvg = slowPathTimes.length > 0
        ? slowPathTimes.reduce((a, b) => a + b, 0) / slowPathTimes.length
        : 0;
    const slowPathMin = slowPathSorted[0] || 0;
    const slowPathMax = slowPathSorted[slowPathSorted.length - 1] || 0;
    const slowPathMedian = slowPathSorted[Math.floor(slowPathSorted.length / 2)] || 0;
    const slowPathP95 = slowPathSorted[Math.floor(slowPathSorted.length * 0.95)] || 0;
    const slowPathP99 = slowPathSorted[Math.floor(slowPathSorted.length * 0.99)] || 0;

    // * Overall statistics
    const allTimes = [...fastPathTimes, ...slowPathTimes];
    const allSorted = allTimes.sort((a, b) => a - b);
    const overallAvg = allTimes.length > 0
        ? allTimes.reduce((a, b) => a + b, 0) / allTimes.length
        : 0;
    const overallMedian = allSorted[Math.floor(allSorted.length / 2)] || 0;
    const overallP95 = allSorted[Math.floor(allSorted.length * 0.95)] || 0;
    const overallP99 = allSorted[Math.floor(allSorted.length * 0.99)] || 0;

    const reqPerSec = (ITERATIONS / totalTime) * 1000;

    // * Check if we have any successful requests
    if (successCount === 0) {
        console.error('❌ All requests failed!');
        console.error('   Make sure the server is running on http://localhost:3000');
        console.error('   Check that the database is set up and accessible\n');
        throw new Error('All requests failed - server may not be running or database not accessible');
    }

    // * Display results
    console.log('📈 Overall Results:\n');
    console.log(`   Total requests: ${ITERATIONS}`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total time: ${totalTime.toFixed(2)}ms`);
    console.log(`   Requests/sec: ${reqPerSec.toFixed(2)}\n`);

    console.log('🔄 Path Distribution:\n');
    console.log(`   Fast path (access token): ${fastPathCount} (${((fastPathCount / ITERATIONS) * 100).toFixed(1)}%)`);
    console.log(`   Slow path (refresh token): ${slowPathCount} (${((slowPathCount / ITERATIONS) * 100).toFixed(1)}%)\n`);

    console.log('⏱️  Overall Response Times:\n');
    console.log(`   Average: ${overallAvg.toFixed(3)}ms`);
    console.log(`   Median: ${overallMedian.toFixed(3)}ms`);
    console.log(`   P95: ${overallP95.toFixed(3)}ms`);
    console.log(`   P99: ${overallP99.toFixed(3)}ms\n`);

    if (fastPathCount > 0) {
        console.log('⚡ Fast Path (Access Token) Response Times:\n');
        console.log(`   Average: ${fastPathAvg.toFixed(3)}ms`);
        console.log(`   Median: ${fastPathMedian.toFixed(3)}ms`);
        console.log(`   Min: ${fastPathMin.toFixed(3)}ms`);
        console.log(`   Max: ${fastPathMax.toFixed(3)}ms`);
        console.log(`   P95: ${fastPathP95.toFixed(3)}ms`);
        console.log(`   P99: ${fastPathP99.toFixed(3)}ms\n`);
    }

    if (slowPathCount > 0) {
        console.log('🐌 Slow Path (Refresh Token) Response Times:\n');
        console.log(`   Average: ${slowPathAvg.toFixed(3)}ms`);
        console.log(`   Median: ${slowPathMedian.toFixed(3)}ms`);
        console.log(`   Min: ${slowPathMin.toFixed(3)}ms`);
        console.log(`   Max: ${slowPathMax.toFixed(3)}ms`);
        console.log(`   P95: ${slowPathP95.toFixed(3)}ms`);
        console.log(`   P99: ${slowPathP99.toFixed(3)}ms\n`);
    }

    return {
        method: 'hybrid',
        iterations: ITERATIONS,
        successCount,
        errorCount,
        fastPathCount,
        slowPathCount,
        totalTime,
        overallAvg,
        overallMedian,
        overallP95,
        overallP99,
        fastPathAvg,
        fastPathMedian,
        slowPathAvg,
        slowPathMedian,
        reqPerSec,
    };
};

benchmarkHybrid()
    .then((results) => {
        console.log('✅ Benchmark complete!\n');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Benchmark failed:', err);
        process.exit(1);
    });

