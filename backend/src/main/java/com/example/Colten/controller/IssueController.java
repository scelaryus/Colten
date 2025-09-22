package com.example.Colten.controller;

import com.example.Colten.model.Issue;
import com.example.Colten.model.IssueStatus;
import com.example.Colten.model.Tenant;
import com.example.Colten.model.Unit;
import com.example.Colten.model.User;
import com.example.Colten.repository.IssueRepository;
import com.example.Colten.repository.TenantRepository;
import com.example.Colten.repository.UnitRepository;
import com.example.Colten.repository.UserRepository;
import com.example.Colten.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "*", maxAge = 3600)
public class IssueController {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    // Get all issues for a tenant
    @GetMapping("/my-issues")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<Issue>> getTenantIssues(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Tenant> tenant = tenantRepository.findByUserEmail(email);
            if (tenant.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            List<Issue> issues = issueRepository.findByTenantIdOrderByCreatedAtDesc(tenant.get().getId());
            return ResponseEntity.ok(issues);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get all issues for an owner's properties
    @GetMapping("/owner-issues")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<Issue>> getOwnerIssues(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            List<Issue> issues = issueRepository.findByUnitBuildingOwnerEmailOrderByCreatedAtDesc(email);
            return ResponseEntity.ok(issues);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get issues for a specific building
    @GetMapping("/building/{buildingId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<Issue>> getBuildingIssues(@PathVariable Long buildingId,
                                                        @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            List<Issue> issues = issueRepository.findByUnitBuildingIdAndUnitBuildingOwnerEmailOrderByCreatedAtDesc(buildingId, email);
            return ResponseEntity.ok(issues);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get a specific issue
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('TENANT')")
    public ResponseEntity<Issue> getIssueById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Issue> issue = issueRepository.findById(id);
            if (issue.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Check permissions - tenant can see their own issues, owner can see issues for their properties
            Issue issueObj = issue.get();
            boolean canAccess = false;
            
            // Check if it's the tenant's issue
            if (issueObj.getTenant().getEmail().equals(email)) {
                canAccess = true;
            }
            // Check if it's the owner's property
            else if (issueObj.getUnit().getBuilding().getOwner().getEmail().equals(email)) {
                canAccess = true;
            }

            if (!canAccess) {
                return ResponseEntity.status(403).build();
            }

            return ResponseEntity.ok(issueObj);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Create a new issue (tenant only)
    @PostMapping
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<Issue> createIssue(@Valid @RequestBody Issue issue, 
                                            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Tenant> tenant = tenantRepository.findByUserEmail(email);
            if (tenant.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Set the tenant and unit
            issue.setTenant(tenant.get());
            issue.setUnit(tenant.get().getUnit());
            issue.setStatus(IssueStatus.OPEN); // Default status

            Issue savedIssue = issueRepository.save(issue);
            return ResponseEntity.ok(savedIssue);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update issue status (owner only)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Issue> updateIssueStatus(@PathVariable Long id,
                                                  @RequestParam IssueStatus status,
                                                  @RequestParam(required = false) String adminNotes,
                                                  @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Issue> existingIssue = issueRepository.findById(id);
            if (existingIssue.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Issue issue = existingIssue.get();
            
            // Check if owner has permission to update this issue
            if (!issue.getUnit().getBuilding().getOwner().getEmail().equals(email)) {
                return ResponseEntity.status(403).build();
            }

            issue.setStatus(status);
            if (adminNotes != null) {
                issue.setAdminNotes(adminNotes);
            }

            // Set resolved date if status is resolved or closed
            if (status == IssueStatus.RESOLVED || status == IssueStatus.CLOSED) {
                issue.setResolvedAt(java.time.LocalDateTime.now());
            }

            Issue updatedIssue = issueRepository.save(issue);
            return ResponseEntity.ok(updatedIssue);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Assign issue to a user (owner only)
    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Issue> assignIssue(@PathVariable Long id,
                                            @RequestParam Long assignedToId,
                                            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Issue> existingIssue = issueRepository.findById(id);
            if (existingIssue.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Issue issue = existingIssue.get();
            
            // Check if owner has permission to update this issue
            if (!issue.getUnit().getBuilding().getOwner().getEmail().equals(email)) {
                return ResponseEntity.status(403).build();
            }

            // Check if assigned user exists
            if (!userRepository.existsById(assignedToId)) {
                return ResponseEntity.badRequest().build();
            }

            User assignedUser = userRepository.findById(assignedToId).get();
            issue.setAssignedTo(assignedUser);
            issue.setStatus(IssueStatus.IN_PROGRESS);

            Issue updatedIssue = issueRepository.save(issue);
            return ResponseEntity.ok(updatedIssue);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update issue details (tenant can update their own issues if still open)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<Issue> updateIssue(@PathVariable Long id,
                                            @Valid @RequestBody Issue issueDetails,
                                            @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Issue> existingIssue = issueRepository.findById(id);
            if (existingIssue.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Issue issue = existingIssue.get();
            
            // Check if tenant owns this issue
            if (!issue.getTenant().getEmail().equals(email)) {
                return ResponseEntity.status(403).build();
            }

            // Only allow updates if issue is still open
            if (issue.getStatus() != IssueStatus.OPEN) {
                return ResponseEntity.badRequest().build();
            }

            // Update allowed fields
            issue.setTitle(issueDetails.getTitle());
            issue.setDescription(issueDetails.getDescription());
            issue.setCategory(issueDetails.getCategory());
            issue.setPriority(issueDetails.getPriority());
            issue.setLocationInUnit(issueDetails.getLocationInUnit());

            Issue updatedIssue = issueRepository.save(issue);
            return ResponseEntity.ok(updatedIssue);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get issues by status
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<Issue>> getIssuesByStatus(@PathVariable IssueStatus status,
                                                        @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            List<Issue> issues = issueRepository.findByStatusAndUnitBuildingOwnerEmailOrderByCreatedAtDesc(status, email);
            return ResponseEntity.ok(issues);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get emergency/urgent issues
    @GetMapping("/urgent")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<Issue>> getUrgentIssues(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            List<Issue> issues = issueRepository.findUrgentIssuesByOwnerEmail(email);
            return ResponseEntity.ok(issues);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
