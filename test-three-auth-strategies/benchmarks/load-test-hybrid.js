import http from 'http';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const SERVER_URL = 'http://localhost:3000';

// * Get hybrid cookies
const getHybridCookies = () => {
    return new Promise((resolve, reject) => {
        const req = http.request(`${SERVER_URL}/api/setup/hybrid`, { method: 'POST', timeout: 5000 }, (res) => {
            const cookies = res.headers['set-cookie'];
            if (cookies) {
                const cookieString = cookies.map((c) => c.split(';')[0]).join('; ');
                if (cookieString) {
                    resolve(cookieString);
                } else {
                    reject(new Error('No cookies received'));
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

// * Run autocannon with hybrid cookies
const runLoadTest = async () => {
    try {
        console.log('🔧 Setting up hybrid session...\n');
        const cookies = await getHybridCookies();
        console.log('✓ Hybrid session created\n');

        console.log('🚀 Running Hybrid load test with 100 connections for 10 seconds...\n');
        console.log(`📊 Endpoint: ${SERVER_URL}/api/protected-hybrid\n`);

        const autocannon = spawn('autocannon', [
            '-c', '100',
            '-d', '10',
            '-H', `Cookie: ${cookies}`,
            `${SERVER_URL}/api/protected-hybrid`
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
        console.error('❌ Failed to setup hybrid session:', err.message);
        process.exit(1);
    }
};

runLoadTest();

