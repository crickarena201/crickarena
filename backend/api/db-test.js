import { connectDB } from '../config/db.js';

export default async function handler(request, response) {
  try {
    // Attempt to connect to the database
    await connectDB(process.env.MONGO_URI);
    
    response.status(200).json({ 
      status: 'success',
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    response.status(500).json({ 
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
}