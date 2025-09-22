// Constants for Colten Frontend Application

export const API_BASE_URL = 'http://localhost:8080/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    TEST: '/auth/test',
    // Legacy aliases for backward compatibility
    SIGNIN: '/auth/login',
    SIGNUP: '/auth/register',
  },
  
  // Buildings
  BUILDINGS: {
    BASE: '/buildings',
    BY_ID: (id: number) => `/buildings/${id}`,
  },
  
  // Units
  UNITS: {
    BASE: '/units',
    BY_ID: (id: number) => `/units/${id}`,
    BY_BUILDING: (buildingId: number) => `/units/building/${buildingId}`,
    AVAILABLE_BY_BUILDING: (buildingId: number) => `/units/building/${buildingId}/available`,
    REGENERATE_ROOM_CODE: (id: number) => `/units/${id}/regenerate-room-code`,
  },
  
  // Tenants
  TENANTS: {
    BASE: '/tenants',
    REGISTER: '/tenants/register',
    VALIDATE_ROOM_CODE: '/tenants/validate-room-code',
    PROFILE: '/tenants/profile',
    BY_ID: (id: number) => `/tenants/${id}`,
    BY_BUILDING: (buildingId: number) => `/tenants/building/${buildingId}`,
  },
  
  // Issues
  ISSUES: {
    BASE: '/issues',
    BY_ID: (id: number) => `/issues/${id}`,
    MY_ISSUES: '/issues/my-issues',
    OWNER_ISSUES: '/issues/owner-issues',
    BY_BUILDING: (buildingId: number) => `/issues/building/${buildingId}`,
    BY_STATUS: (status: string) => `/issues/status/${status}`,
    URGENT: '/issues/urgent',
    UPDATE_STATUS: (id: number) => `/issues/${id}/status`,
    ASSIGN: (id: number) => `/issues/${id}/assign`,
  },
  
  // Payments
  PAYMENTS: {
    BASE: '/payments',
    BY_ID: (id: number) => `/payments/${id}`,
    BY_TENANT: (tenantId: number) => `/payments/tenant/${tenantId}`,
    UPDATE_STATUS: (id: number) => `/payments/${id}/status`,
  },
  
  // Dashboard
  DASHBOARD: {
    OWNER: '/dashboard/owner',
    TENANT: '/dashboard/tenant',
    BUILDING: (buildingId: number) => `/dashboard/building/${buildingId}`,
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'colten_token',
  USER: 'colten_user',
  REFRESH_TOKEN: 'colten_refresh_token',
} as const;

// JWT Token Configuration
export const JWT_CONFIG = {
  EXPIRATION_TIME: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  HEADER_PREFIX: 'Bearer ',
} as const;

// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  TENANT_REGISTER: '/tenant-register',
  DASHBOARD: '/dashboard',
  OWNER_DASHBOARD: '/dashboard/owner',
  TENANT_DASHBOARD: '/dashboard/tenant',
  BUILDINGS: '/buildings',
  UNITS: '/units',
  TENANTS: '/tenants',
  ISSUES: '/issues',
  PAYMENTS: '/payments',
  PROFILE: '/profile',
} as const;

// Form Validation Rules
export const VALIDATION = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    MESSAGE: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  },
  PHONE: {
    PATTERN: /^[\+]?[\d\s\-\(\)]{10,15}$/,
    MESSAGE: 'Please enter a valid phone number',
  },
  REQUIRED: {
    MESSAGE: 'This field is required',
  },
} as const;

// UI Constants
export const UI = {
  NOTIFICATION_DURATION: 5000, // 5 seconds
  DEBOUNCE_DELAY: 300, // 300ms
  LOADING_DELAY: 200, // 200ms
} as const;

