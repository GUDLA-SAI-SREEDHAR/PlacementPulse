const mongoose = require('mongoose');

let mongoMemoryServer = null;
let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (connectionPromise && mongoose.connection && mongoose.connection.readyState === 2) {
    return connectionPromise;
  }

  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_pulse';
  try {
    connectionPromise = mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    const conn = await connectionPromise;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    connectionPromise = null;
    const maskedUri = connUri ? connUri.replace(/:([^:@]+)@/, ':****@') : 'NONE';
    console.error(`[MongoDB Connection Error] ${error.message} (URI: ${maskedUri})`);

    // In serverless (Vercel) or production with remote Atlas URI, throw error immediately
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL || connUri.includes('mongodb+srv://')) {
      throw error;
    }

    console.warn(`⚠️ [MongoDB WARNING] Falling back to temporary in-memory MongoDB (mongodb-memory-server).`);
    console.warn(`⚠️ Data created in this session will NOT be saved to your remote MongoDB Atlas database!`);
    console.log(`[MongoDB Fallback] Launching in-memory MongoDB server...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();

      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB Fallback] Connected successfully to In-Memory MongoDB at: ${memUri}`);

      // Auto-seed in-memory database with mock data
      try {
        const { seedData } = require('../../scripts/seed');
        await seedData({ skipConnect: true, exitOnComplete: false });
        console.log(`[MongoDB Fallback] In-memory database auto-seeded successfully!`);
      } catch (seedErr) {
        console.error(`[MongoDB Fallback Seeding Warning] ${seedErr.message}`);
      }

      return conn;
    } catch (memError) {
      console.error(`[MongoDB Fallback Error] Failed to start MongoMemoryServer: ${memError.message}`);
      return null;
    }
  }
};

module.exports = connectDB;

