const express = require('express');
const router = express.Router();
const {
  createReservation,
  updateReservation,
  deleteReservation,
  getReservationsByUser,
  getAllReservations,
  confirmReservation,
  updateReservationComment,
  getReservationComment,
  getReservationCounts,
  getReservationDetails,
  getReservationDetailsById 
} = require('../controllers/reservationController');

// Route pour créer une réservation
router.post('/', createReservation);

// Route pour mettre à jour une réservation
router.put('/:id', updateReservation);

// Route pour supprimer une réservation
router.delete('/:id', deleteReservation);

// Route pour récupérer les réservations d'un utilisateur spécifique
router.get('/user/:user_id', getReservationsByUser);

router.get('/all', getAllReservations);

router.get('/today/:code', confirmReservation);

router.get('/:reservationId/comment', getReservationComment);

// Route pour mettre à jour un commentaire
router.put('/:reservationId/comment', updateReservationComment);
router.get('/reservations-count', getReservationCounts);
router.get('/details/:userId', getReservationDetails);
router.get('/details/:reservationId', getReservationDetails);


module.exports = router;
