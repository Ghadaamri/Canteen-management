const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Chemin vers votre configuration Sequelize


const User = sequelize.define('User', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  firstName: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  lastName: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // L'email doit être unique
  },
  password: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  code: {
      type: DataTypes.STRING(8), // 8 caractères pour correspondre à votre code utilisateur
      allowNull: false,
      unique: true, // Assurez-vous que chaque code est unique
  },
}, {
  tableName: 'users', // Assurez-vous que cela correspond au nom de votre table dans la base de données
  timestamps: false // Désactiver les colonnes createdAt et updatedAt
});

module.exports = User;