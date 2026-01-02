import http from 'http';
import { spawn } from 'child_process';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-change-in-production';
const TEST_USER_ID = 'test-user-123';
const SERVER_URL = 'http://localhost:3000';

// * Generate test token
const token = jwt.sign({ userId: TEST_USER_ID }, JWT_SECRET, { expiresIn: '15m' });

// * Run autocannon with JWT token
const runLoadTest = () => {
    console.log('🚀 Running JWT-only load test with 100 connections for 10 seconds...\n');
    console.log(`📊 Endpoint: ${SERVER_URL}/api/protected-jwt\n`);

    const autocannon = spawn('autocannon', [
        '-c', '100',
        '-d', '10',
        '-H', `Authorization: Bearer ${token}`,
        `${SERVER_URL}/api/protected-jwt`
    ], {
        stdio: 'inherit',
        shell: false
    });

    autocannon.on('close', (code) => {
        process.exit(code || 0);
    });

    autocannon.on('error', (err) => {
        console.error('❌ Failed to run autocannon:', err.message);
        console.error('   Make sure autocannon is installed: npm install -g autocannon');
        process.exit(1);
    });
};

runLoadTest();

