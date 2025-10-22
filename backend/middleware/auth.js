import { firebaseAdmin } from '../config/firebaseAdmin.js';
import User from '../models/User.js';

async function verifyFromRequest(req) {
  const authH = req.headers.authorization || '';
  const bearer = authH.startsWith('Bearer ') ? authH.slice(7) : null;
  const sessionCookie = req.cookies?.session || null;

  if (sessionCookie) {
    // Prefer session cookie if present
    const decoded = await firebaseAdmin.auth().verifySessionCookie(sessionCookie, true);
    return decoded;
  }
  if (bearer) {
    const decoded = await firebaseAdmin.auth().verifyIdToken(bearer, true);
    return decoded;
  }
  const err = new Error('Missing token');
  err.status = 401;
  throw err;
}

export async function verifyFirebaseToken(req, res, next) {
  try {
    const decoded = await verifyFromRequest(req);
    req.firebase = decoded;
    // Attach Mongo user profile
    const user = await User.findOne({ firebaseUid: decoded.uid }).populate('club');
    if (!user) return res.status(403).json({ message: 'Profile not found' });
    req.user = user;
    next();
  } catch (e) {
    const status = e?.status === 401 ? 401 : 401;
    console.error('Auth verify failed:', e?.message || e);
    res.status(status).json({ message: e?.status === 401 ? 'Missing token' : 'Invalid token' });
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const decoded = await verifyFromRequest(req);
    req.firebase = decoded;
    req.user = (await User.findOne({ firebaseUid: decoded.uid }).populate('club')) || null;
  } catch {
    // No auth
  } finally {
    next();
  }
}