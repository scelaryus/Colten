// Authentication Context for Colten application
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  tenantRegister: (data: any) => Promise<any>;
  logout: () => void;
  loading: boolean;
  isOwner: () => boolean;
  isTenant: () => boolean;
  getUserDisplayName: () => string;
  getUserRole: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      authService.checkTokenAndLogout(); // Check token expiration
      const authenticated = authService.isAuthenticated();
      console.log('Auth check - authenticated:', authenticated);
      
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const currentUser = authService.getCurrentUser();
        console.log('Auth check - currentUser from storage:', currentUser);
        
        setUser(currentUser);
        console.log('Auth check - user set with actual roles:', currentUser);
      }
    };

    checkAuth();
  }, []);

  // Real login function using backend API
  const login = async (email: string, password: string): Promise<any> => {
    setLoading(true);
    try {
      // Call backend authentication service
      const response = await authService.login({ email, password });
      
      console.log('Full API response:', response);
      console.log('Response role:', response.role);
      console.log('Response role type:', typeof response.role);
      console.log('Response role array?:', Array.isArray(response.role));
      
      // Handle both string and array role formats from backend
      let roles: string[];
      if (Array.isArray(response.role)) {
        roles = response.role;
      } else if (typeof response.role === 'string') {
        // Convert single role string to array format
        roles = response.role === 'OWNER' ? ['ROLE_OWNER'] : [`ROLE_${response.role}`];
      } else {
        roles = ['ROLE_OWNER']; // Default for owner login
      }
      
      setIsAuthenticated(true);
      setUser({
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        roles: roles,
      });
      
      console.log('User set in context with actual roles:', {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        roles: roles,
      });
      
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error; // Re-throw to let Login component handle the specific error
    } finally {
      setLoading(false);
    }
  };

  // Owner registration function
  const register = async (data: any): Promise<any> => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      
      // Handle both string and array role formats from backend
      let roles: string[];
      if (Array.isArray(response.role)) {
        roles = response.role;
      } else if (typeof response.role === 'string') {
        // Convert single role string to array format
        roles = response.role === 'OWNER' ? ['ROLE_OWNER'] : [`ROLE_${response.role}`];
      } else {
        roles = ['ROLE_OWNER']; // Default for owner registration
      }
      
      setIsAuthenticated(true);
      setUser({
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        roles: roles,
      });
      
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Tenant registration function
  const tenantRegister = async (data: any): Promise<any> => {
    setLoading(true);
    try {
      const response = await authService.tenantRegister(data);
      
      // Handle both string and array role formats from backend
      let roles: string[];
      if (Array.isArray(response.role)) {
        roles = response.role;
      } else if (typeof response.role === 'string') {
        // Convert single role string to array format
        roles = response.role === 'TENANT' ? ['ROLE_TENANT'] : [`ROLE_${response.role}`];
      } else {
        roles = ['ROLE_TENANT']; // Default for tenant registration
      }
      
      setIsAuthenticated(true);
      setUser({
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        roles: roles,
      });
      
      return response;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout(); // This will clear tokens and redirect
    setIsAuthenticated(false);
    setUser(null);
  };

  // Check if user is owner
  const isOwner = (): boolean => {
    console.log('Checking isOwner, user roles:', user?.roles);
    return user?.roles?.includes('ROLE_OWNER') || user?.roles?.includes('OWNER');
  };

  // Check if user is tenant
  const isTenant = (): boolean => {
    console.log('Checking isTenant, user roles:', user?.roles);
    return user?.roles?.includes('ROLE_TENANT') || user?.roles?.includes('TENANT');
  };

  // Get user display name
  const getUserDisplayName = (): string => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  };

  // Get user role
  const getUserRole = (): string => {
    if (user?.roles?.includes('ROLE_OWNER') || user?.roles?.includes('OWNER')) return 'Owner';
    if (user?.roles?.includes('ROLE_TENANT') || user?.roles?.includes('TENANT')) return 'Tenant';
    return 'Unknown';
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    register,
    tenantRegister,
    logout,
    loading,
    isOwner,
    isTenant,
    getUserDisplayName,
    getUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
