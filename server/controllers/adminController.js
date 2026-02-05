const pool = require('../config/database');

/**
 * Get all users from SQL database
 * @route GET /api/admin/users
 */
exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.id,
                u.uid,
                u.email,
                u.full_name as name,
                u.role,
                u.phone_number,
                u.region,
                u.auth_provider,
                u.email_verified,
                u.is_active,
                u.created_at,
                u.last_login,
                up.institution,
                up.country,
                up.primary_discipline,
                up.bio
            FROM users u
            LEFT JOIN user_profiles up ON u.id = up.user_id
            ORDER BY u.created_at DESC
        `);

        res.json({
            success: true,
            users: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

/**
 * Get dashboard statistics
 * @route GET /api/admin/stats
 */
exports.getDashboardStats = async (req, res) => {
    try {
        // Get total users count
        const usersCount = await pool.query('SELECT COUNT(*) as count FROM users WHERE is_active = true');

        // Get users by role
        const roleStats = await pool.query(`
            SELECT role, COUNT(*) as count 
            FROM users 
            WHERE is_active = true 
            GROUP BY role
        `);

        // Get recent activity (last 30 days)
        const activityStats = await pool.query(`
            SELECT 
                DATE(created_at)::text as date,
                COUNT(*) as count
            FROM activity_logs
            WHERE created_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // Get login stats
        const loginStats = await pool.query(`
            SELECT 
                COUNT(*) FILTER (WHERE action = 'LOGIN') as logins,
                COUNT(*) FILTER (WHERE action = 'LOGOUT') as logouts
            FROM activity_logs
            WHERE created_at >= NOW() - INTERVAL '30 days'
        `);

        res.json({
            success: true,
            stats: {
                totalUsers: parseInt(usersCount.rows[0].count),
                roleBreakdown: roleStats.rows,
                recentActivity: activityStats.rows,
                loginStats: loginStats.rows[0] || { logins: 0, logouts: 0 }
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
};

// ... existing code ...

/**
 * Suspend user
 * @route PUT /api/admin/users/:id/suspend
 */
exports.suspendUser = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
             SET is_active = false, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $1 
             RETURNING id, email, full_name, is_active`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Log the suspension
        await pool.query(
            `INSERT INTO activity_logs (user_id, action, details, ip_address)
             VALUES ($1, $2, $3, $4)`,
            [id, 'suspend_user', `User suspended. Reason: ${reason || 'N/A'}`, req.ip]
        );

        res.json({
            success: true,
            message: 'User suspended successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error suspending user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to suspend user',
            error: error.message
        });
    }
};

/**
 * Unsuspend user
 * @route PUT /api/admin/users/:id/unsuspend
 */
exports.unsuspendUser = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
             SET is_active = true, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $1 
             RETURNING id, email, full_name, is_active`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Log the unsuspension
        await pool.query(
            `INSERT INTO activity_logs (user_id, action, details, ip_address)
             VALUES ($1, $2, $3, $4)`,
            [id, 'unsuspend_user', `User unsuspended. Reason: ${reason || 'N/A'}`, req.ip]
        );

        res.json({
            success: true,
            message: 'User unsuspended successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error unsuspending user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unsuspend user',
            error: error.message
        });
    }
};

/**
 * Update user role
 * @route PUT /api/admin/users/:id/role
 */
exports.updateUserRole = async (req, res) => {
    // ... existing code ...
    const { id } = req.params;
    const { role, reason } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
             SET role = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 
             RETURNING id, email, full_name, role`,
            [role, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Log the role change
        await pool.query(
            `INSERT INTO activity_logs (user_id, action, details, ip_address)
             VALUES ($1, $2, $3, $4)`,
            [id, 'role_change', `Role changed to ${role}. Reason: ${reason || 'N/A'}`, req.ip]
        );

        res.json({
            success: true,
            message: 'User role updated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user role',
            error: error.message
        });
    }
};

/**
 * Delete user
 * @route DELETE /api/admin/users/:id
 */
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING email',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    }
};

/**
 * Get activity logs
 * @route GET /api/admin/logs
 */
exports.getActivityLogs = async (req, res) => {
    const { limit = 100, offset = 0, userId, action } = req.query;

    try {
        let query = `
            SELECT 
                al.id,
                al.user_id,
                al.action,
                al.details,
                al.ip_address,
                al.created_at,
                u.email,
                u.full_name as user_name,
                u.role
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;

        if (userId) {
            query += ` AND al.user_id = $${paramCount}`;
            params.push(userId);
            paramCount++;
        }

        if (action) {
            query += ` AND al.action = $${paramCount}`;
            params.push(action);
            paramCount++;
        }

        query += ` ORDER BY al.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        res.json({
            success: true,
            logs: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity logs',
            error: error.message
        });
    }
};

/**
 * Get all reviews (Admin View)
 * @route GET /api/admin/reviews
 */
exports.getAllReviews = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                r.id,
                r.rating,
                r.comments,
                r.status,
                r.created_at,
                l.title as listing_title,
                u.full_name as reviewer_name,
                u.email as reviewer_email
            FROM reviews r
            LEFT JOIN listings l ON r.listing_id = l.id
            LEFT JOIN users u ON r.reviewer_id = u.id
            ORDER BY r.created_at DESC
        `);

        res.json({
            success: true,
            reviews: result.rows
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews'
        });
    }
};
