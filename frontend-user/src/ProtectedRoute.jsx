import React, { useContext, useEffect } from 'react';
import { StoreContext } from './Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const { token, setToken, setUserId } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      window.location.replace(`http://localhost:5173/`);   // Redirige vers la page de login si pas authentifié
    }
  }, [token, navigate]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Supprime le token et l'ID utilisateur des cookies avant de quitter le site
      Cookies.remove('authToken');
      Cookies.remove('userId');
      setToken(null); // Réinitialise le token dans le contexte si nécessaire
      setUserId(null); // Réinitialise l'ID utilisateur dans le contexte si nécessaire
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [setToken, setUserId]);

  return token ? children : null; // Retourne les enfants si authentifié, sinon null
};

export default ProtectedRoute;
