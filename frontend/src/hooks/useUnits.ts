import { useState, useEffect, useCallback } from 'react';
import { unitService } from '../services/unit';
import { useApiError } from './useApiError';
import type { Unit, UnitFilters } from '../types/unit';

export const useUnits = (filters?: UnitFilters) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [stats, setStats] = useState({
    totalUnits: 0,
    occupiedUnits: 0,
    vacantUnits: 0,
    maintenanceUnits: 0,
    totalRevenue: 0,
    averageRent: 0,
  });
  
  const { error, isLoading, handleApiCall, clearError } = useApiError();

  const loadUnits = useCallback(async (currentFilters?: UnitFilters) => {
    const filtersToUse = currentFilters || filters;
    const result = await handleApiCall(
      () => unitService.getUnits(filtersToUse),
      {
        onSuccess: (unitsData) => {
          setUnits(unitsData);
          
          // Calculate stats from loaded units
          const totalUnits = unitsData.length;
          const occupiedUnits = unitsData.filter(unit => !unit.isAvailable).length;
          const vacantUnits = unitsData.filter(unit => unit.isAvailable).length;
          const totalRevenue = unitsData
            .filter(unit => !unit.isAvailable)
            .reduce((sum, unit) => sum + unit.monthlyRent, 0);
          const averageRent = totalUnits > 0 
            ? unitsData.reduce((sum, unit) => sum + unit.monthlyRent, 0) / totalUnits 
            : 0;

          setStats({
            totalUnits,
            occupiedUnits,
            vacantUnits,
            maintenanceUnits: 0, // This would need to come from unit status field
            totalRevenue,
            averageRent,
          });
        }
      }
    );
    return result;
  }, [handleApiCall, filters]);

  const createUnit = useCallback(async (unitData: any) => {
    const result = await handleApiCall(
      () => unitService.createUnit(unitData),
      {
        successMessage: 'Unit created successfully!',
        onSuccess: (newUnit) => {
          setUnits(prev => [...prev, newUnit]);
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const updateUnit = useCallback(async (id: number, unitData: any) => {
    const result = await handleApiCall(
      () => unitService.updateUnit(id, unitData),
      {
        successMessage: 'Unit updated successfully!',
        onSuccess: (updatedUnit) => {
          setUnits(prev => 
            prev.map(unit => 
              unit.id === id ? updatedUnit : unit
            )
          );
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const deleteUnit = useCallback(async (id: number) => {
    const result = await handleApiCall(
      () => unitService.deleteUnit(id),
      {
        successMessage: 'Unit deleted successfully!',
        onSuccess: () => {
          setUnits(prev => prev.filter(unit => unit.id !== id));
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const getUnitById = useCallback(async (id: number) => {
    const result = await handleApiCall(
      () => unitService.getUnitById(id)
    );
    return result;
  }, [handleApiCall]);

  const regenerateRoomCode = useCallback(async (id: number) => {
    const result = await handleApiCall(
      () => unitService.regenerateRoomCode(id),
      {
        successMessage: 'Room code regenerated successfully!',
        onSuccess: (response) => {
          setUnits(prev => 
            prev.map(unit => 
              unit.id === id 
                ? { ...unit, roomCode: response.newRoomCode }
                : unit
            )
          );
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const getUnitsByBuilding = useCallback(async (buildingId: number) => {
    const result = await handleApiCall(
      () => unitService.getUnitsByBuilding(buildingId)
    );
    return result;
  }, [handleApiCall]);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  return {
    units,
    stats,
    isLoading,
    error,
    clearError,
    loadUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    getUnitById,
    regenerateRoomCode,
    getUnitsByBuilding,
  };
};
