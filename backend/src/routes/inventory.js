const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const inventoryController = require('../controllers/inventoryController');

// Stats routes - must be defined before /:id routes to avoid conflicts
router.get('/low-stock', auth, inventoryController.getLowStockItems);
router.get('/expiring', auth, inventoryController.getExpiringItems);
router.get('/stats', auth, inventoryController.getInventoryStats);
router.get('/categories', auth, inventoryController.getCategoryBreakdown);

// Inventory CRUD operations
router.get('/', auth, inventoryController.getAllInventoryItems);
router.post('/', auth, inventoryController.createInventoryItem);
router.get('/:id', auth, inventoryController.getInventoryItem);
router.put('/:id', auth, inventoryController.updateInventoryItem);
router.delete('/:id', auth, inventoryController.deleteInventoryItem);

module.exports = router;