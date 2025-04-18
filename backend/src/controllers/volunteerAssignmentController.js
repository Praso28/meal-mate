const Donation = require('../models/donation');

const getAllAssignments = async (req, res) => {
    try {
        // Get assignments for the current volunteer
        const volunteerId = req.user.id;
        const assignments = await Donation.findByVolunteerId(volunteerId);
        res.json(assignments || []);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const createAssignment = async (req, res) => {
    try {
        // TODO: Implement create volunteer assignment
        res.json({ message: 'Create volunteer assignment' });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Get volunteer assignment statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAssignmentStats = async (req, res) => {
    try {
        // Get volunteer-specific statistics
        const volunteerId = req.user.id;
        const volunteerStats = await Donation.getVolunteerStats(volunteerId);

        // Format the response
        const stats = {
            userAssignments: parseInt(volunteerStats.assigned_count) || 0,
            completedPickups: parseInt(volunteerStats.completed_count) || 0,
            availableDonations: parseInt(volunteerStats.available_count) || 0,
            totalDonations: (parseInt(volunteerStats.assigned_count) || 0) + (parseInt(volunteerStats.completed_count) || 0),
            pendingDonations: parseInt(volunteerStats.assigned_count) || 0,
            completedDonations: parseInt(volunteerStats.completed_count) || 0,
            assignedVolunteers: 0 // Not relevant for volunteer dashboard
        };

        res.json(stats);
    } catch (error) {
        console.error('Error getting volunteer stats:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllAssignments,
    createAssignment,
    getAssignmentStats
};
