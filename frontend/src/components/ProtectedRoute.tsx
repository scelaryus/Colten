import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role if required
  if (requiredRole && user) {
    const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];
    const hasRequiredRole = userRoles.some((role: string) => 
      role === requiredRole || 
      role === `ROLE_${requiredRole}` || 
      role === 'ADMIN' ||
      role === 'ROLE_ADMIN'
    );

    if (!hasRequiredRole) {
      return (
        <div className="access-denied">
          <div className="access-denied-content">
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
            <p>Required role: {requiredRole}</p>
            <p>Your roles: {userRoles.join(', ')}</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
