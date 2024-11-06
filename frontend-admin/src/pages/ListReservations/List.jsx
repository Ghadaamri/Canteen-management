import { useState, useEffect } from 'react';
import axios from 'axios';
import './List.css';

const ListReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [dishComponents, setDishComponents] = useState([]);
  const [sandwichChoices, setSandwichChoices] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationsResponse = await axios.get('http://localhost:5002/api/reservations/all');
        setReservations(reservationsResponse.data);

        const dishResponse = await axios.get('http://localhost:5002/api/dishcomponents');
        setDishComponents(dishResponse.data);

        const sandwichResponse = await axios.get('http://localhost:5002/api/sandwichchoices');
        setSandwichChoices(sandwichResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data');
      }
    };

    fetchReservations();
  }, []);

  const handleEditClick = (reservation) => {
    console.log('Edit reservation:', reservation);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/reservations/${id}`);
      setReservations(reservations.filter(reservation => reservation.id !== id));
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter reservations based on selected date
  const filteredReservations = selectedDate
    ? reservations.filter(reservation => 
        reservation.reservation_date && 
        reservation.reservation_date.slice(0, 10) === selectedDate
      )
    : reservations;

  return (
    <div>
      <h1>Reservations List</h1>
      <div>
        <label htmlFor="date">Select Date: </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      {filteredReservations.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Day Name</th>
              <th>Reservation Date</th>
              <th>Category</th>
              <th>Details</th>
              <th>Confirmation</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.day_name}</td>
                <td>{reservation.reservation_date ? reservation.reservation_date.slice(0, 10) : 'N/A'}</td>
                <td>{reservation.dailySpecial?.category_name}</td>
                <td>
                  {reservation.dailySpecial?.category_name === 'Sandwich' ? (
                    sandwichChoices.find(choice => choice.id === reservation.dailySpecial?.sandwich_choice_id)?.name || 'N/A'
                  ) : (
                    <div>
                      <p>Main Course 1: {dishComponents.find(component => component.id === reservation.dailySpecial?.dish_component_id)?.main_course_1 || 'N/A'}</p>
                      <p>Garniture 1: {dishComponents.find(component => component.id === reservation.dailySpecial?.dish_component_id)?.garniture_1 || 'N/A'}</p>
                      <p>Dessert 1: {dishComponents.find(component => component.id === reservation.dailySpecial?.dish_component_id)?.dessert_1 || 'N/A'}</p>
                    </div>
                  )}
                </td>
                <td>{reservation.confirmation ? 'Confirmed' : 'Not Confirmed'}</td>
                <td>{reservation.comment || 'No comment'}</td>
                <td>
                  <button onClick={() => handleEditClick(reservation)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(reservation.id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reservations found for the selected date.</p>
      )}
    </div>
  );
};

export default ListReservation;
