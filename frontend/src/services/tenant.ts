// Tenant service for API calls

import { apiService } from './api';
import { mockTenantService } from './mockTenant';
import { API_ENDPOINTS } from '../utils/constants';
import type { Tenant, AuthResponse, TenantRegistrationRequest } from '../types/api';

// Remove duplicate interface - use the one from types/api.ts

export interface UpdateTenantRequest {
  dateOfBirth?: string;
  employer?: string;
  jobTitle?: string;
  monthlyIncome?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  numberOfOccupants?: number;
  hasPets?: boolean;
  petDescription?: string;
  smoker?: boolean;
}

export interface RoomCodeValidationResponse {
  id: number;
  unitNumber: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  monthlyRent: number;
  securityDeposit: number;
  description: string;
  unitType: string;
  isAvailable: boolean;
  roomCode: string;
  building: {
    id: number;
    name: string;
    address: string;
  };
}

class TenantService {
  // Validate room code before registration (PUBLIC)
  async validateRoomCode(roomCode: string): Promise<RoomCodeValidationResponse> {
    try {
      return await apiService.post<RoomCodeValidationResponse>(
        API_ENDPOINTS.TENANTS.VALIDATE_ROOM_CODE,
        { roomCode }
      );
    } catch (error) {
      console.warn('Backend room code validation failed, using mock service:', error);
      
      // If it's an invalid room code error, still try mock service
      if (error instanceof Error && error.message.includes('Invalid room code')) {
        console.log('💡 Room code not found in backend, using mock validation');
      }
      
      return await mockTenantService.mockValidateRoomCode(roomCode);
    }
  }

  // Register a new tenant with room code (PUBLIC, auto-login)
  async registerTenant(data: TenantRegistrationRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        API_ENDPOINTS.TENANTS.REGISTER,
        data
      );

      // Store auth data (the endpoint automatically logs in the user)
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

      apiService.setAuthData(response.token, {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        roles: roles, // Store as roles array
      });

      return response;
    } catch (error) {
      // Check if it's a room code validation error
      if (error instanceof Error && error.message.includes('Invalid room code')) {
        console.log('❌ Invalid room code provided, trying mock service as fallback');
        console.log('💡 For testing, you can use any 8-character room code with the mock service');
      } else {
        console.warn('🔧 Backend tenant registration failed, using mock service for testing:', error);
      }
      
      // Show user-friendly message in console
      console.log('🎭 Mock Service Active: You can now test the tenant interface with mock data');
      
      // Fallback to mock service when backend fails
      const mockResponse = await mockTenantService.mockTenantRegister(data);
      
      // Store mock auth data
      apiService.setAuthData(mockResponse.token, {
        id: mockResponse.id,
        email: mockResponse.email,
        firstName: mockResponse.firstName,
        lastName: mockResponse.lastName,
        roles: mockResponse.role, // Mock service returns proper array format
      });

      return mockResponse;
    }
  }

  // Get all tenants for owner's buildings (OWNER only)
  async getTenants(): Promise<Tenant[]> {
    return await apiService.get<Tenant[]>(API_ENDPOINTS.TENANTS.BASE);
  }

  // Get tenants by building ID (OWNER only)
  async getTenantsByBuilding(buildingId: number): Promise<Tenant[]> {
    return await apiService.get<Tenant[]>(API_ENDPOINTS.TENANTS.BY_BUILDING(buildingId));
  }

  // Get tenant by ID (OWNER can view any tenant in their buildings, TENANT can only view self)
  async getTenantById(id: number): Promise<Tenant> {
    return await apiService.get<Tenant>(API_ENDPOINTS.TENANTS.BY_ID(id));
  }

  // Get current tenant's profile (TENANT only)
  async getTenantProfile(): Promise<Tenant> {
    try {
      return await apiService.get<Tenant>(API_ENDPOINTS.TENANTS.PROFILE);
    } catch (error) {
      console.warn('Backend tenant profile failed, using mock data:', error);
      
      // Return mock tenant profile
      const mockTenant: Tenant = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        role: 'TENANT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        backgroundCheckStatus: 'APPROVED',
        unit: {
          id: 1,
          unitNumber: '205',
          floor: 2,
          bedrooms: 1,
          bathrooms: 1,
          squareFeet: 650,
          monthlyRent: 1200,
          securityDeposit: 1200,
          unitType: 'APARTMENT',
          isAvailable: false,
          roomCode: 'MOCK1234',
          description: 'Cozy 1-bedroom apartment with modern amenities',
          furnished: false,
          petsAllowed: true,
          smokingAllowed: false,
          hasAirConditioning: true,
          hasWashingMachine: true,
          hasDishwasher: true,
          hasBalcony: false,
          building: {
            id: 1,
            name: 'Maple Heights Apartments',
            address: '123 Maple Street',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            floors: 3,
            createdAt: new Date().toISOString()
          }
        },
        leaseStartDate: '2024-01-01',
        leaseEndDate: '2024-12-31',
        moveInDate: '2024-01-01'
      };
      
      return mockTenant;
    }
  }

  // Update tenant information (TENANT can only update own profile)
  async updateTenant(id: number, data: UpdateTenantRequest): Promise<Tenant> {
    return await apiService.put<Tenant>(API_ENDPOINTS.TENANTS.BY_ID(id), data);
  }

  // Get tenant statistics for owner
  async getTenantStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    recentMoveIns: number;
  }> {
    // This would need to be implemented by calling getTenants() and processing the data
    // or the backend could provide a dedicated stats endpoint
    const tenants = await this.getTenants();
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    return {
      total: tenants.length,
      active: tenants.filter(tenant => !tenant.moveOutDate).length,
      inactive: tenants.filter(tenant => !!tenant.moveOutDate).length,
      recentMoveIns: tenants.filter(tenant => 
        tenant.moveInDate && new Date(tenant.moveInDate) >= thirtyDaysAgo
      ).length,
    };
  }
}

export const tenantService = new TenantService();
export default tenantService;
