// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true }, // For local auth users
  password: { type: String }, // For local auth users
  googleId: { type: String, unique: true, sparse: true }, // For Google auth
  displayName: { type: String } // Optional display name (from Google)
});

module.exports = mongoose.model('User', UserSchema);
