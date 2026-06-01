const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Centralized JWT Generation Token function
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'super_secret_amber_insight_key_token_2026', {
        expiresIn: '7d'
    });
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user account profile
 */
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validate incoming data fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All input registration fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must contain at least 6 characters' });
        }

        // 2. Check for duplicate profile registration records
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'An account with this email address already exists' });
        }

        // 3. Create user (password hashing executes automatically in User model hook)
        const user = new User({ name, email, password });
        await user.save();

        // 4. Generate access token and respond to UI
        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Signup Controller Failure:', err);
        res.status(500).json({ error: 'Internal failure processing account registration' });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate existing member credentials
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate form fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email address and password are required' });
        }

        // 2. Look up the identity block
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email address or password combination' });
        }

        // 3. Verify encrypted password match using helper method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email address or password combination' });
        }

        // 4. Return dynamic state token structure
        const token = generateToken(user._id);
        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Login Controller Failure:', err);
        res.status(500).json({ error: 'Internal failure running authentication check' });
    }
});

module.exports = router;