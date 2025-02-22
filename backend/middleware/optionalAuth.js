// backend/middleware/optionalAuth.js
const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // decoded should contain at least { userId: ... }
    } catch (err) {
      // Invalid token; proceed without setting req.user
    }
  }
  next();
};

module.exports = optionalAuth;
