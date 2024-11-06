// controllers/dailySpecialController.js
const DailySpecial = require('../models/DailySpecial');
const SandwichChoice = require('../models/SandwichChoice');
const DishComponent = require('../models/DishComponent');

exports.getAllDailySpecials = async (req, res) => {
  try {
      const dayName = req.query.day_name;

      // Si day_name est fourni, filtrez les résultats par day_name
      if (dayName) {
          const dailySpecials = await DailySpecial.findAll({
              where: { day_name: dayName },
              include: [
                  { model: SandwichChoice, as: 'sandwichChoice' },
                  { model: DishComponent, as: 'dishComponent' }
              ]
          });

          if (dailySpecials.length === 0) {
              return res.status(404).json({ error: 'No daily specials found for this day' });
          }

          return res.json(dailySpecials);
      }

      // Sinon, récupérez tous les daily specials
      const dailySpecials = await DailySpecial.findAll({
          include: [
              { model: SandwichChoice, as: 'sandwichChoice' },
              { model: DishComponent, as: 'dishComponent' }
          ]
      });

      res.json(dailySpecials);
  } catch (error) {
      console.error('Error fetching daily specials:', error);
      res.status(500).json({ error: 'Error fetching daily specials' });
  }
};

exports.createDailySpecial = async (req, res) => {
  try {
    const { day_name, date, category_name, sandwich_choice_id, dish_component_id } = req.body;

    if (!day_name || !date || !category_name) {
      return res.status(400).json({ error: 'Day name, date, and category name are required' });
    }

    if (category_name === 'Sandwich' && !sandwich_choice_id) {
      return res.status(400).json({ error: 'Sandwich choice ID is required for Sandwich category' });
    }

    if (category_name === 'Dish' && !dish_component_id) {
      return res.status(400).json({ error: 'Dish component ID is required for Dish category' });
    }

    const dailySpecial = await DailySpecial.create({
      day_name,
      date,
      category_name,
      sandwich_choice_id: category_name === 'Sandwich' ? sandwich_choice_id : null,
      dish_component_id: category_name === 'Dish' ? dish_component_id : null
    });

    res.status(201).json(dailySpecial);
  } catch (error) {
    console.error('Error creating daily special:', error);
    res.status(500).json({ error: 'Error creating daily special' });
  }
};
exports.updateDailySpecial = async (req, res) => {
  try {
    const { day_name, date, category_name, sandwich_choice_id, dish_component_id } = req.body;
    const { id } = req.params;

    if (!day_name || !date || !category_name) {
      return res.status(400).json({ error: 'Day name, date, and category name are required' });
    }

    const dailySpecial = await DailySpecial.findByPk(id);

    if (!dailySpecial) {
      return res.status(404).json({ error: 'Daily special not found' });
    }

    dailySpecial.day_name = day_name;
    dailySpecial.date = date;
    dailySpecial.category_name = category_name;
    dailySpecial.sandwich_choice_id = category_name === 'Sandwich' ? sandwich_choice_id : null;
    dailySpecial.dish_component_id = category_name === 'Dish' ? dish_component_id : null;

    await dailySpecial.save();

    res.status(200).json(dailySpecial);
  } catch (error) {
    console.error('Error updating daily special:', error);
    res.status(500).json({ error: 'Error updating daily special' });
  }
};

exports.deleteDailySpecial = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DailySpecial.destroy({ where: { id } });
    if (result) {
      res.status(200).json({ message: 'Daily special deleted successfully' });
    } else {
      res.status(404).json({ message: 'Daily special not found' });
    }
  } catch (error) {
    console.error('Error deleting daily special:', error);
    res.status(500).json({ message: 'Server error' });
  }
};