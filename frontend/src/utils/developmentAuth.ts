// Development authentication helper
// This file provides temporary authentication for development when backend auth is not fully configured

import { STORAGE_KEYS } from '../utils/constants';

export const developmentAuth = {
  // Set a temporary mock token for development
  setMockToken: () => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJkZXZlbG9wZXIiLCJyb2xlIjoiT1dORVIiLCJpYXQiOjE2MzIwNzQ0MDAsImV4cCI6OTk5OTk5OTk5OX0.mock_signature_for_development';
    const mockUser = {
      id: 1,
      username: 'developer',
      email: 'dev@example.com',
      role: 'OWNER',
      firstName: 'Dev',
      lastName: 'User'
    };

    localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    
    console.log('🔧 Development mock authentication set');
    console.log('Token:', mockToken);
    console.log('User:', mockUser);
  },

  // Clear mock authentication
  clearMockToken: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    console.log('🔧 Development mock authentication cleared');
  },

  // Check if mock token exists
  hasMockToken: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  }
};

// Auto-set mock token in development
if (process.env.NODE_ENV === 'development') {
  if (!developmentAuth.hasMockToken()) {
    developmentAuth.setMockToken();
  }
}
