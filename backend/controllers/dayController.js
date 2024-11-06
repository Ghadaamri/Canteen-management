// controllers/dayController.js
const Day = require('../models/dayModel');

exports.getAllDays = async (req, res) => {
    try {
        const days = await Day.findAll();
        res.json(days);
    } catch (error) {
        console.error('Error fetching days:', error);
        res.status(500).json({ error: 'Error fetching days' });
    }
};

exports.createDay = async (req, res) => {
    try {
        const day = await Day.create(req.body);
        res.status(201).json(day);
    } catch (error) {
        console.error('Error creating day:', error);
        res.status(500).json({ error: 'Error creating day' });
    }
};
