// models/subscription.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subscription = sequelize.define('Subscription', {
  status: { type: DataTypes.ENUM('active','cancelled','past_due'), defaultValue: 'active' },
  startDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  currentPeriodStart: { type: DataTypes.DATE },
  currentPeriodEnd: { type: DataTypes.DATE },
  trialEnd: { type: DataTypes.DATE },
  canceledAt: { type: DataTypes.DATE },
  amountPaidCents: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'subscriptions' });

module.exports = Subscription;