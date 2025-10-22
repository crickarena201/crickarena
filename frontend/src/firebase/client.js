import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Read config from Vite env (create a `.env` or `.env.local` in /frontend)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

// Determine if Firebase is properly configured
export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (v) => v !== undefined && v !== 'undefined' && v !== '' && v != null
);

if (!isFirebaseConfigured) {
  console.warn('Firebase config missing. Auth features are disabled. Set VITE_FIREBASE_* in your frontend .env to enable.');
}

let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  // Show account chooser every time and ensure fresh consent
  googleProvider.setCustomParameters({ prompt: 'select_account', display: 'popup' });
}

export { auth, googleProvider };