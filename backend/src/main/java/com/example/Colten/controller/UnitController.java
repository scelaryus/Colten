package com.example.Colten.controller;

import com.example.Colten.dto.UnitDTO;
import com.example.Colten.dto.UnitCreateRequest;
import com.example.Colten.dto.UnitDTO;
import com.example.Colten.model.Building;
import com.example.Colten.model.Owner;
import com.example.Colten.model.Unit;
import com.example.Colten.repository.BuildingRepository;
import com.example.Colten.repository.OwnerRepository;
import com.example.Colten.repository.UnitRepository;
import com.example.Colten.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/units")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UnitController {

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private static final String ROOM_CODE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int ROOM_CODE_LENGTH = 8;
    private final SecureRandom random = new SecureRandom();

    // Get all units for a specific building
    @GetMapping("/building/{buildingId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<UnitDTO>> getBuildingUnits(@PathVariable Long buildingId, 
                                                      @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Owner> owner = ownerRepository.findByEmail(email);
            if (owner.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Optional<Building> building = buildingRepository.findById(buildingId);
            if (building.isEmpty() || !building.get().getOwner().getId().equals(owner.get().getId())) {
                return ResponseEntity.notFound().build();
            }

            List<Unit> units = unitRepository.findByBuildingIdOrderByUnitNumberAsc(buildingId);
            List<UnitDTO> unitDTOs = units.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(unitDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get all units for the authenticated owner
    @GetMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<UnitDTO>> getOwnerUnits(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Owner> owner = ownerRepository.findByEmail(email);
            if (owner.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            List<Unit> units = unitRepository.findByBuildingOwnerId(owner.get().getId());
            List<UnitDTO> unitDTOs = units.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(unitDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get a specific unit by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<UnitDTO> getUnitById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Owner> owner = ownerRepository.findByEmail(email);
            if (owner.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Optional<Unit> unit = unitRepository.findById(id);
            if (unit.isEmpty() || !unit.get().getBuilding().getOwner().getId().equals(owner.get().getId())) {
                return ResponseEntity.notFound().build();
            }

            UnitDTO unitDTO = convertToDTO(unit.get());
            return ResponseEntity.ok(unitDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Create a new unit
    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<UnitDTO> createUnit(@Valid @RequestBody UnitCreateRequest unitRequest, 
                                          @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Owner> owner = ownerRepository.findByEmail(email);
            if (owner.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Verify the building belongs to the owner
            Optional<Building> building = buildingRepository.findById(unitRequest.getBuildingId());
            if (building.isEmpty() || !building.get().getOwner().getId().equals(owner.get().getId())) {
                return ResponseEntity.notFound().build();
            }

            // Create new Unit entity from request
            Unit unit = new Unit();
            unit.setUnitNumber(unitRequest.getUnitNumber());
            unit.setFloor(unitRequest.getFloor());
            unit.setBedrooms(unitRequest.getBedrooms());
            unit.setBathrooms(unitRequest.getBathrooms());
            unit.setSquareFeet(unitRequest.getSquareFeet());
            unit.setMonthlyRent(unitRequest.getMonthlyRent());
            unit.setSecurityDeposit(unitRequest.getSecurityDeposit());
            unit.setDescription(unitRequest.getDescription());
            unit.setUnitType(unitRequest.getUnitType());
            unit.setHasBalcony(unitRequest.getHasBalcony());
            unit.setHasDishwasher(unitRequest.getHasDishwasher());
            unit.setHasWashingMachine(unitRequest.getHasWashingMachine());
            unit.setHasAirConditioning(unitRequest.getHasAirConditioning());
            unit.setFurnished(unitRequest.getFurnished());
            unit.setPetsAllowed(unitRequest.getPetsAllowed());
            unit.setSmokingAllowed(unitRequest.getSmokingAllowed());
            unit.setIsAvailable(unitRequest.getIsAvailable());
            unit.setLeaseStartDate(unitRequest.getLeaseStartDate());
            unit.setLeaseEndDate(unitRequest.getLeaseEndDate());

            // Generate unique room code
            String roomCode = generateUniqueRoomCode();
            unit.setRoomCode(roomCode);
            unit.setBuilding(building.get());

            Unit savedUnit = unitRepository.save(unit);
            UnitDTO unitDTO = convertToDTO(savedUnit);
            return ResponseEntity.ok(unitDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update an existing unit
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<UnitDTO> updateUnit(@PathVariable Long id, 
                                          @Valid @RequestBody Unit unitDetails,
                                          @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Owner> owner = ownerRepository.findByEmail(email);
            if (owner.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Optional<Unit> existingUnit = unitRepository.findById(id);
            if (existingUnit.isEmpty() || !existingUnit.get().getBuilding().getOwner().getId().equals(owner.get().getId())) {
                return ResponseEntity.notFound().build();
            }

            Unit unit = existingUnit.get();
            unit.setUnitNumber(unitDetails.getUnitNumber());
            unit.setFloor(unitDetails.getFloor());
            unit.setBedrooms(unitDetails.getBedrooms());
            unit.setBathrooms(unitDetails.getBathrooms());
            unit.setSquareFeet(unitDetails.getSquareFeet());
            unit.setMonthlyRent(unitDetails.getMonthlyRent());
            unit.setSecurityDeposit(unitDetails.getSecurityDeposit());
            unit.setUnitType(unitDetails.getUnitType());
            unit.setDescription(unitDetails.getDescription());
            unit.setIsAvailable(unitDetails.getIsAvailable());
            unit.setFurnished(unitDetails.getFurnished());
            unit.setPetsAllowed(unitDetails.getPetsAllowed());
            unit.setSmokingAllowed(unitDetails.getSmokingAllowed());
            unit.setHasAirConditioning(unitDetails.getHasAirConditioning());
            unit.setHasWashingMachine(unitDetails.getHasWashingMachine());
            unit.setHasDishwasher(unitDetails.getHasDishwasher());
            unit.setHasBalcony(unitDetails.getHasBalcony());
            unit.setLeaseStartDate(unitDetails.getLeaseStartDate());
            unit.setLeaseEndDate(unitDetails.getLeaseEndDate());

            Unit updatedUnit = unitRepository.save(unit);
            UnitDTO unitDTO = convertToDTO(updatedUnit);
            return ResponseEntity.ok(unitDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Delete a unit
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> deleteUnit(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Owner> owner = ownerRepository.findByEmail(email);
            if (owner.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Optional<Unit> unit = unitRepository.findById(id);
            if (unit.isEmpty() || !unit.get().getBuilding().getOwner().getId().equals(owner.get().getId())) {
                return ResponseEntity.notFound().build();
            }

            unitRepository.delete(unit.get());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Regenerate room code for a unit
    @PostMapping("/{id}/regenerate-room-code")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<UnitDTO> regenerateRoomCode(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Owner> owner = ownerRepository.findByEmail(email);
            if (owner.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Optional<Unit> existingUnit = unitRepository.findById(id);
            if (existingUnit.isEmpty() || !existingUnit.get().getBuilding().getOwner().getId().equals(owner.get().getId())) {
                return ResponseEntity.notFound().build();
            }

            Unit unit = existingUnit.get();
            String newRoomCode = generateUniqueRoomCode();
            unit.setRoomCode(newRoomCode);

            Unit updatedUnit = unitRepository.save(unit);
            UnitDTO unitDTO = convertToDTO(updatedUnit);
            return ResponseEntity.ok(unitDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get available units for a building
    @GetMapping("/building/{buildingId}/available")
    public ResponseEntity<List<Unit>> getAvailableUnits(@PathVariable Long buildingId) {
        try {
            List<Unit> availableUnits = unitRepository.findByBuildingIdAndIsAvailableOrderByMonthlyRentAsc(buildingId, true);
            return ResponseEntity.ok(availableUnits);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private String generateUniqueRoomCode() {
        String roomCode;
        do {
            StringBuilder sb = new StringBuilder(ROOM_CODE_LENGTH);
            for (int i = 0; i < ROOM_CODE_LENGTH; i++) {
                sb.append(ROOM_CODE_CHARACTERS.charAt(random.nextInt(ROOM_CODE_CHARACTERS.length())));
            }
            roomCode = sb.toString();
        } while (unitRepository.existsByRoomCode(roomCode));
        
        return roomCode;
    }

    private UnitDTO convertToDTO(Unit unit) {
        UnitDTO dto = new UnitDTO();
        dto.setId(unit.getId());
        dto.setUnitNumber(unit.getUnitNumber());
        dto.setFloor(unit.getFloor());
        dto.setBedrooms(unit.getBedrooms());
        dto.setBathrooms(unit.getBathrooms());
        dto.setSquareFeet(unit.getSquareFeet());
        dto.setMonthlyRent(unit.getMonthlyRent());
        dto.setSecurityDeposit(unit.getSecurityDeposit());
        dto.setDescription(unit.getDescription());
        dto.setUnitType(unit.getUnitType());
        dto.setHasBalcony(unit.getHasBalcony());
        dto.setHasDishwasher(unit.getHasDishwasher());
        dto.setHasWashingMachine(unit.getHasWashingMachine());
        dto.setHasAirConditioning(unit.getHasAirConditioning());
        dto.setFurnished(unit.getFurnished());
        dto.setPetsAllowed(unit.getPetsAllowed());
        dto.setSmokingAllowed(unit.getSmokingAllowed());
        dto.setIsAvailable(unit.getIsAvailable());
        dto.setRoomCode(unit.getRoomCode());
        dto.setLeaseStartDate(unit.getLeaseStartDate());
        dto.setLeaseEndDate(unit.getLeaseEndDate());
        dto.setCreatedAt(unit.getCreatedAt());
        dto.setUpdatedAt(unit.getUpdatedAt());
        
        // Building information
        if (unit.getBuilding() != null) {
            dto.setBuildingId(unit.getBuilding().getId());
            dto.setBuildingName(unit.getBuilding().getName());
        }
        
        return dto;
    }
}
