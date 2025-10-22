import express from 'express';
import Joi from 'joi';
import User from '../models/User.js';
import { firebaseAdmin } from '../config/firebaseAdmin.js';

const router = express.Router();

// Helper: set Firebase session cookie from ID token
async function setSessionCookie(res, idToken) {
  // 5 days session
  const expiresIn = 5 * 24 * 60 * 60 * 1000;
  const sessionCookie = await firebaseAdmin.auth().createSessionCookie(idToken, { expiresIn });
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('session', sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });
}

function clearSessionCookie(res) {
  res.clearCookie('session', { path: '/' });
}

const registerSchema = Joi.object({
  firebaseUid: Joi.string().alphanum().min(10).max(50).required(),
  name: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be less than 50 characters'
    }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .max(254)
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.max': 'Email address is too long'
    }),
  role: Joi.string().valid('public', 'clubManager', 'player', 'coach').default('public')
});

// Disposable email domains to block
const disposableEmailDomains = [
  '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc', 'yopmail.com',
  'sharklasers.com', 'guerrillamail.info', 'grr.la', 'guerrillamail.biz'
];

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map();

// Clean up expired rate limit entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

// Lightweight input sanitization (server-side)
// Avoid DOM-based sanitizers in Node; rely on validation and simple trimming.
function sanitizeInput(obj) {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj || {})) {
    if (typeof value === 'string') {
      // Strip HTML tags and trim whitespace
      const noTags = value.replace(/<[^>]*>/g, '');
      sanitized[key] = noTags.trim();
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// Rate limiting function
function checkRateLimit(ip, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const key = `${ip}`;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const record = rateLimitStore.get(key);
  
  if (now > record.resetTime) {
    // Reset the counter
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxAttempts) {
    return false;
  }
  
  record.count++;
  return true;
}

// Exchange Firebase ID token for a secure session cookie
// IMPORTANT: Only allow session creation if the user is registered in MongoDB
router.post('/session/login', async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ message: 'idToken required' });

    // Verify Firebase ID token first
    let decoded;
    try {
      decoded = await firebaseAdmin.auth().verifyIdToken(idToken, true);
    } catch (err) {
      console.warn('Invalid ID token on session login:', err?.message || err);
      return res.status(401).json({ message: 'Invalid ID token' });
    }

    // Enforce registered-user check
    // Prefer lookup by firebaseUid; fall back to email when available
    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user && decoded.email) {
      user = await User.findOne({ email: String(decoded.email).toLowerCase().trim() });
    }
    if (!user) {
      return res.status(403).json({ message: 'Account not registered. Please sign up first.' });
    }

    await setSessionCookie(res, idToken);
    res.json({ message: 'Session established' });
  } catch (e) {
    console.error('Session login error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear the session cookie
router.post('/session/logout', async (req, res) => {
  try {
    const session = req.cookies?.session;
    if (session) {
      try {
        const decoded = await firebaseAdmin.auth().verifySessionCookie(session, true);
        await firebaseAdmin.auth().revokeRefreshTokens(decoded.sub);
      } catch {}
    }
    clearSessionCookie(res);
    res.json({ message: 'Logged out' });
  } catch (e) {
    res.json({ message: 'Logged out' });
  }
});

router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    // Check rate limiting
    const clientIP = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(clientIP, 30, 60 * 60 * 1000)) { // 30 attempts per hour
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return res.status(429).json({ message: 'Too many registration attempts. Please try again later.' });
    }
    
    // Sanitize input data
    const sanitizedBody = sanitizeInput(req.body);
    console.log('Sanitized input:', sanitizedBody);
    
    // Verify Firebase session or bearer token
    let decoded;
    try {
      const sessionCookie = req.cookies?.session;
      if (sessionCookie) {
        decoded = await firebaseAdmin.auth().verifySessionCookie(sessionCookie, true);
      } else {
        const authH = req.headers.authorization || '';
        const token = authH.startsWith('Bearer ') ? authH.slice(7) : null;
        if (!token) return res.status(401).json({ message: 'Missing token' });
        decoded = await firebaseAdmin.auth().verifyIdToken(token);
      }
      console.log('Firebase token verified for UID:', decoded.uid);
    } catch (err) {
      console.error('ID token verify failed:', err?.message || err);
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (decoded.uid !== sanitizedBody.firebaseUid) {
      console.warn('UID mismatch', { decodedUid: decoded.uid, bodyUid: sanitizedBody.firebaseUid });
      return res.status(403).json({ message: 'UID mismatch' });
    }

    const { value, error } = registerSchema.validate(sanitizedBody);
    if (error) {
      console.log('Validation error:', error.message);
      return res.status(400).json({ message: error.details[0].message });
    }

    // Additional validation for disposable email domains
    const emailDomain = value.email.split('@')[1];
    if (disposableEmailDomains.includes(emailDomain)) {
      console.log('Disposable email rejected:', value.email);
      return res.status(400).json({ message: 'Please use a permanent email address, not a disposable one' });
    }

    // Check if email is already registered by another user
    const existingUser = await User.findOne({ 
      email: value.email, 
      firebaseUid: { $ne: value.firebaseUid } 
    });
    if (existingUser) {
      console.log('Email already in use by different user:', value.email);
      return res.status(400).json({ message: 'Email address is already registered' });
    }



    let user = await User.findOne({ firebaseUid: value.firebaseUid });
    if (!user) {
      console.log('Creating new user in MongoDB:', value);
      user = await User.create({ ...value, emailVerified: true });
      console.log('User created successfully:', user._id);
    } else {
      console.log('Updating existing user:', user._id);
      user.name = value.name;
      user.email = value.email;
      user.role = value.role;
      user.emailVerified = true;
      await user.save();
      console.log('User updated successfully');
    }

    res.json({ message: 'Registered successfully', user });
  } catch (e) {
    console.error('Registration error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile (supports session cookie)
router.get('/profile', async (req, res) => {
  try {
    const sessionCookie = req.cookies?.session;
    let decoded;
    if (sessionCookie) {
      decoded = await firebaseAdmin.auth().verifySessionCookie(sessionCookie, true);
    } else {
      const authH = req.headers.authorization || '';
      const token = authH.startsWith('Bearer ') ? authH.slice(7) : null;
      if (!token) return res.status(401).json({ message: 'Missing token' });
      decoded = await firebaseAdmin.auth().verifyIdToken(token);
    }

    const user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (e) {
    console.error('Profile fetch error:', e);
    res.status(401).json({ message: 'Invalid or missing session' });
  }
});


export default router;