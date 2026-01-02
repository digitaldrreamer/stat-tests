# Benchmark Results Template

Use this template to document your test results for the article.

## Test Environment

- **Date**: [Date of testing]
- **Node.js Version**: [Version]
- **PostgreSQL Version**: [Version]
- **Hardware**: [CPU, RAM, etc.]
- **Database Location**: [Local/Remote, connection details]

## Results Summary

### 1. Average Response Times

| Strategy | Average (ms) | Median (ms) | P95 (ms) | P99 (ms) |
|----------|--------------|-------------|----------|----------|
| JWT-only | | | | |
| Session-only | | | | |
| Hybrid (fast path) | | | | |
| Hybrid (slow path) | | | | |
| Hybrid (overall) | | | | |

### 2. Requests Per Second

| Strategy | Req/sec | Notes |
|----------|---------|-------|
| JWT-only | | |
| Session-only | | |
| Hybrid | | |

### 3. Database Load

| Strategy | Queries/sec | Notes |
|----------|-------------|-------|
| JWT-only | 0 | No database queries |
| Session-only | | Same as req/sec |
| Hybrid | | ~1% of requests |

## Detailed Results

### JWT-Only Authentication

```
Total requests: 1000
Successful: [number]
Errors: [number]
Total time: [ms]
Requests/sec: [number]

Response Times:
   Average: [ms]
   Median: [ms]
   Min: [ms]
   Max: [ms]
   P95: [ms]
   P99: [ms]
```

### Session-Only Authentication

```
Total requests: 1000
Successful: [number]
Errors: [number]
Total time: [ms]
Requests/sec: [number]

Response Times:
   Average: [ms]
   Median: [ms]
   Min: [ms]
   Max: [ms]
   P95: [ms]
   P99: [ms]
```

### Hybrid Authentication

```
Total requests: 1000
Successful: [number]
Errors: [number]
Total time: [ms]
Requests/sec: [number]

Path Distribution:
   Fast path (access token): [number] ([percentage]%)
   Slow path (refresh token): [number] ([percentage]%)

Overall Response Times:
   Average: [ms]
   Median: [ms]
   P95: [ms]
   P99: [ms]

Fast Path Response Times:
   Average: [ms]
   Median: [ms]
   Min: [ms]
   Max: [ms]
   P95: [ms]
   P99: [ms]

Slow Path Response Times:
   Average: [ms]
   Median: [ms]
   Min: [ms]
   Max: [ms]
   P95: [ms]
   P99: [ms]
```

## Load Test Results (Autocannon)

### JWT-Only
```
[Paste autocannon output]
```

### Session-Only
```
[Paste autocannon output]
```

### Hybrid
```
[Paste autocannon output]
```

## Key Observations

1. **JWT-only performance**: [Your observations]
2. **Session-only bottlenecks**: [Your observations]
3. **Hybrid approach efficiency**: [Your observations]
4. **Database impact**: [Your observations]
5. **Error rates at scale**: [Your observations]

## Article-Ready Numbers

### Claim 1: JWT-only is fast (no DB hit)
- Average response time: **[X] ms**
- Requests per second: **[A] req/sec**
- Database queries: **0 queries/sec**

### Claim 2: Session-only is slow (DB hit every request)
- Average response time: **[Y] ms**
- Requests per second: **[B] req/sec**
- Database queries: **[B] queries/sec** (same as req/sec)

### Claim 3: Hybrid is fast most of the time (DB hit only on refresh)
- Average response time (fast path): **[~X] ms** (similar to JWT)
- Average response time (slow path): **[~Y] ms** (similar to session)
- Requests per second: **[~A] req/sec** (close to JWT)
- Database queries: **[~1% of A] queries/sec** (only refresh token lookups)

## Performance Comparison

- **JWT-only vs Session-only**: [X]x faster
- **Hybrid vs Session-only**: [X]x faster
- **Hybrid vs JWT-only**: [X]% slower (but adds revocation capability)

## Notes for Article

- [Any interesting findings]
- [Edge cases discovered]
- [Recommendations based on results]

