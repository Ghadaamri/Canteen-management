import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext'; // Adjust the path if necessary
import './Reservation.css';

const Reservation = () => {
  const { userId } = useContext(StoreContext);

  const [reservations, setReservations] = useState([]);
  const [sandwichChoices, setSandwichChoices] = useState([]);
  const [dishComponents, setDishComponents] = useState([]);
  const [dailySpecials, setDailySpecials] = useState([]);
  const [editReservation, setEditReservation] = useState(null);
  const [filteredSandwichChoices, setFilteredSandwichChoices] = useState([]);
  const [filteredDishComponents, setFilteredDishComponents] = useState([]);
  const [availableSpecials, setAvailableSpecials] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [selectedSpecial, setSelectedSpecial] = useState('');
  const [selectedSandwich, setSelectedSandwich] = useState('');
  const [selectedMainCourse, setSelectedMainCourse] = useState('');
  const [selectedGarniture, setSelectedGarniture] = useState('');
  const [selectedDessert, setSelectedDessert] = useState('');
  const [comment, setComment] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [commentForm, setCommentForm] = useState({ isVisible: false, reservationId: null, comment: '' });

  useEffect(() => {
    fetchReservations();
    fetchSandwichChoices();
    fetchDishComponents();
    fetchDailySpecials();
  }, []);

  useEffect(() => {
    if (editReservation) {
      setNewDate(editReservation.reservation_date ? editReservation.reservation_date.slice(0, 10) : '');
      setComment(editReservation.comment || '');

      const filteredSpecials = dailySpecials.filter(
        (special) => special.day_name === editReservation.day_name
      );

      setAvailableSpecials(filteredSpecials);
      setSelectedSpecial(editReservation.special_id || '');

      if (filteredSpecials.length > 0) {
        // Determine available categories
        const categories = [...new Set(filteredSpecials.map(special => special.category_name))];
        setCategoryOptions(categories);

        const special = filteredSpecials.find((special) => special.id === editReservation.special_id);

        if (special) {
          if (special.category_name === 'Sandwich') {
            setFilteredSandwichChoices(
              sandwichChoices.filter((choice) => choice.id === special.sandwich_choice_id)
            );
            setFilteredDishComponents([]);
            setSelectedSandwich(
              sandwichChoices.find((choice) => choice.id === special.sandwich_choice_id)?.name || ''
            );
          } else if (special.category_name === 'Dish') {
            setFilteredDishComponents(
              dishComponents.filter((component) => component.id === special.dish_component_id)
            );
            setFilteredSandwichChoices([]);
            const dish = dishComponents.find((component) => component.id === special.dish_component_id);
            setSelectedMainCourse(dish?.main_course_1 || '');
            setSelectedGarniture(dish?.garniture_1 || '');
            setSelectedDessert(dish?.dessert_1 || '');
          }
        }
      }
    }
  }, [editReservation, sandwichChoices, dishComponents, dailySpecials]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/api/reservations/user/${userId}`);
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchSandwichChoices = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/sandwichChoices');
      setSandwichChoices(response.data);
    } catch (error) {
      console.error('Error fetching sandwich choices:', error);
    }
  };

  const fetchDishComponents = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/dishComponents');
      setDishComponents(response.data);
    } catch (error) {
      console.error('Error fetching dish components:', error);
    }
  };

  const fetchDailySpecials = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/dailySpecials');
      setDailySpecials(response.data);
    } catch (error) {
      console.error('Error fetching daily specials:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/reservations/${id}`);
      fetchReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (editReservation) {
        let specialId = selectedSpecial;

        if (editReservation.dailySpecial.category_name === 'Sandwich') {
          const selectedSandwichChoice = sandwichChoices.find(choice => choice.name === selectedSandwich);
          specialId = selectedSandwichChoice ? selectedSandwichChoice.id : null;
        } else if (editReservation.dailySpecial.category_name === 'Dish') {
          const selectedDishComponent = dishComponents.find(component =>
            component.main_course_1 === selectedMainCourse &&
            component.garniture_1 === selectedGarniture &&
            component.dessert_1 === selectedDessert
          );
          specialId = selectedDishComponent ? selectedDishComponent.id : null;
        }

        if (specialId) {
          await axios.put(`http://localhost:5002/api/reservations/${editReservation.id}`, {
            reservation_date: newDate,
            special_id: specialId,
            user_id: userId,
            day_name: editReservation.day_name
          });

          await axios.put(`http://localhost:5002/api/reservations/${editReservation.id}/comment`, { comment });

          setEditReservation(null);
          setNewDate('');
          setSelectedSandwich('');
          setSelectedMainCourse('');
          setSelectedGarniture('');
          setSelectedDessert('');
          setComment('');
          fetchReservations();
        } else {
          console.error('Invalid special ID');
        }
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const handleEditClick = (reservation) => {
    setEditReservation(reservation);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setEditReservation(prev => ({
      ...prev,
      category_name: value,
      sandwich_choice_id: value === 'Sandwich' ? '' : prev.sandwich_choice_id,
      main_course: value === 'Dish' ? '' : prev.main_course,
      garniture: value === 'Dish' ? '' : prev.garniture,
      dessert: value === 'Dish' ? '' : prev.dessert
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate();
  };

  const handleCancel = () => {
    setEditReservation(null);
    setNewDate('');
    setSelectedSandwich('');
    setSelectedMainCourse('');
    setSelectedGarniture('');
    setSelectedDessert('');
    setComment('');
  };

  const handleCommentChange = (e) => {
    setCommentForm(prev => ({
      ...prev,
      comment: e.target.value
    }));
  };

  const handleShowCommentForm = (reservationId) => {
    const reservation = reservations.find(res => res.id === reservationId);
    setCommentForm({
      isVisible: true,
      reservationId,
      comment: reservation ? reservation.comment || '' : ''
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5002/api/reservations/${commentForm.reservationId}/comment`, {
        comment: commentForm.comment,
      });
      setCommentForm({ ...commentForm, isVisible: false });
      fetchReservations();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="reservation-container">
      <h2>My Reservations</h2>
      <table className="reservation-table">
        <thead>
          <tr>
            <th>Day Name</th>
            <th>Reservation Date</th>
            <th>Category</th>
            <th>Choice Name</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.day_name}</td>
              <td>{reservation.reservation_date}</td>
              <td>{reservation.dailySpecial?.category_name || 'N/A'}</td>
              <td>
                {reservation.dailySpecial?.category_name === 'Sandwich' ? (
                  sandwichChoices.find(choice => choice.id === reservation.dailySpecial?.sandwich_choice_id)?.name || 'N/A'
                ) : (
                  <div>
                    <p>Main Course: {dishComponents.find(component => component.id === reservation.dailySpecial?.dish_component_id)?.main_course_1 || 'N/A'}</p>
                    <p>Garniture: {dishComponents.find(component => component.id === reservation.dailySpecial?.dish_component_id)?.garniture_1 || 'N/A'}</p>
                    <p>Dessert: {dishComponents.find(component => component.id === reservation.dailySpecial?.dish_component_id)?.dessert_1 || 'N/A'}</p>
                  </div>
                )}
              </td>
              <td>
                <button onClick={() => handleShowCommentForm(reservation.id)}>Add/Edit Comment</button>
                {commentForm.isVisible && commentForm.reservationId === reservation.id && (
                  <form onSubmit={handleCommentSubmit}>
                    <textarea value={commentForm.comment} onChange={handleCommentChange} />
                    <button type="submit">Submit</button>
                  </form>
                )}
              </td>
              <td>
                <button onClick={() => handleEditClick(reservation)}>Edit</button>
                <button onClick={() => handleDelete(reservation.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editReservation && (
        <div className="edit-form">
          <h3>Edit Reservation</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Date:
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
            </label>
            {categoryOptions.length > 1 && (
              <label>
                Category:
                <select value={editReservation.dailySpecial?.category_name || ''} onChange={handleCategoryChange}>
                  <option value="">Select Category</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
            )}
            {editReservation.dailySpecial?.category_name === 'Sandwich' && (
              <label>
                Sandwich:
                <select value={selectedSandwich} onChange={(e) => setSelectedSandwich(e.target.value)}>
                  <option value="">Select Sandwich</option>
                  {filteredSandwichChoices.map((choice) => (
                    <option key={choice.id} value={choice.name}>{choice.name}</option>
                  ))}
                </select>
              </label>
            )}
            {editReservation.dailySpecial?.category_name === 'Dish' && (
              <>
                <label>
                  Main Course:
                  <select value={selectedMainCourse} onChange={(e) => setSelectedMainCourse(e.target.value)}>
                    <option value="">Select Main Course</option>
                    {filteredDishComponents.map((component) => (
                      <option key={component.id} value={component.main_course_1}>{component.main_course_1}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Garniture:
                  <select value={selectedGarniture} onChange={(e) => setSelectedGarniture(e.target.value)}>
                    <option value="">Select Garniture</option>
                    {filteredDishComponents.map((component) => (
                      <option key={component.id} value={component.garniture_1}>{component.garniture_1}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Dessert:
                  <select value={selectedDessert} onChange={(e) => setSelectedDessert(e.target.value)}>
                    <option value="">Select Dessert</option>
                    {filteredDishComponents.map((component) => (
                      <option key={component.id} value={component.dessert_1}>{component.dessert_1}</option>
                    ))}
                  </select>
                </label>
              </>
            )}
            <label>
              Comment:
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
            </label>
            <button type="submit">Update</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reservation;
