const sequelize = require('./config/db');
// sync.js or a separate file for associations
const DailySpecial = require('./models/DailySpecial');
const SandwichChoice = require('./models/SandwichChoice');
const DishComponent = require('./models/DishComponent');

// Configurer les associations
DailySpecial.belongsTo(SandwichChoice, { foreignKey: 'sandwich_choice_id' });
DailySpecial.belongsTo(DishComponent, { foreignKey: 'dish_component_id' });

SandwichChoice.hasMany(DailySpecial, { foreignKey: 'sandwich_choice_id' });
DishComponent.hasMany(DailySpecial, { foreignKey: 'dish_component_id' });

// Synchroniser les modèles avec la base de données
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synchronized');
}).catch(error => {
    console.error('Error synchronizing database:', error);
});
