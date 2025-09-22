package com.example.Colten.model;

/**
 * UnitType enum to define different types of rental units
 */
public enum UnitType {
    STUDIO("Studio"),
    APARTMENT("Apartment"),
    TOWNHOUSE("Townhouse"),
    CONDO("Condominium"),
    LOFT("Loft"),
    PENTHOUSE("Penthouse"),
    DUPLEX("Duplex"),
    SINGLE_FAMILY("Single Family Home");
    
    private final String displayName;
    
    UnitType(String displayName) {
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
