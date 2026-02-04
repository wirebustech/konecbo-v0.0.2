const pool = require('../config/database');

// Get all settings (Admin only - returns everything)
exports.getAllSettings = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM system_settings ORDER BY key ASC');
        res.json({
            success: true,
            settings: result.rows
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching settings'
        });
    }
};

// Update a setting (Admin only)
exports.updateSetting = async (req, res) => {
    const { key, value } = req.body;

    // Basic validation
    if (!key) {
        return res.status(400).json({ success: false, message: 'Key is required' });
    }

    try {
        // Check if key exists
        const check = await pool.query('SELECT * FROM system_settings WHERE key = $1', [key]);
        if (check.rows.length === 0) {
            // Option to create if not exists, or error. Let's allow insert/upsert
            await pool.query(
                'INSERT INTO system_settings (key, value, description) VALUES ($1, $2, $3)',
                [key, value, 'Custom setting']
            );
        } else {
            await pool.query(
                'UPDATE system_settings SET value = $2, updated_at = CURRENT_TIMESTAMP WHERE key = $1',
                [key, value]
            );
        }

        res.json({
            success: true,
            message: 'Setting updated successfully'
        });
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating setting'
        });
    }
};

// Get Researcher Public Settings (Filtered)
// Only returns safe keys needed for the frontend
exports.getResearcherSettings = async (req, res) => {
    try {
        const safeKeys = [
            'google_docs_enabled',
            'chat_enabled',
            'file_sharing_enabled',
            'google_client_id'
            // Do NOT include secrets here
        ];

        const result = await pool.query(
            'SELECT key, value FROM system_settings WHERE key = ANY($1)',
            [safeKeys]
        );

        // Convert to a simple object for easier frontend consumption
        const settingsMap = {};
        result.rows.forEach(row => {
            settingsMap[row.key] = row.value;
        });

        res.json({
            success: true,
            settings: settingsMap
        });
    } catch (error) {
        console.error('Error fetching researcher settings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching settings'
        });
    }
};
