import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Tournament from '../models/Tournament.js';
import Club from '../models/Club.js';
import Payment from '../models/Payment.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys not configured');
  }
  return new Razorpay({ key_id, key_secret });
}

// Create an order for tournament entry fee
router.post('/orders', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
  const { tournamentId } = req.body || {};
    if (!tournamentId) return res.status(400).json({ message: 'tournamentId is required' });

    const t = await Tournament.findById(tournamentId).lean();
    if (!t) return res.status(404).json({ message: 'Tournament not found' });
    const fee = Number(t.entryFee) || 0;
    if (fee <= 0) return res.status(400).json({ message: 'This tournament has no entry fee' });

    const myClub = await Club.findOne({ manager: req.user._id }).lean();
    if (!myClub) return res.status(400).json({ message: 'No club found for this user' });

  // Ensure club's registration is approved and awaiting payment
  const tReg = await (await import('../models/Tournament.js')).default.findById(tournamentId);
  const reg = tReg?.registrations?.find(r => String(r.club) === String(myClub._id));
  if (!reg || reg.status !== 'approved') {
    return res.status(400).json({ message: 'Registration not approved yet' });
  }
  if (reg.paymentStatus && reg.paymentStatus === 'paid') {
    return res.status(400).json({ message: 'Entry fee already paid' });
  }

    const instance = getRazorpay();
    const amountPaise = Math.round(fee * 100);
    // Razorpay requires receipt length <= 40; build compact, deterministic receipt and hard-cap to 40
    const shortT = String(t._id).slice(-6);
    const shortC = String(myClub._id).slice(-6);
    const shortTs = Date.now().toString(36); // base36 timestamp for compactness
    let receipt = `t_${shortT}_${shortC}_${shortTs}`;
    if (receipt.length > 40) {
      // Keep uniqueness at the end (timestamp), trim from start
      receipt = receipt.slice(-40);
    }
    console.log('Creating Razorpay order with receipt:', receipt, 'len=', receipt.length);

    const order = await instance.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt,
      notes: { tournamentId: String(t._id), clubId: String(myClub._id), name: t.name }
    });

    // Persist payment record in 'created' state
    await Payment.create({
      tournament: t._id,
      club: myClub._id,
      manager: req.user._id,
      orderId: order.id,
      amount: amountPaise,
      currency: 'INR',
      receipt,
      status: 'created',
      notes: order.notes
    });

    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      order,
      amount: amountPaise,
      currency: 'INR',
      tournament: { id: t._id, name: t.name, entryFee: fee }
    });
  } catch (err) {
    // Log as much context as possible for debugging
    const detail = err?.error?.description || err?.response?.data?.error?.description || err?.message || 'Unknown error';
    console.error('Order creation error:', detail);
    res.status(500).json({ message: 'Failed to create order', detail });
  }
});

// Verify payment signature
router.post('/verify', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    const { tournamentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!tournamentId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing verification fields' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(500).json({ message: 'Razorpay secret not configured' });

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update payment status and attach IDs
    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: 'paid',
        'verification.verified': true,
        'verification.method': 'signature',
        'verification.verifiedAt': new Date()
      },
      { new: true }
    );

    // After successful payment, mark registration as paid and add to participants
    try {
      const myClub = await Club.findOne({ manager: req.user._id });
      const t = await Tournament.findById(tournamentId);
      if (myClub && t) {
        const reg = t.registrations.find(r => String(r.club) === String(myClub._id));
        if (reg) {
          reg.paymentStatus = 'paid';
          reg.paymentAmount = Number(t.entryFee) || 0;
          // Add to participants now that payment is done
          const exists = (t.participants || []).some(id => String(id) === String(reg.club));
          if (!exists) t.participants.push(reg.club);
          await t.save();
        }
      }
    } catch (e) {
      console.warn('Post-payment update failed (non-blocking):', e?.message || e);
    }

    res.json({ message: 'Payment verified', tournamentId, orderId: razorpay_order_id, paymentId: razorpay_payment_id, stored: Boolean(payment) });
  } catch (err) {
    console.error('Payment verify error:', err?.message || err);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
});

export default router;