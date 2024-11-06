import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const navigate = useNavigate();

  const logout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem("token");
    // Rediriger vers la page d'accueil
    window.location.href = "http://localhost:5173"; // Ou utiliser navigate("/") si vous restez sur la même application
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>

        <Link
          to="/reservations"
          onClick={() => setMenu("reservations")}
          className={menu === "reservations" ? "active" : ""}
        >
          Reservations
        </Link>
      </ul>
      <div className="navbar-right">
        <div className="navbar-profile">
          <img src={assets.profile_icon} alt="Profile" className="icon" />
          <ul className="nav-profile-dropdown">
          
            <li onClick={logout}>
              <img src={assets.logout_icon} alt="Logout" className="icon" />
              <p>Logout</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
