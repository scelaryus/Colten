// Mock tenant service for testing when backend has issues
import type { AuthResponse, TenantRegistrationRequest } from '../types/api';

class MockTenantService {
  // Mock tenant registration that simulates successful registration
  async mockTenantRegister(data: TenantRegistrationRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock response that matches backend format
    const mockResponse: AuthResponse = {
      token: `mock_tenant_token_${Date.now()}`,
      type: 'Bearer',
      id: Math.floor(Math.random() * 1000) + 100,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: ['ROLE_TENANT'] // Return as array to match our frontend expectations
    };
    
    console.log('Mock tenant registration successful:', mockResponse);
    return mockResponse;
  }
  
  // Mock room code validation - accepts any 8-character code
  async mockValidateRoomCode(roomCode: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validate room code format (8 characters)
    if (!roomCode || roomCode.length !== 8) {
      throw new Error('Room code must be exactly 8 characters');
    }
    
    return {
      id: 1,
      unitNumber: '101',
      floor: 1,
      bedrooms: 2,
      bathrooms: 1.5,
      squareFeet: 850,
      monthlyRent: 2500.00,
      securityDeposit: 2500.00,
      description: 'Mock unit for testing',
      unitType: 'APARTMENT',
      isAvailable: true,
      roomCode: roomCode,
      building: {
        id: 1,
        name: 'Mock Building',
        address: '123 Test Street'
      }
    };
  }
}

export const mockTenantService = new MockTenantService();
export default mockTenantService;