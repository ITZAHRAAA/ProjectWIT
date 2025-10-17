// routes/payment.js
const express = require("express");
const router = express.Router();

// Simple payment tracking without external payment processor
router.post("/create-payment", async (req, res) => {
  try {
    const { planType, amount, description } = req.body;
    
    if (!planType || !amount) {
      return res.status(400).json({ error: "planType and amount are required" });
    }

    // Create a simple payment record (you can implement your own payment logic here)
    const paymentData = {
      planType,
      amount,
      description: description || `Payment for ${planType} plan`,
      status: 'pending',
      createdAt: new Date()
    };

    // For now, just return success - implement your own payment logic
    res.json({ 
      message: "Payment created successfully",
      paymentId: `payment_${Date.now()}`,
      data: paymentData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;