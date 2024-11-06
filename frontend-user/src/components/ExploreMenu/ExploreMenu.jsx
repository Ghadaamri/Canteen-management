import React, { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import './ExploreMenu.css';

const ExploreMenu = () => {
  const { token, userId } = useContext(StoreContext);
  const [events, setEvents] = useState([]);
  const [reservedDays, setReservedDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [eventData, setEventData] = useState({
    category_name: '',
    sandwich_choice_id: '',
    dish_component_id: '',
    main_course: '',
    garniture: '',
    dessert: ''
  });

  const [sandwichChoices, setSandwichChoices] = useState([]);
  const [dishComponents, setDishComponents] = useState([]);
  const [availableSandwichChoices, setAvailableSandwichChoices] = useState([]);
  const [availableDishComponents, setAvailableDishComponents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    fetchSandwichChoices();
    fetchDishComponents();
    fetchAllDailySpecials();
    fetchReservedDays();
  }, []);

  const fetchSandwichChoices = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/sandwichChoices');
      setSandwichChoices(response.data);
    } catch (error) {
      console.error('Error fetching sandwich choices:', error);
    }
  };
  const fetchReservedDays = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/api/reservations/user/${userId}`);
      console.log('API Response:', response.data); // Vérifiez les données retournées par l'API
      const reservedDays = response.data.map(reservation => reservation.reservation_date);
      console.log('Fetched reserved days:', reservedDays); // Vérifiez les jours réservés
      setReservedDays(reservedDays);
    } catch (error) {
      console.error('Error fetching reserved days:', error);
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

  const fetchAllDailySpecials = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/dailySpecials');
      const formattedEvents = response.data.map(special => ({
        id: special.id,
        title: special.category_name,
        start: special.date,
        extendedProps: {
          day_name: special.day_name,
          category_name: special.category_name,
          sandwich_choice_id: special.sandwich_choice_id,
          dish_component_id: special.dish_component_id
        },
        description: `Day: ${special.day_name}, Special: ${special.category_name}`
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching daily specials:', error);
    }
  };

  const handleDateClick = (info) => {
    const selectedDateStr = info.dateStr;
    const selectedDayName = getDayName(selectedDateStr);
    setSelectedDate(selectedDateStr);

    const daySpecials = events.filter(event => event.extendedProps.day_name === selectedDayName);

    if (daySpecials.length > 0) {
      const special = daySpecials[0].extendedProps;
      setEventData({
        category_name: special.category_name,
        sandwich_choice_id: special.sandwich_choice_id || '',
        dish_component_id: special.dish_component_id || '',
        main_course: '',
        garniture: '',
        dessert: ''
      });

      // Filtrage des choix disponibles en fonction de `dailySpecial`
      if (special.category_name === 'Sandwich' && special.sandwich_choice_id) {
        const filteredSandwichChoices = sandwichChoices.filter(choice => choice.id === special.sandwich_choice_id);
        setAvailableSandwichChoices(filteredSandwichChoices);
        setAvailableDishComponents([]);
      } else if (special.category_name === 'Dish' && special.dish_component_id) {
        const filteredDishComponents = dishComponents.filter(comp => comp.id === special.dish_component_id);
        setAvailableDishComponents(filteredDishComponents);
        setAvailableSandwichChoices([]);
      }

      setShowForm(true);
      setSelectedEventId(daySpecials[0].id);
    } else {
      alert('No special available for this day.');
      setShowForm(false);
    }
  };

  const handleEventClick = (info) => {
    const eventProps = info.event.extendedProps;

    setSelectedDate(info.event.startStr);
    setEventData({
      category_name: eventProps.category_name,
      sandwich_choice_id: eventProps.sandwich_choice_id || '',
      dish_component_id: eventProps.dish_component_id || '',
      main_course: '',
      garniture: '',
      dessert: ''
    });

    // Filtrage des choix disponibles en fonction de `dailySpecial`
    if (eventProps.category_name === 'Sandwich' && eventProps.sandwich_choice_id) {
      const filteredSandwichChoices = sandwichChoices.filter(choice => choice.id === eventProps.sandwich_choice_id);
      setAvailableSandwichChoices(filteredSandwichChoices);
      setAvailableDishComponents([]);
    } else if (eventProps.category_name === 'Dish' && eventProps.dish_component_id) {
      const filteredDishComponents = dishComponents.filter(comp => comp.id === eventProps.dish_component_id);
      setAvailableDishComponents(filteredDishComponents);
      setAvailableSandwichChoices([]);
    }

    setShowForm(true);
    setSelectedEventId(info.event.id);
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setEventData(prevData => ({
      ...prevData,
      category_name: selectedCategory,
      sandwich_choice_id: selectedCategory === 'Sandwich' ? prevData.sandwich_choice_id : '',
      dish_component_id: selectedCategory === 'Dish' ? prevData.dish_component_id : '',
      main_course: selectedCategory === 'Dish' ? prevData.main_course : '',
      garniture: selectedCategory === 'Dish' ? prevData.garniture : '',
      dessert: selectedCategory === 'Dish' ? prevData.dessert : ''
    }));

    // Mettre à jour les choix disponibles en fonction de la catégorie sélectionnée
    if (selectedCategory === 'Sandwich') {
      setAvailableSandwichChoices(sandwichChoices);
      setAvailableDishComponents([]);
    } else if (selectedCategory === 'Dish') {
      setAvailableDishComponents(dishComponents);
      setAvailableSandwichChoices([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reservationData = {
      category_name: eventData.category_name,
      sandwich_choice_id: eventData.category_name === 'Sandwich' ? eventData.sandwich_choice_id : null,
      dish_component_id: eventData.category_name === 'Dish' ? eventData.dish_component_id : null,
      main_course: eventData.category_name === 'Dish' ? eventData.main_course : null,
      garniture: eventData.category_name === 'Dish' ? eventData.garniture : null,
      dessert: eventData.category_name === 'Dish' ? eventData.dessert : null,
      user_id: userId,
      special_id: selectedEventId,
      reservation_date: selectedDate
    };

    try {
      const response = await axios.post('http://localhost:5002/api/reservations', reservationData);
      console.log('Reservation created successfully', response.data);
      setShowForm(false);
      setEventData({
        category_name: '',
        sandwich_choice_id: '',
        dish_component_id: '',
        main_course: '',
        garniture: '',
        dessert: ''
      });
      setSelectedDate(null);
      setSelectedEventId(null);
      fetchReservedDays(); 
    } catch (error) {
      console.error('Error creating reservation:', error.response?.data || error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEventData({
      category_name: '',
      sandwich_choice_id: '',
      dish_component_id: '',
      main_course: '',
      garniture: '',
      dessert: ''
    });
    setSelectedDate(null);
    setSelectedEventId(null);
  };
  const isReservedDay = (date) => {
    return reservedDays.includes(date);
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventClassNames={(event) => {
          return isReservedDay(event.event.startStr) ? ['reserved-day'] : [];
        }}
      />
      {showForm && (
        <>
          <div className="form-container">
            <h2>{selectedDate ? 'Book for ' + selectedDate : 'Make a Reservation'}</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Category:</label>
                <select
                  value={eventData.category_name}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Dish">Dish</option>
                </select>
              </div>

              {eventData.category_name === 'Sandwich' && (
                <div>
                  <label>Sandwich Choice:</label>
                  <select
                    value={eventData.sandwich_choice_id}
                    onChange={(e) => setEventData({ ...eventData, sandwich_choice_id: e.target.value })}
                    required
                  >
                    <option value="">Select sandwich</option>
                    {availableSandwichChoices.map(choice => (
                      <option key={choice.id} value={choice.id}>{choice.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {eventData.category_name === 'Dish' && (
                <>
                  <div>
                    <label>Main Course:</label>
                    <select
                      value={eventData.main_course}
                      onChange={(e) => setEventData({ ...eventData, main_course: e.target.value })}
                      required
                    >
                      <option value="">Select main course</option>
                      {availableDishComponents.map(comp => (
                        <>
                          <option key={`${comp.id}-main1`} value={comp.main_course_1}>{comp.main_course_1}</option>
                          <option key={`${comp.id}-main2`} value={comp.main_course_2}>{comp.main_course_2}</option>
                        </>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Garniture:</label>
                    <select
                      value={eventData.garniture}
                      onChange={(e) => setEventData({ ...eventData, garniture: e.target.value })}
                      required
                    >
                      <option value="">Select garniture</option>
                      {availableDishComponents.map(comp => (
                        <>
                          <option key={`${comp.id}-garn1`} value={comp.garniture_1}>{comp.garniture_1}</option>
                          <option key={`${comp.id}-garn2`} value={comp.garniture_2}>{comp.garniture_2}</option>
                        </>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Dessert:</label>
                    <select
                      value={eventData.dessert}
                      onChange={(e) => setEventData({ ...eventData, dessert: e.target.value })}
                      required
                    >
                      <option value="">Select dessert</option>
                      {availableDishComponents.map(comp => (
                        <>
                          <option key={`${comp.id}-dessert1`} value={comp.dessert_1}>{comp.dessert_1}</option>
                          <option key={`${comp.id}-dessert2`} value={comp.dessert_2}>{comp.dessert_2}</option>
                        </>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <button type="submit">Submit Reservation</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ExploreMenu;
