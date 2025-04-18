const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import utilities
const logger = require('./utils/logger');
const db = require('./utils/db');

// Import middleware
const { notFound, errorHandler } = require('./middleware/error');

// Import routes
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donation');
const foodBankRoutes = require('./routes/foodBank');
const volunteerAssignmentRoutes = require('./routes/volunteerAssignment');
const notificationRoutes = require('./routes/notification');
const inventoryRoutes = require('./routes/inventory');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/user');

// Test database connection
db.query('SELECT NOW()', [])
  .then(() => {
    logger.info('Connected to PostgreSQL database');
  })
  .catch(err => {
    logger.error('Error connecting to the database:', err);
  });

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  path: '/socket.io/',
  pingTimeout: 60000
});

// Socket.io connection handler
io.on('connection', (socket) => {
  logger.info(`New client connected: ${socket.id}`);

  // Join room based on user role and ID
  socket.on('join', (userData) => {
    if (userData && userData.id) {
      const room = `user-${userData.id}`;
      socket.join(room);
      logger.info(`User ${userData.id} joined room: ${room}`);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/foodbanks', foodBankRoutes);
app.use('/api/volunteer-assignments', volunteerAssignmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to MealMate API',
    version: '1.0.0',
    status: 'running'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
});

module.exports = { app, server, io };