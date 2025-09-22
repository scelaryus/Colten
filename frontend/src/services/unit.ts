// Unit service for API calls

import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { Unit } from '../types/api';

export interface CreateUnitRequest {
  unitNumber: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  monthlyRent: number;
  securityDeposit?: number;
  description?: string;
  unitType?: 'STUDIO' | 'APARTMENT' | 'TOWNHOUSE' | 'PENTHOUSE';
  hasBalcony?: boolean;
  hasDishwasher?: boolean;
  hasWashingMachine?: boolean;
  hasAirConditioning?: boolean;
  furnished?: boolean;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  isAvailable?: boolean;
  leaseStartDate?: string;
  leaseEndDate?: string;
  buildingId: number;
}

export interface UpdateUnitRequest {
  unitNumber?: string;
  floor?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  monthlyRent?: number;
  securityDeposit?: number;
  description?: string;
  unitType?: 'STUDIO' | 'APARTMENT' | 'TOWNHOUSE' | 'PENTHOUSE';
  hasBalcony?: boolean;
  hasDishwasher?: boolean;
  hasWashingMachine?: boolean;
  hasAirConditioning?: boolean;
  furnished?: boolean;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  isAvailable?: boolean;
  leaseStartDate?: string;
  leaseEndDate?: string;
}

export interface UnitFilters {
  buildingId?: number;
  isAvailable?: boolean;
  unitType?: string;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export interface RoomCodeRegenerateResponse {
  id: number;
  roomCode: string;
  unitNumber: string;
  building: {
    id: number;
    name: string;
  };
}

class UnitService {
  // Get all units with optional filters (OWNER only)
  async getUnits(filters?: UnitFilters): Promise<Unit[]> {
    // Backend doesn't support query parameters, so fetch all units and filter on frontend
    const allUnits = await apiService.get<Unit[]>(API_ENDPOINTS.UNITS.BASE);
    
    if (!filters) {
      return allUnits;
    }
    
    // Apply client-side filtering
    return allUnits.filter(unit => {
      // Building filter
      if (filters.buildingId && unit.building.id !== filters.buildingId) {
        return false;
      }
      
      // Availability filter
      if (filters.isAvailable !== undefined && unit.isAvailable !== filters.isAvailable) {
        return false;
      }
      
      // Unit type filter
      if (filters.unitType && unit.unitType !== filters.unitType) {
        return false;
      }
      
      // Minimum rent filter
      if (filters.minRent && unit.monthlyRent < filters.minRent) {
        return false;
      }
      
      // Maximum rent filter
      if (filters.maxRent && unit.monthlyRent > filters.maxRent) {
        return false;
      }
      
      // Bedrooms filter (minimum)
      if (filters.bedrooms && unit.bedrooms < filters.bedrooms) {
        return false;
      }
      
      // Bathrooms filter (minimum)
      if (filters.bathrooms && unit.bathrooms < filters.bathrooms) {
        return false;
      }
      
      return true;
    });
  }

  // Get unit by ID (OWNER only)
  async getUnitById(id: number): Promise<Unit> {
    return await apiService.get<Unit>(API_ENDPOINTS.UNITS.BY_ID(id));
  }

  // Get units by building ID (OWNER only)
  async getUnitsByBuilding(buildingId: number): Promise<Unit[]> {
    return await apiService.get<Unit[]>(API_ENDPOINTS.UNITS.BY_BUILDING(buildingId));
  }

  // Get available units by building ID (PUBLIC)
  async getAvailableUnitsByBuilding(buildingId: number): Promise<Unit[]> {
    return await apiService.get<Unit[]>(API_ENDPOINTS.UNITS.AVAILABLE_BY_BUILDING(buildingId));
  }

  // Create a new unit (OWNER only - room code auto-generated)
  async createUnit(data: CreateUnitRequest): Promise<Unit> {
    return await apiService.post<Unit>(API_ENDPOINTS.UNITS.BASE, data);
  }

  // Update an existing unit (OWNER only)
  async updateUnit(id: number, data: UpdateUnitRequest): Promise<Unit> {
    return await apiService.put<Unit>(API_ENDPOINTS.UNITS.BY_ID(id), data);
  }

  // Delete a unit (OWNER only - cascades to tenant, issues, payments)
  async deleteUnit(id: number): Promise<void> {
    return await apiService.delete<void>(API_ENDPOINTS.UNITS.BY_ID(id));
  }

  // Regenerate room code for a unit (OWNER only)
  async regenerateRoomCode(id: number): Promise<RoomCodeRegenerateResponse> {
    return await apiService.post<RoomCodeRegenerateResponse>(
      API_ENDPOINTS.UNITS.REGENERATE_ROOM_CODE(id),
      {}
    );
  }

  // Get unit statistics for a building
  async getUnitStats(buildingId: number): Promise<{
    total: number;
    available: number;
    occupied: number;
    averageRent: number;
    totalRevenue: number;
  }> {
    const units = await this.getUnitsByBuilding(buildingId);
    
    const stats = {
      total: units.length,
      available: units.filter(unit => unit.isAvailable).length,
      occupied: units.filter(unit => !unit.isAvailable).length,
      averageRent: 0,
      totalRevenue: 0,
    };

    if (units.length > 0) {
      const totalRent = units.reduce((sum, unit) => sum + unit.monthlyRent, 0);
      stats.averageRent = totalRent / units.length;
      stats.totalRevenue = units.filter(unit => !unit.isAvailable)
        .reduce((sum, unit) => sum + unit.monthlyRent, 0);
    }

    return stats;
  }
}

export const unitService = new UnitService();
