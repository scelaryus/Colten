package com.example.Colten.model;

/**
 * PaymentStatus enum to track the status of payments
 */
public enum PaymentStatus {
    PENDING("Pending"),
    PROCESSING("Processing"),
    COMPLETED("Completed"),
    CONFIRMED("Confirmed"),
    FAILED("Failed"),
    CANCELLED("Cancelled"),
    REFUNDED("Refunded"),
    PARTIALLY_REFUNDED("Partially Refunded"),
    DISPUTED("Disputed"),
    CHARGEBACK("Chargeback");
    
    private final String displayName;
    
    PaymentStatus(String displayName) {
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
     * Check if the payment is successful
     */
    public boolean isSuccessful() {
        return this == COMPLETED || this == CONFIRMED;
    }
    
    /**
     * Check if the payment is still being processed
     */
    public boolean isInProgress() {
        return this == PENDING || this == PROCESSING;
    }
    
    /**
     * Check if the payment has failed or been cancelled
     */
    public boolean isFailed() {
        return this == FAILED || this == CANCELLED || this == DISPUTED || this == CHARGEBACK;
    }
}
