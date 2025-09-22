// Building service for API calls

import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { Building } from '../types/api';

export interface CreateBuildingRequest {
  name: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  description?: string;
  floors: number;
  yearBuilt?: number;
  parkingSpaces?: number;
  hasElevator?: boolean;
  hasLaundry?: boolean;
  hasGym?: boolean;
  hasPool?: boolean;
  petFriendly?: boolean;
  imageUrl?: string;
}

export interface UpdateBuildingRequest {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  description?: string;
  floors?: number;
  yearBuilt?: number;
  parkingSpaces?: number;
  hasElevator?: boolean;
  hasLaundry?: boolean;
  hasGym?: boolean;
  hasPool?: boolean;
  petFriendly?: boolean;
  imageUrl?: string;
}

class BuildingService {
  // Get all buildings for the current owner
  async getBuildings(): Promise<Building[]> {
    return await apiService.get<Building[]>(API_ENDPOINTS.BUILDINGS.BASE);
  }

  // Get building by ID
  async getBuildingById(id: number): Promise<Building> {
    return await apiService.get<Building>(API_ENDPOINTS.BUILDINGS.BY_ID(id));
  }

  // Create a new building
  async createBuilding(data: CreateBuildingRequest): Promise<Building> {
    return await apiService.post<Building>(API_ENDPOINTS.BUILDINGS.BASE, data);
  }

  // Update an existing building
  async updateBuilding(id: number, data: UpdateBuildingRequest): Promise<Building> {
    return await apiService.put<Building>(API_ENDPOINTS.BUILDINGS.BY_ID(id), data);
  }

  // Delete a building (WARNING: Cascades to all units, tenants, issues, payments)
  async deleteBuilding(id: number): Promise<void> {
    return await apiService.delete<void>(API_ENDPOINTS.BUILDINGS.BY_ID(id));
  }

  // Get building statistics for owner dashboard
  async getBuildingStats(): Promise<{
    totalBuildings: number;
    totalUnits: number;
    occupiedUnits: number;
    availableUnits: number;
    totalRevenue: number;
    occupancyRate: number;
  }> {
    // This would typically be provided by the dashboard API or calculated from buildings data
    const buildings = await this.getBuildings();
    
    // This is a simplified calculation - in a real app, you'd get this from the backend
    return {
      totalBuildings: buildings.length,
      totalUnits: 0, // Would need to be calculated from units
      occupiedUnits: 0,
      availableUnits: 0,
      totalRevenue: 0,
      occupancyRate: 0,
    };
  }
}

export const buildingService = new BuildingService();
