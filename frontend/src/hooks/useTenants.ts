import { useState, useEffect, useCallback } from 'react';
import { tenantService } from '../services/tenant';
import { useApiError } from './useApiError';
import type { Tenant } from '../types/api';

export const useTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    recentMoveIns: 0,
  });
  
  const { error, isLoading, handleApiCall, clearError } = useApiError();

  const loadTenants = useCallback(async (buildingId?: number) => {
    const result = await handleApiCall(
      async () => {
        let tenantsData: Tenant[];
        
        if (buildingId) {
          tenantsData = await tenantService.getTenantsByBuilding(buildingId);
        } else {
          tenantsData = await tenantService.getTenants();
        }

        const statsData = await tenantService.getTenantStats();
        return { tenants: tenantsData, stats: statsData };
      },
      {
        onSuccess: (data) => {
          setTenants(data.tenants);
          setStats(data.stats);
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const getTenantProfile = useCallback(async () => {
    const result = await handleApiCall(
      () => tenantService.getTenantProfile()
    );
    return result;
  }, [handleApiCall]);

  const updateTenant = useCallback(async (id: number, tenantData: any) => {
    const result = await handleApiCall(
      () => tenantService.updateTenant(id, tenantData),
      {
        successMessage: 'Tenant updated successfully!',
        onSuccess: (updatedTenant) => {
          setTenants(prev => prev.map(tenant => 
            tenant.id === id ? updatedTenant : tenant
          ));
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const validateRoomCode = useCallback(async (roomCode: string) => {
    const result = await handleApiCall(
      () => tenantService.validateRoomCode(roomCode)
    );
    return result;
  }, [handleApiCall]);

  const registerTenant = useCallback(async (tenantData: any) => {
    const result = await handleApiCall(
      () => tenantService.registerTenant(tenantData),
      {
        successMessage: 'Registration successful! Welcome!'
      }
    );
    return result;
  }, [handleApiCall]);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  return {
    tenants,
    stats,
    error,
    isLoading,
    loadTenants,
    getTenantProfile,
    updateTenant,
    validateRoomCode,
    registerTenant,
    clearError,
  };
};
