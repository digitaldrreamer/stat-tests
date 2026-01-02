import http from 'http';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const SERVER_URL = 'http://localhost:3000';

// * Get session cookie
const getSessionCookie = () => {
    return new Promise((resolve, reject) => {
        const req = http.request(`${SERVER_URL}/api/setup/session`, { method: 'POST', timeout: 5000 }, (res) => {
            const cookies = res.headers['set-cookie'];
            if (cookies) {
                const sessionCookie = cookies.find((c) => c.startsWith('sessionId='));
                if (sessionCookie) {
                    resolve(sessionCookie.split(';')[0]);
                } else {
                    reject(new Error('No session cookie received'));
                }
            } else {
                reject(new Error('No cookies in response'));
            }
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Setup request timeout'));
        });
        req.end();
    });
};

// * Run autocannon with session cookie
const runLoadTest = async () => {
    try {
        console.log('🔧 Setting up session...\n');
        const cookie = await getSessionCookie();
        console.log('✓ Session created\n');

        console.log('🚀 Running Session-only load test with 100 connections for 10 seconds...\n');
        console.log(`📊 Endpoint: ${SERVER_URL}/api/protected-session\n`);

        const autocannon = spawn('autocannon', [
            '-c', '100',
            '-d', '10',
            '-H', `Cookie: ${cookie}`,
            `${SERVER_URL}/api/protected-session`
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
    } catch (err) {
        console.error('❌ Failed to setup session:', err.message);
        process.exit(1);
    }
};

runLoadTest();

