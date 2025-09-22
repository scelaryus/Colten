package com.example.Colten.model;

/**
 * PaymentMethod enum to track how payments are made
 */
public enum PaymentMethod {
    CREDIT_CARD("Credit Card"),
    DEBIT_CARD("Debit Card"),
    BANK_TRANSFER("Bank Transfer"),
    ACH("ACH Transfer"),
    CHECK("Check"),
    CASH("Cash"),
    MONEY_ORDER("Money Order"),
    PAYPAL("PayPal"),
    VENMO("Venmo"),
    ZELLE("Zelle"),
    OTHER("Other");
    
    private final String displayName;
    
    PaymentMethod(String displayName) {
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
     * Check if the payment method is electronic
     */
    public boolean isElectronic() {
        return this != CHECK && this != CASH && this != MONEY_ORDER;
    }
}
