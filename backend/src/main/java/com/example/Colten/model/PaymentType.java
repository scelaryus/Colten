package com.example.Colten.model;

/**
 * PaymentType enum to categorize different types of payments
 */
public enum PaymentType {
    RENT("Monthly Rent"),
    SECURITY_DEPOSIT("Security Deposit"),
    LATE_FEE("Late Fee"),
    UTILITY("Utility Bill"),
    MAINTENANCE_FEE("Maintenance Fee"),
    PARKING_FEE("Parking Fee"),
    PET_FEE("Pet Fee"),
    APPLICATION_FEE("Application Fee"),
    CLEANING_FEE("Cleaning Fee"),
    KEY_REPLACEMENT("Key Replacement"),
    DAMAGE_FEE("Damage Fee"),
    OTHER("Other");
    
    private final String displayName;
    
    PaymentType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
}
