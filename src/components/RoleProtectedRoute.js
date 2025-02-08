import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function RoleProtectedRoute({ children, allowedRoles }) {
  const { user, loading, hasAccess } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !hasAccess(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

export default RoleProtectedRoute; 