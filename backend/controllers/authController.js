const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @desc    Register a new user profile
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All input fields are mandatory." });
        }

        // Check if user already exists in cluster
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "An account with this email address already exists." });
        }

        // Salt and Hash the password string securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save fresh user instance
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Issue their first secure JSON Web Token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Session lifetime
        );

        res.status(201).json({
            message: "User account registered successfully!",
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });

    } catch (error) {
        console.error("❌ Sign-Up Engine Error:", error.message);
        res.status(500).json({ error: "Internal registration failure." });
    }
};

/**
 * @desc    Authenticate existing user and return access token
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password inputs are mandatory." });
        }

        // Locate user records
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credential parameters." });
        }

        // Compare incoming plain text password with secure stored hash string
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credential parameters." });
        }

        // Issue access token signature
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "Authentication successful!",
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error("❌ Login Engine Error:", error.message);
        res.status(500).json({ error: "Internal authentication failure." });
    }
};