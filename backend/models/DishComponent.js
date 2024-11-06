// models/DishComponent.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class DishComponent extends Model {}

DishComponent.init({
    soup: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    main_course_1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    main_course_2: {
        type: DataTypes.STRING,
        allowNull: false
    },
    garniture_1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    garniture_2: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dessert_1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dessert_2: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'DishComponent',
    tableName: 'dish_components',
    timestamps: false
});

module.exports = DishComponent;
