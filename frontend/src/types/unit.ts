// Unit types for the Colten application

export interface Unit {
  id: number;
  unitNumber: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  monthlyRent: number;
  securityDeposit?: number;
  unitType: UnitType;
  isAvailable: boolean;
  roomCode: string;
  description?: string;
  furnished?: boolean;
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  hasAirConditioning?: boolean;
  hasWashingMachine?: boolean;
  hasDishwasher?: boolean;
  hasBalcony?: boolean;
  leaseStartDate?: string;
  leaseEndDate?: string;
  building: {
    id: number;
    name: string;
  };
  tenant?: any;
  createdAt: string;
  updatedAt?: string;
}

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

export type UnitType = 'STUDIO' | 'APARTMENT' | 'TOWNHOUSE' | 'PENTHOUSE';

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
