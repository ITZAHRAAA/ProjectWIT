// models/payment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  amount_cents: { type: DataTypes.INTEGER, allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  provider: { type: DataTypes.STRING },
  providerPaymentId: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('pending','succeeded','failed'), defaultValue: 'pending' }
}, { tableName: 'payments' });

module.exports = Payment;