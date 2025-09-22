package com.example.Colten.dto;

import com.example.Colten.model.UnitType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class UnitCreateRequest {
    
    @NotNull(message = "Building ID is required")
    private Long buildingId;
    
    @NotBlank(message = "Unit number is required")
    @Size(max = 20)
    private String unitNumber;
    
    @NotNull(message = "Floor number is required")
    @Positive(message = "Floor number must be positive")
    private Integer floor;
    
    @NotNull(message = "Number of bedrooms is required")
    private Integer bedrooms;
    
    @NotNull(message = "Number of bathrooms is required")
    @DecimalMin(value = "0.5", message = "Bathrooms must be at least 0.5")
    private BigDecimal bathrooms;
    
    @NotNull(message = "Square footage is required")
    @Positive(message = "Square footage must be positive")
    private Integer squareFeet;
    
    @NotNull(message = "Monthly rent is required")
    @DecimalMin(value = "0.0", message = "Rent must be non-negative")
    private BigDecimal monthlyRent;
    
    private BigDecimal securityDeposit;
    
    @Size(max = 500)
    private String description;
    
    private UnitType unitType = UnitType.APARTMENT;
    
    private Boolean hasBalcony = false;
    
    private Boolean hasDishwasher = false;
    
    private Boolean hasWashingMachine = false;
    
    private Boolean hasAirConditioning = false;
    
    private Boolean furnished = false;
    
    private Boolean petsAllowed = false;
    
    private Boolean smokingAllowed = false;
    
    private Boolean isAvailable = true;
    
    private LocalDateTime leaseStartDate;
    
    private LocalDateTime leaseEndDate;
    
    // Constructors
    public UnitCreateRequest() {}
    
    // Getters and Setters
    public Long getBuildingId() {
        return buildingId;
    }
    
    public void setBuildingId(Long buildingId) {
        this.buildingId = buildingId;
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
}