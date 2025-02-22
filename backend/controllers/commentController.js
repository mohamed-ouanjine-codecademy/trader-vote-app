// backend/controllers/commentController.js
const Comment = require('../models/Comment');

exports.postComment = async (req, res) => {
  try {
    const { text, name } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text is required" });

    // Build the comment data object.
    // If a user is logged in (req.user is set by our optionalAuth middleware),
    // attach the user ID and optionally override the provided name.
    const commentData = {
      trader: req.params.id,
      text,
      name: name || "Anonymous",
    };

    if (req.user) {
      commentData.user = req.user.userId;
      // Optionally, if your JWT includes displayName, you could do:
      // commentData.name = req.user.displayName || commentData.name;
    }

    const newComment = new Comment(commentData);
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ trader: req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'username displayName'); // optionally populate user info
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
