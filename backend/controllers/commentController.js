// backend/controllers/commentController.js
const Comment = require('../models/Comment');

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ trader: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postComment = async (req, res) => {
  try {
    const { text, name } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text is required" });
    const newComment = new Comment({
      trader: req.params.id,
      text,
      name: name || "Anonymous"
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
