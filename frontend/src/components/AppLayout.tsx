import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigation } from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Don't show navigation on auth pages
  const authPages = ['/login', '/register', '/tenant-register'];
  const isAuthPage = authPages.includes(location.pathname);
  const showNavigation = isAuthenticated && !isAuthPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavigation && <Navigation />}
      <main className={showNavigation ? '' : 'min-h-screen'}>
        {children}
      </main>
    </div>
  );
};
