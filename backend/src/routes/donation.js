const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { auth } = require('../middleware/auth');

// Donation routes
router.get('/', auth, donationController.getDonations);
router.post('/', auth, donationController.createDonation);

// Statistics routes - must be defined before /:id routes to avoid conflicts
router.get('/stats', auth, donationController.getDonationStats);

// Donation detail routes
router.get('/:id', auth, donationController.getDonationById);
router.put('/:id', auth, donationController.updateDonation);
router.delete('/:id', auth, donationController.deleteDonation);
router.post('/:id/assign', auth, donationController.assignVolunteer);
router.post('/:id/complete', auth, donationController.completeDonation);
router.put('/:id/status', auth, donationController.updateDonationStatus);

module.exports = router;