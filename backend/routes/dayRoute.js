// routes/dayRoute.js
const express = require('express');
const router = express.Router();
const dayController = require('../controllers/dayController');

router.get('/', dayController.getAllDays);
router.post('/', dayController.createDay);

module.exports = router;
