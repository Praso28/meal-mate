const express = require('express');
const router = express.Router();
const { getAllFoodBanks, getFoodBank, getFoodBankStats, getDonationTrends, getVolunteers } = require('../controllers/foodBankController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getAllFoodBanks);

// Stats route - must be defined before /:id routes to avoid conflicts
router.get('/stats', auth, getFoodBankStats);

// Donation trends route
router.get('/donation-trends', auth, getDonationTrends);

// Get volunteers for assignment
router.get('/volunteers', auth, getVolunteers);

router.get('/:id', auth, getFoodBank);

module.exports = router;