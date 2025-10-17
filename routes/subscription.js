// routes/subscription.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Plan = require('../models/plan');
const Subscription = require('../models/subscription');

// Create a new subscription
router.post('/create', auth(), async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await Plan.findByPk(planId);
    if (!plan) return res.status(404).json({ msg: 'Plan not found' });

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      where: { userId: req.user.id, status: 'active' }
    });

    if (existingSubscription) {
      return res.status(400).json({ msg: 'User already has an active subscription' });
    }

    const now = new Date();
    const periodEnd = new Date(now);
    
    // Calculate period end based on plan interval
    if (plan.interval === 'day') periodEnd.setDate(now.getDate() + 1);
    else if (plan.interval === 'month') periodEnd.setMonth(now.getMonth() + 1);
    else if (plan.interval === 'year') periodEnd.setFullYear(now.getFullYear() + 1);

    const subscription = await Subscription.create({
      userId: req.user.id,
      planId: plan.id,
      status: 'active',
      startDate: now,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      trialEnd: plan.trial_days > 0 ? new Date(now.getTime() + plan.trial_days * 24 * 60 * 60 * 1000) : null
    });

    res.json({ 
      msg: 'Subscription created successfully',
      subscription: subscription
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel subscription
router.post('/cancel', auth(), async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id, status: 'active' }
    });
    
    if (!subscription) return res.status(404).json({ msg: 'No active subscription found' });

    subscription.status = 'cancelled';
    subscription.canceledAt = new Date();
    await subscription.save();

    res.json({ msg: 'Subscription cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's subscription
router.get('/my-subscription', auth(), async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id },
      include: [{ model: Plan, as: 'plan' }],
      order: [['createdAt', 'DESC']]
    });

    if (!subscription) {
      return res.status(404).json({ msg: 'No subscription found' });
    }

    res.json({ subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;