// Application Messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Successfully logged in!',
    REGISTER: 'Account created successfully!',
    LOGOUT: 'Successfully logged out!',
    BUILDING_CREATED: 'Building created successfully!',
    BUILDING_UPDATED: 'Building updated successfully!',
    BUILDING_DELETED: 'Building deleted successfully!',
    UNIT_CREATED: 'Unit created successfully!',
    UNIT_UPDATED: 'Unit updated successfully!',
    UNIT_DELETED: 'Unit deleted successfully!',
    ISSUE_CREATED: 'Issue reported successfully!',
    ISSUE_UPDATED: 'Issue updated successfully!',
    PAYMENT_COMPLETED: 'Payment completed successfully!',
  },
  ERROR: {
    NETWORK: 'Network error. Please check your connection and try again.',
    UNAUTHORIZED: 'Your session has expired. Please log in again.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
    VALIDATION: 'Please check your input and try again.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    ROOM_CODE_INVALID: 'Invalid room code. Please check and try again.',
  },
  LOADING: {
    AUTHENTICATING: 'Authenticating...',
    LOADING_DASHBOARD: 'Loading dashboard...',
    LOADING_BUILDINGS: 'Loading buildings...',
    LOADING_UNITS: 'Loading units...',
    LOADING_TENANTS: 'Loading tenants...',
    LOADING_ISSUES: 'Loading issues...',
    LOADING_PAYMENTS: 'Loading payments...',
    PROCESSING_PAYMENT: 'Processing payment...',
    CREATING_ACCOUNT: 'Creating account...',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Application Configuration
export const APP_CONFIG = {
  NAME: 'Colten',
  VERSION: '1.0.0',
  ENVIRONMENT: import.meta.env.MODE || 'development',
  API_TIMEOUT: 30000, // 30 seconds
} as const;

// Stripe Configuration
export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_test_key_here',
  CURRENCY: 'usd',
  LOCALE: 'en',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy hh:mm a',
  API: 'yyyy-MM-dd',
} as const;

// Unit Type Display Names
export const UNIT_TYPE_LABELS = {
  STUDIO: 'Studio',
  APARTMENT: 'Apartment',
  TOWNHOUSE: 'Townhouse',
  PENTHOUSE: 'Penthouse',
} as const;

// Issue Priority Display Names
export const ISSUE_PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
  EMERGENCY: 'Emergency',
} as const;

// Issue Category Display Names
export const ISSUE_CATEGORY_LABELS = {
  PLUMBING: 'Plumbing',
  ELECTRICAL: 'Electrical',
  HEATING_COOLING: 'Heating/Cooling',
  APPLIANCES: 'Appliances',
  PEST_CONTROL: 'Pest Control',
  STRUCTURAL: 'Structural',
  SAFETY_SECURITY: 'Safety & Security',
  CLEANING: 'Cleaning',
  NOISE_COMPLAINT: 'Noise Complaint',
  WATER_DAMAGE: 'Water Damage',
  LOCKS_KEYS: 'Locks & Keys',
  WINDOWS_DOORS: 'Windows & Doors',
  LIGHTING: 'Lighting',
  INTERNET_CABLE: 'Internet & Cable',
  PARKING: 'Parking',
  GARBAGE_RECYCLING: 'Garbage & Recycling',
  LANDSCAPING: 'Landscaping',
  OTHER: 'Other',
} as const;

// Date formatting utilities
export const formatDateForBackend = (dateString: string): string => {
  if (!dateString) return '';
  
  // If it's already in the correct format (yyyy-MM-dd), return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Convert to yyyy-MM-dd format if needed
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toISOString().split('T')[0];
};

export const formatDateTimeForBackend = (dateString: string): string => {
  if (!dateString) return '';
  
  // For LocalDateTime fields, convert to ISO format with time
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  // Return in format: 2025-08-04T00:00:00
  return date.toISOString().split('.')[0];
};

// Alternative format for dates that might be expected as LocalDateTime
export const formatDateAsDateTime = (dateString: string): string => {
  if (!dateString) return '';
  
  // Convert date to LocalDateTime format: yyyy-MM-ddT00:00:00
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  // Set time to start of day and return in LocalDateTime format
  date.setHours(0, 0, 0, 0);
  return date.toISOString().split('.')[0];
};

// Format lease start date (beginning of day)
export const formatLeaseStartDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  // Set to start of day: 00:00:00
  date.setHours(0, 0, 0, 0);
  return date.toISOString().split('.')[0];
};

// Format lease end date (end of day)
export const formatLeaseEndDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  // Set to end of day: 23:59:59
  date.setHours(23, 59, 59, 0);
  return date.toISOString().split('.')[0];
};
