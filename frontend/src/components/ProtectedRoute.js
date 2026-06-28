import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protect only screen that demands token
const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, token } = useAuth();

  // Check if the token exists and the user is authenticated
  return token && isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;