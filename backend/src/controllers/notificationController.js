const Notification = require('../models/notification');

const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.findByUser(userId);

        // Format the response to match what the frontend expects
        res.json({
            success: true,
            data: notifications.map(notification => ({
                id: notification.id,
                title: notification.title,
                message: notification.message,
                type: notification.type || 'info',
                is_read: notification.is_read,
                created_at: notification.created_at
            }))
        });
    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = parseInt(req.params.id);
        const userId = req.user.id;

        const updatedNotification = await Notification.markAsRead(notificationId, userId);

        if (!updatedNotification) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found or does not belong to this user'
            });
        }

        // Format the response to match what the frontend expects
        res.json({
            success: true,
            data: {
                id: updatedNotification.id,
                title: updatedNotification.title,
                message: updatedNotification.message,
                type: updatedNotification.type || 'info',
                is_read: true,
                created_at: updatedNotification.created_at
            }
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.markAllAsRead(userId);

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getUserNotifications,
    markNotificationAsRead,
    markAllAsRead
};
