import React, { useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';

const FoodDisplay = () => {
    const { dailySpecials, selectedDay, setSelectedDay } = useContext(StoreContext);

    if (!dailySpecials) {
        return <div>Loading...</div>;
    }

    const specialsForDay = dailySpecials[selectedDay] || [];

    return (
        <div>
            
        </div>
    );
};

export default FoodDisplay;
