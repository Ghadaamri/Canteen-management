const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Category extends Model {}

Category.init(
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
    modelName: 'Category',
    timestamps: true, // Enable timestamps
  }
);

module.exports = Category;
