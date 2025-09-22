package com.example.Colten.controller;

import com.example.Colten.model.Building;
import com.example.Colten.model.Owner;
import com.example.Colten.repository.BuildingRepository;
import com.example.Colten.repository.OwnerRepository;
import com.example.Colten.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import com.example.Colten.dto.BuildingDTO;
import com.example.Colten.dto.UnitDTO;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/buildings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BuildingController {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private JwtUtils jwtUtils;

    // Get all buildings for the authenticated owner
    @GetMapping
    @PreAuthorize("hasRole('OWNER')")
        public ResponseEntity<List<BuildingDTO>> getOwnerBuildings(@RequestHeader("Authorization") String token) {
            try {
                String jwt = token.substring(7);
                String email = jwtUtils.getUserNameFromJwtToken(jwt);

                Optional<Owner> owner = ownerRepository.findByEmail(email);
                if (owner.isEmpty()) {
                    return ResponseEntity.notFound().build();
                }

                List<Building> buildings = buildingRepository.findByOwnerId(owner.get().getId());
                List<BuildingDTO> buildingDTOs = buildings.stream().map(b -> {
                    List<UnitDTO> unitDTOs = b.getUnits().stream()
                        .map(u -> new UnitDTO(u.getId(), u.getUnitNumber(), b.getId()))
                        .collect(Collectors.toList());
                    return new BuildingDTO(b.getId(), b.getName(), unitDTOs);
                }).collect(Collectors.toList());
                return ResponseEntity.ok(buildingDTOs);
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
            }
        }

    // Get a specific building by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
        public ResponseEntity<BuildingDTO> getBuildingById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
            try {
                String jwt = token.substring(7);
                String email = jwtUtils.getUserNameFromJwtToken(jwt);

                Optional<Owner> owner = ownerRepository.findByEmail(email);
                if (owner.isEmpty()) {
                    return ResponseEntity.notFound().build();
                }

                Optional<Building> building = buildingRepository.findById(id);
                if (building.isEmpty() || !building.get().getOwner().getId().equals(owner.get().getId())) {
                    return ResponseEntity.notFound().build();
                }

                Building b = building.get();
                List<UnitDTO> unitDTOs = b.getUnits().stream()
                    .map(u -> new UnitDTO(u.getId(), u.getUnitNumber(), b.getId()))
                    .collect(Collectors.toList());
                BuildingDTO dto = new BuildingDTO(b.getId(), b.getName(), unitDTOs);
                return ResponseEntity.ok(dto);
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
            }
        }

    // Create a new building
    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Building> createBuilding(@Valid @RequestBody Building building, 
                                                  @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Owner> owner = ownerRepository.findByEmail(email);
            if (owner.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            building.setOwner(owner.get());
            Building savedBuilding = buildingRepository.save(building);
            return ResponseEntity.ok(savedBuilding);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update an existing building
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Building> updateBuilding(@PathVariable Long id, 
                                                  @Valid @RequestBody Building buildingDetails,
                                                  @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Owner> owner = ownerRepository.findByEmail(email);
            if (owner.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Optional<Building> existingBuilding = buildingRepository.findById(id);
            if (existingBuilding.isEmpty() || !existingBuilding.get().getOwner().getId().equals(owner.get().getId())) {
                return ResponseEntity.notFound().build();
            }

            Building building = existingBuilding.get();
            building.setName(buildingDetails.getName());
            building.setAddress(buildingDetails.getAddress());
            building.setCity(buildingDetails.getCity());
            building.setState(buildingDetails.getState());
            building.setZipCode(buildingDetails.getZipCode());
            building.setCountry(buildingDetails.getCountry());
            building.setDescription(buildingDetails.getDescription());
            building.setFloors(buildingDetails.getFloors());
            building.setYearBuilt(buildingDetails.getYearBuilt());
            building.setParkingSpaces(buildingDetails.getParkingSpaces());
            building.setHasElevator(buildingDetails.getHasElevator());
            building.setHasGym(buildingDetails.getHasGym());
            building.setHasPool(buildingDetails.getHasPool());
            building.setHasLaundry(buildingDetails.getHasLaundry());
            building.setPetFriendly(buildingDetails.getPetFriendly());
            building.setImageUrl(buildingDetails.getImageUrl());

            Building updatedBuilding = buildingRepository.save(building);
            return ResponseEntity.ok(updatedBuilding);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Delete a building
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> deleteBuilding(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(jwt);
            
            Optional<Owner> owner = ownerRepository.findByEmail(email);
            if (owner.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Optional<Building> building = buildingRepository.findById(id);
            if (building.isEmpty() || !building.get().getOwner().getId().equals(owner.get().getId())) {
                return ResponseEntity.notFound().build();
            }

            buildingRepository.delete(building.get());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
