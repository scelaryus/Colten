// Authentication service for Colten application
import { apiService } from './api';
import { tenantService } from './tenant';
import { API_ENDPOINTS } from '../utils/constants';
import type { 
  LoginRequest, 
  RegisterRequest, 
  TenantRegistrationRequest, 
  AuthResponse 
} from '../types/api';

class AuthService {
  // Owner login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔄 AuthService.login called with:', { email: credentials.email });
    console.log('🔄 Using endpoint:', API_ENDPOINTS.AUTH.LOGIN);
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Login request timed out after 30 seconds')), 30000)
    );
    
    const loginPromise = apiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    try {
      const response = await Promise.race([loginPromise, timeoutPromise]) as AuthResponse;
      console.log('✅ AuthService.login response received:', { 
        id: response.id, 
        email: response.email,
        role: response.role 
      });
      
      // Store auth data - handle both string and array role formats from backend
      let roles: string[];
      if (Array.isArray(response.role)) {
        roles = response.role;
      } else if (typeof response.role === 'string') {
        // Convert single role string to array format
        roles = response.role === 'OWNER' ? ['ROLE_OWNER'] : [`ROLE_${response.role}`];
      } else {
        roles = ['ROLE_OWNER']; // Default for owner login
      }

      apiService.setAuthData(response.token, {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        roles: roles, // Store as roles array
      });
      
      console.log('✅ Auth data stored successfully');
      return response;
    } catch (error) {
      console.error('❌ AuthService.login error:', error);
      throw error;
    }
  }

  // Owner registration
  async register(data: RegisterRequest): Promise<AuthResponse> {
    console.log('AuthService.register called with:', data);
    console.log('Using endpoint:', API_ENDPOINTS.AUTH.REGISTER);
    console.log('Full URL:', `${window.location.origin}/api${API_ENDPOINTS.AUTH.REGISTER}`);
    
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    
    // Store auth data - handle both string and array role formats from backend
    let roles: string[];
    if (Array.isArray(response.role)) {
      roles = response.role;
    } else if (typeof response.role === 'string') {
      // Convert single role string to array format
      roles = response.role === 'OWNER' ? ['ROLE_OWNER'] : [`ROLE_${response.role}`];
    } else {
      roles = ['ROLE_OWNER']; // Default for owner registration
    }

    apiService.setAuthData(response.token, {
      id: response.id,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      roles: roles, // Store as roles array
    });
    
    return response;
  }

  // Tenant registration with room code
  async tenantRegister(data: TenantRegistrationRequest): Promise<AuthResponse> {
    // Use the tenant service which has the correct type mapping
    const response = await tenantService.registerTenant(data);
    
    return response;
  }

  // Logout
  logout(): void {
    apiService.clearAuthData();
    // Redirect to login page
    window.location.href = '/login';
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }

  // Get current user
  getCurrentUser() {
    return apiService.getCurrentUser();
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role?.includes(`ROLE_${role}`) || false;
  }

  // Check if user is owner
  isOwner(): boolean {
    return this.hasRole('OWNER');
  }

  // Check if user is tenant
  isTenant(): boolean {
    return this.hasRole('TENANT');
  }

  // Get user's display name
  getUserDisplayName(): string {
    const user = this.getCurrentUser();
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  }

  // Get user's role display name
  getUserRole(): string {
    if (this.isOwner()) return 'Owner';
    if (this.isTenant()) return 'Tenant';
    return 'Unknown';
  }

  // Check token expiration (basic check)
  isTokenExpired(): boolean {
    const token = localStorage.getItem('colten_token');
    if (!token) return true;

    try {
      // Simple JWT payload decode (not secure, just for expiration check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Auto logout if token is expired
  checkTokenAndLogout(): void {
    if (this.isAuthenticated() && this.isTokenExpired()) {
      console.log('Token expired, logging out...');
      this.logout();
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
