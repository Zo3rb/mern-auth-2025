import React from "react";
import { Navigate, useLocation } from "react-router";
import { useSelector } from "react-redux";

import { selectIsAuthenticated } from "../../redux/slicers/authSlice";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  // If not authenticated, redirect to login and save current location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
