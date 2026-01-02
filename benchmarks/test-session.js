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
const benchmarkSession = async () => {
    console.log('🔬 Benchmarking Session-only authentication...\n');

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

    const times = [];
    let successCount = 0;
    let errorCount = 0;
    let sessionCookie = '';

    // * Setup: Create session first
    try {
        await new Promise((resolve, reject) => {
            const req = http.request(`${SERVER_URL}/api/setup/session`, { method: 'POST', timeout: 5000 }, (res) => {
                const cookies = res.headers['set-cookie'];
                if (cookies) {
                    sessionCookie = cookies.find((c) => c.startsWith('sessionId=')) || '';
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
        console.error('❌ Failed to create session:', err.message);
        console.error('   Check that the database is set up: npm run setup:db\n');
        throw err;
    }

    if (!sessionCookie) {
        console.error('❌ Failed to get session cookie from server');
        throw new Error('Session setup failed - no cookie received');
    }

    // * Run benchmark
    const startTime = performance.now();

    for (let i = 0; i < ITERATIONS; i++) {
        const requestStart = performance.now();

        try {
            await new Promise((resolve, reject) => {
                const req = http.request(
                    `${SERVER_URL}/api/protected-session`,
                    {
                        method: 'GET',
                        headers: {
                            'Cookie': sessionCookie,
                        },
                    },
                    (res) => {
                        const requestEnd = performance.now();
                        const duration = requestEnd - requestStart;

                        if (res.statusCode === 200) {
                            successCount++;
                            times.push(duration);
                        } else {
                            errorCount++;
                        }

                        resolve();
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

    // * Check if we have any successful requests
    if (successCount === 0) {
        console.error('❌ All requests failed!');
        console.error('   Make sure the server is running on http://localhost:3000');
        console.error('   Check that the database is set up and accessible\n');
        throw new Error('All requests failed - server may not be running or database not accessible');
    }

    // * Calculate statistics (only if we have successful requests)
    const sortedTimes = times.sort((a, b) => a - b);
    const avg = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    const min = sortedTimes[0] || 0;
    const max = sortedTimes[times.length - 1] || 0;
    const median = sortedTimes.length > 0 ? sortedTimes[Math.floor(sortedTimes.length / 2)] : 0;
    const p95 = sortedTimes.length > 0 ? sortedTimes[Math.floor(sortedTimes.length * 0.95)] : 0;
    const p99 = sortedTimes.length > 0 ? sortedTimes[Math.floor(sortedTimes.length * 0.99)] : 0;

    const reqPerSec = (ITERATIONS / totalTime) * 1000;

    // * Display results
    console.log('📈 Results:\n');
    console.log(`   Total requests: ${ITERATIONS}`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total time: ${totalTime.toFixed(2)}ms`);
    console.log(`   Requests/sec: ${reqPerSec.toFixed(2)}\n`);

    if (times.length > 0) {
        console.log('⏱️  Response Times:\n');
        console.log(`   Average: ${avg.toFixed(3)}ms`);
        console.log(`   Median: ${median.toFixed(3)}ms`);
        console.log(`   Min: ${min.toFixed(3)}ms`);
        console.log(`   Max: ${max.toFixed(3)}ms`);
        console.log(`   P95: ${p95.toFixed(3)}ms`);
        console.log(`   P99: ${p99.toFixed(3)}ms\n`);
    }

    return {
        method: 'session-only',
        iterations: ITERATIONS,
        successCount,
        errorCount,
        totalTime,
        avg,
        median,
        min,
        max,
        p95,
        p99,
        reqPerSec,
    };
};

benchmarkSession()
    .then((results) => {
        console.log('✅ Benchmark complete!\n');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Benchmark failed:', err);
        process.exit(1);
    });

