// Seed 8 club manager users with clubs (approved)
// Requirements:
// - backend/.env must include MONGO_URI and Firebase Admin creds
// - MongoDB must be reachable
// - Firebase service account must be valid

import 'dotenv/config';
import { connectDB } from '../config/db.js';
import { firebaseAdmin } from '../config/firebaseAdmin.js';
import User from '../models/User.js';
import Club from '../models/Club.js';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment. Aborting.');
  process.exit(1);
}

const accounts = [
  {
    email: 'manager01@crickarena.local',
    password: 'K3r@la!Cm01',
    name: 'Manager 01',
    clubName: 'Trivandrum Titans',
    district: 'Thiruvananthapuram',
    city: 'Thiruvananthapuram'
  },
  {
    email: 'manager02@crickarena.local',
    password: 'K3r@la!Cm02',
    name: 'Manager 02',
    clubName: 'Kollam Knights',
    district: 'Kollam',
    city: 'Kollam'
  },
  {
    email: 'manager03@crickarena.local',
    password: 'K3r@la!Cm03',
    name: 'Manager 03',
    clubName: 'Kottayam Kings',
    district: 'Kottayam',
    city: 'Kottayam'
  },
  {
    email: 'manager04@crickarena.local',
    password: 'K3r@la!Cm04',
    name: 'Manager 04',
    clubName: 'Ernakulam Eagles',
    district: 'Ernakulam',
    city: 'Kochi'
  },
  {
    email: 'manager05@crickarena.local',
    password: 'K3r@la!Cm05',
    name: 'Manager 05',
    clubName: 'Thrissur Thunder',
    district: 'Thrissur',
    city: 'Thrissur'
  },
  {
    email: 'manager06@crickarena.local',
    password: 'K3r@la!Cm06',
    name: 'Manager 06',
    clubName: 'Palakkad Panthers',
    district: 'Palakkad',
    city: 'Palakkad'
  },
  {
    email: 'manager07@crickarena.local',
    password: 'K3r@la!Cm07',
    name: 'Manager 07',
    clubName: 'Kozhikode Chargers',
    district: 'Kozhikode',
    city: 'Kozhikode'
  },
  {
    email: 'manager08@crickarena.local',
    password: 'K3r@la!Cm08',
    name: 'Manager 08',
    clubName: 'Kannur Warriors',
    district: 'Kannur',
    city: 'Kannur'
  }
];

async function ensureFirebaseUser({ email, password, name }) {
  const auth = firebaseAdmin.auth();
  try {
    const existing = await auth.getUserByEmail(email);
    // Update password/displayName and verify email to match test setup
    await auth.updateUser(existing.uid, {
      password,
      displayName: name,
      emailVerified: true
    });
    return existing.uid;
  } catch (err) {
    if (err && err.code === 'auth/user-not-found') {
      const created = await auth.createUser({
        email,
        password,
        displayName: name,
        emailVerified: true
      });
      return created.uid;
    }
    throw err;
  }
}

async function upsertUserDoc({ uid, email, name }) {
  const user = await User.findOneAndUpdate(
    { email },
    {
      firebaseUid: uid,
      name,
      email,
      role: 'clubManager',
      emailVerified: true
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return user;
}

async function upsertClubDoc({ manager, clubName, district, city, managerName, email }) {
  const club = await Club.findOneAndUpdate(
    { manager: manager._id },
    {
      clubName,
      district, // required by schema
      city,
      manager: manager._id,
      managerName,
      email,
      status: 'approved' // mark as approved for testing
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return club;
}

async function main() {
  try {
    await connectDB(MONGO_URI);

    const results = [];
    for (const acc of accounts) {
      const uid = await ensureFirebaseUser({ email: acc.email, password: acc.password, name: acc.name });
      const user = await upsertUserDoc({ uid, email: acc.email, name: acc.name });
      const club = await upsertClubDoc({
        manager: user,
        clubName: acc.clubName,
        district: acc.district,
        city: acc.city,
        managerName: acc.name,
        email: acc.email
      });
      results.push({ email: acc.email, uid, userId: user._id.toString(), clubId: club._id.toString(), clubName: club.clubName });
    }

    console.table(results);
    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

main();