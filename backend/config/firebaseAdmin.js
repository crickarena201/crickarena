import admin from 'firebase-admin';

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

// Normalize private key from .env (handle both raw base64 body and full PEM with escaped newlines)
const normalizedKey = (FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const hasPemHeader = /BEGIN PRIVATE KEY/.test(normalizedKey);
const privateKey = hasPemHeader
  ? normalizedKey
  : `-----BEGIN PRIVATE KEY-----\n${normalizedKey}\n-----END PRIVATE KEY-----\n`;

const serviceAccount = {
  projectId: FIREBASE_PROJECT_ID,
  project_id: FIREBASE_PROJECT_ID, // some firebase-admin versions expect snake_case
  clientEmail: FIREBASE_CLIENT_EMAIL,
  client_email: FIREBASE_CLIENT_EMAIL,
  privateKey,
  private_key: privateKey
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const firebaseAdmin = admin;