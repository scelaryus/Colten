package com.example.Colten.repository;

import com.example.Colten.model.Unit;
import com.example.Colten.model.UnitType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {
    List<Unit> findByBuildingId(Long buildingId);
    List<Unit> findByBuildingIdOrderByUnitNumberAsc(Long buildingId);
    List<Unit> findByBuildingOwnerId(Long ownerId);
    List<Unit> findByIsAvailable(boolean isAvailable);
    List<Unit> findByBuildingIdAndIsAvailable(Long buildingId, boolean isAvailable);
    List<Unit> findByBuildingIdAndIsAvailableOrderByMonthlyRentAsc(Long buildingId, boolean isAvailable);
    
    Optional<Unit> findByRoomCode(String roomCode);
    boolean existsByRoomCode(String roomCode);
    
    List<Unit> findByUnitType(UnitType unitType);
    List<Unit> findByBedroomsAndBathrooms(int bedrooms, BigDecimal bathrooms);
    List<Unit> findByMonthlyRentBetween(BigDecimal minRent, BigDecimal maxRent);
    List<Unit> findByPetsAllowed(boolean petsAllowed);
    List<Unit> findByFurnished(boolean furnished);
    
    // Complex queries
    List<Unit> findByBuildingIdAndBedroomsAndIsAvailable(Long buildingId, int bedrooms, boolean isAvailable);
    List<Unit> findByBuildingIdAndMonthlyRentBetweenAndIsAvailable(Long buildingId, BigDecimal minRent, BigDecimal maxRent, boolean isAvailable);
}
