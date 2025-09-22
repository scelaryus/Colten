package com.example.Colten.dto;

import com.example.Colten.model.PaymentMethod;
import com.example.Colten.model.PaymentType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentRequest {
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    @NotNull(message = "Payment type is required")
    private PaymentType paymentType;
    
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    // For manual payments by owners
    private Long tenantId;
    private Long unitId;
    
    // For Stripe payments
    private String stripeToken;
    private String stripePaymentMethodId;
    
    // Due date for rent payments
    private LocalDateTime dueDate;
    
    // Payment period (for rent)
    private LocalDateTime paymentPeriodStart;
    private LocalDateTime paymentPeriodEnd;
    
    // Constructors
    public PaymentRequest() {}
    
    public PaymentRequest(BigDecimal amount, PaymentType paymentType, PaymentMethod paymentMethod) {
        this.amount = amount;
        this.paymentType = paymentType;
        this.paymentMethod = paymentMethod;
    }
    
    // Getters and Setters
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public PaymentType getPaymentType() {
        return paymentType;
    }
    
    public void setPaymentType(PaymentType paymentType) {
        this.paymentType = paymentType;
    }
    
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Long getTenantId() {
        return tenantId;
    }
    
    public void setTenantId(Long tenantId) {
        this.tenantId = tenantId;
    }
    
    public Long getUnitId() {
        return unitId;
    }
    
    public void setUnitId(Long unitId) {
        this.unitId = unitId;
    }
    
    public String getStripeToken() {
        return stripeToken;
    }
    
    public void setStripeToken(String stripeToken) {
        this.stripeToken = stripeToken;
    }
    
    public String getStripePaymentMethodId() {
        return stripePaymentMethodId;
    }
    
    public void setStripePaymentMethodId(String stripePaymentMethodId) {
        this.stripePaymentMethodId = stripePaymentMethodId;
    }
    
    public LocalDateTime getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
    
    public LocalDateTime getPaymentPeriodStart() {
        return paymentPeriodStart;
    }
    
    public void setPaymentPeriodStart(LocalDateTime paymentPeriodStart) {
        this.paymentPeriodStart = paymentPeriodStart;
    }
    
    public LocalDateTime getPaymentPeriodEnd() {
        return paymentPeriodEnd;
    }
    
    public void setPaymentPeriodEnd(LocalDateTime paymentPeriodEnd) {
        this.paymentPeriodEnd = paymentPeriodEnd;
    }
}
