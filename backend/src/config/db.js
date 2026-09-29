const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_pulse';
  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${connUri}`);

    // In production, fail fast — do not use in-memory fallback
    if (process.env.NODE_ENV === 'production') {
      console.error('[MongoDB] FATAL: Cannot connect to MongoDB in production. Exiting.');
      process.exit(1);
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

