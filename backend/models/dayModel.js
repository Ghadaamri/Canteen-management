const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Day extends Model {}

Day.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Day',
    timestamps: true, // Enable timestamps
  }
);

module.exports = Day;
