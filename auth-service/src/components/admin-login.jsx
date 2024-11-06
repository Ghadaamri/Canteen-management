import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AiOutlineUnlock } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import Cookies from "js-cookie";

const AdminLogin = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.email || !values.password) {
      setError("Email and password are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/admin/login",
        values,
        { withCredentials: true }  // Include cookies in the request
      );

      // Set cookies with correct keys
      Cookies.set("adminId", response.data.adminId, {
        expires: 1,
        secure: true,
        sameSite: "None",
      });
      Cookies.set("adminToken", response.data.token, {
        expires: 1,
        secure: true,
        sameSite: "None",
      });

      setSuccess("Login successful!");
      setError("");

      window.location.replace("http://localhost:5174/dailyspecials");
    } catch (error) {
      setError(
        "Error logging in: " + (error.response?.data?.error || "Unknown error")
      );
      setSuccess("");
    }
  };

  return (
    <div>
      <div className="bg-slate-200 border border-slate-400 rounded-md p-8  shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative">
        <h1 className="text-4xl text-white font-bold text-center mb-6">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit}>
          <h2>Your email</h2>
          <div className="relative my-4">
            <input
              type="email"
              className="block  w-72 p-2.5 text-sm text-gray-900 bg-blue-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              placeholder=""
              id="email"
              value={values.email}
              onChange={handleChange}
              required
            />
            <BiUser className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500" />
          </div>
          <h2>Your password</h2>
          <div className="relative my-4">
            <input
              type="password"
              className="block  w-72 p-2.5 text-sm text-gray-900 bg-blue-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              placeholder=""
              id="password"
              value={values.password}
              onChange={handleChange}
              required
            />
            <AiOutlineUnlock className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500" />
          </div>
          <button
            className="w-full text-white mb-4 text-[18px] mt-6 rounded-full bg-blue-800 hover:bg-yellow-600 py-2 transition-color"
            type="submit"
          >
            Login
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <div>
            <span className="mt-2">
              Or{" "}
              <Link className="text-yellow-500" to="/login">
                Login as a User
              </Link>
            </span>
            <br />
            <span className="mt-2">
              <Link className="text-yellow-500" to="/ConfirmReservation">
                Open confirmation mode
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
