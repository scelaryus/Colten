package com.example.Colten.model;

/**
 * Role enum to define user types in the Colten tenant management system
 */
public enum Role {
    OWNER("Building Owner"),
    TENANT("Tenant"),
    ADMIN("System Administrator");
    
    private final String displayName;
    
    Role(String displayName) {
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
