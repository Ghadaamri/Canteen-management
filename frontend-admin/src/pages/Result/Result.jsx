import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './Result.css';

const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  const blob = new Blob([wbout], { type: 'application/octet-stream' });
  saveAs(blob, fileName);
};

const Result = () => {
  const [reservations, setReservations] = useState([]);
  const [sandwichChoices, setSandwichChoices] = useState({});
  const [dishComponents, setDishComponents] = useState({});
  const [sandwichTotals, setSandwichTotals] = useState({});
  const [componentTotals, setComponentTotals] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationsResponse = await axios.get('http://localhost:5002/api/reservations/all');
        const allReservations = reservationsResponse.data;
        setReservations(allReservations);

        const sandwichResponse = await axios.get('http://localhost:5002/api/sandwichchoices');
        const dishResponse = await axios.get('http://localhost:5002/api/dishcomponents');

        const sandwichChoicesMap = sandwichResponse.data.reduce((acc, sandwich) => {
          acc[sandwich.id] = sandwich.name;
          return acc;
        }, {});

        const dishComponentsMap = dishResponse.data.reduce((acc, dish) => {
          acc[dish.id] = dish;
          return acc;
        }, {});

        setSandwichChoices(sandwichChoicesMap);
        setDishComponents(dishComponentsMap);

        const sandwichTotalsTemp = {};
        const componentTotalsTemp = {};

        allReservations.forEach(reservation => {
          const date = new Date(reservation.reservation_date).toLocaleDateString();

          if (reservation.dailySpecial?.category_name === 'Sandwich') {
            const sandwichName = sandwichChoicesMap[reservation.dailySpecial?.sandwich_choice_id];
            if (!sandwichTotalsTemp[date]) {
              sandwichTotalsTemp[date] = [];
            }
            if (sandwichName) {
              const existing = sandwichTotalsTemp[date].find(item => item.item === sandwichName);
              if (existing) {
                existing.count += 1;
              } else {
                sandwichTotalsTemp[date].push({
                  item: sandwichName,
                  count: 1
                });
              }
            }
          } else if (reservation.dailySpecial?.category_name === 'Dish') {
            const dish = dishComponentsMap[reservation.dailySpecial?.dish_component_id];
            const components = [
              dish?.main_course_1,
              dish?.main_course_2,
              dish?.garniture_1,
              dish?.garniture_2,
              dish?.dessert_1,
              dish?.dessert_2
            ];

            components.forEach(component => {
              if (component) {
                if (!componentTotalsTemp[date]) {
                  componentTotalsTemp[date] = [];
                }
                const existing = componentTotalsTemp[date].find(item => item.item === component);
                if (existing) {
                  existing.count += 1;
                } else {
                  componentTotalsTemp[date].push({
                    item: component,
                    count: 1
                  });
                }
              }
            });
          }
        });

        setSandwichTotals(sandwichTotalsTemp);
        setComponentTotals(componentTotalsTemp);

      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleExport = () => {
    const dateStr = new Date(selectedDate).toLocaleDateString();
    const sandwichData = sandwichTotals[dateStr] || [];
    const componentData = componentTotals[dateStr] || [];
    
    // Create a workbook with separate sheets
    const workbook = XLSX.utils.book_new();
    
    // Format sandwich data for export
    const formattedSandwichData = sandwichData.map(entry => ({
      Date: dateStr, // Include the date in the export
      Item: entry.item,
      Count: entry.count
    }));
    
    // Format component data for export
    const formattedComponentData = componentData.map(entry => ({
      Date: dateStr, // Include the date in the export
      Item: entry.item,
      Count: entry.count
    }));

    // Add sheets to workbook
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(formattedSandwichData), 'Sandwiches');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(formattedComponentData), 'Dish Components');
    
    // Write workbook to binary array
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Save file
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `Reservation_Data_${dateStr}.xlsx`);
  };

  if (error) {
    return <div className="result-container">Error: {error}</div>;
  }

  return (
    <div className="result-container">
      <h1>Reservation Component Totals by Date</h1>

      <label htmlFor="date-select">Select a date:</label>
      <input 
        type="date" 
        id="date-select" 
        value={selectedDate} 
        onChange={handleDateChange} 
      />

      {selectedDate && (
        <div>
          <h2>Reservations for {new Date(selectedDate).toLocaleDateString()}</h2>
          <h3>Sandwich Totals:</h3>
          <ul>
            {sandwichTotals[new Date(selectedDate).toLocaleDateString()] ? 
              sandwichTotals[new Date(selectedDate).toLocaleDateString()].map((entry, index) => (
                <li key={index}>
                  {entry.item}: {entry.count}
                </li>
              )) 
              : <li className="no-data">No sandwiches reserved for this date.</li>}
          </ul>
          <h3>Dish Component Totals:</h3>
          <ul>
            {componentTotals[new Date(selectedDate).toLocaleDateString()] ? 
              componentTotals[new Date(selectedDate).toLocaleDateString()].map((entry, index) => (
                <li key={index}>
                  {entry.item}: {entry.count}
                </li>
              )) 
              : <li className="no-data">No dish components reserved for this date.</li>}
          </ul>
          <button onClick={handleExport} className="btn-export">Export to Excel</button>
        </div>
      )}
    </div>
  );
};

export default Result;
