package com.example.Colten.repository;

import com.example.Colten.model.Issue;
import com.example.Colten.model.IssueStatus;
import com.example.Colten.model.IssuePriority;
import com.example.Colten.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    
    // Find issues by tenant
    List<Issue> findByTenantOrderByCreatedAtDesc(Tenant tenant);
    List<Issue> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
    
    // Find issues by building
    List<Issue> findByUnit_Building_IdOrderByCreatedAtDesc(Long buildingId);
    
    // Find issues by owner's email
    @Query("SELECT i FROM Issue i WHERE i.unit.building.owner.email = :ownerEmail ORDER BY i.createdAt DESC")
    List<Issue> findByUnitBuildingOwnerEmailOrderByCreatedAtDesc(@Param("ownerEmail") String ownerEmail);
    
    // Find issues by building and owner
    @Query("SELECT i FROM Issue i WHERE i.unit.building.id = :buildingId AND i.unit.building.owner.email = :ownerEmail ORDER BY i.createdAt DESC")
    List<Issue> findByUnitBuildingIdAndUnitBuildingOwnerEmailOrderByCreatedAtDesc(@Param("buildingId") Long buildingId, @Param("ownerEmail") String ownerEmail);
    
    // Find issues by status
    List<Issue> findByStatusOrderByCreatedAtDesc(IssueStatus status);
    
    // Find issues by status and owner
    @Query("SELECT i FROM Issue i WHERE i.status = :status AND i.unit.building.owner.email = :ownerEmail ORDER BY i.createdAt DESC")
    List<Issue> findByStatusAndUnitBuildingOwnerEmailOrderByCreatedAtDesc(@Param("status") IssueStatus status, @Param("ownerEmail") String ownerEmail);
    
    // Find urgent issues (EMERGENCY or URGENT priority)
    @Query("SELECT i FROM Issue i WHERE i.unit.building.owner.email = :ownerEmail AND (i.priority = 'EMERGENCY' OR i.priority = 'URGENT') AND i.status NOT IN ('RESOLVED', 'CLOSED') ORDER BY i.createdAt DESC")
    List<Issue> findUrgentIssuesByOwnerEmail(@Param("ownerEmail") String ownerEmail);
    
    // Find issues by assigned user
    List<Issue> findByAssignedToIdOrderByCreatedAtDesc(Long assignedToId);
    
    // Find issues by unit
    List<Issue> findByUnitIdOrderByCreatedAtDesc(Long unitId);
    
    // Find open issues count for a building
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.unit.building.id = :buildingId AND i.status = 'OPEN'")
    Long countOpenIssuesByBuildingId(@Param("buildingId") Long buildingId);
    
    // Find open issues count for an owner
    @Query("SELECT COUNT(i) FROM Issue i WHERE i.unit.building.owner.email = :ownerEmail AND i.status = 'OPEN'")
    Long countOpenIssuesByOwnerEmail(@Param("ownerEmail") String ownerEmail);
    
    // Find issues created in the last 30 days
    @Query("SELECT i FROM Issue i WHERE i.unit.building.owner.email = :ownerEmail AND i.createdAt >= :thirtyDaysAgo ORDER BY i.createdAt DESC")
    List<Issue> findRecentIssuesByOwnerEmail(@Param("ownerEmail") String ownerEmail, @Param("thirtyDaysAgo") java.time.LocalDateTime thirtyDaysAgo);
}
