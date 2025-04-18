const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const volunteerAssignmentController = require('../controllers/volunteerAssignmentController');

router.get('/', auth, volunteerAssignmentController.getAllAssignments);
router.post('/', auth, volunteerAssignmentController.createAssignment);
router.get('/stats', auth, volunteerAssignmentController.getAssignmentStats);

module.exports = router;