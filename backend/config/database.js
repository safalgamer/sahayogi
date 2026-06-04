const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('MongoDB URI not configured, using in-memory mode');
    return false;
  }
  try {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 30000,
    });
    isConnected = true;
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    return true;
  } catch (err) {
    console.log('MongoDB unavailable, using in-memory mode:', err.message.split('\n')[0]);
    return false;
  }
}

mongoose.connection.on('disconnected', () => { isConnected = false; });
mongoose.connection.on('error', err => console.error('MongoDB error:', err.message));

module.exports = { connectDB, isConnected: () => isConnected };
