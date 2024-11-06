const express = require('express');
const router = express.Router();
const sandwichChoiceController = require('../controllers/sandwichChoiceController');

router.get('/', sandwichChoiceController.getAllSandwichChoices);
router.post('/', sandwichChoiceController.createSandwichChoice);
router.delete('/:id', sandwichChoiceController.deleteSandwichChoice);
router.put('/:id', sandwichChoiceController.updateSandwichChoice);

module.exports = router;
