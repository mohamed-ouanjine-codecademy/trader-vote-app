// backend/models/Comment.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  trader: { type: mongoose.Schema.Types.ObjectId, ref: 'Trader', required: true },
  name: { type: String, default: 'Anonymous' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
