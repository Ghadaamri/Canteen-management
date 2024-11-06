const SandwichChoice = require('../models/SandwichChoice');
const db=require('../config/db') ;

exports.getAllSandwichChoices = async (req, res) => {
    try {
        const sandwichChoices = await SandwichChoice.findAll();
        res.json(sandwichChoices);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching sandwich choices' });
    }
};

exports.createSandwichChoice = async (req, res) => {
    try {
        const sandwichChoice = await SandwichChoice.create(req.body);
        res.status(201).json(sandwichChoice);
    } catch (error) {
        res.status(500).json({ error: 'Error creating sandwich choice' });
    }
};
exports.deleteSandwichChoice = async (req, res) => {
  const { id } = req.params;

  try {
    const sandwichChoice = await SandwichChoice.findByPk(id);

    if (!sandwichChoice) {
      return res.status(404).json({ error: 'Sandwich choice not found' });
    }

    await sandwichChoice.destroy();
    return res.status(200).json({ message: 'Sandwich choice deleted successfully' });
  } catch (error) {
    console.error('Error deleting sandwich choice:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.updateSandwichChoice = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Chercher le SandwichChoice par son ID
    const sandwichChoice = await SandwichChoice.findByPk(id);

    // Si le SandwichChoice n'existe pas, renvoyer une erreur 404
    if (!sandwichChoice) {
      return res.status(404).json({ error: 'Sandwich choice not found' });
    }

    // Mettre à jour le SandwichChoice
    sandwichChoice.name = name;
    
    // Sauvegarder les modifications
    await sandwichChoice.save();

    // Renvoyer le SandwichChoice mis à jour
    return res.status(200).json(sandwichChoice);
  } catch (error) {
    console.error('Error updating sandwich choice:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};