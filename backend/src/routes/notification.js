const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// Simple route to check if the notification route is working
router.get('/check', (req, res) => {
  res.json({ message: 'Notification route is working' });
});

router.get('/', auth, notificationController.getUserNotifications);
router.patch('/mark-all-read', auth, notificationController.markAllAsRead);
router.patch('/:id', auth, notificationController.markNotificationAsRead);

module.exports = router;