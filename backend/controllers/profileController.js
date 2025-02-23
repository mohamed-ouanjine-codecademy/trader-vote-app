// backend/controllers/profileController.js
const User = require('../models/User');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');

exports.getProfile = async (req, res) => {
  try {
    // Check if req.user is defined and has a userId
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized: No valid token provided." });
    }
    const user = await User.findById(req.user.userId).select('-password');
    const votes = await Vote.find({ user: req.user.userId }).populate('trader');
    const comments = await Comment.find({ user: req.user.userId }).populate('trader');
    res.json({ user, votes, comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
