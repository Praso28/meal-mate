const Donation = require('../models/donation');
const Inventory = require('../models/inventory');
const User = require('../models/user');
const db = require('../config/db');

const getAllFoodBanks = async (req, res) => {
    try {
        res.json({ message: 'List all food banks' });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getFoodBank = async (req, res) => {
    try {
        res.json({ message: `Get food bank with id ${req.params.id}` });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Get food bank statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getFoodBankStats = async (req, res) => {
    try {
        // Get food bank-specific statistics
        const foodbankId = req.user.id;

        // Get donation statistics
        const donationStats = await Donation.getFoodBankStats(foodbankId);

        // Get inventory statistics
        const inventoryStats = await Inventory.getInventoryStats(foodbankId);

        // Get low stock items count
        const lowStockItems = await Inventory.getLowStockItems(foodbankId);

        // Get incoming donations (assigned to this food bank but not completed)
        const incomingDonations = await Donation.findByFoodBankAndStatus(foodbankId, 'assigned');
        const inTransitDonations = await Donation.findByFoodBankAndStatus(foodbankId, 'in_transit');

        // Combine the statistics
        const stats = {
            inventoryItems: parseInt(inventoryStats?.total_items) || 0,
            incomingDonations: (incomingDonations?.length || 0) + (inTransitDonations?.length || 0),
            lowStockItems: lowStockItems?.length || 0,
            storageCapacity: 100, // This could be a setting in the future
            totalDonations: parseInt(donationStats?.total_donations) || 0,
            pendingDonations: parseInt(donationStats?.pending_donations) || 0,
            completedDonations: parseInt(donationStats?.completed_donations) || 0,
            assignedVolunteers: parseInt(donationStats?.assigned_volunteers) || 0
        };

        res.json(stats);
    } catch (error) {
        console.error('Error getting food bank stats:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get donation trends for a food bank
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDonationTrends = async (req, res) => {
    try {
        const foodbankId = req.user.id;

        // Get donation trends by month
        const query = `
            SELECT
                DATE_TRUNC('month', created_at) as month,
                COUNT(*) as count
            FROM donations
            WHERE foodbank_id = $1
            GROUP BY month
            ORDER BY month
        `;
        const { rows } = await db.query(query, [foodbankId]);

        // Format the data for the frontend
        const trends = rows.map(row => ({
            month: new Date(row.month).toISOString().slice(0, 7), // Format as YYYY-MM
            count: parseInt(row.count)
        }));

        res.json(trends);
    } catch (error) {
        console.error('Error getting donation trends:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get all volunteers for a food bank to assign to donations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getVolunteers = async (req, res) => {
    try {
        // Get all users with role 'volunteer'
        const query = `
            SELECT id, name, email, phone, role, created_at
            FROM users
            WHERE role = 'volunteer'
            ORDER BY name
        `;
        const { rows } = await db.query(query);

        res.json(rows);
    } catch (error) {
        console.error('Error getting volunteers:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllFoodBanks,
    getFoodBank,
    getFoodBankStats,
    getDonationTrends,
    getVolunteers
};