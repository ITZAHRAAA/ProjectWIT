// routes/subscription.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Plan = require('../models/plan');
const Subscription = require('../models/subscription');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { calculateProration } = require('../utils/proration');

router.post('/create-checkout-session', auth(), async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await Plan.findByPk(planId);
    if (!plan) return res.status(404).json({ msg: 'Plan not found' });

    if (!plan.stripePriceId) return res.status(400).json({ msg: 'Plan not linked to Stripe Price ID' });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      customer_email: req.user.email,
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: { userId: req.user.id, planId: plan.id }
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/cancel', auth(), async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id, status: 'active' }
    });
    if (!subscription) return res.status(404).json({ msg: 'No active subscription' });

    const now = new Date();
    const proration = calculateProration({
      currentStart: subscription.currentPeriodStart,
      currentEnd: subscription.currentPeriodEnd,
      now,
      paidCents: subscription.amountPaidCents || 0
    });

    subscription.status = 'cancelled';
    subscription.canceledAt = now;
    await subscription.save();

    res.json({ msg: 'Subscription cancelled', refund: proration.refundCents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;