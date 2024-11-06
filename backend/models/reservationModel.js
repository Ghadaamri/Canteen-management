const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const DailySpecial = require('../models/DailySpecial');
const { Op } = require('sequelize');

class Reservation extends Model {}

Reservation.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    special_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DailySpecial,
            key: 'id'
        }
    },
    day_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reservation_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    confirmation: { // Nouvelle colonne
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Par défaut à false
      allowNull: false
  },
  comment: { // Nouvelle colonne
    type: DataTypes.TEXT, // Utiliser TEXT pour des commentaires plus longs
    allowNull: true
  },
  
}, {
    sequelize,
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: true
});

Reservation.belongsTo(DailySpecial, { as: 'dailySpecial', foreignKey: 'special_id' });

module.exports = Reservation;
