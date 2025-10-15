// models/index.js
const sequelize = require('../config/database');

const User = require('./user');
const Factory = require('./factory');
const Plan = require('./plan');
const Subscription = require('./subscription');
const Payment = require('./payment');

// Associations
User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

Subscription.hasMany(Payment, { foreignKey: 'subscriptionId' });
Payment.belongsTo(Subscription, { foreignKey: 'subscriptionId' });

User.hasMany(Subscription, { foreignKey: 'userId' });
Subscription.belongsTo(User, { foreignKey: 'userId' });

Plan.hasMany(Subscription, { foreignKey: 'planId' });
Subscription.belongsTo(Plan, { foreignKey: 'planId' });

// You may also add Factory relations later if needed

module.exports = {
  sequelize,
  User,
  Factory,
  Plan,
  Subscription,
  Payment
};
