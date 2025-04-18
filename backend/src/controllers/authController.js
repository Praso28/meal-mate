const User = require('../models/user');
const { generateToken, comparePassword } = require('../utils/auth');

const register = async (req, res) => {
    try {
        const { email, password, name, role, address, phone } = req.body;
        const user = await User.create({
            email,
            password,
            name,
            role,
            address,
            phone
        });
        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);

        if (!user || !(await comparePassword(password, user.password))) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, city, state, zip_code } = req.body;
        const userId = req.user.id;

        // Update user profile
        const updatedUser = await User.update(userId, {
            name,
            phone,
            address,
            city,
            state,
            zip_code
        });

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Get current user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Verify current password
        if (!(await comparePassword(currentPassword, user.password))) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect'
            });
        }

        // Update password
        await User.updatePassword(userId, newPassword);

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    updateProfile,
    changePassword
};