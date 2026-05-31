const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// Mapping routes directly to our engine definitions
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;