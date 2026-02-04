const pool = require('../config/database');

const createSettingsTable = async () => {
    const client = await pool.connect();
    try {
        console.log('🔄 Creating system_settings table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS system_settings (
                key VARCHAR(255) PRIMARY KEY,
                value TEXT,
                description TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Insert default values if not exists
        await client.query(`
            INSERT INTO system_settings (key, value, description)
            VALUES 
            ('google_docs_enabled', 'false', 'Enable Google Docs integration'),
            ('google_client_id', '', 'Google OAuth Client ID'),
            ('chat_enabled', 'false', 'Enable Chat feature'),
            ('file_sharing_enabled', 'false', 'Enable File Sharing feature')
            ON CONFLICT (key) DO NOTHING;
        `);

        console.log('✅ System settings table created successfully');
    } catch (error) {
        console.error('❌ Error creating system_settings table:', error);
    } finally {
        client.release();
    }
};

// Execute if run directly
if (require.main === module) {
    createSettingsTable();
}

module.exports = createSettingsTable;
