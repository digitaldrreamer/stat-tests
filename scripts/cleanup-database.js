import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// * Configuration
const DATABASE_URL = process.env.DATABASE_URL;

// * Cleanup options
const cleanupOptions = {
    // * Clean up expired sessions
    expired: true,
    // * Clean up all test sessions (sessions with test user)
    testSessions: false,
    // * Clean up all sessions
    all: false,
};

// * Parse command line arguments
const args = process.argv.slice(2);
if (args.includes('--all')) {
    cleanupOptions.all = true;
    cleanupOptions.testSessions = true;
    cleanupOptions.expired = true;
} else if (args.includes('--test-only')) {
    cleanupOptions.testSessions = true;
    cleanupOptions.expired = false;
}

// * Database connection
const pool = new Pool({
    connectionString: DATABASE_URL,
});

// * Cleanup functions
const cleanupExpiredSessions = async () => {
    try {
        const result = await pool.query('DELETE FROM sessions WHERE expires_at < NOW()');
        console.log(`🧹 Cleaned up ${result.rowCount} expired sessions`);
        return result.rowCount;
    } catch (err) {
        console.error('❌ Error cleaning up expired sessions:', err.message);
        throw err;
    }
};

const cleanupTestSessions = async () => {
    try {
        const result = await pool.query("DELETE FROM sessions WHERE user_id = 'test-user-123'");
        console.log(`🧹 Cleaned up ${result.rowCount} test sessions`);
        return result.rowCount;
    } catch (err) {
        console.error('❌ Error cleaning up test sessions:', err.message);
        throw err;
    }
};

const cleanupAllSessions = async () => {
    try {
        const result = await pool.query('DELETE FROM sessions');
        console.log(`🧹 Cleaned up ${result.rowCount} all sessions`);
        return result.rowCount;
    } catch (err) {
        console.error('❌ Error cleaning up all sessions:', err.message);
        throw err;
    }
};

// * Get session count
const getSessionCount = async () => {
    try {
        const totalResult = await pool.query('SELECT COUNT(*) FROM sessions');
        const expiredResult = await pool.query('SELECT COUNT(*) FROM sessions WHERE expires_at < NOW()');
        const testResult = await pool.query("SELECT COUNT(*) FROM sessions WHERE user_id = 'test-user-123'");

        return {
            total: parseInt(totalResult.rows[0].count),
            expired: parseInt(expiredResult.rows[0].count),
            test: parseInt(testResult.rows[0].count),
        };
    } catch (err) {
        console.error('❌ Error getting session count:', err.message);
        throw err;
    }
};

// * Main cleanup function
const cleanup = async () => {
    if (!DATABASE_URL) {
        console.error('❌ DATABASE_URL not set in .env');
        process.exit(1);
    }

    try {
        console.log('🔍 Checking database...\n');

        // * Get current session counts
        const counts = await getSessionCount();
        console.log('📊 Current session counts:');
        console.log(`   Total: ${counts.total}`);
        console.log(`   Expired: ${counts.expired}`);
        console.log(`   Test sessions: ${counts.test}\n`);

        if (counts.total === 0) {
            console.log('✅ Database is already clean!\n');
            await pool.end();
            process.exit(0);
        }

        let totalCleaned = 0;

        // * Clean up based on options
        if (cleanupOptions.all) {
            console.log('🧹 Cleaning up ALL sessions...\n');
            totalCleaned = await cleanupAllSessions();
        } else {
            if (cleanupOptions.expired && counts.expired > 0) {
                console.log('🧹 Cleaning up expired sessions...\n');
                totalCleaned += await cleanupExpiredSessions();
            }

            if (cleanupOptions.testSessions && counts.test > 0) {
                console.log('🧹 Cleaning up test sessions...\n');
                totalCleaned += await cleanupTestSessions();
            }
        }

        // * Get final counts
        const finalCounts = await getSessionCount();
        console.log('\n📊 Final session counts:');
        console.log(`   Total: ${finalCounts.total}`);
        console.log(`   Expired: ${finalCounts.expired}`);
        console.log(`   Test sessions: ${finalCounts.test}\n`);

        console.log(`✅ Cleanup complete! Removed ${totalCleaned} session(s)\n`);

        await pool.end();
        process.exit(0);
    } catch (err) {
        console.error('❌ Cleanup failed:', err);
        await pool.end();
        process.exit(1);
    }
};

// * Show help
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🧹 Database Cleanup Script

Usage:
  node scripts/cleanup-database.js [options]

Options:
  --all          Clean up ALL sessions (expired, test, and regular)
  --test-only    Clean up only test sessions (user_id = 'test-user-123')
  (no options)   Clean up only expired sessions (default)

Examples:
  npm run cleanup              # Clean expired sessions only
  npm run cleanup:test         # Clean test sessions only
  npm run cleanup:all          # Clean all sessions
`);
    process.exit(0);
}

cleanup();

