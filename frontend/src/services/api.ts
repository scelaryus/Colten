// Core API service for Colten application
import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, STORAGE_KEYS, HTTP_STATUS, MESSAGES } from '../utils/constants';
import type { ApiError } from '../types/api';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common HTTP errors
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          // Clear token and redirect to login
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          window.location.href = '/login';
          break;
          
        case HTTP_STATUS.FORBIDDEN:
          console.error('Access forbidden:', error.response.data);
          break;
          
        case HTTP_STATUS.NOT_FOUND:
          console.error('Resource not found:', error.response.data);
          break;
          
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          console.error('Server error:', error.response.data);
          break;
          
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request);
    } else {
      // Other error
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Generic API service class
class ApiService {
  // GET request
  async get<T>(url: string): Promise<T> {
    try {
      const response = await apiClient.get<T>(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // POST request
  async post<T, D = any>(url: string, data?: D): Promise<T> {
    try {
      console.log('API POST request:', { url: `${API_BASE_URL}${url}`, data });
      const response = await apiClient.post<T>(url, data);
      console.log('API POST full response:', response);
      console.log('API POST response data:', response.data);
      console.log('API POST response data keys:', Object.keys(response.data || {}));
      console.log('API POST response roles:', (response.data as any)?.roles);
      return response.data;
    } catch (error) {
      console.error('API POST error:', error);
      throw this.handleError(error as AxiosError);
    }
  }

  // PUT request
  async put<T, D = any>(url: string, data?: D): Promise<T> {
    try {
      const response = await apiClient.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // DELETE request
  async delete<T>(url: string): Promise<T> {
    try {
      const response = await apiClient.delete<T>(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // PATCH request
  async patch<T, D = any>(url: string, data?: D): Promise<T> {
    try {
      const response = await apiClient.patch<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // Error handler
  private handleError(error: AxiosError): Error {
    if (error.response?.data) {
      const apiError = error.response.data as ApiError;
      return new Error(apiError.message || this.getErrorMessage(error.response.status));
    }
    
    if (error.request) {
      return new Error(MESSAGES.ERROR.NETWORK);
    }
    
    return new Error(error.message || MESSAGES.ERROR.SERVER_ERROR);
  }

  // Get user-friendly error message based on status code
  private getErrorMessage(status: number): string {
    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return MESSAGES.ERROR.VALIDATION;
      case HTTP_STATUS.UNAUTHORIZED:
        return MESSAGES.ERROR.UNAUTHORIZED;
      case HTTP_STATUS.FORBIDDEN:
        return MESSAGES.ERROR.FORBIDDEN;
      case HTTP_STATUS.NOT_FOUND:
        return MESSAGES.ERROR.NOT_FOUND;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return MESSAGES.ERROR.SERVER_ERROR;
      default:
        return MESSAGES.ERROR.SERVER_ERROR;
    }
  }

  // Get auth headers for manual requests
  getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  }

  // Get current user from storage
  getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Set authentication data
  setAuthData(token: string, user: any): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // Clear authentication data
  clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
