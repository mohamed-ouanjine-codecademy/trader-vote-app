// backend/controllers/commentController.js
const Comment = require('../models/Comment');
const User = require('../models/User');

exports.postComment = async (req, res) => {
  try {
    const { text, name } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    let commentName = name || "Anonymous";

    // If the user is authenticated, override the name with the user's display name or username
    if (req.user && req.user.userId) {
      const user = await User.findById(req.user.userId);
      if (user) {
        commentName = user.displayName || user.username || commentName;
      }
    }

    const commentData = {
      trader: req.params.id,
      text,
      name: commentName,
      parentComment: req.body.parentComment || null,
    };

    if (req.user) {
      commentData.user = req.user.userId;
    }

    const newComment = new Comment(commentData);
    await newComment.save();

    // Emit a real-time update event to the trader's room
    const io = req.app.get('io');
    io.to(req.params.id.toString()).emit('commentUpdate', { traderId: req.params.id });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ trader: req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'displayName username')
      .lean();
    // Build a nested tree from the flat list:
    const commentMap = {};
    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment._id.toString()] = comment;
    });
    const threadedComments = [];
    comments.forEach(comment => {
      if (comment.parentComment) {
        const parentId = comment.parentComment.toString();
        if (commentMap[parentId]) {
          commentMap[parentId].replies.push(comment);
        }
      } else {
        threadedComments.push(comment);
      }
    });
    res.json(threadedComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};