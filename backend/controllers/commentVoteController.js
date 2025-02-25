// backend/controllers/commentVoteController.js
const Comment = require('../models/Comment');

exports.voteComment = async (req, res) => {
  const { action } = req.body; // expected: "up" or "down"
  const { commentId } = req.params;
  const userId = req.user.userId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    // Check if user already voted in the same direction
    if (action === 'up') {
      if (comment.upvotedBy.includes(userId)) {
        return res.status(400).json({ error: 'You have already upvoted this comment.' });
      }
      // Remove downvote if exists
      comment.downvotedBy = comment.downvotedBy.filter(id => id.toString() !== userId);
      comment.upvotedBy.push(userId);
    } else if (action === 'down') {
      if (comment.downvotedBy.includes(userId)) {
        return res.status(400).json({ error: 'You have already downvoted this comment.' });
      }
      // Remove upvote if exists
      comment.upvotedBy = comment.upvotedBy.filter(id => id.toString() !== userId);
      comment.downvotedBy.push(userId);
    } else {
      return res.status(400).json({ error: 'Invalid vote action.' });
    }

    await comment.save();

    // Emit update (if using Socket.IO)
    const io = req.app.get('io');
    io.emit('commentVoteUpdate', {
      commentId: comment._id,
      upvotes: comment.upvotedBy.length,
      downvotes: comment.downvotedBy.length,
    });

    res.json({
      commentId: comment._id,
      score: comment.upvotedBy.length - comment.downvotedBy.length,
      upvotes: comment.upvotedBy.length,
      downvotes: comment.downvotedBy.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
