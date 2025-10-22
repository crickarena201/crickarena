// Simple script to check clubs in the database
import mongoose from 'mongoose';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

async function checkClubs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crickarena', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Import the Club model
    const Club = (await import('./models/Club.js')).default;
    
    // Find all clubs and check for logo data
    const clubs = await Club.find({}).select('+logo +proof');
    console.log(`Found ${clubs.length} clubs`);
    
    let clubsWithLogos = 0;
    
    for (const club of clubs) {
      console.log(`\nClub: ${club.clubName || club.name || 'Unknown'}`);
      console.log(`  ID: ${club._id}`);
      console.log(`  Status: ${club.status}`);
      console.log(`  Has logo data: ${!!(club.logo && club.logo.data)}`);
      
      if (club.logo && club.logo.data) {
        clubsWithLogos++;
        console.log(`  Logo data size: ${club.logo.data.length} bytes`);
        console.log(`  Logo content type: ${club.logo.contentType || 'Unknown'}`);
      } else {
        console.log(`  Logo URL: ${club.logoUrl || 'None'}`);
      }
    }
    
    console.log(`\nSummary: ${clubsWithLogos} out of ${clubs.length} clubs have logo data`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkClubs();