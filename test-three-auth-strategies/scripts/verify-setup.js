import http from 'http';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// * Configuration
const SERVER_URL = 'http://localhost:3000';
const DATABASE_URL = process.env.DATABASE_URL;

// * Check server health
const checkServer = () => {
    return new Promise((resolve, reject) => {
        const req = http.request(`${SERVER_URL}/health`, (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                reject(new Error(`Server returned status ${res.statusCode}`));
            }
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Server connection timeout'));
        });

        req.end();
    });
};

// * Check database connection
const checkDatabase = async () => {
    if (!DATABASE_URL) {
        throw new Error('DATABASE_URL not set in .env');
    }

    const pool = new Pool({
        connectionString: DATABASE_URL,
    });

    try {
        await pool.query('SELECT 1');
        const result = await pool.query(
            "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sessions')"
        );

        if (!result.rows[0].exists) {
            throw new Error('Sessions table does not exist. Run: npm run setup:db');
        }

        await pool.end();
        return true;
    } catch (err) {
        await pool.end();
        throw err;
    }
};

// * Main verification
const verify = async () => {
    console.log('🔍 Verifying setup...\n');

    try {
        console.log('✓ Checking server...');
        await checkServer();
        console.log('  ✅ Server is running\n');

        console.log('✓ Checking database...');
        await checkDatabase();
        console.log('  ✅ Database connection successful\n');
        console.log('  ✅ Sessions table exists\n');

        console.log('✅ All checks passed! Ready to run benchmarks.\n');
        process.exit(0);
    } catch (err) {
        console.error('❌ Setup verification failed:', err.message);
        console.error('\n💡 Troubleshooting:');
        console.error('   1. Make sure the server is running: npm start');
        console.error('   2. Check your DATABASE_URL in .env');
        console.error('   3. Run database setup: npm run setup:db');
        process.exit(1);
    }
};

verify();

