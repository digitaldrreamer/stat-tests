import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// * Configuration
const RUNS = 10; // Number of times to run each benchmark
const BENCHMARKS = [
    'test-includes-vs-bitmask.js',
    'test-booleans-vs-bitmask.js',
    'test-memory-usage.js'
];

// * Parse benchmark output to extract metrics
const parseBenchmarkOutput = (output, benchmarkName) => {
    const results = {
        benchmark: benchmarkName,
        runs: []
    };

    // * Extract metrics based on benchmark type
    if (benchmarkName.includes('includes')) {
        // * Array .includes() vs Bitmask
        const arrayMatch = output.match(/Array \.includes\(\):[\s\S]*?Operations\/sec: ([\d.]+)/);
        const bitmaskMatch = output.match(/Bitmask & check:[\s\S]*?Operations\/sec: ([\d.]+)/);
        const speedupMatch = output.match(/Bitmask is ([\d.]+)x faster/);

        if (arrayMatch && bitmaskMatch && speedupMatch) {
            results.runs.push({
                arrayOpsPerSec: parseFloat(arrayMatch[1]),
                bitmaskOpsPerSec: parseFloat(bitmaskMatch[1]),
                speedup: parseFloat(speedupMatch[1])
            });
        }
    } else if (benchmarkName.includes('booleans')) {
        // * Multiple booleans vs Bitmask
        const booleanMatch = output.match(/Multiple Boolean Properties:[\s\S]*?Operations\/sec: ([\d.]+)/);
        const bitmaskMatch = output.match(/Single Bitmask:[\s\S]*?Operations\/sec: ([\d.]+)/);
        const speedupMatch = output.match(/Bitmask is ([\d.]+)x faster/);

        if (booleanMatch && bitmaskMatch && speedupMatch) {
            results.runs.push({
                booleanOpsPerSec: parseFloat(booleanMatch[1]),
                bitmaskOpsPerSec: parseFloat(bitmaskMatch[1]),
                speedup: parseFloat(speedupMatch[1])
            });
        }
    } else if (benchmarkName.includes('memory')) {
        // * Memory usage
        const boolMemoryMatch = output.match(/Multiple Booleans: ([\d.]+) MB \(([\d.]+) bytes\/object\)/);
        const bitmaskMemoryMatch = output.match(/Single Bitmask:\s+([\d.]+) MB \(([\d.]+) bytes\/object\)/);
        const arrayMemoryMatch = output.match(/Array:\s+([\d.]+) MB \(([\d.]+) bytes\/object\)/);
        const savingsMatch = output.match(/Bitmask uses ([\d.]+)% less memory/);

        if (boolMemoryMatch && bitmaskMemoryMatch && arrayMemoryMatch && savingsMatch) {
            results.runs.push({
                boolMemoryMB: parseFloat(boolMemoryMatch[1]),
                boolMemoryPerObject: parseFloat(boolMemoryMatch[2]),
                bitmaskMemoryMB: parseFloat(bitmaskMemoryMatch[1]),
                bitmaskMemoryPerObject: parseFloat(bitmaskMemoryMatch[2]),
                arrayMemoryMB: parseFloat(arrayMemoryMatch[1]),
                arrayMemoryPerObject: parseFloat(arrayMemoryMatch[2]),
                memorySavingsPercent: parseFloat(savingsMatch[1])
            });
        }
    }

    return results;
};

// * Run a single benchmark
const runBenchmark = (script) => {
    return new Promise((resolve, reject) => {
        let output = '';
        const child = spawn('node', [join(__dirname, script)], {
            stdio: ['inherit', 'pipe', 'pipe'],
            shell: false,
        });

        child.stdout.on('data', (data) => {
            output += data.toString();
        });

        child.stderr.on('data', (data) => {
            output += data.toString();
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(`Benchmark ${script} exited with code ${code}`));
            }
        });

        child.on('error', (err) => {
            reject(err);
        });
    });
};

// * Calculate averages
const calculateAverages = (results) => {
    if (results.runs.length === 0) return null;

    const avg = {};
    const keys = Object.keys(results.runs[0]);

    for (const key of keys) {
        const values = results.runs.map(run => run[key]).filter(v => !isNaN(v));
        if (values.length > 0) {
            avg[key] = values.reduce((a, b) => a + b, 0) / values.length;
        }
    }

    // * Calculate min/max
    const min = {};
    const max = {};
    for (const key of keys) {
        const values = results.runs.map(run => run[key]).filter(v => !isNaN(v));
        if (values.length > 0) {
            min[key] = Math.min(...values);
            max[key] = Math.max(...values);
        }
    }

    return { avg, min, max, runs: results.runs.length };
};

