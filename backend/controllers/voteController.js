// backend/controllers/voteController.js
const Vote = require('../models/Vote');

exports.submitVote = async (req, res) => {
  try {
    const { vote } = req.body;
    // Check if the user has already voted for this trader
    const existingVote = await Vote.findOne({
      trader: req.params.id,
      user: req.user.userId,
    });
    if (existingVote) {
      return res.status(400).json({ error: "You have already voted for this trader" });
    }

    let evidenceFiles = [];
    if (req.files) {
      evidenceFiles = req.files.map(file => file.path);
    }

    const newVote = new Vote({
      trader: req.params.id,
      vote,
      evidence: evidenceFiles,
      user: req.user.userId,
    });

    await newVote.save();

    // Emit real-time update event for votes (if using Socket.IO)
    // backend/controllers/voteController.js
    const io = req.app.get('io');
    io.to(req.params.id.toString()).emit('voteUpdate', { traderId: req.params.id });
    io.emit('globalUpdate', { traderId: req.params.id });  // Global update event



    res.status(201).json({ message: 'Vote recorded', vote: newVote });
  } catch (error) {
    // Check for duplicate key error in case the unique index fires
    if (error.code === 11000) {
      return res.status(400).json({ error: "You have already voted for this trader" });
    }
    res.status(500).json({ error: error.message });
  }
};
