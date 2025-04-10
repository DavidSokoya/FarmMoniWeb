import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // --- ADD THESE LOGS ---
  console.log("AdminRoute Check:");
  console.log("Loading?", loading);
  console.log("User found?", user);
  console.log("User Role?", user?.role);
  // ----------------------

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (user && user.role === 'admin') {
    return children;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

export default AdminRoute;

