const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
    // Extract the Authorization header safely from the incoming request payload
    const authHeader = req.header('Authorization');

    // If no header exists, or it doesn't use the 'Bearer ' schema, treat them as a guest profile
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("ℹ️ No authentication token provided. Continuing session as guest profile...");
        return next();
    }

    // Strip out the raw token string by splitting off the 'Bearer ' prefix
    const token = authHeader.split(' ')[1];

    try {
        // Decode and verify the signature using your .env variable or the rock-solid fallback string
        const secretKey = process.env.JWT_SECRET || 'super_secret_amber_insight_key_token_2026';
        const decoded = jwt.verify(token, secretKey);

        // Attach the decoded user object profile context onto the request lifecycle
        req.user = decoded;
        next();
    } catch (err) {
        // Log the explicit error to the backend console window for fast tracking
        console.error("❌ Token verification failed:", err.message);

        // Explicitly halt execution and notify the client UI to dump the stale session token
        return res.status(401).json({ error: "Access token is invalid or expired." });
    }
};

module.exports = { optionalAuth };