package com.example.Colten.dto;

import com.example.Colten.model.UnitType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class UnitDTO {
    private Long id;
    private String unitNumber;
    private Integer floor;
    private Integer bedrooms;
    private BigDecimal bathrooms;
    private Integer squareFeet;
    private BigDecimal monthlyRent;
    private BigDecimal securityDeposit;
    private String description;
    private UnitType unitType;
    private Boolean hasBalcony;
    private Boolean hasDishwasher;
    private Boolean hasWashingMachine;
    private Boolean hasAirConditioning;
    private Boolean furnished;
    private Boolean petsAllowed;
    private Boolean smokingAllowed;
    private Boolean isAvailable;
    private String roomCode;
    private LocalDateTime leaseStartDate;
    private LocalDateTime leaseEndDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long buildingId;
    private String buildingName;

    public UnitDTO() {}

    public UnitDTO(Long id, String unitNumber, Long buildingId) {
        this.id = id;
        this.unitNumber = unitNumber;
        this.buildingId = buildingId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUnitNumber() { return unitNumber; }
    public void setUnitNumber(String unitNumber) { this.unitNumber = unitNumber; }

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }

    public Integer getBedrooms() { return bedrooms; }
    public void setBedrooms(Integer bedrooms) { this.bedrooms = bedrooms; }

    public BigDecimal getBathrooms() { return bathrooms; }
    public void setBathrooms(BigDecimal bathrooms) { this.bathrooms = bathrooms; }

    public Integer getSquareFeet() { return squareFeet; }
    public void setSquareFeet(Integer squareFeet) { this.squareFeet = squareFeet; }

    public BigDecimal getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(BigDecimal monthlyRent) { this.monthlyRent = monthlyRent; }

    public BigDecimal getSecurityDeposit() { return securityDeposit; }
    public void setSecurityDeposit(BigDecimal securityDeposit) { this.securityDeposit = securityDeposit; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public UnitType getUnitType() { return unitType; }
    public void setUnitType(UnitType unitType) { this.unitType = unitType; }

    public Boolean getHasBalcony() { return hasBalcony; }
    public void setHasBalcony(Boolean hasBalcony) { this.hasBalcony = hasBalcony; }

    public Boolean getHasDishwasher() { return hasDishwasher; }
    public void setHasDishwasher(Boolean hasDishwasher) { this.hasDishwasher = hasDishwasher; }

    public Boolean getHasWashingMachine() { return hasWashingMachine; }
    public void setHasWashingMachine(Boolean hasWashingMachine) { this.hasWashingMachine = hasWashingMachine; }

    public Boolean getHasAirConditioning() { return hasAirConditioning; }
    public void setHasAirConditioning(Boolean hasAirConditioning) { this.hasAirConditioning = hasAirConditioning; }

    public Boolean getFurnished() { return furnished; }
    public void setFurnished(Boolean furnished) { this.furnished = furnished; }

    public Boolean getPetsAllowed() { return petsAllowed; }
    public void setPetsAllowed(Boolean petsAllowed) { this.petsAllowed = petsAllowed; }

    public Boolean getSmokingAllowed() { return smokingAllowed; }
    public void setSmokingAllowed(Boolean smokingAllowed) { this.smokingAllowed = smokingAllowed; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    public LocalDateTime getLeaseStartDate() { return leaseStartDate; }
    public void setLeaseStartDate(LocalDateTime leaseStartDate) { this.leaseStartDate = leaseStartDate; }

    public LocalDateTime getLeaseEndDate() { return leaseEndDate; }
    public void setLeaseEndDate(LocalDateTime leaseEndDate) { this.leaseEndDate = leaseEndDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }

    public String getBuildingName() { return buildingName; }
    public void setBuildingName(String buildingName) { this.buildingName = buildingName; }
}
