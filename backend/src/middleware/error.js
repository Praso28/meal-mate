const logger = require('../utils/logger');

/**
 * Not found middleware
 * Handles 404 errors for routes that don't exist
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Error handler middleware
 * Handles all errors in the application
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  
  // Set status code
  const statusCode = err.status || 500;
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Server Error'
      : err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = {
  notFound,
  errorHandler
};
