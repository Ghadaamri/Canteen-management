import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(Cookies.get("adminToken") || null);
  const [adminId, setAdminId] = useState(Cookies.get("adminId") || null);

  useEffect(() => {
    if (adminToken) {
      Cookies.set("adminToken", adminToken, { expires: 1, secure: true, sameSite: "None" });
    } else {
      Cookies.remove("adminToken");
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminId) {
      Cookies.set("adminId", adminId, { expires: 1, secure: true, sameSite: "None" });
    } else {
      Cookies.remove("adminId");
    }
  }, [adminId]);

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminId(null);
    Cookies.remove("adminToken");
    Cookies.remove("adminId");
  };

  return (
    <AdminContext.Provider value={{ adminToken, setAdminToken, adminId, setAdminId, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};