// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Trader = require('./models/Trader');
const Vote = require('./models/Vote');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log("Connected to MongoDB");

    // Clear existing data
    await Trader.deleteMany({});
    await Vote.deleteMany({});
    console.log("Cleared previous data");

    // Synthetic trader data
    const tradersData = [
      {
        name: "John Doe",
        socialMedia: "https://twitter.com/johndoe",
        images: ["https://via.placeholder.com/300x200?text=John+Doe"]
      },
      {
        name: "Jane Smith",
        socialMedia: "https://instagram.com/janesmith",
        images: ["https://via.placeholder.com/300x200?text=Jane+Smith"]
      },
      {
        name: "Ali Hassan",
        socialMedia: "https://twitter.com/alihassan",
        images: ["https://via.placeholder.com/300x200?text=Ali+Hassan"]
      },
      {
        name: "Marie Curie",
        socialMedia: "https://facebook.com/mariecurie",
        images: ["https://via.placeholder.com/300x200?text=Marie+Curie"]
      },
      {
        name: "Sami Omar",
        socialMedia: "https://instagram.com/samiodar",
        images: ["https://via.placeholder.com/300x200?text=Sami+Omar"]
      }
    ];

    // Insert traders into the database
    const traders = await Trader.insertMany(tradersData);
    console.log("Traders seeded");

    // Create synthetic votes for each trader
    const votesData = [];

    traders.forEach(trader => {
      // Each trader gets a random number of votes (between 3 and 7)
      const numVotes = Math.floor(Math.random() * 5) + 3;
      for (let i = 0; i < numVotes; i++) {
        const randomVote = Math.random() < 0.5 ? 'scammer' : 'legit';
        // Randomly decide if this vote includes evidence
        const evidence = Math.random() < 0.5 
          ? [] 
          : [`https://via.placeholder.com/300x200?text=Evidence+for+${encodeURIComponent(trader.name)}`];
        votesData.push({
          trader: trader._id,
          vote: randomVote,
          evidence: evidence
        });
      }
    });

    await Vote.insertMany(votesData);
    console.log("Votes seeded");

    console.log("Database seeding completed successfully.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
