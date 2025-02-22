const User = require('../models/User');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    const votes = await Vote.find({ user: req.user.userId }).populate('trader');
    const comments = await Comment.find({ user: req.user.userId }).populate('trader');
    res.json({ user, votes, comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
