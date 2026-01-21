const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Note: In Azure deployment, server folder is copied as a subdirectory
// So routes are at ./server/routes/
const authRoutes = require('./server/routes/authRoutes');
const adminRoutes = require('./server/routes/adminRoutes');
const listingRoutes = require('./server/routes/listingRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for now to prevent React issues
}));
app.use(morgan('dev')); // Logging
app.use(cors({
    origin: process.env.CLIENT_URL || ['http://localhost:3000', 'https://konecbo-main.azurewebsites.net'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app (build folder)
// The build folder is at the root of the artifact
app.use(express.static(path.join(__dirname, 'build')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/listings', listingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Konecbo API is running',
        timestamp: new Date().toISOString()
    });
});



// API 404 Handler - If a request starts with /api but matches no route, return JSON 404
app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found'
    });
});

// SPA Catch-all Handler - For any other request, send back React's index.html
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Start server
// Note: In Azure, scripts are at ./server/scripts/
const createTables = require('./server/scripts/initDatabase');

const startServer = async () => {
    try {
        // Initialize database tables on startup
        console.log('🔄 Initializing database...');
        await createTables();
        console.log('✅ Database initialized successfully');

        app.listen(PORT, () => {
            console.log(`🚀 Konecbo API v0.0.3 (Fixed Build) running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'Default (localhost & Azure Domain)'}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
