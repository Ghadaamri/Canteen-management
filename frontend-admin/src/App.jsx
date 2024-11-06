import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import ListDishComponents from './pages/ListDishComponents/List';
import ListSandwich from './pages/ListSandwich/List';
import ListReservations from './pages/ListReservations/List';
import Result from './pages/Result/Result';
import DailySpecials from './pages/Dailyspecials/List';
import AdminProtectedRoute from './ProtectedRoute'; // Assurez-vous du bon chemin
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminProvider } from "./AdminContext";

const App = () => {
  return (
    <AdminProvider>
      <div className='app'>
        <ToastContainer />
        <AdminProtectedRoute><Navbar /></AdminProtectedRoute>
        
        <hr />
        <div className="app-content">
          <AdminProtectedRoute><Sidebar /></AdminProtectedRoute>
          <Routes>
            <Route
              path="/listSandwich"
              element={
                <AdminProtectedRoute>
                  <ListSandwich />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/listDishComponents"
              element={
                <AdminProtectedRoute>
                  <ListDishComponents />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/listReservations"
              element={
                <AdminProtectedRoute>
                  <ListReservations />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/result"
              element={
                <AdminProtectedRoute>
                  <Result />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/dailyspecials"
              element={
                <AdminProtectedRoute>
                  <DailySpecials />
                </AdminProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </AdminProvider>
  );
};

export default App;
