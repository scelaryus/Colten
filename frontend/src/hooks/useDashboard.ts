import { useState, useCallback } from 'react';
import { dashboardService } from '../services/dashboard';
import { useApiError } from './useApiError';
import type { OwnerDashboard, TenantDashboard } from '../types/api';

export const useDashboard = () => {
  const [ownerDashboard, setOwnerDashboard] = useState<OwnerDashboard | null>(null);
  const [tenantDashboard, setTenantDashboard] = useState<TenantDashboard | null>(null);
  const [buildingDashboard, setBuildingDashboard] = useState<any>(null);
  
  const { error, isLoading, handleApiCall, clearError } = useApiError();

  const loadOwnerDashboard = useCallback(async () => {
    const result = await handleApiCall(
      () => dashboardService.getOwnerDashboard(),
      {
        onSuccess: (data) => {
          setOwnerDashboard(data);
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const loadTenantDashboard = useCallback(async () => {
    const result = await handleApiCall(
      () => dashboardService.getTenantDashboard(),
      {
        onSuccess: (data) => {
          setTenantDashboard(data);
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const loadBuildingDashboard = useCallback(async (buildingId: number) => {
    const result = await handleApiCall(
      () => dashboardService.getBuildingDashboard(buildingId),
      {
        onSuccess: (data) => {
          setBuildingDashboard(data);
        }
      }
    );
    return result;
  }, [handleApiCall]);

  return {
    ownerDashboard,
    tenantDashboard,
    buildingDashboard,
    error,
    isLoading,
    loadOwnerDashboard,
    loadTenantDashboard,
    loadBuildingDashboard,
    clearError,
  };
};
