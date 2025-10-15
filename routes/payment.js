// routes/payment.js
const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const { planType } = req.body;
  const prices = {
    monthly: 10000, // cents -> $100.00
    yearly: 100000 // cents -> $1000.00
  };

  if (!planType || !prices[planType]) return res.status(400).json({ error: "Invalid planType" });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `Subscription Plan: ${planType}` },
          unit_amount: prices[planType]
        },
        quantity: 1
      }],
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;