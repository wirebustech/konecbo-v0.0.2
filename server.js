const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

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
// We perform this check to ensure the folder exists, though usually it is copied during deployment.
app.use(express.static(path.join(__dirname, 'build')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Konecbo API is running',
        timestamp: new Date().toISOString()
    });
});

// API 404 Handler - If a request starts with /api/ but matches no route, return JSON 404
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found'
    });
});

// SPA Catch-all Handler - For any other request, send back React's index.html
app.get('*', (req, res) => {
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
const createTables = require('./scripts/initDatabase');

const startServer = async () => {
    try {
        // Initialize database tables on startup
        console.log('🔄 Initializing database...');
        await createTables();
        console.log('✅ Database initialized successfully');

        app.listen(PORT, () => {
            console.log(`🚀 Konecbo API server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        // We might not want to exit if DB fails transiently, but for initial setup it's safer
        // to restart. Azure will restart the container.
        process.exit(1);
    }
};

startServer();

module.exports = app;
