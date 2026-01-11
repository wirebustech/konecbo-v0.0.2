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

// Delete user
router.delete('/users/:id', adminController.deleteUser);

// Get activity logs
router.get('/logs', adminController.getActivityLogs);

module.exports = router;
