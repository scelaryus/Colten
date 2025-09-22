import { useState, useEffect, useCallback } from 'react';
import { issueService } from '../services/issue';
import { useApiError } from './useApiError';
import type { Issue, IssueStatus } from '../types/api';

export const useIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    urgent: 0,
    emergency: 0,
  });
  
  const { error, isLoading, handleApiCall, clearError } = useApiError();

  const loadIssues = useCallback(async (type: 'my' | 'owner' | 'building' = 'owner', buildingId?: number) => {
    const result = await handleApiCall(
      async () => {
        let issuesData: Issue[];
        
        if (type === 'my') {
          issuesData = await issueService.getMyIssues();
        } else if (type === 'building' && buildingId) {
          issuesData = await issueService.getIssuesByBuilding(buildingId);
        } else {
          issuesData = await issueService.getOwnerIssues();
        }

        const statsData = await issueService.getIssueStats();
        return { issues: issuesData, stats: statsData };
      },
      {
        onSuccess: (data) => {
          setIssues(data.issues);
          setStats(data.stats);
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const createIssue = useCallback(async (issueData: any) => {
    const result = await handleApiCall(
      () => issueService.createIssue(issueData),
      {
        successMessage: 'Issue reported successfully!',
        onSuccess: (newIssue) => {
          setIssues(prev => [newIssue, ...prev]);
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const updateIssueStatus = useCallback(async (id: number, status: IssueStatus, adminNotes?: string) => {
    const result = await handleApiCall(
      () => issueService.updateIssueStatus(id, status, adminNotes),
      {
        successMessage: 'Issue status updated successfully!',
        onSuccess: (updatedIssue) => {
          setIssues(prev => prev.map(issue => 
            issue.id === id ? updatedIssue : issue
          ));
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const assignIssue = useCallback(async (id: number, assignedToId: number) => {
    const result = await handleApiCall(
      () => issueService.assignIssue(id, assignedToId),
      {
        successMessage: 'Issue assigned successfully!',
        onSuccess: (updatedIssue) => {
          setIssues(prev => prev.map(issue => 
            issue.id === id ? updatedIssue : issue
          ));
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const getUrgentIssues = useCallback(async () => {
    const result = await handleApiCall(
      () => issueService.getUrgentIssues()
    );
    return result;
  }, [handleApiCall]);

  const getIssuesByStatus = useCallback(async (status: IssueStatus) => {
    const result = await handleApiCall(
      () => issueService.getIssuesByStatus(status)
    );
    return result;
  }, [handleApiCall]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  return {
    issues,
    stats,
    error,
    isLoading,
    loadIssues,
    createIssue,
    updateIssueStatus,
    assignIssue,
    getUrgentIssues,
    getIssuesByStatus,
    clearError,
  };
};
