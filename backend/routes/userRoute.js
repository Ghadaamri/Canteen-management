const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Assurez-vous que ce chemin est correct

// Route pour obtenir un utilisateur par code
router.get('/by-code/:code', async (req, res) => {
  try {
    const user = await User.findOne({ where: { code: req.params.code } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by code:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
