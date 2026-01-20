const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
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

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
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
