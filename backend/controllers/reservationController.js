// Dans controllers/reservationController.js

const Reservation = require("../models/reservationModel");
const DailySpecial = require("../models/DailySpecial");
const SandwichChoice = require("../models/SandwichChoice");
const DishComponent = require("../models/DishComponent");
const sequelize = require("../config/db");
const { Op, fn, col } = require('sequelize');
const moment = require('moment');
const User = require('../models/userModel')

const getReservationsByUser = async (req, res) => {
  const { user_id } = req.params;
  console.log("Extracted user_id:", user_id);

  try {
    const reservations = await Reservation.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: DailySpecial,
          as: "dailySpecial",
        },
      ],
    });

    console.log("Reservations found:", JSON.stringify(reservations, null, 2));

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
const getReservationDetails = async (req, res) => {  
  const { userId } = req.params;
  const today = new Date().toISOString().split('T')[0];

  try {
    console.log('Fetching reservation for userId:', userId, 'on date:', today);

    // Fetch the reservation including the associated dailySpecial, DishComponent, and SandwichChoice
    const reservation = await Reservation.findOne({
      where: {
        user_id: userId,
        reservation_date: today
      },
      include: [
        {
          model: DailySpecial,
          as: 'dailySpecial',
          include: [
            { model: DishComponent, as: 'dishComponent' },  // Correct alias is 'dishComponent'
            { model: SandwichChoice, as: 'sandwichChoice' } // Correct alias is 'sandwichChoice'
          ]
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({ message: 'No reservation found for today.' });
    }

    console.log('Reservation found:', reservation);
    res.status(200).json(reservation);
  } catch (error) {
    console.error('Error fetching reservation details:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
const createReservation = async (req, res) => {
  const {
    category_name,
    sandwich_choice_id,
    dish_component_id,
    main_course,
    garniture,
    dessert,
    user_id,
    special_id,
    reservation_date
  } = req.body;

  try {
    // Vérifiez que l'utilisateur et la spécialité quotidienne existent
    const special = await DailySpecial.findOne({ where: { id: special_id } });

    if (!special) {
      return res.status(404).json({ error: 'Daily special not found' });
    }

    // Validez les données de la réservation
    if (!user_id || !special_id || !category_name || !reservation_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Obtenez le jour de la semaine à partir de la date de réservation
    const reservationDate = new Date(reservation_date);
    const reservationDayName = reservationDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Vérifiez si le jour de la réservation correspond au jour du DailySpecial
    if (reservationDayName !== special.day_name) {
      return res.status(400).json({ error: 'Reservation date does not match the selected day' });
    }

    // Créez la réservation
    const reservation = await Reservation.create({
      user_id,
      special_id,
      day_name: special.day_name,
      reservation_date,
      category_name,
      sandwich_choice_id: category_name === 'Sandwich' ? sandwich_choice_id : null,
      dish_component_id: category_name === 'Dish' ? dish_component_id : null,
      main_course: category_name === 'Dish' ? main_course : null,
      garniture: category_name === 'Dish' ? garniture : null,
      dessert: category_name === 'Dish' ? dessert : null
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const { special_id, day_name, reservation_date } = req.body;

    // Rechercher la réservation par ID
    const reservation = await Reservation.findByPk(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Vérifier que le Daily Special existe
    const dailySpecial = await DailySpecial.findByPk(special_id);
    if (!dailySpecial) {
      return res.status(404).json({ error: "Daily special not found" });
    }

    // Vérifier que la date correspond au jour spécifié
    const reservationDay = new Date(reservation_date).toLocaleDateString('en-US', { weekday: 'long' });
    if (reservationDay !== day_name) {
      return res.status(400).json({ error: `Reservation date does not match the selected day ${day_name}` });
    }

    // Mettre à jour la réservation
    await reservation.update({
      special_id,
      day_name,
      reservation_date,
    });

    res.status(200).json({
      message: "Réservation mise à jour avec succès",
      data: reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour de la réservation",
    });
  }
};

// Supprimer une réservation
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que la réservation existe
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Supprimer la réservation
    await reservation.destroy();

    return res
      .status(200)
      .json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        {
          model: DailySpecial,
          as: "dailySpecial",
        },
      ],
    });

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
const confirmReservation = async (req, res) => {
  const { code } = req.params;

  if (!code) {
    return res.status(400).json({ message: 'Missing code parameter' });
  }

  try {
    // Obtenir l'ID de l'utilisateur à partir du code
    const user = await User.findOne({ where: { code } });

    if (user) {
      const userId = user.id;

      // Obtenir la date d'aujourd'hui et de demain au format YYYY-MM-DD
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const formattedToday = today.toISOString().split('T')[0];
      const formattedTomorrow = tomorrow.toISOString().split('T')[0];

      // Rechercher la réservation de l'utilisateur entre aujourd'hui et demain
      const reservation = await Reservation.findOne({
        where: {
          user_id: userId,
          reservation_date: {
            [Op.between]: [formattedToday, formattedTomorrow]
          }
        },
        include: [{
          model: DailySpecial,
          as: 'dailySpecial',
          include: [
            {
              model: DishComponent,
              as: 'dishComponent',
              required: false // Inclure même si ce modèle n'est pas présent
            },
            {
              model: SandwichChoice,
              as: 'sandwichChoice',
              required: false // Inclure même si ce modèle n'est pas présent
            }
          ]
        }]
      });

      if (reservation) {
        res.json(reservation);
      } else {
        res.status(404).json({ message: 'No reservation found for the given range' });
      }
    } else {
      res.status(404).json({ message: 'No user found with the given code' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getReservationComment = async (req, res) => {
  const { code } = req.params;

  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  try {
    // Trouver l'utilisateur par son code
    const user = await User.findOne({ where: { code } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = user.id;

    // Obtenir la date de demain
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split('T')[0]; // Date au format YYYY-MM-DD

    // Rechercher la réservation de demain pour cet utilisateur
    const reservation = await Reservation.findOne({
      where: {
        user_id: userId,
        reservation_date: {
          [Op.between]: [formattedTomorrow, formattedTomorrow]
        }
      },
      include: [
        {
          model: DailySpecial,
          as: 'dailySpecial',
          include: [
            {
              model: DishComponent,
              as: 'dishComponent',
              attributes: ['soup', 'salad', 'main_course_1', 'main_course_2', 'garniture_1', 'garniture_2', 'dessert_1', 'dessert_2']
            },
            {
              model: SandwichChoice,
              as: 'sandwichChoice',
              attributes: ['name']
            }
          ]
        }
      ]
    });

    if (reservation) {
      return res.json(reservation);
    } else {
      return res.status(404).json({ message: 'No reservation found for tomorrow' });
    }
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateReservationComment = async (req, res) => {
  const { reservationId } = req.params;
  const { comment } = req.body;
  try {
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    reservation.comment = comment;
    await reservation.save();
    res.status(200).json(reservation);
  } catch (error) {
    console.error('Error updating reservation comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getReservationCounts = async (req, res) => {
  try {
    // Compter les réservations pour chaque colonne de DishComponent
    const dishComponentColumns = [
      'soup', 
      'salad', 
      'main_course_1', 
      'main_course_2', 
      'garniture_1', 
      'garniture_2', 
      'dessert_1', 
      'dessert_2'
    ];

    let dishCounts = [];

    for (let column of dishComponentColumns) {
      const result = await Reservation.findAll({
        attributes: [
          [sequelize.col(`dailySpecial.dishComponent.${column}`), 'componentName'],
          [sequelize.fn('COUNT', sequelize.col('Reservation.id')), 'reservationCount']
        ],
        include: [
          {
            model: DailySpecial,
            as: 'dailySpecial',
            attributes: [],
            where: { category_name: 'Dish' },
            include: [
              {
                model: DishComponent,
                as: 'dishComponent',
                attributes: [],
              }
            ]
          }
        ],
        group: [`dailySpecial.dishComponent.${column}`],
        raw: true
      });

      dishCounts = dishCounts.concat(result);
    }

    // Compter les réservations pour les SandwichChoices
    const sandwichCounts = await Reservation.findAll({
      attributes: [
        [sequelize.col('dailySpecial.sandwichChoice.name'), 'componentName'],
        [sequelize.fn('COUNT', sequelize.col('Reservation.id')), 'reservationCount']
      ],
      include: [
        {
          model: DailySpecial,
          as: 'dailySpecial',
          attributes: [],
          where: { category_name: 'Sandwich' },
          include: [
            {
              model: SandwichChoice,
              as: 'sandwichChoice',
              attributes: [],
            }
          ]
        }
      ],
      group: ['dailySpecial.sandwichChoice.name'],
      raw: true
    });

    // Fusionner les résultats des deux requêtes
    const combinedCounts = [...dishCounts, ...sandwichCounts];

    res.json(combinedCounts);
  } catch (error) {
    console.error('Error fetching reservation counts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getReservationDetailsById = async (req, res) => {
  const { reservationId } = req.params;

  try {
    console.log('Fetching reservation details for reservationId:', reservationId);

    const reservation = await Reservation.findOne({
      where: { id: reservationId },
      include: [
        {
          model: DailySpecial,
          as: 'dailySpecial',
          include: [
            { model: DishComponent, as: 'dishComponent' }, // Assurez-vous que l'alias est correct
            { model: SandwichChoice, as: 'sandwichChoice' } // Assurez-vous que l'alias est correct
          ]
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({ message: 'No reservation found with this ID.' });
    }

    console.log('Reservation found:', reservation);
    res.status(200).json(reservation);
  } catch (error) {
    console.error('Error fetching reservation details:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


module.exports = {
  createReservation,
  getReservationsByUser,
  updateReservation,
  deleteReservation,
  getAllReservations,
  confirmReservation,
  updateReservationComment,
  getReservationComment,
  getReservationCounts,
  getReservationDetails,
  getReservationDetailsById 
};
