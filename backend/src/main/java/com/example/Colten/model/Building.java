package com.example.Colten.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "buildings")
public class Building {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Building name is required")
    @Size(max = 100)
    @Column(name = "name", nullable = false)
    private String name;
    
    @NotBlank(message = "Address is required")
    @Size(max = 200)
    @Column(name = "address", nullable = false)
    private String address;
    
    @Size(max = 100)
    @Column(name = "city")
    private String city;
    
    @Size(max = 100)
    @Column(name = "state")
    private String state;
    
    @Size(max = 20)
    @Column(name = "zip_code")
    private String zipCode;
    
    @Size(max = 100)
    @Column(name = "country")
    private String country = "USA";
    
    @Size(max = 500)
    @Column(name = "description")
    private String description;
    
    @NotNull(message = "Number of floors is required")
    @Positive(message = "Number of floors must be positive")
    @Column(name = "floors", nullable = false)
    private Integer floors;
    
    @Column(name = "year_built")
    private Integer yearBuilt;
    
    @Column(name = "parking_spaces")
    private Integer parkingSpaces;
    
    @Column(name = "has_elevator")
    private Boolean hasElevator = false;
    
    @Column(name = "has_laundry")
    private Boolean hasLaundry = false;
    
    @Column(name = "has_gym")
    private Boolean hasGym = false;
    
    @Column(name = "has_pool")
    private Boolean hasPool = false;
    
    @Column(name = "pet_friendly")
    private Boolean petFriendly = false;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnore
    private Owner owner;
    
    @OneToMany(mappedBy = "building", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Unit> units = new ArrayList<>();
    
    // Constructors
    public Building() {}
    
    public Building(String name, String address, Integer floors, Owner owner) {
        this.name = name;
        this.address = address;
        this.floors = floors;
        this.owner = owner;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getZipCode() {
        return zipCode;
    }
    
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getFloors() {
        return floors;
    }
    
    public void setFloors(Integer floors) {
        this.floors = floors;
    }
    
    public Integer getYearBuilt() {
        return yearBuilt;
    }
    
    public void setYearBuilt(Integer yearBuilt) {
        this.yearBuilt = yearBuilt;
    }
    
    public Integer getParkingSpaces() {
        return parkingSpaces;
    }
    
    public void setParkingSpaces(Integer parkingSpaces) {
        this.parkingSpaces = parkingSpaces;
    }
    
    public Boolean getHasElevator() {
        return hasElevator;
    }
    
    public void setHasElevator(Boolean hasElevator) {
        this.hasElevator = hasElevator;
    }
    
    public Boolean getHasLaundry() {
        return hasLaundry;
    }
    
    public void setHasLaundry(Boolean hasLaundry) {
        this.hasLaundry = hasLaundry;
    }
    
    public Boolean getHasGym() {
        return hasGym;
    }
    
    public void setHasGym(Boolean hasGym) {
        this.hasGym = hasGym;
    }
    
    public Boolean getHasPool() {
        return hasPool;
    }
    
    public void setHasPool(Boolean hasPool) {
        this.hasPool = hasPool;
    }
    
    public Boolean getPetFriendly() {
        return petFriendly;
    }
    
    public void setPetFriendly(Boolean petFriendly) {
        this.petFriendly = petFriendly;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Owner getOwner() {
        return owner;
    }
    
    public void setOwner(Owner owner) {
        this.owner = owner;
    }
    
    public List<Unit> getUnits() {
        return units;
    }
    
    public void setUnits(List<Unit> units) {
        this.units = units;
    }
    
    // Utility methods
    public void addUnit(Unit unit) {
        units.add(unit);
        unit.setBuilding(this);
    }
    
    public void removeUnit(Unit unit) {
        units.remove(unit);
        unit.setBuilding(null);
    }
    
    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        sb.append(address);
        if (city != null && !city.isEmpty()) {
            sb.append(", ").append(city);
        }
        if (state != null && !state.isEmpty()) {
            sb.append(", ").append(state);
        }
        if (zipCode != null && !zipCode.isEmpty()) {
            sb.append(" ").append(zipCode);
        }
        return sb.toString();
    }
    
    public int getTotalUnits() {
        return units.size();
    }
    
    public long getOccupiedUnits() {
        return units.stream()
                .filter(unit -> unit.getTenant() != null)
                .count();
    }
    
    public long getVacantUnits() {
        return getTotalUnits() - getOccupiedUnits();
    }
    
    // Update timestamp before updating
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
