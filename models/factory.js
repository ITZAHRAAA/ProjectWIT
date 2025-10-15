// models/factory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Factory = sequelize.define('Factory', {
  name: { type: DataTypes.STRING, allowNull: false },
  logoUrl: { type: DataTypes.STRING },
  governorate: { type: DataTypes.STRING },
  industryType: { type: DataTypes.STRING },
  establishedYear: { type: DataTypes.INTEGER },
  status: { type: DataTypes.ENUM('active','paused'), defaultValue: 'active' },
  phone: { type: DataTypes.STRING },
  location: { type: DataTypes.JSON }, // {lat, lng}
  description: { type: DataTypes.TEXT },
}, { tableName: 'factories' });

module.exports = Factory;