// backend/models/Vote.js
const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  trader: { type: mongoose.Schema.Types.ObjectId, ref: 'Trader', required: true },
  vote: { type: String, enum: ['scammer', 'legit'], required: true },
  evidence: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Ensure that each user can vote only once per trader.
VoteSchema.index({ trader: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
