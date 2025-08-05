import React from "react";
import { Navigate } from "react-router";
import { useSelector } from "react-redux";

import { selectIsAuthenticated } from "../../redux/slicers/authSlice";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // If authenticated and trying to access login/register, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, render the public component
  return children;
};

export default PublicRoute;
