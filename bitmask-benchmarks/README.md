# Bitmask Operations Benchmark

Comprehensive performance testing suite for bitmask operations vs alternatives:
1. **Array .includes()** vs **Bitmask & check**
2. **Multiple boolean properties** vs **Single bitmask**
3. **Memory usage comparison**

## Prerequisites

- Node.js 18+ (ES modules support)
- npm or bun

## Quick Start

```bash
# 1. Install dependencies
npm install  # or: bun install

# 2. Run all benchmarks
npm run test:all  # or: bun run test:all
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

## Running Tests

### Run Individual Benchmarks

```bash
# Test Array .includes() vs Bitmask
npm run test:includes

# Test Multiple booleans vs Single bitmask
npm run test:booleans

# Test Memory usage comparison
npm run test:memory

# Run all tests sequentially
npm run test:all
```

## Expected Results

### Array .includes() vs Bitmask

- **Array .includes()**: ~X ms average per operation
- **Bitmask & check**: ~Y ms average per operation
- **Speedup**: Bitmask is typically 10-100x faster

### Multiple Booleans vs Single Bitmask

- **Multiple booleans**: ~X ms average per check
- **Single bitmask**: ~Y ms average per check
- **Speedup**: Bitmask is typically 2-5x faster
- **Memory**: Bitmask uses significantly less memory

### Memory Usage

- **Multiple booleans**: ~X bytes per object
- **Single bitmask**: ~Y bytes per object (typically 70-90% less)
- **Array approach**: ~Z bytes per object

## Understanding the Results

### Array .includes() vs Bitmask

**Array .includes()**:
- Pros: Easy to understand, dynamic size
- Cons: O(n) time complexity, slower for large arrays

**Bitmask & check**:
- Pros: O(1) time complexity, extremely fast
- Cons: Limited to ~32-53 values (depending on number size), requires bit manipulation knowledge

### Multiple Booleans vs Single Bitmask

**Multiple boolean properties**:
- Pros: Easy to read and understand, explicit
- Cons: More memory usage, slower property access

**Single bitmask**:
- Pros: Minimal memory usage, fast operations, compact
- Cons: Less readable, requires bit manipulation knowledge

### Memory Usage

Bitmasks are extremely memory-efficient:
- **10 booleans**: ~80-120 bytes per object (depending on JS engine)
- **1 bitmask (number)**: ~8 bytes per object
- **Savings**: 85-93% memory reduction

## Notes

- All tests run 1,000,000 iterations for statistical significance
- Memory tests use 100,000 objects
- Results may vary based on JavaScript engine and system
- For accurate memory measurements, run with `--expose-gc` flag:
  ```bash
  node --expose-gc benchmarks/test-memory-usage.js
  ```

## Contributing

When adding new tests:
1. Maintain the same output format
2. Include both average and percentile metrics
3. Document any assumptions or limitations

