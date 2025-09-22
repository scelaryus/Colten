// Dashboard service for API calls
import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { Issue, Payment } from '../types/api';

export interface OwnerDashboardData {
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

export interface TenantDashboardData {
  unit: any;
  upcomingRent: Payment;
  recentPayments: Payment[];
  openIssues: Issue[];
  announcements: any[];
}

export interface BuildingDashboardData {
  building: any;
  units: any[];
  tenants: any[];
  issues: Issue[];
  payments: Payment[];
  occupancyRate: number;
  monthlyRevenue: number;
}

class DashboardService {
  // Get owner dashboard summary (OWNER only)
  async getOwnerDashboard(): Promise<OwnerDashboardData> {
    return await apiService.get<OwnerDashboardData>(API_ENDPOINTS.DASHBOARD.OWNER);
  }

  // Get tenant dashboard summary (TENANT only)
  async getTenantDashboard(): Promise<TenantDashboardData> {
    return await apiService.get<TenantDashboardData>(API_ENDPOINTS.DASHBOARD.TENANT);
  }

  // Get building-specific dashboard (OWNER only)
  async getBuildingDashboard(buildingId: number): Promise<BuildingDashboardData> {
    return await apiService.get<BuildingDashboardData>(API_ENDPOINTS.DASHBOARD.BUILDING(buildingId));
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;