const pool = require('../config/database');

/**
 * Send a friend request
 * @route POST /api/friends/request/:id
 */
exports.sendFriendRequest = async (req, res) => {
    try {
        const requesterId = req.user.userId;
        const addresseeId = req.params.id;

        if (requesterId == addresseeId) {
            return res.status(400).json({ success: false, message: "Cannot friend yourself" });
        }

        // Check for existing request
        const existing = await pool.query(
            `SELECT * FROM friendships WHERE 
            (requester_id = $1 AND addressee_id = $2) OR 
            (requester_id = $2 AND addressee_id = $1)`,
            [requesterId, addresseeId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: existing.rows[0].status === 'accepted'
                    ? "Already friends"
                    : "Friend request already sent/pending"
            });
        }

        await pool.query(
            `INSERT INTO friendships (requester_id, addressee_id, status) VALUES ($1, $2, 'pending')`,
            [requesterId, addresseeId]
        );

        res.json({ success: true, message: "Friend request sent!" });
    } catch (error) {
        console.error("sendFriendRequest error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * Accept friend request
 * @route POST /api/friends/accept/:requestId
 */
exports.acceptFriendRequest = async (req, res) => {
    try {
        const userId = req.user.userId;
        const requestId = req.params.requestId;

        // Ensure the current user is the ADDRESSEE of this request
        const result = await pool.query(
            `UPDATE friendships SET status = 'accepted', updated_at = CURRENT_TIMESTAMP 
             WHERE id = $1 AND addressee_id = $2 RETURNING *`,
            [requestId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Request not found or not for you" });
        }

        res.json({ success: true, message: "Friend request accepted!" });
    } catch (error) {
        console.error("acceptFriendRequest error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * Get all friends
 * @route GET /api/friends
 */
exports.getFriends = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(`
            SELECT u.id, u.full_name, u.email, u.role, p.avatar_url
            FROM users u
            JOIN friendships f ON (f.requester_id = u.id OR f.addressee_id = u.id)
            JOIN user_profiles p ON u.id = p.user_id
            WHERE (f.requester_id = $1 OR f.addressee_id = $1)
            AND f.status = 'accepted'
            AND u.id != $1
        `, [userId]);

        res.json({ success: true, friends: result.rows });
    } catch (error) {
        console.error("getFriends error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * Get pending friend requests (incoming)
 * @route GET /api/friends/requests
 */
exports.getFriendRequests = async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(`
            SELECT f.id, u.full_name, u.email, f.created_at
            FROM friendships f
            JOIN users u ON f.requester_id = u.id
            WHERE f.addressee_id = $1
            AND f.status = 'pending'
        `, [userId]);

        res.json({ success: true, requests: result.rows });
    } catch (error) {
        console.error("getFriendRequests error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * Check friendship status with a specific user
 * @route GET /api/friends/status/:userId
 */
exports.checkFriendStatus = async (req, res) => {
    try {
        const myId = req.user.userId;
        const targetId = req.params.userId;

        const result = await pool.query(`
            SELECT status, requester_id FROM friendships 
            WHERE (requester_id = $1 AND addressee_id = $2) 
               OR (requester_id = $2 AND addressee_id = $1)
        `, [myId, targetId]);

        if (result.rows.length === 0) {
            return res.json({ success: true, status: 'none' });
        }

        const friend = result.rows[0];
        let status = friend.status;

        // Differentiate notifications
        if (status === 'pending') {
            if (friend.requester_id == myId) status = 'sent';
            else status = 'received';
        }

        res.json({ success: true, status });
    } catch (error) {
        console.error("checkFriendStatus error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * Remove a friend (Disconnect)
 * @route DELETE /api/friends/:friendId
 */
exports.removeFriend = async (req, res) => {
    try {
        const userId = req.user.userId;
        const friendId = req.params.friendId;

        const result = await pool.query(
            `DELETE FROM friendships 
             WHERE (requester_id = $1 AND addressee_id = $2) 
                OR (requester_id = $2 AND addressee_id = $1)
             RETURNING id`,
            [userId, friendId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Friendship not found" });
        }

        res.json({ success: true, message: "Friend removed successfully" });
    } catch (error) {
        console.error("removeFriend error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
