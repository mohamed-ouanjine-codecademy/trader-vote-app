// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Initiate Google OAuth (pass the desired redirect path via the "state" parameter)
router.get('/google', (req, res, next) => {
  const redirectUrl = req.query.redirect || '/';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: redirectUrl, // pass the redirect path in state
  })(req, res, next);
});

// Google callback route: always redirect to /login so that the Login component can update AuthContext
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const payload = { userId: req.user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    // Read the original redirect from state; default to '/' if not provided
    const redirectPath = req.query.state ? decodeURIComponent(req.query.state) : '/';
    // Always send the user to the /login route with token and redirect parameters
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}&redirect=${encodeURIComponent(redirectPath)}`);
  }
);

module.exports = router;
