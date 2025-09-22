// API Types for Colten Tenant Management System
// Based on backend documentation

// Const objects and union types (compatible with erasableSyntaxOnly)
export const Role = {
  OWNER: 'OWNER',
  TENANT: 'TENANT'
} as const;
export type Role = typeof Role[keyof typeof Role];

export const BackgroundCheckStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  NOT_REQUIRED: 'NOT_REQUIRED'
} as const;
export type BackgroundCheckStatus = typeof BackgroundCheckStatus[keyof typeof BackgroundCheckStatus];

export const UnitType = {
  STUDIO: 'STUDIO',
  APARTMENT: 'APARTMENT',
  TOWNHOUSE: 'TOWNHOUSE',
  PENTHOUSE: 'PENTHOUSE'
} as const;
export type UnitType = typeof UnitType[keyof typeof UnitType];

export const IssueCategory = {
  PLUMBING: 'PLUMBING',
  ELECTRICAL: 'ELECTRICAL',
  HEATING_COOLING: 'HEATING_COOLING',
  APPLIANCES: 'APPLIANCES',
  PEST_CONTROL: 'PEST_CONTROL',
  STRUCTURAL: 'STRUCTURAL',
  SAFETY_SECURITY: 'SAFETY_SECURITY',
  CLEANING: 'CLEANING',
  NOISE_COMPLAINT: 'NOISE_COMPLAINT',
  WATER_DAMAGE: 'WATER_DAMAGE',
  LOCKS_KEYS: 'LOCKS_KEYS',
  WINDOWS_DOORS: 'WINDOWS_DOORS',
  LIGHTING: 'LIGHTING',
  INTERNET_CABLE: 'INTERNET_CABLE',
  PARKING: 'PARKING',
  GARBAGE_RECYCLING: 'GARBAGE_RECYCLING',
  LANDSCAPING: 'LANDSCAPING',
  OTHER: 'OTHER'
} as const;
export type IssueCategory = typeof IssueCategory[keyof typeof IssueCategory];

export const IssuePriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
  EMERGENCY: 'EMERGENCY'
} as const;
export type IssuePriority = typeof IssuePriority[keyof typeof IssuePriority];

export const IssueStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_PARTS: 'PENDING_PARTS',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  SCHEDULED: 'SCHEDULED',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED',
  DUPLICATE: 'DUPLICATE'
} as const;
export type IssueStatus = typeof IssueStatus[keyof typeof IssueStatus];

export const PaymentType = {
  RENT: 'RENT',
  SECURITY_DEPOSIT: 'SECURITY_DEPOSIT',
  LATE_FEE: 'LATE_FEE',
  UTILITY: 'UTILITY',
  OTHER: 'OTHER'
} as const;
export type PaymentType = typeof PaymentType[keyof typeof PaymentType];

export const PaymentMethod = {
  CREDIT_CARD: 'CREDIT_CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CHECK: 'CHECK',
  CASH: 'CASH',
  STRIPE: 'STRIPE'
} as const;
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
} as const;
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

// Core Entity Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Owner extends User {
  companyName?: string;
  buildings: Building[];
}

export interface Tenant extends User {
  unit?: Unit;
  backgroundCheckStatus: BackgroundCheckStatus;
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
  leaseStartDate?: string;
  leaseEndDate?: string;
  moveInDate?: string;
  moveOutDate?: string;
  isActive?: boolean;
  emailVerified?: boolean;
}

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
  units?: Unit[];
}

export interface Unit {
  id: number;
  unitNumber: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  monthlyRent: number;
  securityDeposit: number;
  unitType: UnitType;
  isAvailable: boolean;
  roomCode: string;
  description: string;
  furnished: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  hasAirConditioning: boolean;
  hasWashingMachine: boolean;
  hasDishwasher: boolean;
  hasBalcony: boolean;
  leaseStartDate?: string;
  leaseEndDate?: string;
  building: Building;
  tenant?: Tenant;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  locationInUnit?: string;
  adminNotes?: string;
  tenant: Tenant;
  unit: Unit;
  assignedTo?: User;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
}

export interface Payment {
  id: number;
  amount: number;
  paymentDate: string;
  dueDate: string;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  description: string;
  tenant: Tenant;
  unit: Unit;
  createdAt: string;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  companyName?: string;
}

export interface TenantRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  roomCode: string;
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
  leaseStartDate?: string;
  leaseEndDate?: string;
  moveInDate?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string[]; // Backend returns role as array like ["ROLE_OWNER"]
}

export interface IssueRequest {
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
}

export interface PaymentRequest {
  amount: number;
  paymentType: PaymentType;
  description: string;
  stripePaymentMethodId: string;
}

export interface RoomCodeRequest {
  roomCode: string;
}

// Dashboard Types
export interface OwnerDashboard {
  totalBuildings: number;
  totalUnits: number;
  occupiedUnits: number;
  availableUnits: number;
  totalTenants: number;
  openIssues: number;
  totalRevenue: number;
  monthlyRevenue: number;
  recentIssues: Issue[];
  recentPayments: Payment[];
}

export interface TenantDashboard {
  unit: Unit;
  upcomingRent: Payment;
  recentPayments: Payment[];
  openIssues: Issue[];
  announcements: any[];
}

// API Error Types
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

// Form Types for Components
export interface BuildingFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  numberOfUnits: number;
}

export interface UnitFormData {
  unitNumber: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  monthlyRent: number;
  securityDeposit: number;
  unitType: UnitType;
  description: string;
  furnished: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  hasAirConditioning: boolean;
  hasWashingMachine: boolean;
  hasDishwasher: boolean;
  hasBalcony: boolean;
  leaseStartDate?: string;
  leaseEndDate?: string;
}
