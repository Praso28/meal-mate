const Donation = require('../models/donation');
const Notification = require('../models/notification');
const User = require('../models/user');

exports.createDonation = async (req, res) => {
  try {
    const donation = await Donation.create({
      ...req.body,
      donor_id: req.user.id,
    });

    // Create notification for food banks
    const foodBanks = await User.findByRole('foodbank');
    if (foodBanks && foodBanks.length > 0) {
      for (const foodBank of foodBanks) {
        await Notification.create({
          user_id: foodBank.id,
          title: 'New Donation Available',
          message: `A new donation "${donation.title}" is available for assignment.`,
          type: 'info',
          related_id: donation.id,
          related_type: 'donation'
        });
      }

      // Send real-time notification via Socket.io
      if (req.app.get('io')) {
        const io = req.app.get('io');
        foodBanks.forEach(foodBank => {
          io.to(`user-${foodBank.id}`).emit('notification', {
            title: 'New Donation Available',
            message: `A new donation "${donation.title}" is available for assignment.`,
            type: 'info',
            related_id: donation.id,
            related_type: 'donation',
            created_at: new Date().toISOString()
          });
        });
      }
    }

    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDonations = async (req, res) => {
  try {
    let donations;

    if (req.query.status) {
      // Filter by status
      donations = await Donation.findByStatus(req.query.status);
    } else if (req.user.role === 'donor') {
      donations = await Donation.findByDonor(req.user.id);
    } else if (req.user.role === 'volunteer') {
      donations = await Donation.findByVolunteer(req.user.id);
    } else if (req.user.role === 'foodbank') {
      donations = await Donation.findByFoodBank(req.user.id);
    } else {
      // Admin or other roles get all donations
      donations = await Donation.getAvailable();
    }

    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignVolunteer = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.status !== 'pending' && donation.status !== 'assigned') {
      return res.status(400).json({ error: 'Donation is not available for assignment' });
    }

    let volunteerId;

    // If the request is coming from a foodbank, use the volunteer_id from the request body
    // Otherwise, use the current user's ID (for volunteers assigning themselves)
    if (req.user.role === 'food_bank' || req.user.role === 'foodbank') {
      // For foodbanks, we need to get a volunteer ID from the request body
      if (req.body && req.body.volunteer_id) {
        volunteerId = req.body.volunteer_id;
      } else {
        return res.status(400).json({ error: 'Volunteer ID is required' });
      }

      // Check if the donation is assigned to this foodbank
      if (donation.foodbank_id !== req.user.id) {
        return res.status(403).json({ error: 'You can only assign volunteers to donations assigned to your foodbank' });
      }
    } else if (req.user.role === 'volunteer') {
      // For volunteers, use their own ID
      volunteerId = req.user.id;
    } else {
      return res.status(403).json({ error: 'Only foodbanks or volunteers can assign volunteers to donations' });
    }

    const updatedDonation = await Donation.assignVolunteer(donation.id, volunteerId);

    // Create notification for the donor
    await Notification.create({
      user_id: donation.donor_id,
      title: 'Volunteer Assigned',
      message: `A volunteer has been assigned to your donation "${donation.title}".`,
      type: 'success',
      related_id: donation.id,
      related_type: 'donation'
    });

    // Create notification for the volunteer (only if the volunteer is not the same as the foodbank)
    if (req.user.role !== 'volunteer') {
      await Notification.create({
        user_id: volunteerId,
        title: 'New Assignment',
        message: `You have been assigned to pick up donation "${donation.title}".`,
        type: 'success',
        related_id: donation.id,
        related_type: 'donation'
      });
    }

    // Send real-time notification via Socket.io
    if (req.app.get('io')) {
      const io = req.app.get('io');

      // Notify donor
      io.to(`user-${donation.donor_id}`).emit('notification', {
        title: 'Volunteer Assigned',
        message: `A volunteer has been assigned to your donation "${donation.title}".`,
        type: 'success',
        related_id: donation.id,
        related_type: 'donation',
        created_at: new Date().toISOString()
      });

      // Notify volunteer (only if the volunteer is not the same as the foodbank)
      if (req.user.role !== 'volunteer') {
        io.to(`user-${volunteerId}`).emit('notification', {
          title: 'New Assignment',
          message: `You have been assigned to pick up donation "${donation.title}".`,
          type: 'success',
          related_id: donation.id,
          related_type: 'donation',
          created_at: new Date().toISOString()
        });
      }
    }

    res.json(updatedDonation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.status !== 'assigned') {
      return res.status(400).json({ error: 'Donation must be assigned before completion' });
    }

    if (donation.volunteer_id !== req.user.id) {
      return res.status(403).json({ error: 'Only assigned volunteer can complete the donation' });
    }

    const updatedDonation = await Donation.updateStatus(donation.id, 'completed');

    // Create notification for the donor
    await Notification.create({
      user_id: donation.donor_id,
      title: 'Donation Completed',
      message: `Your donation "${donation.title}" has been successfully delivered.`,
      type: 'success',
      related_id: donation.id,
      related_type: 'donation'
    });

    // Create notification for the food bank if assigned
    if (donation.foodbank_id) {
      await Notification.create({
        user_id: donation.foodbank_id,
        title: 'Donation Delivered',
        message: `The donation "${donation.title}" has been successfully delivered to your food bank.`,
        type: 'success',
        related_id: donation.id,
        related_type: 'donation'
      });
    }

    // Send real-time notifications via Socket.io
    if (req.app.get('io')) {
      const io = req.app.get('io');

      // Notify donor
      io.to(`user-${donation.donor_id}`).emit('notification', {
        title: 'Donation Completed',
        message: `Your donation "${donation.title}" has been successfully delivered.`,
        type: 'success',
        related_id: donation.id,
        related_type: 'donation',
        created_at: new Date().toISOString()
      });

      // Notify food bank if assigned
      if (donation.foodbank_id) {
        io.to(`user-${donation.foodbank_id}`).emit('notification', {
          title: 'Donation Delivered',
          message: `The donation "${donation.title}" has been successfully delivered to your food bank.`,
          type: 'success',
          related_id: donation.id,
          related_type: 'donation',
          created_at: new Date().toISOString()
        });
      }
    }

    res.json(updatedDonation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Allow admins to update any donation
    if (req.user.role !== 'admin' && donation.donor_id !== req.user.id) {
      return res.status(403).json({ error: 'Only donor or admin can update the donation' });
    }

    // Allow admins to update donations in any status
    // For donors, only allow updating pending donations
    if (req.user.role !== 'admin' && donation.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot update assigned or completed donations' });
    }

    // Extract update data from request body
    const {
      title, description, quantity, unit, expiry_date,
      pickup_address, pickup_city, pickup_state, pickup_zip_code,
      pickup_instructions, pickup_date, pickup_time_start, pickup_time_end,
      volunteer_id, foodbank_id, status
    } = req.body;

    // Update donation
    const updatedDonation = await Donation.update(req.params.id, {
      title, description, quantity, unit, expiry_date,
      pickup_address, pickup_city, pickup_state, pickup_zip_code,
      pickup_instructions, pickup_date, pickup_time_start, pickup_time_end,
      volunteer_id, foodbank_id, status
    });

    res.json(updatedDonation);
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.donor_id !== req.user.id) {
      return res.status(403).json({ error: 'Only donor can delete the donation' });
    }

    if (donation.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot delete assigned or completed donations' });
    }

    const deletedDonation = await Donation.delete(donation.id, req.user.id);
    if (!deletedDonation) {
      return res.status(400).json({ error: 'Failed to delete donation' });
    }

    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get donation statistics for a donor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDonationStats = async (req, res) => {
  try {
    // Get donor-specific statistics
    const donorStats = await Donation.getDonorStats(req.user.id);

    // Format the response
    const stats = {
      totalDonations: parseInt(donorStats.total_donations) || 0,
      pendingDonations: parseInt(donorStats.pending_donations) || 0,
      completedDonations: parseInt(donorStats.completed_donations) || 0,
      assignedVolunteers: 0 // This will be updated when we implement volunteer assignments
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting donation stats:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update donation status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    // Validate status
    const validStatuses = ['pending', 'assigned', 'in_transit', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Check permissions based on user role and status change
    const { role } = req.user;

    // Volunteers can only update to in_transit or completed
    if (role === 'volunteer') {
      if (donation.volunteer_id !== req.user.id) {
        return res.status(403).json({ error: 'You are not assigned to this donation' });
      }

      if (status === 'in_transit' && donation.status !== 'assigned') {
        return res.status(400).json({ error: 'Only assigned donations can be marked as in transit' });
      }

      if (status === 'completed' && donation.status !== 'in_transit') {
        return res.status(400).json({ error: 'Only in transit donations can be marked as completed' });
      }

      if (status !== 'in_transit' && status !== 'completed') {
        return res.status(403).json({ error: 'Volunteers can only mark donations as in transit or completed' });
      }
    }

    // Update the donation status
    const updatedDonation = await Donation.updateStatus(id, status);
    if (!updatedDonation) {
      return res.status(400).json({ error: 'Failed to update donation status' });
    }

    // Create notifications based on status change
    if (status === 'in_transit') {
      // Notify donor
      await Notification.create({
        user_id: donation.donor_id,
        title: 'Donation Picked Up',
        message: `Your donation "${donation.title}" has been picked up by the volunteer.`,
        type: 'info',
        related_id: donation.id,
        related_type: 'donation'
      });

      // Notify food bank if assigned
      if (donation.foodbank_id) {
        await Notification.create({
          user_id: donation.foodbank_id,
          title: 'Donation In Transit',
          message: `The donation "${donation.title}" is on its way to your food bank.`,
          type: 'info',
          related_id: donation.id,
          related_type: 'donation'
        });
      }

      // Send real-time notifications
      if (req.app.get('io')) {
        const io = req.app.get('io');

        io.to(`user-${donation.donor_id}`).emit('notification', {
          title: 'Donation Picked Up',
          message: `Your donation "${donation.title}" has been picked up by the volunteer.`,
          type: 'info',
          related_id: donation.id,
          related_type: 'donation',
          created_at: new Date().toISOString()
        });

        if (donation.foodbank_id) {
          io.to(`user-${donation.foodbank_id}`).emit('notification', {
            title: 'Donation In Transit',
            message: `The donation "${donation.title}" is on its way to your food bank.`,
            type: 'info',
            related_id: donation.id,
            related_type: 'donation',
            created_at: new Date().toISOString()
          });
        }
      }
    } else if (status === 'completed') {
      // Notify donor
      await Notification.create({
        user_id: donation.donor_id,
        title: 'Donation Completed',
        message: `Your donation "${donation.title}" has been successfully delivered.`,
        type: 'success',
        related_id: donation.id,
        related_type: 'donation'
      });

      // Notify food bank if assigned
      if (donation.foodbank_id) {
        await Notification.create({
          user_id: donation.foodbank_id,
          title: 'Donation Delivered',
          message: `The donation "${donation.title}" has been successfully delivered to your food bank.`,
          type: 'success',
          related_id: donation.id,
          related_type: 'donation'
        });
      }

      // Send real-time notifications
      if (req.app.get('io')) {
        const io = req.app.get('io');

        io.to(`user-${donation.donor_id}`).emit('notification', {
          title: 'Donation Completed',
          message: `Your donation "${donation.title}" has been successfully delivered.`,
          type: 'success',
          related_id: donation.id,
          related_type: 'donation',
          created_at: new Date().toISOString()
        });

        if (donation.foodbank_id) {
          io.to(`user-${donation.foodbank_id}`).emit('notification', {
            title: 'Donation Delivered',
            message: `The donation "${donation.title}" has been successfully delivered to your food bank.`,
            type: 'success',
            related_id: donation.id,
            related_type: 'donation',
            created_at: new Date().toISOString()
          });
        }
      }
    }

    res.json(updatedDonation);
  } catch (error) {
    console.error('Error updating donation status:', error);
    res.status(500).json({ error: error.message });
  }
};