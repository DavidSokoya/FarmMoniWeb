import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  // Allow access if User state exists OR Token exists in storage
  return (user || token) ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;