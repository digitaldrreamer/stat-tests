# Authentication Strategies Benchmark

Comprehensive performance testing suite for three authentication approaches:
1. **JWT-only** (no database)
2. **Session-only** (database hit every request)
3. **Hybrid** (database hit only on refresh)

## 📊 Results

**See [RESULTS.md](./RESULTS.md) for comprehensive benchmark results and analysis.**

### Quick Summary
- **JWT-only**: 5,527 req/sec, 0 DB queries
- **Session-only**: 4,561 req/sec, 4,561 DB queries/sec
- **Hybrid**: 5,494 req/sec, ~0 DB queries/sec (99% fast path)

## Prerequisites

- Node.js 18+ (ES modules support)
- PostgreSQL (for accurate benchmarks)
- bun or yarn

## Quick Start

### Option 1: Docker Setup (Easiest - Recommended)

If you don't have PostgreSQL server installed, use Docker:

```bash
# 1. Install dependencies
bun install  # or: bun install

# 2. Setup PostgreSQL with Docker (creates container, DB, tables, and .env)
bun run setup:docker  # or: bun run setup:docker

# 3. Start server (in one terminal)
bun start  # or: bun start

# 4. Run benchmarks (in another terminal)
bun run test:all  # or: bun run test:all
```

**Note**: Requires Docker to be installed and running.

### Option 2: Native PostgreSQL Setup

If you have PostgreSQL server installed:

```bash
# 1. Install dependencies
bun install

# 2. Start PostgreSQL (if not already running)
bun run start:postgres
# Or manually: sudo systemctl start postgresql

# 3. Setup PostgreSQL database automatically (creates DB, tables, and .env)
bun run setup:postgres

# 4. Start server (in one terminal)
bun start

# 5. Run benchmarks (in another terminal)
bun run test:all
```

### Option 3: Manual Setup

```bash
# 1. Install dependencies
bun install

# 2. Create .env file with your database URL
echo "DATABASE_URL=postgresql://user:password@localhost:5432/auth_benchmark" > .env
echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" >> .env
echo "PORT=3000" >> .env

# 3. Create database manually
createdb auth_benchmark

# 4. Setup database tables
bun run setup:db

# 5. Start server (in one terminal)
bun start

# 6. Run benchmarks (in another terminal)
bun run test:all
```

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Setup Database

#### Automated Setup (Easiest)

Run the automated setup script which will:
- Check if PostgreSQL is installed
- Create the database
- Create tables and indexes
- Generate `.env` file with configuration

```bash
bun run setup:postgres
```

#### Manual Setup

**Step 1**: Create the database:
```bash
createdb auth_benchmark
```

**Step 2**: Create `.env` file:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/auth_benchmark
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
```

**Step 3**: Setup database tables:
```bash
bun run setup:db
```

### 3. Verify Setup

Create the database and tables:

```bash
bun run setup:db
```

This will:
- Create the `sessions` table
- Add indexes for optimal performance
- Clean up expired sessions

### 4. Cleanup (Optional)

Clean up test data from the database:

```bash
# Clean expired sessions only (default)
bun run cleanup

# Clean test sessions only
bun run cleanup:test

# Clean ALL sessions
bun run cleanup:all
```

### 5. Verify Setup

Verify that everything is configured correctly:

```bash
bun run verify
```

This checks:
- Server is running
- Database connection works
- Sessions table exists

## Running Tests

### Start the Server

In one terminal:

```bash
bun start
```

The server will start on `http://localhost:3000`

**Important**: Keep the server running while executing benchmarks!

### Run Individual Benchmarks

In another terminal:

```bash
# Test JWT-only authentication
bun run test:jwt

# Test Session-only authentication
bun run test:session

# Test Hybrid authentication
bun run test:hybrid

# Run all tests sequentially
bun run test:all
```

### Load Testing with Autocannon

For high-concurrency load testing:

