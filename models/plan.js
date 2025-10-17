// models/plan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Plan = sequelize.define('Plan', {
  name: { type: DataTypes.STRING, allowNull: false },
  price_cents: { type: DataTypes.INTEGER, allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  interval: { type: DataTypes.ENUM('day','month','year'), allowNull: false },
  features: { type: DataTypes.JSON },
  trial_days: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'plans' });

module.exports = Plan;