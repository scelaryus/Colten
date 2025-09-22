package com.example.Colten.model;

/**
 * IssueStatus enum to track the status of reported issues
 */
public enum IssueStatus {
    OPEN("Open"),
    IN_PROGRESS("In Progress"),
    PENDING_PARTS("Pending Parts"),
    PENDING_APPROVAL("Pending Approval"),
    SCHEDULED("Scheduled"),
    RESOLVED("Resolved"),
    CLOSED("Closed"),
    CANCELLED("Cancelled"),
    DUPLICATE("Duplicate");
    
    private final String displayName;
    
    IssueStatus(String displayName) {
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
     * Check if the status indicates the issue is completed
     */
    public boolean isCompleted() {
        return this == RESOLVED || this == CLOSED || this == CANCELLED;
    }
    
    /**
     * Check if the status indicates the issue is active/in progress
     */
    public boolean isActive() {
        return this == OPEN || this == IN_PROGRESS || this == SCHEDULED;
    }
}
