import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const Logout = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Effacer le token du cookies
    Cookies.remove('authToken');
    // Rediriger vers la page de connexion
    navigate('/login');
  }, [navigate]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Logging out...</h1>
      <p className="text-gray-500">You will be redirected shortly.</p>
    </div>
  );
};

export default Logout;
