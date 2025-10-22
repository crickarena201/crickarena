import mongoose from 'mongoose';

export async function connectDB(uri) {
  mongoose.set('strictQuery', true);
  
  // Configure connection options for better reliability
  const options = {
    dbName: 'crickarena',
    serverSelectionTimeoutMS: 10000, // 10 seconds
    socketTimeoutMS: 45000, // 45 seconds
    maxPoolSize: 10, // Maintain up to 10 socket connections
    minPoolSize: 1, // Maintain a minimum of 1 socket connection
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    // Remove bufferMaxEntries as it's deprecated and causing issues
    bufferCommands: false, // Disable mongoose buffering
  };
  
  // Add connection event listeners
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
  
  await mongoose.connect(uri, options);
  console.log('MongoDB connected');
} 