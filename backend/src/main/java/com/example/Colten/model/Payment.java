package com.example.Colten.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", message = "Amount must be non-negative")
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false)
    private PaymentType paymentType = PaymentType.RENT;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod = PaymentMethod.CREDIT_CARD;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;
    
    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate = LocalDateTime.now();
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @Size(max = 500)
    @Column(name = "description")
    private String description;
    
    @Size(max = 1000)
    @Column(name = "notes")
    private String notes;
    
    // Stripe payment details
    @Column(name = "stripe_payment_intent_id")
    private String stripePaymentIntentId;
    
    @Column(name = "stripe_charge_id")
    private String stripeChargeId;
    
    @Column(name = "stripe_receipt_url")
    private String stripeReceiptUrl;
    
    // Reference number for tracking
    @Column(name = "reference_number", unique = true)
    private String referenceNumber;
    
    // Late fee information
    @Column(name = "late_fee", precision = 10, scale = 2)
    private BigDecimal lateFee = BigDecimal.ZERO;
    
    @Column(name = "is_late")
    private Boolean isLate = false;
    
    // Refund information
    @Column(name = "refund_amount", precision = 10, scale = 2)
    private BigDecimal refundAmount = BigDecimal.ZERO;
    
    @Column(name = "refund_date")
    private LocalDateTime refundDate;
    
    @Size(max = 500)
    @Column(name = "refund_reason")
    private String refundReason;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    @JsonIgnore
    private Tenant tenant;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    @JsonIgnore
    private Unit unit;
    
    // For rent payments, this represents the month/year
    @Column(name = "payment_period_start")
    private LocalDateTime paymentPeriodStart;
    
    @Column(name = "payment_period_end")
    private LocalDateTime paymentPeriodEnd;
    
    // Constructors
    public Payment() {}
    
    public Payment(BigDecimal amount, PaymentType paymentType, Tenant tenant, Unit unit) {
        this.amount = amount;
        this.paymentType = paymentType;
        this.tenant = tenant;
        this.unit = unit;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public PaymentStatus getStatus() {
        return status;
    }
    
    public void setStatus(PaymentStatus status) {
        this.status = status;
        if (status == PaymentStatus.COMPLETED || status == PaymentStatus.CONFIRMED) {
            this.processedAt = LocalDateTime.now();
        }
    }
    
    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public LocalDateTime getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }
    
    public LocalDateTime getProcessedAt() {
        return processedAt;
    }
    
    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getStripePaymentIntentId() {
        return stripePaymentIntentId;
    }
    
    public void setStripePaymentIntentId(String stripePaymentIntentId) {
        this.stripePaymentIntentId = stripePaymentIntentId;
    }
    
    public String getStripeChargeId() {
        return stripeChargeId;
    }
    
    public void setStripeChargeId(String stripeChargeId) {
        this.stripeChargeId = stripeChargeId;
    }
    
    public String getStripeReceiptUrl() {
        return stripeReceiptUrl;
    }
    
    public void setStripeReceiptUrl(String stripeReceiptUrl) {
        this.stripeReceiptUrl = stripeReceiptUrl;
    }
    
    public String getReferenceNumber() {
        return referenceNumber;
    }
    
    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }
    
    public BigDecimal getLateFee() {
        return lateFee;
    }
    
    public void setLateFee(BigDecimal lateFee) {
        this.lateFee = lateFee;
    }
    
    public Boolean getIsLate() {
        return isLate;
    }
    
    public void setIsLate(Boolean isLate) {
        this.isLate = isLate;
    }
    
    public BigDecimal getRefundAmount() {
        return refundAmount;
    }
    
    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }
    
    public LocalDateTime getRefundDate() {
        return refundDate;
    }
    
    public void setRefundDate(LocalDateTime refundDate) {
        this.refundDate = refundDate;
    }
    
    public String getRefundReason() {
        return refundReason;
    }
    
    public void setRefundReason(String refundReason) {
        this.refundReason = refundReason;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Tenant getTenant() {
        return tenant;
    }
    
    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }
    
    public Unit getUnit() {
        return unit;
    }
    
    public void setUnit(Unit unit) {
        this.unit = unit;
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
    
    // Utility methods
    public BigDecimal getTotalAmount() {
        return amount.add(lateFee);
    }
    
    public BigDecimal getNetAmount() {
        return getTotalAmount().subtract(refundAmount);
    }
    
    public boolean isOverdue() {
        return dueDate != null && 
               LocalDateTime.now().isAfter(dueDate) && 
               (status == PaymentStatus.PENDING || status == PaymentStatus.FAILED);
    }
    
    public long getDaysOverdue() {
        if (isOverdue()) {
            return java.time.Duration.between(dueDate, LocalDateTime.now()).toDays();
        }
        return 0;
    }
    
    public boolean isRefunded() {
        return refundAmount.compareTo(BigDecimal.ZERO) > 0;
    }
    
    public boolean isCompleted() {
        return status == PaymentStatus.COMPLETED || status == PaymentStatus.CONFIRMED;
    }
    
    // Update timestamp before updating
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
