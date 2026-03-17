import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../AppContext';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<'student' | 'mentor' | 'admin' | 'dsl'>;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { state } = useAppContext();
  const location = useLocation();

  if (!state.user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(state.user.role)) {
    // Redirect to a default safe page based on their role, or just dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
