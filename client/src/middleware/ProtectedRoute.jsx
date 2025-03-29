// import { useState, useEffect } from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ element }) => {

//   const token = localStorage.getItem("token")

//   const [isAuthenticated, setIsAuthenticated] = useState(!!token);

//   useEffect(() => {
//     const checkAuth = () => {
//       setIsAuthenticated(!!token);
//     };

//     // Listen for storage changes (for multi-tab support)
//     window.addEventListener("storage", checkAuth);
//     return () => window.removeEventListener("storage", checkAuth);
//   }, []);

//   return isAuthenticated ? element : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;


import React from 'react'
import { Navigate, Outlet } from 'react-router';

function RequireUser() {

  const token = localStorage.getItem('token');


  return (
    token ? <Outlet /> : <Navigate to="/login" />
  )
}

export default RequireUser