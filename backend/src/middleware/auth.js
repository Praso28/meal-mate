const { verifyToken } = require('../utils/auth');
const logger = require('../utils/logger');

/**
 * Authentication middleware
 * Verifies JWT token and adds user data to request
 */
const auth = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.replace('Bearer ', '')
            : authHeader;

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No authentication token provided'
            });
        }

        // Verify token
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        logger.error(`Authentication error: ${error.message}`);
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};

/**
 * Role-based authorization middleware
 * @param {string[]} roles - Array of allowed roles
 * @returns {Function} Middleware function
 */
const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        // Check if user role is in allowed roles
        if (roles.length && !roles.includes(req.user.role)) {
            logger.warn(`Authorization failed: User ${req.user.id} with role ${req.user.role} attempted to access restricted route`);
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

// Role constants
const ROLES = {
    ADMIN: 'admin',
    DONOR: 'donor',
    VOLUNTEER: 'volunteer',
    FOODBANK: 'foodbank'
};

module.exports = {
    auth,
    authorize,
    ROLES
};