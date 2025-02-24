// backend/controllers/commentController.js
const Comment = require('../models/Comment');

exports.postComment = async (req, res) => {
  try {
    const { text, name, parentComment } = req.body;
    if (!text)
      return res.status(400).json({ error: 'Comment text is required' });
    
    const commentData = {
      trader: req.params.id,
      text,
      name: name || 'Anonymous',
      parentComment: parentComment || null
    };
    if (req.user) {
      commentData.user = req.user.userId;
    }
    const newComment = new Comment(commentData);
    await newComment.save();
    
    // Emit real-time update event for this trader’s comments
    const io = req.app.get('io');
    io.to(req.params.id.toString()).emit('commentUpdate', { traderId: req.params.id });
    
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    // Fetch all comments for the trader
    const comments = await Comment.find({ trader: req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'username displayName')
      .lean(); // Using .lean() to get plain JS objects for easier manipulation
    
    // Optionally, organize comments into a tree structure (one level deep)
    const commentMap = {};
    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment._id] = comment;
    });
    const threadedComments = [];
    comments.forEach(comment => {
      if (comment.parentComment) {
        // Add as a reply if parent exists
        if (commentMap[comment.parentComment]) {
          commentMap[comment.parentComment].replies.push(comment);
        }
      } else {
        // Top-level comment
        threadedComments.push(comment);
      }
    });
    
    res.json(threadedComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
