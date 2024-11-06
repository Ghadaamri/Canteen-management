import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Cart from './pages/Cart/Cart';
import LoginPopup from './components/Logout/Logout';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import MyOrders from './pages/MyOrders/MyOrders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify';
import Reservation from './components/Reservation/Reservation';
import Logout from './components/Logout/Logout';
import ProtectedRoute from './ProtectedRoute'; // Importer le composant ProtectedRoute

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token) {
      navigate('/login'); // Rediriger vers la page de login si le token est absent
    }
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/login' element={<LoginPopup setShowLogin={setShowLogin} />} />
          <Route 
            path='/' 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/cart' 
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/order' 
            element={
              <ProtectedRoute>
                <PlaceOrder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/myorders' 
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/verify' 
            element={
              <ProtectedRoute>
                <Verify />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/reservations' 
            element={
              <ProtectedRoute>
                <Reservation />
              </ProtectedRoute>
            } 
          />
          <Route path='/logout' element={<Logout />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
