// routes/webhooks.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/subscription');
const User = require('../models/user');
const Plan = require('../models/plan');

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    const rawBody = req.rawBody; // set in express.json verify
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const user = await User.findByPk(session.metadata.userId);
      const plan = await Plan.findByPk(session.metadata.planId);

      const now = new Date();
      const periodEnd = new Date(now);
      if (plan.interval === 'day') periodEnd.setDate(now.getDate() + 1);
      else if (plan.interval === 'month') periodEnd.setMonth(now.getMonth() + 1);
      else if (plan.interval === 'year') periodEnd.setFullYear(now.getFullYear() + 1);

      await Subscription.create({
        userId: user.id,
        planId: plan.id,
        status: 'active',
        startDate: now,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        stripeSubscriptionId: session.subscription,
        trialEnd: plan.trial_days > 0 ? new Date(now.getTime() + plan.trial_days * 24 * 60 * 60 * 1000) : null
      });
    }
  } catch (err) {
    console.error("Webhook handling error:", err);
    return res.status(500).send();
  }

  res.json({ received: true });
});

module.exports = router;