const User = require('../models/user');
const Donation = require('../models/donation');
const logger = require('../utils/logger');

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    logger.error('Error getting users:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    logger.error('Error getting user by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createUser = async (req, res) => {
  try {
    const { email, password, name, role, phone, address, city, state, zip_code } = req.body;

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      role,
      phone,
      address,
      city,
      state,
      zip_code
    });

    res.status(201).json(user);
  } catch (error) {
    logger.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, phone, address, city, state, zip_code, is_active } = req.body;

    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user
    const updatedUser = await User.update(req.params.id, {
      name,
      email,
      role,
      phone,
      address,
      city,
      state,
      zip_code,
      is_active
    });

    res.json(updatedUser);
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteUser = async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    await User.delete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all donations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDonations = async (req, res) => {
  try {
    let donations;

    if (req.query.status) {
      // Filter by status
      donations = await Donation.findByStatus(req.query.status);
    } else {
      // Get all donations
      donations = await Donation.findAll();
    }

    res.json(donations);
  } catch (error) {
    logger.error('Error getting donations:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get donation statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDonationStats = async (req, res) => {
  try {
    const stats = await Donation.getStats();
    res.json(stats);
  } catch (error) {
    logger.error('Error getting donation stats:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserStats = async (req, res) => {
  try {
    const stats = await User.getStats();
    res.json(stats);
  } catch (error) {
    logger.error('Error getting user stats:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get admin dashboard statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAdminStats = async (req, res) => {
  try {
    // Get user statistics
    const userStats = await User.getStats();

    // Get donation statistics
    const donationStats = await Donation.getStats();

    // Combine statistics
    const stats = {
      totalUsers: parseInt(userStats.total_users) || 0,
      activeVolunteers: parseInt(userStats.volunteer_count) || 0,
      foodBanks: parseInt(userStats.foodbank_count) || 0,
      totalDonations: parseInt(donationStats.total_donations) || 0,
      pendingDonations: parseInt(donationStats.pending_donations) || 0,
      completedDonations: parseInt(donationStats.completed_donations) || 0,
      assignedVolunteers: parseInt(userStats.assigned_volunteer_count) || 0
    };

    res.json(stats);
  } catch (error) {
    logger.error('Error getting admin stats:', error);
    res.status(500).json({ error: error.message });
  }
};
