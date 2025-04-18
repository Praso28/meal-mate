const Donation = require('../models/donation');
const User = require('../models/user');
const logger = require('../utils/logger');

/**
 * Get dashboard statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Get user ID from authenticated user
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let stats = {
      totalDonations: 0,
      pendingDonations: 0,
      completedDonations: 0,
      assignedVolunteers: 0
    };
    
    // Get donation statistics
    const donationStats = await Donation.getStats();
    if (donationStats) {
      stats.totalDonations = parseInt(donationStats.total_donations) || 0;
      stats.pendingDonations = parseInt(donationStats.pending_donations) || 0;
      stats.completedDonations = parseInt(donationStats.completed_donations) || 0;
    }
    
    // Add role-specific statistics
    switch (userRole) {
      case 'admin':
        // Get user statistics
        const userStats = await User.getStats();
        if (userStats) {
          stats.totalUsers = parseInt(userStats.total_users) || 0;
          stats.activeVolunteers = parseInt(userStats.volunteer_count) || 0;
          stats.foodBanks = parseInt(userStats.foodbank_count) || 0;
        }
        break;
        
      case 'volunteer':
        // Get volunteer-specific statistics
        const volunteerStats = await Donation.getVolunteerStats(userId);
        if (volunteerStats) {
          stats.userAssignments = parseInt(volunteerStats.assigned_count) || 0;
          stats.completedPickups = parseInt(volunteerStats.completed_count) || 0;
          stats.availableDonations = parseInt(volunteerStats.available_count) || 0;
        }
        break;
        
      case 'foodbank':
        // Get foodbank-specific statistics
        stats.inventoryItems = 0;
        stats.incomingDonations = 0;
        stats.lowStockItems = 0;
        stats.storageCapacity = 0;
        break;
        
      case 'donor':
      default:
        // Get donor-specific statistics
        const donorStats = await Donation.getDonorStats(userId);
        if (donorStats) {
          stats.totalDonations = parseInt(donorStats.total_donations) || 0;
          stats.pendingDonations = parseInt(donorStats.pending_donations) || 0;
          stats.completedDonations = parseInt(donorStats.completed_donations) || 0;
        }
        break;
    }
    
    res.json(stats);
  } catch (error) {
    logger.error('Error getting dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
};
