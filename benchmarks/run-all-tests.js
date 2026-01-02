import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// * Run all benchmarks sequentially
const runBenchmark = (script) => {
    return new Promise((resolve, reject) => {
        console.log(`\n${'='.repeat(60)}\n`);
        const child = spawn('node', [join(__dirname, script)], {
            stdio: 'inherit',
            shell: false,
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Benchmark ${script} exited with code ${code}`));
            }
        });

        child.on('error', (err) => {
            reject(err);
        });
    });
};

// * Main execution
const runAllTests = async () => {
    console.log('🚀 Running all authentication strategy benchmarks...\n');
    console.log('⚠️  Make sure the server is running on http://localhost:3000\n');

    try {
        await runBenchmark('test-jwt.js');
        await new Promise((resolve) => setTimeout(resolve, 2000)); // * Brief pause between tests

        await runBenchmark('test-session.js');
        await new Promise((resolve) => setTimeout(resolve, 2000));

        await runBenchmark('test-hybrid.js');

        console.log(`\n${'='.repeat(60)}\n`);
        console.log('✅ All benchmarks completed successfully!\n');
        process.exit(0);
    } catch (err) {
        console.error('❌ Benchmark suite failed:', err);
        process.exit(1);
    }
};

runAllTests();

