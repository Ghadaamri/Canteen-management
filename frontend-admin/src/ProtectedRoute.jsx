import React, { useContext, useEffect } from 'react';
import { AdminContext } from './AdminContext'; // Assurez-vous du bon chemin
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminProtectedRoute = ({ children }) => {
  const { adminToken, handleAdminTokenStorage } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminToken) {
      window.location.replace(`http://localhost:5173/`); // Redirige vers la page de login si pas authentifié
    }
  }, [adminToken, navigate]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Supprime le token des cookies avant de quitter le site
      Cookies.remove('adminToken');
      handleAdminTokenStorage(null); // Réinitialise le token dans le contexte si nécessaire
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleAdminTokenStorage]);

  return adminToken ? children : null; // Retourne les enfants si authentifié, sinon null
};

export default AdminProtectedRoute;
