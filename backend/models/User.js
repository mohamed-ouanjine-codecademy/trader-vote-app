// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  displayName: { type: String },
  email: { type: String, unique: true, sparse: true },
  followedTraders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trader' }]
});

module.exports = mongoose.model('User', UserSchema);
