// backend/controllers/profileController.js
const User = require('../models/User');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');

exports.getProfile = async (req, res) => {
  try {
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

exports.updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized: No valid token provided." });
    }
    const { displayName } = req.body;
    if (!displayName) {
      return res.status(400).json({ error: "Display name is required" });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.displayName = displayName;
    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