// * Main execution
const runMultipleTimes = async () => {
    console.log(`🚀 Running benchmarks ${RUNS} times each for statistical accuracy...\n`);
    console.log(`📊 Benchmarks: ${BENCHMARKS.join(', ')}\n`);

    const allResults = {};

    for (const benchmark of BENCHMARKS) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`\n🔄 Running ${benchmark} ${RUNS} times...\n`);

        const results = {
            benchmark,
            runs: []
        };

        for (let i = 1; i <= RUNS; i++) {
            process.stdout.write(`   Run ${i}/${RUNS}... `);
            try {
                const output = await runBenchmark(benchmark);
                const parsed = parseBenchmarkOutput(output, benchmark);
                if (parsed.runs.length > 0) {
                    results.runs.push(parsed.runs[0]);
                    console.log('✓');
                } else {
                    console.log('⚠ (could not parse)');
                }
            } catch (err) {
                console.log(`✗ Error: ${err.message}`);
            }
            // * Small delay between runs
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        allResults[benchmark] = results;
    }

    // * Calculate and display averages
    console.log(`\n${'='.repeat(60)}`);
    console.log('\n📈 AVERAGE RESULTS (across all runs)\n');

    for (const [benchmark, results] of Object.entries(allResults)) {
        const stats = calculateAverages(results);
        if (!stats) continue;

        console.log(`\n${'─'.repeat(60)}`);
        console.log(`\n📊 ${benchmark}\n`);

        if (benchmark.includes('includes')) {
            console.log('Array .includes() vs Bitmask:\n');
            console.log(`   Array .includes():`);
            console.log(`     Average ops/sec: ${stats.avg.arrayOpsPerSec.toFixed(2)}`);
            console.log(`     Min: ${stats.min.arrayOpsPerSec.toFixed(2)}`);
            console.log(`     Max: ${stats.max.arrayOpsPerSec.toFixed(2)}\n`);
            console.log(`   Bitmask & check:`);
            console.log(`     Average ops/sec: ${stats.avg.bitmaskOpsPerSec.toFixed(2)}`);
            console.log(`     Min: ${stats.min.bitmaskOpsPerSec.toFixed(2)}`);
            console.log(`     Max: ${stats.max.bitmaskOpsPerSec.toFixed(2)}\n`);
            console.log(`   Speedup:`);
            console.log(`     Average: ${stats.avg.speedup.toFixed(2)}x`);
            console.log(`     Min: ${stats.min.speedup.toFixed(2)}x`);
            console.log(`     Max: ${stats.max.speedup.toFixed(2)}x\n`);

        } else if (benchmark.includes('booleans')) {
            console.log('Multiple Booleans vs Single Bitmask:\n');
            console.log(`   Multiple Booleans:`);
            console.log(`     Average ops/sec: ${stats.avg.booleanOpsPerSec.toFixed(2)}`);
            console.log(`     Min: ${stats.min.booleanOpsPerSec.toFixed(2)}`);
            console.log(`     Max: ${stats.max.booleanOpsPerSec.toFixed(2)}\n`);
            console.log(`   Single Bitmask:`);
            console.log(`     Average ops/sec: ${stats.avg.bitmaskOpsPerSec.toFixed(2)}`);
            console.log(`     Min: ${stats.min.bitmaskOpsPerSec.toFixed(2)}`);
            console.log(`     Max: ${stats.max.bitmaskOpsPerSec.toFixed(2)}\n`);
            console.log(`   Speedup:`);
            console.log(`     Average: ${stats.avg.speedup.toFixed(2)}x`);
            console.log(`     Min: ${stats.min.speedup.toFixed(2)}x`);
            console.log(`     Max: ${stats.max.speedup.toFixed(2)}x\n`);

        } else if (benchmark.includes('memory')) {
            console.log('Memory Usage Comparison:\n');
            console.log(`   Multiple Booleans:`);
            console.log(`     Average: ${stats.avg.boolMemoryMB.toFixed(2)} MB (${stats.avg.boolMemoryPerObject.toFixed(2)} bytes/object)`);
            console.log(`     Range: ${stats.min.boolMemoryMB.toFixed(2)} - ${stats.max.boolMemoryMB.toFixed(2)} MB\n`);
            console.log(`   Single Bitmask:`);
            console.log(`     Average: ${stats.avg.bitmaskMemoryMB.toFixed(2)} MB (${stats.avg.bitmaskMemoryPerObject.toFixed(2)} bytes/object)`);
            console.log(`     Range: ${stats.min.bitmaskMemoryMB.toFixed(2)} - ${stats.max.bitmaskMemoryMB.toFixed(2)} MB\n`);
            console.log(`   Array:`);
            console.log(`     Average: ${stats.avg.arrayMemoryMB.toFixed(2)} MB (${stats.avg.arrayMemoryPerObject.toFixed(2)} bytes/object)`);
            console.log(`     Range: ${stats.min.arrayMemoryMB.toFixed(2)} - ${stats.max.arrayMemoryMB.toFixed(2)} MB\n`);
            console.log(`   Memory Savings:`);
            console.log(`     Average: ${stats.avg.memorySavingsPercent.toFixed(1)}%`);
            console.log(`     Range: ${stats.min.memorySavingsPercent.toFixed(1)}% - ${stats.max.memorySavingsPercent.toFixed(1)}%\n`);
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`\n✅ All benchmarks completed! (${RUNS} runs each)\n`);

    // * Save results to file
    const fs = await import('fs');
    const resultsPath = join(__dirname, '..', 'RESULTS_AVERAGE.md');
    let resultsDoc = '# Bitmask Benchmarks - Average Results\n\n';
    resultsDoc += `**Test Configuration:**\n`;
    resultsDoc += `- Runs per benchmark: ${RUNS}\n`;
    resultsDoc += `- Date: ${new Date().toISOString()}\n\n`;

    for (const [benchmark, results] of Object.entries(allResults)) {
        const stats = calculateAverages(results);
        if (!stats) continue;

        resultsDoc += `## ${benchmark}\n\n`;

        if (benchmark.includes('includes')) {
            resultsDoc += `### Array .includes() vs Bitmask\n\n`;
            resultsDoc += `| Metric | Array .includes() | Bitmask | Speedup |\n`;
            resultsDoc += `|--------|-------------------|---------|----------|\n`;
            resultsDoc += `| Average ops/sec | ${stats.avg.arrayOpsPerSec.toFixed(2)} | ${stats.avg.bitmaskOpsPerSec.toFixed(2)} | ${stats.avg.speedup.toFixed(2)}x |\n`;
            resultsDoc += `| Min ops/sec | ${stats.min.arrayOpsPerSec.toFixed(2)} | ${stats.min.bitmaskOpsPerSec.toFixed(2)} | ${stats.min.speedup.toFixed(2)}x |\n`;
            resultsDoc += `| Max ops/sec | ${stats.max.arrayOpsPerSec.toFixed(2)} | ${stats.max.bitmaskOpsPerSec.toFixed(2)} | ${stats.max.speedup.toFixed(2)}x |\n\n`;

        } else if (benchmark.includes('booleans')) {
            resultsDoc += `### Multiple Booleans vs Single Bitmask\n\n`;
            resultsDoc += `| Metric | Multiple Booleans | Single Bitmask | Speedup |\n`;
            resultsDoc += `|--------|-------------------|----------------|----------|\n`;
            resultsDoc += `| Average ops/sec | ${stats.avg.booleanOpsPerSec.toFixed(2)} | ${stats.avg.bitmaskOpsPerSec.toFixed(2)} | ${stats.avg.speedup.toFixed(2)}x |\n`;
            resultsDoc += `| Min ops/sec | ${stats.min.booleanOpsPerSec.toFixed(2)} | ${stats.min.bitmaskOpsPerSec.toFixed(2)} | ${stats.min.speedup.toFixed(2)}x |\n`;
            resultsDoc += `| Max ops/sec | ${stats.max.booleanOpsPerSec.toFixed(2)} | ${stats.max.bitmaskOpsPerSec.toFixed(2)} | ${stats.max.speedup.toFixed(2)}x |\n\n`;

        } else if (benchmark.includes('memory')) {
            resultsDoc += `### Memory Usage Comparison\n\n`;
            resultsDoc += `| Approach | Average MB | Bytes/Object | Memory Savings |\n`;
            resultsDoc += `|----------|------------|--------------|----------------|\n`;
            resultsDoc += `| Multiple Booleans | ${stats.avg.boolMemoryMB.toFixed(2)} | ${stats.avg.boolMemoryPerObject.toFixed(2)} | - |\n`;
            resultsDoc += `| Single Bitmask | ${stats.avg.bitmaskMemoryMB.toFixed(2)} | ${stats.avg.bitmaskMemoryPerObject.toFixed(2)} | ${stats.avg.memorySavingsPercent.toFixed(1)}% |\n`;
            resultsDoc += `| Array | ${stats.avg.arrayMemoryMB.toFixed(2)} | ${stats.avg.arrayMemoryPerObject.toFixed(2)} | - |\n\n`;
        }
    }

    fs.writeFileSync(resultsPath, resultsDoc);
    console.log(`📄 Results saved to: ${resultsPath}\n`);

    process.exit(0);
};

runMultipleTimes().catch((err) => {
    console.error('❌ Benchmark suite failed:', err);
    process.exit(1);
});

