package com.example.Colten.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "units")
public class Unit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Unit number is required")
    @Size(max = 20)
    @Column(name = "unit_number", nullable = false)
    private String unitNumber;
    
    @NotNull(message = "Floor number is required")
    @Positive(message = "Floor number must be positive")
    @Column(name = "floor", nullable = false)
    private Integer floor;
    
    @NotNull(message = "Number of bedrooms is required")
    @Column(name = "bedrooms", nullable = false)
    private Integer bedrooms;
    
    @NotNull(message = "Number of bathrooms is required")
    @DecimalMin(value = "0.5", message = "Bathrooms must be at least 0.5")
    @Column(name = "bathrooms", nullable = false, precision = 3, scale = 1)
    private BigDecimal bathrooms;
    
    @NotNull(message = "Square footage is required")
    @Positive(message = "Square footage must be positive")
    @Column(name = "square_feet", nullable = false)
    private Integer squareFeet;
    
    @NotNull(message = "Monthly rent is required")
    @DecimalMin(value = "0.0", message = "Rent must be non-negative")
    @Column(name = "monthly_rent", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyRent;
    
    @Column(name = "security_deposit", precision = 10, scale = 2)
    private BigDecimal securityDeposit;
    
    @Size(max = 500)
    @Column(name = "description")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "unit_type")
    private UnitType unitType = UnitType.APARTMENT;
    
    @Column(name = "has_balcony")
    private Boolean hasBalcony = false;
    
    @Column(name = "has_dishwasher")
    private Boolean hasDishwasher = false;
    
    @Column(name = "has_washing_machine")
    private Boolean hasWashingMachine = false;
    
    @Column(name = "has_air_conditioning")
    private Boolean hasAirConditioning = false;
    
    @Column(name = "furnished")
    private Boolean furnished = false;
    
    @Column(name = "pets_allowed")
    private Boolean petsAllowed = false;
    
    @Column(name = "smoking_allowed")
    private Boolean smokingAllowed = false;
    
    @Column(name = "is_available")
    private Boolean isAvailable = true;
    
    // Unique room code for tenant access
    @Column(name = "room_code", unique = true)
    private String roomCode;
    
    @Column(name = "lease_start_date")
    private LocalDateTime leaseStartDate;
    
    @Column(name = "lease_end_date")
    private LocalDateTime leaseEndDate;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    @JsonIgnore
    private Building building;
    
    @OneToOne(mappedBy = "unit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Tenant tenant;
    
    @OneToMany(mappedBy = "unit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Issue> issues = new ArrayList<>();
    
    @OneToMany(mappedBy = "unit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Payment> payments = new ArrayList<>();
    
    // Constructors
    public Unit() {}
    
    public Unit(String unitNumber, Integer floor, Integer bedrooms, BigDecimal bathrooms, 
                Integer squareFeet, BigDecimal monthlyRent, Building building) {
        this.unitNumber = unitNumber;
        this.floor = floor;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.squareFeet = squareFeet;
        this.monthlyRent = monthlyRent;
        this.building = building;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUnitNumber() {
        return unitNumber;
    }
    
    public void setUnitNumber(String unitNumber) {
        this.unitNumber = unitNumber;
    }
    
    public Integer getFloor() {
        return floor;
    }
    
    public void setFloor(Integer floor) {
        this.floor = floor;
    }
    
    public Integer getBedrooms() {
        return bedrooms;
    }
    
    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }
    
    public BigDecimal getBathrooms() {
        return bathrooms;
    }
    
    public void setBathrooms(BigDecimal bathrooms) {
        this.bathrooms = bathrooms;
    }
    
    public Integer getSquareFeet() {
        return squareFeet;
    }
    
    public void setSquareFeet(Integer squareFeet) {
        this.squareFeet = squareFeet;
    }
    
    public BigDecimal getMonthlyRent() {
        return monthlyRent;
    }
    
    public void setMonthlyRent(BigDecimal monthlyRent) {
        this.monthlyRent = monthlyRent;
    }
    
    public BigDecimal getSecurityDeposit() {
        return securityDeposit;
    }
    
    public void setSecurityDeposit(BigDecimal securityDeposit) {
        this.securityDeposit = securityDeposit;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public UnitType getUnitType() {
        return unitType;
    }
    
    public void setUnitType(UnitType unitType) {
        this.unitType = unitType;
    }
    
    public Boolean getHasBalcony() {
        return hasBalcony;
    }
    
    public void setHasBalcony(Boolean hasBalcony) {
        this.hasBalcony = hasBalcony;
    }
    
    public Boolean getHasDishwasher() {
        return hasDishwasher;
    }
    
    public void setHasDishwasher(Boolean hasDishwasher) {
        this.hasDishwasher = hasDishwasher;
    }
    
    public Boolean getHasWashingMachine() {
        return hasWashingMachine;
    }
    
    public void setHasWashingMachine(Boolean hasWashingMachine) {
        this.hasWashingMachine = hasWashingMachine;
    }
    
    public Boolean getHasAirConditioning() {
        return hasAirConditioning;
    }
    
    public void setHasAirConditioning(Boolean hasAirConditioning) {
        this.hasAirConditioning = hasAirConditioning;
    }
    
    public Boolean getFurnished() {
        return furnished;
    }
    
    public void setFurnished(Boolean furnished) {
        this.furnished = furnished;
    }
    
    public Boolean getPetsAllowed() {
        return petsAllowed;
    }
    
    public void setPetsAllowed(Boolean petsAllowed) {
        this.petsAllowed = petsAllowed;
    }
    
    public Boolean getSmokingAllowed() {
        return smokingAllowed;
    }
    
    public void setSmokingAllowed(Boolean smokingAllowed) {
        this.smokingAllowed = smokingAllowed;
    }
    
    public Boolean getIsAvailable() {
        return isAvailable;
    }
    
    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
    
    public String getRoomCode() {
        return roomCode;
    }
    
    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }
    
    public LocalDateTime getLeaseStartDate() {
        return leaseStartDate;
    }
    
    public void setLeaseStartDate(LocalDateTime leaseStartDate) {
        this.leaseStartDate = leaseStartDate;
    }
    
    public LocalDateTime getLeaseEndDate() {
        return leaseEndDate;
    }
    
    public void setLeaseEndDate(LocalDateTime leaseEndDate) {
        this.leaseEndDate = leaseEndDate;
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
    
    public Building getBuilding() {
        return building;
    }
    
    public void setBuilding(Building building) {
        this.building = building;
    }
    
    public Tenant getTenant() {
        return tenant;
    }
    
    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }
    
    public List<Issue> getIssues() {
        return issues;
    }
    
    public void setIssues(List<Issue> issues) {
        this.issues = issues;
    }
    
    public List<Payment> getPayments() {
        return payments;
    }
    
    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }
    
    // Utility methods
    public String getUnitIdentifier() {
        return building.getName() + " - Unit " + unitNumber;
    }
    
    public String getBedroomBathroomString() {
        return bedrooms + "BR/" + bathrooms + "BA";
    }
    
    public boolean isOccupied() {
        return tenant != null;
    }
    
    public void addIssue(Issue issue) {
        issues.add(issue);
        issue.setUnit(this);
    }
    
    public void removeIssue(Issue issue) {
        issues.remove(issue);
        issue.setUnit(null);
    }
    
    public void addPayment(Payment payment) {
        payments.add(payment);
        payment.setUnit(this);
    }
    
    public void removePayment(Payment payment) {
        payments.remove(payment);
        payment.setUnit(null);
    }
    
    // Update timestamp before updating
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
