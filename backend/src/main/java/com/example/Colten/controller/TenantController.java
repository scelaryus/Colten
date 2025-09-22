package com.example.Colten.controller;

import com.example.Colten.dto.AuthResponse;
import com.example.Colten.dto.RoomCodeRequest;
import com.example.Colten.dto.TenantRegistrationRequest;
import com.example.Colten.model.Role;
import com.example.Colten.model.Tenant;
import com.example.Colten.model.Unit;
import com.example.Colten.model.User;
import com.example.Colten.repository.TenantRepository;
import com.example.Colten.repository.UnitRepository;
import com.example.Colten.repository.UserRepository;
import com.example.Colten.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tenants")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TenantController {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    // Validate room code
    @PostMapping("/validate-room-code")
    public ResponseEntity<?> validateRoomCode(@Valid @RequestBody RoomCodeRequest request) {
        try {
            Optional<Unit> unit = unitRepository.findByRoomCode(request.getRoomCode());
            
            if (unit.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse("Error: Invalid room code!"));
            }

            if (!unit.get().getIsAvailable()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse("Error: This unit is not available!"));
            }

            // Return unit information for tenant registration
            return ResponseEntity.ok(unit.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse("Error: Could not validate room code!"));
        }
    }

    // Register tenant with room code
    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> registerTenant(@Valid @RequestBody TenantRegistrationRequest request) {
        try {
            // Validate room code first
            Optional<Unit> unit = unitRepository.findByRoomCode(request.getRoomCode());
            
            if (unit.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse("Error: Invalid room code!"));
            }

            if (!unit.get().getIsAvailable()) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse("Error: This unit is not available!"));
            }

            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse("Error: Email is already in use!"));
            }

            // Create tenant directly (it extends User, so no need to create User separately)
            Tenant tenant = new Tenant(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                encoder.encode(request.getPassword())
            );

            if (request.getPhone() != null) {
                tenant.setPhone(request.getPhone());
            }

            tenant.setIsActive(true);
            tenant.setEmailVerified(false);
            tenant.setUnit(unit.get());
            
            if (request.getDateOfBirth() != null) {
                tenant.setDateOfBirth(request.getDateOfBirth().atStartOfDay());
            }
            tenant.setEmployer(request.getEmployer());
            tenant.setJobTitle(request.getJobTitle());
            tenant.setMonthlyIncome(request.getMonthlyIncome());
            tenant.setEmergencyContactName(request.getEmergencyContactName());
            tenant.setEmergencyContactPhone(request.getEmergencyContactPhone());
            tenant.setNumberOfOccupants(request.getNumberOfOccupants());
            tenant.setHasPets(request.getHasPets());
            tenant.setPetDescription(request.getPetDescription());
            tenant.setSmoker(request.getSmoker());
            
            if (request.getLeaseStartDate() != null) {
                tenant.setLeaseStartDate(request.getLeaseStartDate().atStartOfDay());
            }
            if (request.getLeaseEndDate() != null) {
                tenant.setLeaseEndDate(request.getLeaseEndDate().atStartOfDay());
            }
            if (request.getMoveInDate() != null) {
                tenant.setMoveInDate(request.getMoveInDate().atStartOfDay());
            }

            Tenant savedTenant = tenantRepository.save(tenant);

            // Mark unit as unavailable
            Unit unitToUpdate = unit.get();
            unitToUpdate.setIsAvailable(false);
            if (request.getLeaseStartDate() != null) {
                unitToUpdate.setLeaseStartDate(request.getLeaseStartDate().atStartOfDay());
            }
            if (request.getLeaseEndDate() != null) {
                unitToUpdate.setLeaseEndDate(request.getLeaseEndDate().atStartOfDay());
            }
            unitRepository.save(unitToUpdate);

            // Generate JWT token for immediate login
            String jwt = jwtUtils.generateTokenFromUsername(savedTenant.getEmail());

            AuthResponse response = new AuthResponse(
                jwt,
                savedTenant.getId(),
                savedTenant.getEmail(),
                savedTenant.getFirstName(),
                savedTenant.getLastName(),
                savedTenant.getRole()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthResponse("Error: Could not register tenant. " + e.getMessage()));
        }
    }

    // Get all tenants for owner
    @GetMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<Tenant>> getOwnerTenants(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            List<Tenant> tenants = tenantRepository.findByUnitBuildingOwnerEmail(email);
            return ResponseEntity.ok(tenants);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get tenants for a specific building
    @GetMapping("/building/{buildingId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<Tenant>> getBuildingTenants(@PathVariable Long buildingId,
                                                          @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            List<Tenant> tenants = tenantRepository.findByUnitBuildingIdAndUnitBuildingOwnerEmail(buildingId, email);
            return ResponseEntity.ok(tenants);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get tenant details
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('OWNER') or hasRole('TENANT')")
    public ResponseEntity<Tenant> getTenantById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Tenant> tenant = tenantRepository.findById(id);
            if (tenant.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Check if user has permission to view this tenant
            if (!tenant.get().getEmail().equals(email) && 
                !tenant.get().getUnit().getBuilding().getOwner().getEmail().equals(email)) {
                return ResponseEntity.status(403).build();
            }

            return ResponseEntity.ok(tenant.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update tenant information
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<Tenant> updateTenant(@PathVariable Long id,
                                              @Valid @RequestBody Tenant tenantDetails,
                                              @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Tenant> existingTenant = tenantRepository.findById(id);
            if (existingTenant.isEmpty() || !existingTenant.get().getEmail().equals(email)) {
                return ResponseEntity.notFound().build();
            }

            Tenant tenant = existingTenant.get();
            tenant.setDateOfBirth(tenantDetails.getDateOfBirth());
            tenant.setEmployer(tenantDetails.getEmployer());
            tenant.setJobTitle(tenantDetails.getJobTitle());
            tenant.setMonthlyIncome(tenantDetails.getMonthlyIncome());
            tenant.setEmergencyContactName(tenantDetails.getEmergencyContactName());
            tenant.setEmergencyContactPhone(tenantDetails.getEmergencyContactPhone());
            tenant.setNumberOfOccupants(tenantDetails.getNumberOfOccupants());
            tenant.setHasPets(tenantDetails.getHasPets());
            tenant.setPetDescription(tenantDetails.getPetDescription());
            tenant.setSmoker(tenantDetails.getSmoker());

            Tenant updatedTenant = tenantRepository.save(tenant);
            return ResponseEntity.ok(updatedTenant);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get current tenant profile
    @GetMapping("/profile")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<Tenant> getCurrentTenantProfile(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Tenant> tenant = tenantRepository.findByUserEmail(email);
            if (tenant.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(tenant.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
