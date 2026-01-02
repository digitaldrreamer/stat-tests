import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// * Configuration
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-change-in-production';
const DATABASE_URL = process.env.DATABASE_URL;

// * Database connection
const pool = new Pool({
  connectionString: DATABASE_URL,
});

// * Test user ID for all tests
const TEST_USER_ID = 'test-user-123';

// * Express app setup
const app = express();
app.use(express.json());
app.use(cookieParser());

// * Helper: Generate JWT token
const generateJWT = (userId, expiresIn = '15m') => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn });
};

// * Helper: Generate refresh token
const generateRefreshToken = () => {
  return jwt.sign({ type: 'refresh', userId: TEST_USER_ID }, JWT_SECRET, { expiresIn: '7d' });
};

// * Test 1: JWT-only authentication (no database)
app.get('/api/protected-jwt', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // * Fast path: JWT verification only (no database hit)
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ 
      userId: decoded.userId,
      method: 'jwt-only',
      timestamp: Date.now()
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// * Test 2: Session-only authentication (database hit every request)
app.get('/api/protected-session', async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: 'No session ID provided' });
  }

  try {
    // * Slow path: Database lookup every request
    const result = await pool.query(
      'SELECT user_id, expires_at FROM sessions WHERE id = $1 AND expires_at > NOW()',
      [sessionId]
    );

    if (!result.rows[0]) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    res.json({ 
      userId: result.rows[0].user_id,
      method: 'session-only',
      timestamp: Date.now()
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// * Test 3: Hybrid authentication (DB hit only on refresh)
app.get('/api/protected-hybrid', async (req, res) => {
  const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  try {
    // * Fast path: Verify access token (no database hit - 99% of requests)
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    res.json({ 
      userId: decoded.userId,
      method: 'hybrid-fast',
      timestamp: Date.now()
    });
  } catch (err) {
    // * Slow path: Access token expired, check refresh token in database
    if (err.name !== 'TokenExpiredError' && err.name !== 'JsonWebTokenError') {
      return res.status(500).json({ error: 'Token verification error' });
    }

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    try {
      // * Database lookup for refresh token
      const result = await pool.query(
        'SELECT user_id, expires_at FROM sessions WHERE refresh_token = $1 AND expires_at > NOW()',
        [refreshToken]
      );

      if (!result.rows[0]) {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
      }

      // * Issue new access token
      const newAccessToken = generateJWT(result.rows[0].user_id, '15m');

      res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
      res.json({ 
        userId: result.rows[0].user_id,
        method: 'hybrid-slow',
        newTokenIssued: true,
        timestamp: Date.now()
      });
    } catch (dbErr) {
      console.error('Database error:', dbErr);
      res.status(500).json({ error: 'Database error during refresh' });
    }
  }
});

// * Setup endpoints: Generate tokens/sessions for testing
app.post('/api/setup/jwt', (req, res) => {
  const token = generateJWT(TEST_USER_ID, '15m');
  res.cookie('accessToken', token, { httpOnly: true, maxAge: 15 * 60 * 1000 });
  res.json({ token, userId: TEST_USER_ID });
});

app.post('/api/setup/session', async (req, res) => {
  try {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
      [sessionId, TEST_USER_ID, expiresAt]
    );

    res.cookie('sessionId', sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ sessionId, userId: TEST_USER_ID });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.post('/api/setup/hybrid', async (req, res) => {
  try {
    const accessToken = generateJWT(TEST_USER_ID, '15m');
    const refreshToken = generateRefreshToken();
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
      'INSERT INTO sessions (id, user_id, refresh_token, expires_at) VALUES ($1, $2, $3, $4)',
      [sessionId, TEST_USER_ID, refreshToken, expiresAt]
    );

    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ accessToken, refreshToken, userId: TEST_USER_ID });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to create hybrid session' });
  }
});

// * Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// * Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Test endpoints:`);
  console.log(`   - JWT-only: GET /api/protected-jwt`);
  console.log(`   - Session-only: GET /api/protected-session`);
  console.log(`   - Hybrid: GET /api/protected-hybrid`);
  console.log(`\n🔧 Setup endpoints:`);
  console.log(`   - POST /api/setup/jwt`);
  console.log(`   - POST /api/setup/session`);
  console.log(`   - POST /api/setup/hybrid`);
});

