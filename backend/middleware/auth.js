const jwt = require('jsonwebtoken');

/**
 * Custom flexible auth middleware.
 * If a token is provided, it must be valid, and it will append req.user.
 * If no token is provided, it lets the request pass as a guest user.
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null; // No token provided; process as guest
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        console.error("⚠️ JWT Verification Failure:", error.message);
        return res.status(401).json({ error: "Access token is invalid or expired." });
    }
};

module.exports = { optionalAuth };