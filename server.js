const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

// Try to load database config, but don't crash if it fails (for batch 1 readiness)
const { Pool } = require('pg');

// Initialize Database Pool directly here to avoid path resolution issues in Azure artifact
const pool = new Pool({
    host: process.env.DB_HOST || 'konecbo-db.postgres.database.azure.com',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'konecbo',
    user: process.env.DB_USER || 'konecboadmin',
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }, // Critical for Azure
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
});

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

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Konecbo Server is running' });
});

// DB Connection Test Endpoint
app.get('/api/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: 'connected', time: result.rows[0].now });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Handle React routing, return all requests to React app
// Using Regex /.*/ because string '*' is invalid in newer path-to-regexp used by Express 5
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
