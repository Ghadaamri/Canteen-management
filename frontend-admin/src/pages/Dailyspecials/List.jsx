import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // for clickable events

import axios from 'axios';
import './List.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [eventData, setEventData] = useState({
    day_name: '',
    date: '',
    category_name: '',
    sandwich_choice_id: null,
    dish_component_id: null
  });
  const [sandwichChoices, setSandwichChoices] = useState([]);
  const [dishComponents, setDishComponents] = useState([]);

  useEffect(() => {
    fetchDailySpecials();
    fetchSandwichChoices();
    fetchDishComponents();
  }, []);

  const fetchDailySpecials = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/dailySpecials');
      const formattedEvents = response.data.map(special => ({
        id: special.id,
        title: special.category_name,
        start: special.date,
        extendedProps: {
          day_name: special.day_name,
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

  const getDayName = (date) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date(date).getDay();
    return dayNames[dayIndex];
  };

  const handleDateClick = (info) => {
    const selectedDate = info.dateStr;
    setEventData({
      ...eventData,
      date: selectedDate,
      day_name: getDayName(selectedDate)
    });
    setSelectedEvent(null);
    setShowForm(true);
  };

  const handleEventClick = (info) => {
    const eventId = info.event.id;
    const eventProps = info.event.extendedProps;

    setSelectedEvent(eventId);
    setEventData({
      date: info.event.startStr,
      day_name: eventProps.day_name, // Set the current day_name
      category_name: info.event.title,
      sandwich_choice_id: eventProps.sandwich_choice_id,
      dish_component_id: eventProps.dish_component_id
    });
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      day_name: eventData.day_name || '',
      date: eventData.date || '',
      category_name: eventData.category_name || '',
      sandwich_choice_id: eventData.category_name === 'Sandwich' ? eventData.sandwich_choice_id : null,
      dish_component_id: eventData.category_name === 'Dish' ? eventData.dish_component_id : null
    };

    console.log('Submitting data:', dataToSend);

    try {
      if (selectedEvent) {
        await axios.put(`http://localhost:5002/api/dailySpecials/${selectedEvent}`, dataToSend);
      } else {
        await axios.post('http://localhost:5002/api/dailySpecials/create', dataToSend);
      }
      fetchDailySpecials();
      setShowForm(false);
      setEventData({
        day_name: '',
        date: '',
        category_name: '',
        sandwich_choice_id: null,
        dish_component_id: null
      });
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving daily special:', error.response ? error.response.data : error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5002/api/dailySpecials/${selectedEvent}`);
      fetchDailySpecials();
      setShowForm(false);
      setEventData({
        day_name: '',
        date: '',
        category_name: '',
        sandwich_choice_id: null,
        dish_component_id: null
      });
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting daily special:', error);
    }
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
      {showForm && (
        <div className="form-container">
          <h2>{selectedEvent ? 'Edit Daily Special' : 'Add Daily Special'}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Date:</label>
              <input
                type="date"
                value={eventData.date || ''}
                onChange={(e) => setEventData({ ...eventData, date: e.target.value, day_name: getDayName(e.target.value) })}
                required
              />
            </div>
            <div>
              <label>Day Name:</label>
              <input
                type="text"
                value={eventData.day_name || ''}
                readOnly
              />
            </div>
            <div>
              <label>Category:</label>
              <select
                value={eventData.category_name || ''}
                onChange={(e) => {
                  const category = e.target.value;
                  setEventData({
                    ...eventData,
                    category_name: category,
                    sandwich_choice_id: category === 'Sandwich' ? eventData.sandwich_choice_id : null,
                    dish_component_id: category === 'Dish' ? eventData.dish_component_id : null
                  });
                }}
                required
              >
                <option value="">Select Category</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Dish">Dish</option>
              </select>
            </div>
            {eventData.category_name === 'Sandwich' && (
              <div>
                <label>Sandwich Choice:</label>
                <select
                  value={eventData.sandwich_choice_id || ''}
                  onChange={(e) => setEventData({ ...eventData, sandwich_choice_id: e.target.value })}
                  required
                >
                  <option value="">Select Sandwich Choice</option>
                  {sandwichChoices.map(choice => (
                    <option key={choice.id} value={choice.id}>{choice.name}</option>
                  ))}
                </select>
              </div>
            )}
            {eventData.category_name === 'Dish' && (
              <div>
                <label>Dish Components:</label>
                <select
                  value={eventData.dish_component_id || ''}
                  onChange={(e) => setEventData({ ...eventData, dish_component_id: e.target.value })}
                  required
                >
                  <option value="">Select Dish Components</option>
                  {dishComponents.map(component => (
                    <option key={component.id} value={component.id}>
                      {component.soup}, {component.salad}, {component.main_course_1}, {component.main_course_2}, {component.garniture_1}, {component.garniture_2}, {component.dessert_1}, {component.dessert_2}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button type="submit">{selectedEvent ? 'Update' : 'Add'}</button>
            {selectedEvent && <button type="button" onClick={handleDelete}>Delete</button>}
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Calendar;
