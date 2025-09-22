import { useState, useEffect, useCallback } from 'react';
import { buildingService } from '../services/building';
import { dashboardService } from '../services/dashboard';
import { useApiError } from './useApiError';
import type { Building } from '../types/building';

export const useBuildings = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalUnits: 0,
    totalRevenue: 0,
    occupancyRate: 0,
  });
  
  const { error, isLoading, handleApiCall, clearError } = useApiError();

  const loadBuildings = useCallback(async () => {
    const result = await handleApiCall(
      async () => {
        const buildingsData = await buildingService.getBuildings();
        
        // Try to get dashboard stats for more comprehensive data
        try {
          const dashboardData = await dashboardService.getOwnerDashboard();
          const stats = {
            totalBuildings: dashboardData.totalBuildings,
            totalUnits: dashboardData.totalUnits,
            totalRevenue: dashboardData.totalRevenue,
            occupancyRate: dashboardData.totalUnits > 0 ? (dashboardData.occupiedUnits / dashboardData.totalUnits) * 100 : 0,
          };
          return { buildings: buildingsData, stats };
        } catch {
          // Fallback to basic stats if dashboard API fails
          const stats = {
            totalBuildings: buildingsData.length,
            totalUnits: 0,
            totalRevenue: 0,
            occupancyRate: 0,
          };
          return { buildings: buildingsData, stats };
        }
      },
      {
        onSuccess: (data) => {
          setBuildings(data.buildings);
          setStats({
            totalBuildings: data.stats.totalBuildings,
            totalUnits: data.stats.totalUnits,
            totalRevenue: data.stats.totalRevenue,
            occupancyRate: data.stats.occupancyRate,
          });
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const createBuilding = useCallback(async (buildingData: any) => {
    const result = await handleApiCall(
      () => buildingService.createBuilding(buildingData),
      {
        successMessage: 'Building created successfully!',
        onSuccess: (newBuilding) => {
          setBuildings(prev => [...prev, newBuilding]);
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const updateBuilding = useCallback(async (id: number, buildingData: any) => {
    const result = await handleApiCall(
      () => buildingService.updateBuilding(id, buildingData),
      {
        successMessage: 'Building updated successfully!',
        onSuccess: (updatedBuilding) => {
          setBuildings(prev => 
            prev.map(building => 
              building.id === id ? updatedBuilding : building
            )
          );
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const deleteBuilding = useCallback(async (id: number) => {
    const result = await handleApiCall(
      () => buildingService.deleteBuilding(id),
      {
        successMessage: 'Building deleted successfully!',
        onSuccess: () => {
          setBuildings(prev => prev.filter(building => building.id !== id));
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const getBuildingById = useCallback(async (id: number) => {
    const result = await handleApiCall(
      () => buildingService.getBuildingById(id)
    );
    return result;
  }, [handleApiCall]);

  useEffect(() => {
    loadBuildings();
  }, [loadBuildings]);

  return {
    buildings,
    stats,
    isLoading,
    error,
    clearError,
    loadBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    getBuildingById,
  };
};
