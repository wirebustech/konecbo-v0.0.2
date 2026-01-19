const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

// Try to load database config, but don't crash if it fails (for batch 1 readiness)
let pool;
try {
    pool = require('./server/config/database');
} catch (e) {
    console.warn('Database config could not be loaded:', e);
}

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Debug Middleware: Log all requests
app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
});

// Deployment Verification Route
app.get('/verify-deployment', (req, res) => {
    res.send(`Deployment Active. Timestamp: ${new Date().toISOString()}`);
});

// Health Check Endpoint (Batch 1 verification)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Konecbo Server is running' });
});

// DB Connection Test Endpoint (Batch 1 verification)
app.get('/api/db-test', async (req, res) => {
    if (!pool) return res.status(500).json({ error: 'Database pool not initialized' });
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: 'connected', time: result.rows[0].now });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
