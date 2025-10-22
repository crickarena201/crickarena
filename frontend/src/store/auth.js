import { defineStore } from 'pinia';
import axios from 'axios';
import { auth, googleProvider } from '../firebase/client';
import { isFirebaseConfigured } from '../firebase/client';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';
axios.defaults.withCredentials = true;

export const useAuthStore = defineStore('auth', {
  state: () => ({ 
    user: null, 
    idToken: null, 
    profile: null, 
    userProfile: null,
    loginAttempts: 0,
    lastLoginAttempt: null,
    isBlocked: false,
    initialized: false
  }),
  actions: {
    async init() {
      if (!isFirebaseConfigured) {
        console.warn('Auth disabled: missing Firebase configuration.');
        this.initialized = true; // ensure router guards don't hang
        return;
      }
      await new Promise((resolve) => {
        onAuthStateChanged(auth, async (u) => {
          this.user = u;
          this.idToken = u ? await u.getIdToken() : null;
          if (this.idToken) {
            // Set bearer header as fallback (useful in local dev and for immediate calls)
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.idToken}`;
            // Establish secure session cookie on backend
            try {
              await axios.post(`${API}/auth/session/login`, { idToken: this.idToken });
            } catch (e) {
              console.warn('Failed to set session cookie:', e?.response?.data || e.message);
            }
            // Fetch user profile (cookie will be sent automatically)
            try {
              const response = await axios.get(`${API}/auth/profile`);
              this.userProfile = response.data.user;
            } catch (err) {
              console.warn('Failed to fetch user profile:', err);
              this.userProfile = null;
            }
          } else {
            delete axios.defaults.headers.common['Authorization'];
            this.userProfile = null;
          }
          this.initialized = true;
          resolve();
        });
      });
    },
    async loginGoogle() {
      if (!isFirebaseConfigured) throw new Error('Firebase not configured');
      const { user } = await signInWithPopup(auth, googleProvider);
      this.user = user; this.idToken = await user.getIdToken(true);
      // Attempt to create server session cookie; backend will reject if not registered
      try {
        await axios.post(`${API}/auth/session/login`, { idToken: this.idToken });
        // If session established, fetch user profile
        try {
          const response = await axios.get(`${API}/auth/profile`);
          this.userProfile = response.data.user;
        } catch (err) {
          this.userProfile = null;
        }
        return true;
      } catch (e) {
        // Not registered: sign out locally and surface error
        await signOut(auth);
        this.user = null; this.idToken = null; this.userProfile = null;
        throw new Error(e?.response?.data?.message || 'This email is not registered. Please sign up first.');
      }
    },
    async loginEmail(email, password) {
      if (!isFirebaseConfigured) throw new Error('Firebase not configured');
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      this.user = user; this.idToken = await user.getIdToken(true);
      // Create/refresh session cookie
      try { await axios.post(`${API}/auth/session/login`, { idToken: this.idToken }); } catch {}
      // Fetch user profile from backend (cookie used)
      try {
        const response = await axios.get(`${API}/auth/profile`);
        this.userProfile = response.data.user;
      } catch (err) {
        console.warn('Failed to fetch user profile after login:', err);
        this.userProfile = null;
      }
    },
    async registerEmail(name, email, password, role='public') {
      if (!isFirebaseConfigured) throw new Error('Firebase not configured');
      
      console.log('Starting email registration for:', email);
      
      try {
        // Step 1: Create user in Firebase
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Firebase user created:', cred.user.uid);
        
        // Step 2: Send email verification
        await sendEmailVerification(cred.user);
        console.log('Email verification sent');
        
        // Step 3: Get ID token
        const idToken = await cred.user.getIdToken(true);
        console.log('ID token obtained');
        
        // Step 4: Register user in MongoDB
        console.log('Registering user in MongoDB...');
        const response = await axios.post(
          `${API}/auth/register`,
          { firebaseUid: cred.user.uid, name, email, role },
          { headers: { Authorization: `Bearer ${idToken}` } }
        );
        console.log('MongoDB registration successful:', response.data);
        this.userProfile = response.data.user;
        
        this.user = cred.user; 
        this.idToken = idToken;
        // Create/refresh session cookie
        try { await axios.post(`${API}/auth/session/login`, { idToken: this.idToken }); } catch {}
        // Refresh profile from backend to ensure latest role
        try {
          const prof = await axios.get(`${API}/auth/profile`);
          this.userProfile = prof.data.user;
        } catch {}
        
      } catch (err) {
        console.error('Registration error:', err);
        if (err.code) {
          // Firebase error
          console.error('Firebase error code:', err.code);
          console.error('Firebase error message:', err.message);
        }
        if (err.response) {
          // API error
          console.error('API error:', err.response.data);
        }
        throw new Error(err?.response?.data?.message || err.message || 'Registration failed. Please check backend and Firebase Admin config.');
      }
    },
    async registerWithCurrentUser(role='public') {
      if (!isFirebaseConfigured) throw new Error('Firebase not configured');
      if (!this.user) throw new Error('No authenticated user');
      const idToken = await this.user.getIdToken(true);
      try {
        const response = await axios.post(
          `${API}/auth/register`,
          { 
            firebaseUid: this.user.uid, 
            name: this.user.displayName || this.user.email?.split('@')[0] || 'User',
            email: this.user.email, 
            role 
          },
          { headers: { Authorization: `Bearer ${idToken}` } }
        );
        this.userProfile = response.data.user;
      } catch (err) {
        console.error('Register API error:', err?.response?.data || err.message);
        throw new Error(err?.response?.data?.message || 'Registration failed. Please check backend and Firebase Admin config.');
      }
      this.idToken = idToken;
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.idToken}`;
    },
    async logout() {
      if (!isFirebaseConfigured) {
        this.user = null; this.idToken = null; this.profile = null; this.userProfile = null;
        delete axios.defaults.headers.common['Authorization'];
        return;
      }
      await signOut(auth);
      // Clear server session cookie
      try { await axios.post(`${API}/auth/session/logout`); } catch {}
      this.user = null; this.idToken = null; this.profile = null; this.userProfile = null;
    }
  }
});