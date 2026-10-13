// MongoDB Connection Configuration with Auto-Reconnection & Graceful Fallback
const mongoose = require('mongoose');

let retryInterval = null;

const connectDB = async () => {
  // Prevent Mongoose from buffering queries for 10s if MongoDB is offline
  mongoose.set('bufferCommands', false);
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/rit_canteen_pro';
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    if (retryInterval) {
      clearInterval(retryInterval);
      retryInterval = null;
    }

    // Auto-seed if collections are empty
    try {
      const MenuItem = require('../models/MenuItem');
      const User = require('../models/User');
      const { initialDishes, initialUsers } = require('../seed/seedData');

      const dishCount = await MenuItem.countDocuments();
      if (dishCount === 0) {
        await MenuItem.insertMany(initialDishes);
        console.log(`🌱 Seeded ${initialDishes.length} menu items into MongoDB`);
      }

      const userCount = await User.countDocuments();
      if (userCount === 0) {
        await User.insertMany(initialUsers);
        console.log(`🌱 Seeded ${initialUsers.length} initial users into MongoDB`);
      }
    } catch (seedErr) {
      console.warn('Seed sync notice:', seedErr.message);
    }

    return true;
  } catch (error) {
    if (!retryInterval) {
      console.warn(`⚠️ MongoDB not connected yet (${error.message}).`);
      console.log(`💡 Note: If you start local mongod or set MONGO_URI, the server will auto-connect instantly.`);
      console.log(`🚀 Running Express REST API with resilient in-memory engine so the app runs without interruption!`);
      // Retry in background every 6 seconds
      retryInterval = setInterval(async () => {
        try {
          if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 3000 });
            console.log(`✅ MongoDB Auto-Connected Successfully!`);
            clearInterval(retryInterval);
            retryInterval = null;
          }
        } catch {
          // Keep retrying quietly
        }
      }, 6000);
    }
    return false;
  }
};

module.exports = connectDB;

