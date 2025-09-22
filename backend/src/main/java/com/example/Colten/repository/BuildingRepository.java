package com.example.Colten.repository;

import com.example.Colten.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {
    List<Building> findByOwnerId(Long ownerId);
    List<Building> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
    List<Building> findByNameContainingIgnoreCase(String name);
    List<Building> findByCityIgnoreCase(String city);
    List<Building> findByStateIgnoreCase(String state);
    List<Building> findByPetFriendly(boolean petFriendly);
}
