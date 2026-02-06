const pool = require('../config/database');

// Create a new listing
exports.createListing = async (req, res) => {
    try {
        const { title, summary, description, category, budget, deadline } = req.body;
        const researcher_id = req.user.id; // from authMiddleware

        // Basic validation
        if (!title || !summary) {
            return res.status(400).json({ success: false, message: 'Title and Summary are required' });
        }

        const query = `
            INSERT INTO listings (researcher_id, title, summary, description, category, budget, deadline, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        const values = [researcher_id, title, summary, description, category, budget, deadline, 'pending'];
        const result = await pool.query(query, values);

        res.status(201).json({ success: true, listing: result.rows[0] });
    } catch (error) {
        console.error('Create listing error:', error);
        res.status(500).json({ success: false, message: 'Server error creating listing' });
    }
};

// Get all active listings
exports.getAllListings = async (req, res) => {
    try {
        const query = `
            SELECT l.*, u.full_name as "researcherName"
            FROM listings l
            JOIN users u ON l.researcher_id = u.id
            WHERE l.status = 'active'
            ORDER BY l.created_at DESC
        `;
        const result = await pool.query(query);
        res.json({ success: true, listings: result.rows });
    } catch (error) {
        console.error('Get all listings error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching listings' });
    }
};

// Get listings for current user
exports.getMyListings = async (req, res) => {
    try {
        const researcher_id = req.user.id;
        const query = `
            SELECT * FROM listings
            WHERE researcher_id = $1
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query, [researcher_id]);
        res.json({ success: true, listings: result.rows });
    } catch (error) {
        console.error('Get my listings error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching your listings' });
    }
};

// Get single listing by ID
exports.getListingById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT l.*, u.full_name as "researcherName", u.email as "researcherEmail"
            FROM listings l
            JOIN users u ON l.researcher_id = u.id
            WHERE l.id = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        res.json({ success: true, listing: result.rows[0] });
    } catch (error) {
        console.error('Get listing by ID error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching listing' });
    }
};

// Update listing
exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const researcher_id = req.user.id;
        const { title, summary, description, category, budget, deadline, status } = req.body;

        // Check ownership
        const checkQuery = 'SELECT researcher_id FROM listings WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        if (checkResult.rows[0].researcher_id !== researcher_id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
        }

        const updateQuery = `
            UPDATE listings 
            SET title = $1, summary = $2, description = $3, category = $4, budget = $5, deadline = $6, status = $7, updated_at = CURRENT_TIMESTAMP
            WHERE id = $8
            RETURNING *
        `;
        const values = [
            title,
            summary,
            description,
            category,
            budget,
            deadline,
            status || 'pending',
            id
        ];

        const result = await pool.query(updateQuery, values);
        res.json({ success: true, listing: result.rows[0] });

    } catch (error) {
        console.error('Update listing error:', error);
        res.status(500).json({ success: false, message: 'Server error updating listing' });
    }
};

// Delete listing
exports.deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        const researcher_id = req.user.id;

        // Check ownership
        const checkQuery = 'SELECT researcher_id FROM listings WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        if (checkResult.rows[0].researcher_id !== researcher_id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
        }

        await pool.query('DELETE FROM listings WHERE id = $1', [id]);
        res.json({ success: true, message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Delete listing error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting listing' });
    }
};
