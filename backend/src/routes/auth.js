const express = require('express');
const router = express.Router();
const { register, login, updateProfile, changePassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Public authentication routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.put('/profile', auth, updateProfile);
router.post('/change-password', auth, changePassword);

module.exports = router;