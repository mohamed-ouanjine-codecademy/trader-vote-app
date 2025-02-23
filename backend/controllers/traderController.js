const Trader = require('../models/Trader');
const Vote = require('../models/Vote');

exports.getTraders = async (req, res) => {
  try {
    // Use an aggregation pipeline to lookup votes and compute voteSummary for each trader
    const traders = await Trader.aggregate([
      {
        $lookup: {
          from: "votes",         // votes collection name
          localField: "_id",
          foreignField: "trader",
          as: "votes"
        }
      },
      {
        $addFields: {
          voteSummary: {
            scammer: {
              $size: {
                $filter: {
                  input: "$votes",
                  cond: { $eq: ["$$this.vote", "scammer"] }
                }
              }
            },
            legit: {
              $size: {
                $filter: {
                  input: "$votes",
                  cond: { $eq: ["$$this.vote", "legit"] }
                }
              }
            }
          }
        }
      },
      {
        // Exclude the full votes array from the response
        $project: {
          votes: 0
        }
      }
    ]);

    res.json(traders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTraderById = async (req, res) => {
  try {
    const trader = await Trader.findById(req.params.id);
    if (!trader) return res.status(404).json({ message: 'Trader not found' });
    
    // Fetch votes separately for detailed view
    const votes = await Vote.find({ trader: trader._id });
    const voteSummary = {
      scammer: votes.filter(v => v.vote === 'scammer').length,
      legit: votes.filter(v => v.vote === 'legit').length
    };
    
    res.json({ trader, votes, voteSummary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
