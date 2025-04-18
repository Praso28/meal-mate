const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/user');

// Get all foodbanks
router.get('/foodbanks', auth, async (req, res) => {
  try {
    const foodbanks = await User.findByRole('food_bank');
    res.json(foodbanks);
  } catch (error) {
    console.error('Error fetching foodbanks:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
