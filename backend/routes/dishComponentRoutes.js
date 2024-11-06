// routes/dishComponentRoutes.js
const express = require('express');
const router = express.Router();
const { getAllDishComponents,createDishComponent , getDishComponentById,deleteDishComponent,updateDishComponent} = require('../controllers/dishComponentController'); // Assurez-vous que le chemin est correct

// Vérifiez que la fonction `getAllDishComponents` est définie et exportée dans le contrôleur
router.get('/', getAllDishComponents);
router.post('/', createDishComponent);
router.get('/:id', getDishComponentById);

// Ajouter un nouveau composant d'un type spécifique
router.put('/:id', updateDishComponent);

// Supprimer un composant d'un type spécifique
router.delete('/:id', deleteDishComponent);

module.exports = router;


