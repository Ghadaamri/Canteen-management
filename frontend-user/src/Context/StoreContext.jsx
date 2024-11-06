import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
    const [dailySpecials, setDailySpecials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedDay, setSelectedDay] = useState('');
    const [cart, setCart] = useState({});
    const [token, setToken] = useState(Cookies.get('authToken') || null);
    const [userId, setUserId] = useState(Cookies.get('userId') || null);

    useEffect(() => {
        
        console.log('Valeur de userId:', Cookies.get('userId'));
        console.log('Valeur de token:', Cookies.get('authToken'));

        if (Cookies.get('userId')) {
            setUserId(Cookies.get('userId'));
        } else {
            console.log('userId n\'est pas stocké dans les cookies');
        }

        if (Cookies.get('authToken')) {
            setToken(Cookies.get('authToken'));
        } else {
            console.log('authToken n\'est pas stocké dans les cookies');
        }
    }, []);

    const handleReservationSubmit = (e, mealType, selectedSandwich, selectedMainCourse, selectedGarniture, selectedDessert) => {
        e.preventDefault();
        const reservationData = {
            day: selectedDay,
            mealType,
            sandwichChoice: mealType === 'sandwich' ? selectedSandwich : null,
            dishComponents: mealType === 'menu' ? {
                soup: 'Tomato Soup', // Replace with dynamic data if needed
                salad: 'Caesar Salad', // Replace with dynamic data if needed
                mainCourse: selectedMainCourse,
                garniture: selectedGarniture,
                dessert: selectedDessert,
            } : null,
        };

        console.log('Reservation Data:', reservationData);
        console.log('User ID dans store context:', userId);
    };

    const handleTokenStorage = (newToken, newUserId) => {
        console.log('Enregistrement dans les cookies:');
        console.log('Nouveau token:', newToken);
        console.log('Nouveau userId:', newUserId);

        setToken(newToken);
        setUserId(newUserId);
        Cookies.set('authToken', newToken, { expires: 1, secure: true, sameSite: 'None' });
        Cookies.set('userId', newUserId, { expires: 1, secure: true, sameSite: 'None' });

        // Vérification après l'enregistrement
        console.log('Vérification après enregistrement:');
        console.log('Valeur stockée de userId:', Cookies.get('userId'));
        console.log('Valeur stockée de authToken:', Cookies.get('authToken'));
    };

    useEffect(() => {
        const fetchDailySpecials = async () => {
            try {
                if (selectedDay) {
                    const response = await axios.get(`http://localhost:5002/api/dailySpecials?day_name=${selectedDay}`);
                    setDailySpecials(response.data);
                }
            } catch (error) {
                console.error('Error fetching daily specials:', error);
            }
        };

        fetchDailySpecials();
    }, [selectedDay]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5002/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const getTotalCartAmount = () => {
        return Object.values(cart).reduce((sum, { quantity, price }) => sum + quantity * price, 0);
    };

    const addToCart = (itemId, quantity, price) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            if (updatedCart[itemId]) {
                updatedCart[itemId].quantity += quantity;
            } else {
                updatedCart[itemId] = { quantity, price };
            }
            return updatedCart;
        });
    };

    return (
        <StoreContext.Provider
            value={{
                dailySpecials,
                categories,
                selectedDay,
                setSelectedDay,
                cart,
                getTotalCartAmount,
                addToCart,
                token,
                userId,
                handleTokenStorage,
                handleReservationSubmit,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};
