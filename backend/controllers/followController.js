// backend/controllers/followController.js
const User = require('../models/User');

exports.followTrader = async (req, res) => {
  try {
    const userId = req.user.userId;
    const traderId = req.params.traderId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.followedTraders.includes(traderId)) {
      return res.status(400).json({ error: 'Already following this trader' });
    }
    user.followedTraders.push(traderId);
    await user.save();
    res.json({ message: 'Trader followed successfully', followedTraders: user.followedTraders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unfollowTrader = async (req, res) => {
  try {
    const userId = req.user.userId;
    const traderId = req.params.traderId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.followedTraders.includes(traderId)) {
      return res.status(400).json({ error: 'Not following this trader' });
    }
    user.followedTraders = user.followedTraders.filter(id => id.toString() !== traderId);
    await user.save();
    res.json({ message: 'Trader unfollowed successfully', followedTraders: user.followedTraders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
