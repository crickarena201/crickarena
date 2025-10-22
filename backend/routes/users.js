import express from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim(),
  phone: Joi.string().allow('', null),
  district: Joi.string().allow('', null)
});

const favSchema = Joi.object({
  type: Joi.string().valid('tournament', 'club').required(),
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  action: Joi.string().valid('add', 'remove').required()
});

// Get current user's profile (mirrors /api/auth/profile but under /api/users/me)
router.get('/me', verifyFirebaseToken, async (req, res) => {
  const user = req.user;
  res.json({ user });
});

// Update current user's profile
router.put('/me', verifyFirebaseToken, async (req, res) => {
  try {
    const { value, error } = updateSchema.validate(req.body || {}, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = req.user;
    if (value.name !== undefined) user.name = value.name;
    if (value.phone !== undefined) user.phone = value.phone || '';
    if (value.district !== undefined) user.district = value.district || '';

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (e) {
    console.error('Update profile error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get favorites (optionally populated)
router.get('/me/favorites', verifyFirebaseToken, async (req, res) => {
  try {
    const populate = String(req.query.populate || 'false').toLowerCase() === 'true' || req.query.populate === '1';
    const user = req.user;

    if (!populate) {
      return res.json({
        favoriteTournaments: (user.favoriteTournaments || []).map(String),
        favoriteClubs: (user.favoriteClubs || []).map(String),
      });
    }

    const populated = await user
      .populate([
        { path: 'favoriteTournaments', options: { lean: true } },
        { path: 'favoriteClubs', options: { lean: true } }
      ]);

    res.json({
      favoriteTournaments: populated.favoriteTournaments || [],
      favoriteClubs: populated.favoriteClubs || [],
    });
  } catch (e) {
    console.error('Get favorites error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update favorites (add/remove)
router.post('/me/favorites', verifyFirebaseToken, async (req, res) => {
  try {
    const { value, error } = favSchema.validate(req.body || {}, { abortEarly: true });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = req.user;
    const oid = new mongoose.Types.ObjectId(value.id);

    if (value.type === 'tournament') {
      const set = new Set((user.favoriteTournaments || []).map(String));
      if (value.action === 'add') set.add(String(oid)); else set.delete(String(oid));
      user.favoriteTournaments = Array.from(set).map(id => new mongoose.Types.ObjectId(id));
    } else if (value.type === 'club') {
      const set = new Set((user.favoriteClubs || []).map(String));
      if (value.action === 'add') set.add(String(oid)); else set.delete(String(oid));
      user.favoriteClubs = Array.from(set).map(id => new mongoose.Types.ObjectId(id));
    }

    await user.save();

    res.json({
      message: 'Favorites updated',
      favoriteTournaments: (user.favoriteTournaments || []).map(String),
      favoriteClubs: (user.favoriteClubs || []).map(String),
    });
  } catch (e) {
    console.error('Update favorites error:', e);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;