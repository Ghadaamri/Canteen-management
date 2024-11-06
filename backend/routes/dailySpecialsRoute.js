// routes/dailySpecials.js
const express = require('express');
const router = express.Router();
const { getAllDailySpecials , createDailySpecial , updateDailySpecial ,deleteDailySpecial} = require('../controllers/dailySpecialsController');

// Assurez-vous que `getAllDailySpecials` est défini dans `dailySpecialController`
router.get('/', getAllDailySpecials);
router.post('/create', createDailySpecial);
router.put('/:id', updateDailySpecial);
router.delete('/:id', deleteDailySpecial);

module.exports = router;
