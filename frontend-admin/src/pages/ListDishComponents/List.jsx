import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './List.css';

const DishComponents = () => {
  const [dishComponents, setDishComponents] = useState([]);
  const [newDishComponent, setNewDishComponent] = useState({});
  const [editDishComponent, setEditDishComponent] = useState(null);

  useEffect(() => {
    fetchDishComponents();
  }, []);

  const fetchDishComponents = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/dishComponents');
      setDishComponents(response.data);
    } catch (error) {
      console.error('Error fetching dish components:', error);
    }
  };

  const handleAddDishComponent = async () => {
    try {
      await axios.post('http://localhost:5002/api/dishComponents', newDishComponent);
      setNewDishComponent({});
      fetchDishComponents();
    } catch (error) {
      console.error('Error adding dish component:', error);
    }
  };

  const handleUpdateDishComponent = async () => {
    try {
      if (!editDishComponent || !editDishComponent.id) {
        console.error('No DishComponent selected for updating');
        return;
      }

      const response = await axios.put(`http://localhost:5002/api/dishComponents/${editDishComponent.id}`, editDishComponent);

      if (response.status === 200) {
        console.log('DishComponent updated successfully:', response.data);
        setEditDishComponent(null); // Clear the edit form after successful update
        fetchDishComponents(); // Refresh the list of DishComponents
      } else {
        console.error('Failed to update DishComponent:', response);
      }
    } catch (error) {
      console.error('Error updating DishComponent:', error);
    }
  };

  const handleDeleteDishComponent = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/dishComponents/${id}`);
      fetchDishComponents();
    } catch (error) {
      console.error('Error deleting dish component:', error);
    }
  };

  return (
    <div className="dish-components">
      <h3 className="dish-components-title">Dish Components</h3>
      <ul className="dish-components-list">
        {dishComponents.map((component) => (
          <li key={component.id} className="dish-components-item">
            {component.soup} / {component.salad} / {component.main_course_1} / {component.main_course_2} / {component.garniture_1} / {component.garniture_2} / {component.dessert_1} / {component.dessert_2}
            <div className="dish-components-buttons">
              <button className="edit-button" onClick={() => setEditDishComponent(component)}>Edit</button>
              <button className="delete-button" onClick={() => handleDeleteDishComponent(component.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="dish-components-inputs">
        <input
          type="text"
          value={newDishComponent.soup || ''}
          onChange={(e) => setNewDishComponent({ ...newDishComponent, soup: e.target.value })}
          placeholder="Soup"
          className="input-field"
        />
        <input
          type="text"
          value={newDishComponent.salad || ''}
          onChange={(e) => setNewDishComponent({ ...newDishComponent, salad: e.target.value })}
          placeholder="Salad"
          className="input-field"
        />
        <input
          type="text"
          value={newDishComponent.main_course_1 || ''}
          onChange={(e) => setNewDishComponent({ ...newDishComponent, main_course_1: e.target.value })}
          placeholder="Main Course 1"
          className="input-field"
        />
        <input
          type="text"
          value={newDishComponent.main_course_2 || ''}
          onChange={(e) => setNewDishComponent({ ...newDishComponent, main_course_2: e.target.value })}
          placeholder="Main Course 2"
          className="input-field"
        />
        <input
          type="text"
          value={newDishComponent.garniture_1 || ''}
          onChange={(e) => setNewDishComponent({ ...newDishComponent, garniture_1: e.target.value })}
          placeholder="Garniture 1"
          className="input-field"
        />
        <input
          type="text"
          value={newDishComponent.garniture_2 || ''}
          onChange={(e) => setNewDishComponent({ ...newDishComponent, garniture_2: e.target.value })}
          placeholder="Garniture 2"
          className="input-field"
        />
        <input
          type="text"
          value={newDishComponent.dessert_1 || ''}
          onChange={(e) => setNewDishComponent({ ...newDishComponent, dessert_1: e.target.value })}
          placeholder="Dessert 1"
          className="input-field"
        />
        <input
          type="text"
          value={newDishComponent.dessert_2 || ''}
          onChange={(e) => setNewDishComponent({ ...newDishComponent, dessert_2: e.target.value })}
          placeholder="Dessert 2"
          className="input-field"
        />
        <button className="add-button" onClick={handleAddDishComponent}>Add Dish Component</button>
      </div>

      {editDishComponent && (
        <div className="edit-form">
          <h3>Edit Dish Component</h3>
          <input
            type="text"
            value={editDishComponent.soup || ''}
            onChange={(e) => setEditDishComponent({ ...editDishComponent, soup: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            value={editDishComponent.salad || ''}
            onChange={(e) => setEditDishComponent({ ...editDishComponent, salad: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            value={editDishComponent.main_course_1 || ''}
            onChange={(e) => setEditDishComponent({ ...editDishComponent, main_course_1: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            value={editDishComponent.main_course_2 || ''}
            onChange={(e) => setEditDishComponent({ ...editDishComponent, main_course_2: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            value={editDishComponent.garniture_1 || ''}
            onChange={(e) => setEditDishComponent({ ...editDishComponent, garniture_1: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            value={editDishComponent.garniture_2 || ''}
            onChange={(e) => setEditDishComponent({ ...editDishComponent, garniture_2: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            value={editDishComponent.dessert_1 || ''}
            onChange={(e) => setEditDishComponent({ ...editDishComponent, dessert_1: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            value={editDishComponent.dessert_2 || ''}
            onChange={(e) => setEditDishComponent({ ...editDishComponent, dessert_2: e.target.value })}
            className="input-field"
          />
          <button className="update-button" onClick={handleUpdateDishComponent}>Update Dish Component</button>
        </div>
      )}
    </div>
  );
};

export default DishComponents;