```bash
# Install autocannon globally (if not already installed)
bun install -g autocannon

# Test JWT-only (100 connections, 10 seconds)
bun run load:jwt

# Test Session-only (100 connections, 10 seconds)
bun run load:session

# Test Hybrid (100 connections, 10 seconds)
bun run load:hybrid
```

## Expected Results

### Response Times (Average)

- **JWT-only**: ~0.1-0.5ms per request
- **Session-only**: ~5-20ms per request (database bottleneck)
- **Hybrid (fast path)**: ~0.1-0.5ms (99% of requests)
- **Hybrid (slow path)**: ~5-20ms (1% of requests - refresh token lookup)

### Requests Per Second

- **JWT-only**: ~10,000-50,000 req/sec
- **Session-only**: ~500-2,000 req/sec (DB bottleneck)
- **Hybrid**: ~9,000-45,000 req/sec (close to JWT since 99% skip DB)

### Database Load

- **JWT-only**: 0 queries/sec
- **Session-only**: Same as req/sec (every request hits DB)
- **Hybrid**: ~1% of requests/sec (only refresh token lookups)

## Test Endpoints

### Protected Endpoints

- `GET /api/protected-jwt` - JWT-only authentication
- `GET /api/protected-session` - Session-only authentication
- `GET /api/protected-hybrid` - Hybrid authentication

### Setup Endpoints

- `POST /api/setup/jwt` - Generate JWT token for testing
- `POST /api/setup/session` - Create session in database
- `POST /api/setup/hybrid` - Create hybrid session (access + refresh tokens)

### Health Check

- `GET /health` - Server health status

## Understanding the Results

### JWT-Only Strategy

- **Pros**: Fastest, no database load, stateless
- **Cons**: Cannot revoke tokens, larger token size, security concerns if leaked

### Session-Only Strategy

- **Pros**: Can revoke sessions, smaller tokens, better security control
- **Cons**: Database hit on every request, slower, database becomes bottleneck

### Hybrid Strategy

- **Pros**: Best of both worlds - fast most of the time, can revoke sessions
- **Cons**: More complex implementation, still requires database for refresh

## Notes

- All tests use a test user ID: `test-user-123`
- JWT tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Sessions expire in 7 days
- Benchmarks run 1000 iterations by default
- Load tests use 100 concurrent connections for 10 seconds

## Troubleshooting

### PostgreSQL Not Running

If you see "connection to server failed" errors:

**Quick fix:**
```bash
# Try the automated start script
bun run start:postgres

# Or manually start PostgreSQL:
sudo systemctl start postgresql
# Or on older systems:
sudo service postgresql start
```

**Enable auto-start on boot:**
```bash
sudo systemctl enable postgresql
```

**Check if PostgreSQL is running:**
```bash
pg_isready
# Or:
sudo systemctl status postgresql
```

### PostgreSQL Server Not Installed

You have two options:

#### Option A: Use Docker (Easiest)

```bash
# Install Docker if not already installed
sudo apt-get update
sudo apt-get install docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Then use Docker setup
bun run setup:docker
```

#### Option B: Install PostgreSQL Server

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Other platforms:**
Download from [PostgreSQL official website](https://www.postgresql.org/download/)

### Database Connection Issues

If you see database connection errors:
1. Verify PostgreSQL is running: `pg_isready` or `sudo systemctl status postgresql`
2. Check your `DATABASE_URL` in `.env`
3. Ensure the database exists: `createdb auth_benchmark`
4. Try the automated setup: `bun run setup:postgres`

### Port Already in Use

If port 3000 is already in use:
1. Change `PORT` in `.env`
2. Update server URL in benchmark scripts

### High Error Rates

If you see high error rates:
1. Check database connection pool settings
2. Verify indexes are created: `bun run setup:db`
3. Check server logs for errors

## Contributing

When adding new tests or modifying existing ones:
1. Maintain the same output format
2. Include both average and percentile metrics
3. Document any assumptions or limitations

