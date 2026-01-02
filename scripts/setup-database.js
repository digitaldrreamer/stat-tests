import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// * Create sessions table
const createSessionsTable = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

        // * Create index for faster lookups
        await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_id ON sessions(id);
      CREATE INDEX IF NOT EXISTS idx_sessions_refresh_token ON sessions(refresh_token);
      CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
    `);

        console.log('✅ Sessions table created successfully');
    } catch (err) {
        console.error('❌ Error creating sessions table:', err);
        throw err;
    }
};

// * Clean up old sessions
const cleanupOldSessions = async () => {
    try {
        const result = await pool.query('DELETE FROM sessions WHERE expires_at < NOW()');
        console.log(`🧹 Cleaned up ${result.rowCount} expired sessions`);
    } catch (err) {
        console.error('❌ Error cleaning up sessions:', err);
    }
};

// * Main setup function
const setup = async () => {
    try {
        console.log('🔧 Setting up database...');
        await createSessionsTable();
        await cleanupOldSessions();
        console.log('✅ Database setup complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Setup failed:', err);
        process.exit(1);
    }
};

setup();

