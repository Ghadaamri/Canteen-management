import Login from './components/login';
import './App.css';
import { Route,  Routes } from 'react-router-dom';
import Register from './components/Register';
import AdminLogin from './components/admin-login';
import AdminRegister from './components/admin-register';
import ConfirmReservation from './components/ConfirmReservation' ;





const App = () => {
  return (
    <div
      className="text-white h-[100vh] flex justify-center items-center bg-auto overflow-hidden bg-no-repeat bg-center"
      style={{ backgroundImage: `url('../public/assets/bg.jpg')` }}
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/ConfirmReservation" element={<ConfirmReservation />}/>
        
      </Routes>
    </div>
  );
};

export default App;
