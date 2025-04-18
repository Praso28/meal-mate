const Inventory = require('../models/inventory');

const getAllInventoryItems = async (req, res) => {
    try {
        // Check if the user is a food bank
        if (req.user.role !== 'foodbank') {
            return res.status(403).json({
                success: false,
                error: 'Only food banks can access inventory'
            });
        }

        const items = await Inventory.findByFoodbank(req.user.id);
        res.json(items);
    } catch (error) {
        console.error('Error getting inventory items:', error);
        res.status(500).json({ error: error.message });
    }
};

const createInventoryItem = async (req, res) => {
    try {
        // Check if the user is a food bank
        if (req.user.role !== 'foodbank') {
            return res.status(403).json({
                success: false,
                error: 'Only food banks can create inventory items'
            });
        }

        const { item_name, category, quantity, unit, expiry_date, notes } = req.body;

        // Validate required fields
        if (!item_name || !category || !quantity || !unit) {
            return res.status(400).json({
                success: false,
                error: 'Please provide item name, category, quantity, and unit'
            });
        }

        const item = await Inventory.create({
            foodbank_id: req.user.id,
            item_name,
            category,
            quantity,
            unit,
            expiry_date,
            notes
        });

        res.status(201).json(item);
    } catch (error) {
        console.error('Error creating inventory item:', error);
        res.status(400).json({ error: error.message });
    }
};

const getInventoryItem = async (req, res) => {
    try {
        // TODO: Implement get inventory item by ID
        res.json({ message: `Get inventory item with id ${req.params.id}` });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const updateInventoryItem = async (req, res) => {
    try {
        // TODO: Implement update inventory item
        res.json({ message: `Update inventory item with id ${req.params.id}` });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const deleteInventoryItem = async (req, res) => {
    try {
        // TODO: Implement delete inventory item
        res.json({ message: `Delete inventory item with id ${req.params.id}` });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Additional endpoints for food bank dashboard
const getLowStockItems = async (req, res) => {
    try {
        // Check if the user is a food bank
        if (req.user.role !== 'foodbank') {
            return res.status(403).json({
                success: false,
                error: 'Only food banks can access inventory'
            });
        }

        const threshold = req.query.threshold || 10;
        const items = await Inventory.getLowStockItems(req.user.id, threshold);

        res.json(items);
    } catch (error) {
        console.error('Error getting low stock items:', error);
        res.status(500).json({ error: error.message });
    }
};

const getExpiringItems = async (req, res) => {
    try {
        // Check if the user is a food bank
        if (req.user.role !== 'foodbank') {
            return res.status(403).json({
                success: false,
                error: 'Only food banks can access inventory'
            });
        }

        const days = req.query.days || 7;
        const items = await Inventory.getExpiringItems(req.user.id, days);

        res.json(items);
    } catch (error) {
        console.error('Error getting expiring items:', error);
        res.status(500).json({ error: error.message });
    }
};

const getInventoryStats = async (req, res) => {
    try {
        // Check if the user is a food bank
        if (req.user.role !== 'foodbank') {
            return res.status(403).json({
                success: false,
                error: 'Only food banks can access inventory'
            });
        }

        const stats = await Inventory.getInventoryStats(req.user.id);

        res.json(stats);
    } catch (error) {
        console.error('Error getting inventory stats:', error);
        res.status(500).json({ error: error.message });
    }
};

const getCategoryBreakdown = async (req, res) => {
    try {
        // Check if the user is a food bank
        if (req.user.role !== 'foodbank') {
            return res.status(403).json({
                success: false,
                error: 'Only food banks can access inventory'
            });
        }

        const breakdown = await Inventory.getCategoryBreakdown(req.user.id);

        res.json(breakdown);
    } catch (error) {
        console.error('Error getting category breakdown:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllInventoryItems,
    createInventoryItem,
    getInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getLowStockItems,
    getExpiringItems,
    getInventoryStats,
    getCategoryBreakdown
};
