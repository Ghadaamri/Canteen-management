const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const SandwichChoice = require('./SandwichChoice');
const DishComponent = require('./DishComponent');

const DailySpecial = sequelize.define('DailySpecial', {
    day_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY, // Utilisation de DATEONLY pour stocker uniquement la date sans l'heure
      allowNull: false
  },
    dish_component_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    sandwich_choice_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'daily_specials'
});

DailySpecial.belongsTo(SandwichChoice, { foreignKey: 'sandwich_choice_id', as: 'sandwichChoice' });
DailySpecial.belongsTo(DishComponent, { foreignKey: 'dish_component_id', as: 'dishComponent' });



module.exports = DailySpecial;
