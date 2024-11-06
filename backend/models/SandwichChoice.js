// models/SandwichChoice.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class SandwichChoice extends Model {}

SandwichChoice.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'SandwichChoice',
    tableName: 'sandwich_choices',
    timestamps: false
});

module.exports = SandwichChoice;
