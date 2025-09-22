package com.example.Colten.model;

/**
 * IssuePriority enum to prioritize issues based on urgency and importance
 */
public enum IssuePriority {
    LOW("Low"),
    MEDIUM("Medium"),
    HIGH("High"),
    URGENT("Urgent"),
    EMERGENCY("Emergency");
    
    private final String displayName;
    
    IssuePriority(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
    
    /**
     * Get priority level as integer for sorting
     */
    public int getLevel() {
        return switch (this) {
            case LOW -> 1;
            case MEDIUM -> 2;
            case HIGH -> 3;
            case URGENT -> 4;
            case EMERGENCY -> 5;
        };
    }
}
