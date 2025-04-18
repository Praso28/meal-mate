const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donation');
const foodBankRoutes = require('./routes/foodBank');
const volunteerAssignmentRoutes = require('./routes/volunteerAssignment');
const notificationRoutes = require('./routes/notification');
const inventoryRoutes = require('./routes/inventory');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
db.query('SELECT NOW()', [], (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to PostgreSQL database');
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/foodbanks', foodBankRoutes);
app.use('/api/volunteer-assignments', volunteerAssignmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/inventory', inventoryRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MealMate API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;