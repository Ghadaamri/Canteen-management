import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './List.css';

const SandwichChoices = () => {
  const [sandwichChoices, setSandwichChoices] = useState([]);
  const [newSandwichChoice, setNewSandwichChoice] = useState('');
  const [editSandwich, setEditSandwich] = useState(null);

  useEffect(() => {
    fetchSandwichChoices();
  }, []);

  const fetchSandwichChoices = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/sandwichChoices');
      setSandwichChoices(response.data);
    } catch (error) {
      console.error('Error fetching sandwich choices:', error);
    }
  };

  const handleAddSandwichChoice = async () => {
    try {
      await axios.post('http://localhost:5002/api/sandwichChoices', { name: newSandwichChoice });
      setNewSandwichChoice('');
      fetchSandwichChoices();
    } catch (error) {
      console.error('Error adding sandwich choice:', error);
    }
  };

  const handleUpdateSandwichChoice = async () => {
    try {
      await axios.put(`http://localhost:5002/api/sandwichChoices/${editSandwich.id}`, { name: editSandwich.name });
      setEditSandwich(null);
      fetchSandwichChoices();
    } catch (error) {
      console.error('Error updating sandwich choice:', error);
    }
  };

  const handleDeleteSandwichChoice = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/sandwichChoices/${id}`);
      fetchSandwichChoices();
    } catch (error) {
      console.error('Error deleting sandwich choice:', error);
    }
  };

  return (
    <div className="sandwich-choices">
      <h3 className="sandwich-choices-title">Sandwich Choices</h3>
      <ul className="sandwich-choices-list">
        {sandwichChoices.map((choice) => (
          <li key={choice.id} className="sandwich-choices-item">
            {choice.name}
            <div className="sandwich-choices-buttons">
              <button className="edit-button" onClick={() => setEditSandwich(choice)}>Edit</button>
              <button className="delete-button" onClick={() => handleDeleteSandwichChoice(choice.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="sandwich-choices-inputs">
        <input
          type="text"
          value={newSandwichChoice}
          onChange={(e) => setNewSandwichChoice(e.target.value)}
          placeholder="New Sandwich Choice"
          className="input-field"
        />
        <button className="add-button" onClick={handleAddSandwichChoice}>Add Sandwich Choice</button>
      </div>

      {editSandwich && (
        <div className="edit-form">
          <h3>Edit Sandwich Choice</h3>
          <input
            type="text"
            value={editSandwich.name}
            onChange={(e) => setEditSandwich({ ...editSandwich, name: e.target.value })}
            className="input-field"
          />
          <button className="update-button" onClick={handleUpdateSandwichChoice}>Update Sandwich Choice</button>
        </div>
      )}
    </div>
  );
};

export default SandwichChoices;
