// controllers/dishComponentController.js
const DishComponent = require('../models/DishComponent');

exports.getAllDishComponents = async (req, res) => {
    try {
        const dishComponents = await DishComponent.findAll();
        res.json(dishComponents);
    } catch (error) {
        console.error('Error fetching dish components:', error);
        res.status(500).json({ error: 'Error fetching dish components' });
    }
};

exports.createDishComponent = async (req, res) => {
  try {
    const { soup, salad, main_course_1, main_course_2, garniture_1, garniture_2, dessert_1, dessert_2 } = req.body;

    if (!soup || !salad || !main_course_1 || !main_course_2 || !garniture_1 || !garniture_2 || !dessert_1 || !dessert_2) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Ajouter une vérification de date ici si nécessaire
    const today = new Date().toISOString().split('T')[0];
    // Par exemple, vérifier si la date est dans la plage valide
    // if (someConditionBasedOnDate) {
    //   return res.status(400).json({ error: 'Invalid date condition' });
    // }
    const dishComponent = await DishComponent.create({
      soup,
      salad,
      main_course_1,
      main_course_2,
      garniture_1,
      garniture_2,
      dessert_1,
      dessert_2,
      createdAt: today, // Ajouter une date de création
      updatedAt: today  // Ajouter une date de mise à jour
    });

    res.status(201).json(dishComponent);
  } catch (error) {
    console.error('Error creating dish component:', error);
    res.status(500).json({ error: 'Error creating dish component' });
  }
};

exports.getDishComponentById = async (req, res) => {
  try {
    const dishComponent = await DishComponent.findByPk(req.params.id);
    if (!dishComponent) {
      return res.status(404).json({ message: 'DishComponent non trouvé' });
    }
    res.status(200).json(dishComponent);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du DishComponent', error });
  }
};

// Mettre à jour un DishComponent par ID
exports.updateDishComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const dishComponent = await DishComponent.findByPk(id);

    if (!dishComponent) {
      return res.status(404).json({ message: 'DishComponent not found' });
    }

    // Ajouter une vérification de date ici si nécessaire
    const today = new Date().toISOString().split('T')[0];
    // Par exemple, vérifier si la date est dans la plage valide
    // if (someConditionBasedOnDate) {
    //   return res.status(400).json({ error: 'Invalid date condition' });
    // }

    await dishComponent.update({
      ...req.body,
      updatedAt: today // Mettre à jour la date de mise à jour
    });
    
    res.status(200).json(dishComponent);
  } catch (error) {
    console.error('Error updating DishComponent:', error);
    res.status(500).json({ message: 'Error updating DishComponent' });
  }
};
// Supprimer un DishComponent par ID
exports.deleteDishComponent = async (req, res) => {
  try {
    const dishComponent = await DishComponent.findByPk(req.params.id);
    if (!dishComponent) {
      return res.status(404).json({ message: 'DishComponent non trouvé' });
    }
    await dishComponent.destroy();
    res.status(200).json({ message: 'DishComponent supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du DishComponent', error });
  }
};