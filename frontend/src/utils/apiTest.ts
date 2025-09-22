// API Connection Test Utility
import { API_BASE_URL } from '../utils/constants';

export const testApiConnection = async () => {
  console.log('🔄 Testing API connection...');
  console.log('🔄 Base URL:', API_BASE_URL);
  
  try {
    // Test basic connectivity
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ API Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.text();
      console.log('✅ API Response Data:', data);
      return { success: true, data };
    } else {
      console.error('❌ API responded with error status:', response.status);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const testLoginEndpoint = async () => {
  console.log('🔄 Testing login endpoint...');
  
  try {
    // Test login endpoint with OPTIONS request first
    const optionsResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    
    console.log('✅ OPTIONS Response Status:', optionsResponse.status);
    console.log('✅ OPTIONS Response Headers:', Object.fromEntries(optionsResponse.headers.entries()));
    
    return { success: optionsResponse.ok };
  } catch (error) {
    console.error('❌ Login endpoint test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
