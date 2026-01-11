const pool = require('../config/database');

async function testConnection() {
    console.log('🔍 Testing database connection...\n');

    try {
        // Test basic connection
        const client = await pool.connect();
        console.log('✅ Successfully connected to PostgreSQL database');

        // Test query
        const result = await client.query('SELECT NOW() as current_time, version() as version');
        console.log('\n📊 Database Information:');
        console.log('   Current Time:', result.rows[0].current_time);
        console.log('   PostgreSQL Version:', result.rows[0].version.split(',')[0]);

        // Check if tables exist
        const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

        console.log('\n📋 Tables in database:');
        if (tablesResult.rows.length === 0) {
            console.log('   ⚠️  No tables found. Run "npm run init-db" to create tables.');
        } else {
            tablesResult.rows.forEach(row => {
                console.log(`   ✓ ${row.table_name}`);
            });
        }

        // Count users
        const userCountResult = await client.query('SELECT COUNT(*) as count FROM users');
        console.log(`\n👥 Total users: ${userCountResult.rows[0].count}`);

        client.release();
        console.log('\n✅ Database connection test completed successfully!');

    } catch (error) {
        console.error('\n❌ Database connection test failed:');
        console.error('   Error:', error.message);

        if (error.code === 'ECONNREFUSED') {
            console.error('\n💡 Troubleshooting:');
            console.error('   1. Check if PostgreSQL is running');
            console.error('   2. Verify database credentials in .env file');
            console.error('   3. Ensure database exists (CREATE DATABASE konecbo_db;)');
        }
    } finally {
        await pool.end();
        process.exit();
    }
}

testConnection();
