// Issue service for API calls
import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { Issue } from '../types/api';

export interface IssueCreateRequest {
  title: string;
  description: string;
  category: string;
  priority: string;
  locationInUnit?: string;
}

export interface IssueUpdateRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  locationInUnit?: string;
}

class IssueService {
  // Create a new issue (TENANT only)
  async createIssue(data: IssueCreateRequest): Promise<Issue> {
    return await apiService.post<Issue>(API_ENDPOINTS.ISSUES.BASE, data);
  }

  // Get tenant's own issues (TENANT only)
  async getMyIssues(): Promise<Issue[]> {
    return await apiService.get<Issue[]>(API_ENDPOINTS.ISSUES.MY_ISSUES);
  }

  // Get all issues for owner's properties (OWNER only)
  async getOwnerIssues(): Promise<Issue[]> {
    return await apiService.get<Issue[]>(API_ENDPOINTS.ISSUES.OWNER_ISSUES);
  }

  // Get issues for a specific building (OWNER only)
  async getBuildingIssues(buildingId: number): Promise<Issue[]> {
    return await apiService.get<Issue[]>(API_ENDPOINTS.ISSUES.BY_BUILDING(buildingId));
  }

  // Get issue by ID (OWNER can view all, TENANT can view own)
  async getIssueById(id: number): Promise<Issue> {
    return await apiService.get<Issue>(API_ENDPOINTS.ISSUES.BY_ID(id));
  }

  // Get issues by status (OWNER only)
  async getIssuesByStatus(status: string): Promise<Issue[]> {
    return await apiService.get<Issue[]>(API_ENDPOINTS.ISSUES.BY_STATUS(status));
  }

  // Get urgent/emergency issues (OWNER only)
  async getUrgentIssues(): Promise<Issue[]> {
    return await apiService.get<Issue[]>(API_ENDPOINTS.ISSUES.URGENT);
  }

  // Update issue status (OWNER only)
  async updateIssueStatus(id: number, status: string, adminNotes?: string): Promise<Issue> {
    const params = new URLSearchParams({ status });
    if (adminNotes) {
      params.append('adminNotes', adminNotes);
    }
    
    return await apiService.put<Issue>(
      `${API_ENDPOINTS.ISSUES.UPDATE_STATUS(id)}?${params.toString()}`
    );
  }

  // Assign issue to user (OWNER only)
  async assignIssue(id: number, assignedToId: number): Promise<Issue> {
    const params = new URLSearchParams({ assignedToId: assignedToId.toString() });
    
    return await apiService.put<Issue>(
      `${API_ENDPOINTS.ISSUES.ASSIGN(id)}?${params.toString()}`
    );
  }

  // Update issue details (TENANT only, only if status is OPEN)
  async updateIssue(id: number, data: IssueUpdateRequest): Promise<Issue> {
    return await apiService.put<Issue>(API_ENDPOINTS.ISSUES.BY_ID(id), data);
  }

  // Get issue statistics for owner
  async getIssueStats(): Promise<{
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    urgent: number;
  }> {
    try {
      const issues = await this.getOwnerIssues();
      
      return {
        total: issues.length,
        open: issues.filter(issue => issue.status === 'OPEN').length,
        inProgress: issues.filter(issue => issue.status === 'IN_PROGRESS').length,
        resolved: issues.filter(issue => issue.status === 'RESOLVED').length,
        urgent: issues.filter(issue => 
          issue.priority === 'URGENT' || issue.priority === 'EMERGENCY'
        ).length,
      };
    } catch (error) {
      console.error('Failed to get issue stats:', error);
      return { total: 0, open: 0, inProgress: 0, resolved: 0, urgent: 0 };
    }
  }
}

export const issueService = new IssueService();
export default issueService;