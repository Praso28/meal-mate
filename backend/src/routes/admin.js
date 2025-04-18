const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/auth');
const { adminOnly } = require('../middleware/role');

// Admin routes - all require authentication and admin role
router.use(auth);
router.use(adminOnly);

// User management routes
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Donation management routes
router.get('/donations', adminController.getDonations);
router.get('/stats/donations', adminController.getDonationStats);
router.get('/stats/users', adminController.getUserStats);

// Dashboard statistics
router.get('/stats', adminController.getAdminStats);

module.exports = router;
