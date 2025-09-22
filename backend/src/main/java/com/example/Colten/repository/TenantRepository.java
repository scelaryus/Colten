package com.example.Colten.repository;

import com.example.Colten.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    
    Optional<Tenant> findByEmail(String email);
    
    @Query("SELECT t FROM Tenant t WHERE t.email = :email")
    Optional<Tenant> findByUserEmail(@Param("email") String email);
    
    @Query("SELECT t FROM Tenant t WHERE t.unit.building.owner.email = :ownerEmail")
    List<Tenant> findByUnitBuildingOwnerEmail(@Param("ownerEmail") String ownerEmail);
    
    @Query("SELECT t FROM Tenant t WHERE t.unit.building.id = :buildingId AND t.unit.building.owner.email = :ownerEmail")
    List<Tenant> findByUnitBuildingIdAndUnitBuildingOwnerEmail(@Param("buildingId") Long buildingId, @Param("ownerEmail") String ownerEmail);
    
    Optional<Tenant> findByUnitId(Long unitId);
    
    @Query("SELECT t FROM Tenant t WHERE t.unit.building.id = :buildingId")
    List<Tenant> findByUnitBuildingId(@Param("buildingId") Long buildingId);
    
    @Query("SELECT t FROM Tenant t WHERE t.backgroundCheckStatus = :status")
    List<Tenant> findByBackgroundCheckStatus(@Param("status") com.example.Colten.model.BackgroundCheckStatus status);
    
    @Query("SELECT t FROM Tenant t WHERE t.leaseEndDate < CURRENT_DATE")
    List<Tenant> findTenantsWithExpiredLeases();
    
    @Query("SELECT t FROM Tenant t WHERE t.leaseEndDate BETWEEN CURRENT_DATE AND :endDate")
    List<Tenant> findTenantsWithLeasesExpiringBefore(@Param("endDate") java.time.LocalDate endDate);
    
    Boolean existsByUnitId(Long unitId);
}
