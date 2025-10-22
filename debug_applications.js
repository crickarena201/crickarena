// Debug script to check player applications in the database
import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Club from './models/Club.js';
import Player from './models/Player.js';

const MONGO_URI = process.env.MONGO_URI;

async function debugApplications() {
  try {
    await connectDB(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all players with applications
    const playersWithApps = await Player.find({ 
      'applications.0': { $exists: true } 
    })
    .populate('user', 'name email')
    .populate('applications.club', 'clubName name district manager')
    .select('fullName applications user');

    console.log(`\nFound ${playersWithApps.length} players with applications:`);
    
    playersWithApps.forEach((player, index) => {
      console.log(`\n--- Player ${index + 1} ---`);
      console.log(`Name: ${player.fullName}`);
      console.log(`Email: ${player.user?.email}`);
      console.log(`Applications: ${player.applications.length}`);
      
      player.applications.forEach((app, appIndex) => {
        console.log(`  Application ${appIndex + 1}:`);
        console.log(`    Club: ${app.club?.clubName || app.club?.name || 'Unknown'}`);
        console.log(`    Status: ${app.status}`);
        console.log(`    Applied At: ${app.appliedAt}`);
        console.log(`    Club ID: ${app.club?._id}`);
        console.log(`    Club Manager: ${app.club?.manager}`);
      });
    });

    // Find all clubs and their managers
    console.log('\n--- All Clubs ---');
    const clubs = await Club.find({ status: 'approved' })
      .populate('manager', 'name email')
      .select('clubName name manager district');
    
    clubs.forEach((club, index) => {
      console.log(`\nClub ${index + 1}:`);
      console.log(`  Name: ${club.clubName || club.name}`);
      console.log(`  Manager: ${club.manager?.name} (${club.manager?.email})`);
      console.log(`  Manager ID: ${club.manager?._id}`);
      console.log(`  Club ID: ${club._id}`);
    });

    // Test the API endpoint logic manually
    console.log('\n--- Testing API Endpoint Logic ---');
    
    for (const club of clubs) {
      console.log(`\nTesting for club: ${club.clubName || club.name}`);
      
      // Find all players with applications to this club
      const players = await Player.find({ 'applications.club': club._id })
        .populate('user', 'name email')
        .select('fullName age preferredPosition playingExperience applications careerHistory profilePhoto');

      console.log(`  Found ${players.length} players with applications to this club`);

      // Filter and format applications for this club
      const applications = [];
      players.forEach(player => {
        const clubApplications = player.applications.filter(app => 
          app.club.toString() === club._id.toString()
        );
        
        clubApplications.forEach(app => {
          applications.push({
            _id: app._id,
            player: {
              _id: player._id,
              fullName: player.fullName,
              age: player.age,
              preferredPosition: player.preferredPosition,
              playingExperience: player.playingExperience,
              user: player.user
            },
            status: app.status,
            appliedAt: app.appliedAt
          });
        });
      });

      console.log(`  Formatted applications: ${applications.length}`);
      console.log(`  Pending applications: ${applications.filter(app => app.status === 'pending').length}`);
      
      if (applications.length > 0) {
        applications.forEach((app, index) => {
          console.log(`    App ${index + 1}: ${app.player.fullName} - ${app.status}`);
        });
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Debug failed:', err);
    process.exit(1);
  }
}

debugApplications();
