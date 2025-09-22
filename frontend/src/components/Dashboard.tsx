import React from 'react';
import { useAuth } from '../context/AuthContext';
import OwnerDashboard from './OwnerDashboard';
import TenantDashboard from './TenantDashboard';

const Dashboard: React.FC = () => {
  const { isOwner, isTenant, getUserRole } = useAuth();

  console.log('Dashboard - isOwner:', isOwner(), 'isTenant:', isTenant(), 'getUserRole:', getUserRole());

  // Route to appropriate dashboard based on user role
  if (isTenant()) {
    return <TenantDashboard />;
  }
  
  if (isOwner()) {
    return <OwnerDashboard />;
  }

  // Default to owner dashboard for unknown roles
  return <OwnerDashboard />;
};

export default Dashboard;
