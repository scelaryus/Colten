package com.example.Colten.model;

/**
 * IssueCategory enum to categorize different types of maintenance and service issues
 */
public enum IssueCategory {
    PLUMBING("Plumbing"),
    ELECTRICAL("Electrical"),
    HEATING_COOLING("Heating & Cooling"),
    APPLIANCES("Appliances"),
    PEST_CONTROL("Pest Control"),
    STRUCTURAL("Structural"),
    SAFETY_SECURITY("Safety & Security"),
    CLEANING("Cleaning"),
    NOISE_COMPLAINT("Noise Complaint"),
    WATER_DAMAGE("Water Damage"),
    LOCKS_KEYS("Locks & Keys"),
    WINDOWS_DOORS("Windows & Doors"),
    LIGHTING("Lighting"),
    INTERNET_CABLE("Internet & Cable"),
    PARKING("Parking"),
    GARBAGE_RECYCLING("Garbage & Recycling"),
    LANDSCAPING("Landscaping"),
    OTHER("Other");
    
    private final String displayName;
    
    IssueCategory(String displayName) {
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
