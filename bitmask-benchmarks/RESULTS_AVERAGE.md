# Bitmask Benchmarks - Average Results

**Test Configuration:**
- Runs per benchmark: 10
- Date: 2026-01-06T00:48:15.601Z

## test-includes-vs-bitmask.js

### Array .includes() vs Bitmask

| Metric | Array .includes() | Bitmask | Speedup |
|--------|-------------------|---------|----------|
| Average ops/sec | 2093324.65 | 3012325.00 | 1.50x |
| Min ops/sec | 1123205.47 | 2061893.32 | 0.78x |
| Max ops/sec | 3088108.46 | 5033386.12 | 2.28x |

## test-booleans-vs-bitmask.js

### Multiple Booleans vs Single Bitmask

| Metric | Multiple Booleans | Single Bitmask | Speedup |
|--------|-------------------|----------------|----------|
| Average ops/sec | 2605846.37 | 2897838.97 | 1.14x |
| Min ops/sec | 1567704.02 | 1797742.62 | 0.63x |
| Max ops/sec | 3666585.23 | 4645400.68 | 1.73x |

## test-memory-usage.js

### Memory Usage Comparison

| Approach | Average MB | Bytes/Object | Memory Savings |
|----------|------------|--------------|----------------|
| Multiple Booleans | 12.05 | 126.34 | - |
| Single Bitmask | 6.47 | 67.79 | 46.3% |
| Array | 11.58 | 121.43 | - |

