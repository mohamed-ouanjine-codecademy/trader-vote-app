// backend/models/Trader.js
const mongoose = require('mongoose');

const TraderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  socialMedia: { type: String }, // e.g., Twitter or Instagram URL
  images: [String], // Array of image URLs
});

module.exports = mongoose.model('Trader', TraderSchema);
