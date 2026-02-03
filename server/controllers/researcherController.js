const pool = require('../config/database');

// Get all researchers (with optional filtering)
exports.getAllResearchers = async (req, res) => {
    try {
        const { query, discipline, country } = req.query;

        let sql = `
            SELECT u.id, u.full_name, u.email, u.email_verified, 
                   p.current_position, p.institution, p.country, 
                   p.primary_discipline, p.research_interests, p.profile_completeness,
                   p.bio, p.avatar_url
            FROM users u
            JOIN user_profiles p ON u.id = p.user_id
            WHERE u.role = 'researcher' AND u.is_active = true
        `;

        const params = [];
        let paramIndex = 1;

        if (query) {
            sql += ` AND (u.full_name ILIKE $${paramIndex} OR p.bio ILIKE $${paramIndex} OR p.research_interests::text ILIKE $${paramIndex})`;
            params.push(`%${query}%`);
            paramIndex++;
        }

        if (discipline) {
            sql += ` AND p.primary_discipline ILIKE $${paramIndex}`;
            params.push(`%${discipline}%`);
            paramIndex++;
        }

        if (country) {
            sql += ` AND p.country ILIKE $${paramIndex}`;
            params.push(`%${country}%`);
            paramIndex++;
        }

        sql += ` ORDER BY p.profile_completeness DESC, u.created_at DESC LIMIT 50`;

        const result = await pool.query(sql, params);

        res.json({
            success: true,
            count: result.rows.length,
            researchers: result.rows
        });
    } catch (error) {
        console.error('Error fetching researchers:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching researchers'
        });
    }
};

// Get details of a specific researcher (Public Profile)
exports.getResearcherById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT u.id, u.full_name, u.email, u.created_at,
                   p.*
            FROM users u
            JOIN user_profiles p ON u.id = p.user_id
            WHERE u.uid = $1 OR u.id::text = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Researcher not found'
            });
        }

        // Remove sensitive data if any (though we selected explicit columns mostly, p.* includes everything in profiles)
        // Profiles are generally public, but let's be safe.
        const profile = result.rows[0];

        // Hide contact info if user prefers? (Not implemented in schema yet, assuming public for now)

        res.json({
            success: true,
            researcher: profile
        });

    } catch (error) {
        console.error('Error fetching researcher profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
};
