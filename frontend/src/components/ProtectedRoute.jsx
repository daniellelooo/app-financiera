import React from "react";
import { Navigate } from "react-router-dom";

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
