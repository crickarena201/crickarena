import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tournament from './models/Tournament.js';
import Match from './models/Match.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

console.log('Testing tournament deletion...');

try {
  // Find a tournament to delete
  const tournament = await Tournament.findOne();
  if (!tournament) {
    console.log('No tournaments found in database');
    process.exit(1);
  }
  
  console.log('Found tournament:', tournament._id, tournament.name);
  
  // Try to delete matches first
  console.log('Deleting matches for tournament...');
  const deleteMatchesResult = await Match.deleteMany({ tournament: tournament._id });
  console.log('Deleted matches count:', deleteMatchesResult.deletedCount);
  
  // Then delete the tournament
  console.log('Deleting tournament...');
  const deletedTournament = await Tournament.findByIdAndDelete(tournament._id);
  console.log('Deleted tournament:', deletedTournament);
  
  if (deletedTournament) {
    console.log('Tournament deleted successfully');
  } else {
    console.log('Tournament not found or already deleted');
  }
} catch (error) {
  console.error('Error during test:', error);
} finally {
  await mongoose.connection.close();
  console.log('Database connection closed');
}