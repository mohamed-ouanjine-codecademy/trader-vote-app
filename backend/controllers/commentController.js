// backend/controllers/commentController.js
const Comment = require('../models/Comment');

exports.postComment = async (req, res) => {
  try {
    const { text, name } = req.body;
    if (!text)
      return res.status(400).json({ error: 'Comment text is required' });
    
    const commentData = {
      trader: req.params.id,
      text,
      name: name || 'Anonymous',
    };
    if (req.user) {
      commentData.user = req.user.userId;
    }
    const newComment = new Comment(commentData);
    await newComment.save();
    // Emit real‑time update event for comments
    const io = req.app.get('io');
    io.emit('commentUpdate', { traderId: req.params.id });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ trader: req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'username displayName');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
