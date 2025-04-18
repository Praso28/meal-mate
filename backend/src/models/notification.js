const db = require('../config/db');

class Notification {
    static async create({ user_id, title, message, type, related_id = null, related_type = null }) {
        const query = `
            INSERT INTO notifications (user_id, title, message, type, related_id, related_to, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        const values = [user_id, title, message, type, related_id, related_type];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async findByUser(userId) {
        const query = `
            SELECT * FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 50
        `;
        const { rows } = await db.query(query, [userId]);
        return rows;
    }

    static async markAsRead(notificationId, userId) {
        const query = `
            UPDATE notifications
            SET is_read = true
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `;
        const { rows } = await db.query(query, [notificationId, userId]);
        return rows[0];
    }

    static async markAllAsRead(userId) {
        const query = `
            UPDATE notifications
            SET is_read = true
            WHERE user_id = $1 AND is_read = false
            RETURNING *
        `;
        const { rows } = await db.query(query, [userId]);
        return rows;
    }

    static async getUnreadCount(userId) {
        const query = `
            SELECT COUNT(*) as count
            FROM notifications
            WHERE user_id = $1 AND is_read = false
        `;
        const { rows } = await db.query(query, [userId]);
        return parseInt(rows[0].count);
    }

    // Helper method to create donation-related notifications
    static async notifyDonationUpdate(donation, action) {
        const notifications = [];
        let title, message;

        switch (action) {
            case 'created':
                // Notify volunteers about new donation
                title = 'New Donation Available';
                message = `A new donation of ${donation.quantity} ${donation.description} is available for pickup.`;
                const volunteers = await db.query('SELECT id FROM users WHERE role = $1', ['volunteer']);
                for (const vol of volunteers.rows) {
                    notifications.push(this.create({
                        user_id: vol.id,
                        title,
                        message,
                        type: 'donation_created'
                    }));
                }
                break;

            case 'assigned':
                // Notify donor that volunteer accepted
                title = 'Volunteer Assigned';
                message = `A volunteer has been assigned to pick up your donation of ${donation.quantity} ${donation.description}.`;
                notifications.push(this.create({
                    user_id: donation.donor_id,
                    title,
                    message,
                    type: 'donation_assigned'
                }));
                break;

            case 'picked_up':
                // Notify donor that food was picked up
                title = 'Donation Picked Up';
                message = `Your donation has been picked up by the volunteer.`;
                notifications.push(this.create({
                    user_id: donation.donor_id,
                    title,
                    message,
                    type: 'donation_picked_up'
                }));
                break;

            case 'completed':
                // Notify donor that donation was delivered
                title = 'Donation Completed';
                message = `Your donation has been successfully delivered to the food bank.`;
                notifications.push(this.create({
                    user_id: donation.donor_id,
                    title,
                    message,
                    type: 'donation_completed'
                }));
                break;
        }

        await Promise.all(notifications);
    }
}

module.exports = Notification;