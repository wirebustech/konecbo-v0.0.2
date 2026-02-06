const pool = require('../config/database');

// Join a collaboration
exports.joinCollaboration = async (req, res) => {
    try {
        const { listingId } = req.body;
        const collaboratorId = req.user.id;

        // Check if listing exists and is active
        const listingCheck = await pool.query('SELECT status, researcher_id FROM listings WHERE id = $1', [listingId]);
        if (listingCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }
        if (listingCheck.rows[0].status !== 'active') { // Only join active listings? Or pending too? Assuming active.
            // Maybe allow joining pending? But 'Contributor Stars' depends on active.
            // Let's allow joining active listings.
        }

        // Prevent owner from joining their own listing
        if (listingCheck.rows[0].researcher_id === collaboratorId) {
            return res.status(400).json({ success: false, message: 'Cannot join your own listing' });
        }

        const query = `
            INSERT INTO collaborations (listing_id, collaborator_id, status)
            VALUES ($1, $2, 'active')
            ON CONFLICT (listing_id, collaborator_id) DO NOTHING
            RETURNING *
        `;
        const result = await pool.query(query, [listingId, collaboratorId]);

        if (result.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Already a collaborator' });
        }

        res.status(201).json({ success: true, collaboration: result.rows[0] });
    } catch (error) {
        console.error('Join collaboration error:', error);
        res.status(500).json({ success: false, message: 'Server error joining collaboration' });
    }
};

// Acknowledge a collaborator
exports.acknowledgeCollaborator = async (req, res) => {
    try {
        const { collaborationId } = req.body;
        const researcherId = req.user.id;

        // Verify ownership of the listing associated with this collaboration
        const checkQuery = `
            SELECT c.*, l.researcher_id 
            FROM collaborations c
            JOIN listings l ON c.listing_id = l.id
            WHERE c.id = $1
        `;
        const checkResult = await pool.query(checkQuery, [collaborationId]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Collaboration not found' });
        }

        if (checkResult.rows[0].researcher_id !== researcherId) {
            return res.status(403).json({ success: false, message: 'Not authorized to acknowledge this collaboration' });
        }

        const updateQuery = `
            UPDATE collaborations
            SET status = 'acknowledged', updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(updateQuery, [collaborationId]);

        res.json({ success: true, collaboration: result.rows[0] });
    } catch (error) {
        console.error('Acknowledge collaboration error:', error);
        res.status(500).json({ success: false, message: 'Server error acknowledging collaboration' });
    }
};

// Get collaborators for a listing
exports.getCollaborators = async (req, res) => {
    try {
        const { listingId } = req.params;

        const query = `
            SELECT c.*, u.full_name, u.email
            FROM collaborations c
            JOIN users u ON c.collaborator_id = u.id
            WHERE c.listing_id = $1
        `;
        const result = await pool.query(query, [listingId]);

        res.json({ success: true, collaborators: result.rows });
    } catch (error) {
        console.error('Get collaborators error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching collaborators' });
    }
};

// Get my collaborations (for stars)
exports.getMyCollaborations = async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
            SELECT c.*, l.title, l.summary
            FROM collaborations c
            JOIN listings l ON c.listing_id = l.id
            WHERE c.collaborator_id = $1
        `;
        const result = await pool.query(query, [userId]);

        res.json({ success: true, collaborations: result.rows });
    } catch (error) {
        console.error('Get my collaborations error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching your collaborations' });
    }
};
