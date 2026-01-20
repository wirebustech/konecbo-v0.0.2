const { Pool } = require('pg');
require('dotenv').config();

// Azure Database uses SSL by default. We must enable it.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'konecbo-webs2.postgres.database.azure.com',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'konecboadmin',
    password: process.env.DB_PASSWORD, // Must be supplied via Environment Variables
    ssl: {
        rejectUnauthorized: false // Required for Azure PostgreSQL connectivity
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Test database connection listener
pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    // Don't crash the entire app on DB idle error, just log it
});

module.exports = pool;
