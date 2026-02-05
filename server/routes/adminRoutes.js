const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get all users
router.get('/users', adminController.getAllUsers);

// Get dashboard statistics
router.get('/stats', adminController.getDashboardStats);

// Update user role
router.put('/users/:id/role', adminController.updateUserRole);

// Suspend user
router.put('/users/:id/suspend', adminController.suspendUser);

// Unsuspend user
router.put('/users/:id/unsuspend', adminController.unsuspendUser);

// Delete user
router.delete('/users/:id', adminController.deleteUser);

// Get activity logs
router.get('/logs', adminController.getActivityLogs);

// Get all reviews
router.get('/reviews', adminController.getAllReviews);

// System Settings Management
const adminSettingsController = require('../controllers/adminSettingsController');
router.get('/settings', adminSettingsController.getAllSettings);
router.put('/settings', adminSettingsController.updateSetting);

module.exports = router;
