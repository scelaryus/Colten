// Building types for the Colten application

export interface Building {
  id: number;
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
  createdAt: string;
  updatedAt?: string;
}

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

export interface BuildingWithUnits extends Building {
  units: Array<{
    id: number;
    unitNumber: string;
    isAvailable: boolean;
    monthlyRent: number;
    unitType: string;
  }>;
}

export interface BuildingStats {
  totalUnits: number;
  availableUnits: number;
  occupiedUnits: number;
  occupancyRate: number;
  totalRevenue: number;
  averageRent: number;
}
