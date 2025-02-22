// backend/controllers/traderController.js
const Trader = require('../models/Trader');
const Vote = require('../models/Vote');

exports.getTraders = async (req, res) => {
  try {
    const traders = await Trader.find();
    res.json(traders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTraderById = async (req, res) => {
  try {
    const trader = await Trader.findById(req.params.id);
    if (!trader) return res.status(404).json({ message: 'Trader not found' });
    const votes = await Vote.find({ trader: trader._id });
    res.json({ trader, votes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
