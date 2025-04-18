/**
 * Middleware to check if user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
};

/**
 * Middleware to check if user has donor role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.donorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'donor') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Donor role required.' });
  }
};

/**
 * Middleware to check if user has volunteer role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.volunteerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'volunteer') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Volunteer role required.' });
  }
};

/**
 * Middleware to check if user has food bank role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.foodBankOnly = (req, res, next) => {
  if (req.user && req.user.role === 'food_bank') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Food bank role required.' });
  }
};

/**
 * Middleware to check if user has one of the specified roles
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} Middleware function
 */
exports.hasRole = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Required role not found.' });
    }
  };
};
