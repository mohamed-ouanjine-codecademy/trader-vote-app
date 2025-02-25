// backend/controllers/commentController.js
const Comment = require('../models/Comment');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.postComment = async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    // Ensure the user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Authentication required to post a comment." });
    }

    // Fetch the current user from the database
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Always override the comment name with the current user's name
    const commentData = {
      trader: req.params.id,
      text,
      name: user.displayName || user.username || "Anonymous",
      user: req.user.userId,
      parentComment: parentComment || null,
    };

    const newComment = new Comment(commentData);
    await newComment.save();

    // If this comment is a reply, notify the parent comment's owner (if different)
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (parent && parent.user && parent.user.toString() !== req.user.userId) {
        const notification = new Notification({
          user: parent.user,
          type: 'reply',
          message: `${user.displayName || user.username} replied to your comment.`,
        });
        await notification.save();
        const io = req.app.get('io');
        io.to(parent.user.toString()).emit('notification', notification);
      }
    }

    // Emit a real-time update event to all clients viewing this trader
    const io = req.app.get('io');
    io.to(req.params.id.toString()).emit('commentUpdate', { traderId: req.params.id });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    // Retrieve comments and populate the user field (getting displayName and username)
    let comments = await Comment.find({ trader: req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'displayName username')
      .lean();

    // Override the name of each comment with the current user data (if available)
    comments = comments.map(comment => {
      if (comment.user) {
        comment.name = comment.user.displayName || comment.user.username || comment.name;
      }
      return comment;
    });

    // Build the nested (threaded) comment tree
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
