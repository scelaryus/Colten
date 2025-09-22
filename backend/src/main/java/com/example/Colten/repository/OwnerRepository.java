package com.example.Colten.repository;

import com.example.Colten.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
    
    Optional<Owner> findByEmail(String email);
    
    Optional<Owner> findByCompanyName(String companyName);
    
    Boolean existsByBusinessLicense(String businessLicense);
}
