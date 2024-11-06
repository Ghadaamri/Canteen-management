import React, { useState } from 'react';
import axios from 'axios';
import './ConfirmReservation.css';
import { Link } from 'react-router-dom';

const ConfirmReservation = () => {
  const [code, setCode] = useState('');
  const [reservationDetails, setReservationDetails] = useState(null);
  const [dishComponent, setDishComponent] = useState(null);
  const [sandwichChoices, setSandwichChoices] = useState([]);
  const [filteredSandwichChoices, setFilteredSandwichChoices] = useState([]);
  const [error, setError] = useState('');

  // Gérer le changement d'entrée du code
  const handleChangeCode = (e) => {
    setCode(e.target.value);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code) {
      setError('Le code est requis');
      return;
    }

    try {
      // 1. Récupérer l'`user_id` en utilisant le code
      const userResponse = await axios.get(`http://localhost:5002/api/user/by-code/${code}`, {
        withCredentials: true,
      });
      const userId = userResponse.data.id;

      // 2. Récupérer les détails de la réservation
      const reservationResponse = await axios.get(`http://localhost:5002/api/reservations/today/${code}`, {
        withCredentials: true,
      });
      const reservationData = reservationResponse.data;
      setReservationDetails(reservationData);
      setError('');

      // 3. Récupérer les détails supplémentaires selon la catégorie
      if (reservationData.dailySpecial.category_name === 'Dish' && reservationData.dailySpecial.dish_component_id) {
        // Récupérer les composants du plat par ID
        const dishResponse = await axios.get(`http://localhost:5002/api/dishComponents/${reservationData.dailySpecial.dish_component_id}`);
        setDishComponent(dishResponse.data);
      } else if (reservationData.dailySpecial.category_name === 'Sandwich') {
        // Récupérer tous les choix de sandwich
        const sandwichResponse = await axios.get(`http://localhost:5002/api/sandwich`);
        setSandwichChoices(sandwichResponse.data);

        // Filtrer les choix de sandwich pour l'utilisateur
        const filteredChoices = sandwichResponse.data.filter(choice =>
          reservationData.dailySpecial.sandwich_choices.includes(choice.id)
        );
        setFilteredSandwichChoices(filteredChoices);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la réservation :', error);
      setError('Impossible de récupérer les détails de la réservation');
      setReservationDetails(null);
      setDishComponent(null);
      setSandwichChoices([]);
      setFilteredSandwichChoices([]);
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-form bg-slate-200 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative">
        <h1 className="text-4xl text-white font-bold text-center mb-6">Confirm Reservation</h1>
        <form onSubmit={handleSubmit}>
          <div className="relative my-4">
            <input
              type="text"
              className="block w-72 py-2.5 px-0 text-sm text-blue bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:text-white focus:border-yellow-600 peer"
              placeholder=""
              id="code"
              value={code}
              onChange={handleChangeCode}
              required
            />
            <label
              htmlFor="code"
              className="absolute text-m text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-5">
              Code 
            </label>
          </div>
          <button
            className="w-full text-white mb-4 text-[18px] mt-6 rounded-full bg-blue-800 hover:bg-yellow-600 py-2 transition-color"
            type="submit">
            Confirm
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>

        {reservationDetails && (
          <div className="reservation-details mt-6">
            <h2 className="text-2xl text-white mb-4">Details of Reservation</h2>
            <p><strong>Jour :</strong> {reservationDetails.dailySpecial.day_name}</p>
            <p><strong>Type de Spécial :</strong> {reservationDetails.dailySpecial.category_name}</p>

            {reservationDetails.dailySpecial.category_name === 'Dish' && dishComponent && (
              <div>
                {dishComponent.soup && <p><strong>Soupe :</strong> {dishComponent.soup}</p>}
                {dishComponent.salad && <p><strong>Salade :</strong> {dishComponent.salad}</p>}
                {dishComponent.main_course_1 && <p><strong>Plat Principal 1 :</strong> {dishComponent.main_course_1}</p>}
              
                {dishComponent.garniture_1 && <p><strong>Garniture 1 :</strong> {dishComponent.garniture_1}</p>}
                
                {dishComponent.dessert_1 && <p><strong>Dessert 1 :</strong> {dishComponent.dessert_1}</p>}
                
              </div>
            )}

            {reservationDetails.dailySpecial.category_name === 'Sandwich' && filteredSandwichChoices.length > 0 ? (
              <div>
                <p><strong>Choix de Sandwich Disponibles :</strong></p>
                {filteredSandwichChoices.map((choice) => (
                  <p key={choice.id}>{choice.name}</p>
                ))}
              </div>
            ) : reservationDetails.dailySpecial.category_name === 'Sandwich' ? (
              <p className="text-red-500">Aucun choix de sandwich disponible</p>
            ) : null}
          </div>
        )}

        <div>
          <span className="mt-2">
            Ou{" "}
            <Link className="text-yellow-500" to="/login">
              Back to user login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConfirmReservation;
