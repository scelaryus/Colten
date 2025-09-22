package com.example.Colten.model;

/**
 * BackgroundCheckStatus enum to track the status of tenant background checks
 */
public enum BackgroundCheckStatus {
    PENDING("Pending"),
    IN_PROGRESS("In Progress"),
    APPROVED("Approved"),
    REJECTED("Rejected"),
    EXPIRED("Expired"),
    NOT_REQUIRED("Not Required");
    
    private final String displayName;
    
    BackgroundCheckStatus(String displayName) {
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
