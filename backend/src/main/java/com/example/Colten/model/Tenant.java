package com.example.Colten.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tenants")
@PrimaryKeyJoinColumn(name = "user_id")
public class Tenant extends User {
    
    @Column(name = "date_of_birth")
    private LocalDateTime dateOfBirth;
    
    @Size(max = 100)
    @Column(name = "emergency_contact_name")
    private String emergencyContactName;
    
    @Size(max = 20)
    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;
    
    @Size(max = 100)
    @Column(name = "employer")
    private String employer;
    
    @Size(max = 100)
    @Column(name = "job_title")
    private String jobTitle;
    
    @Column(name = "monthly_income", precision = 10, scale = 2)
    private java.math.BigDecimal monthlyIncome;
    
    @Column(name = "lease_start_date")
    private LocalDateTime leaseStartDate;
    
    @Column(name = "lease_end_date")
    private LocalDateTime leaseEndDate;
    
    @Column(name = "move_in_date")
    private LocalDateTime moveInDate;
    
    @Column(name = "move_out_date")
    private LocalDateTime moveOutDate;
    
    // Stripe customer ID for payment processing
    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;
    
    // Number of occupants
    @Column(name = "number_of_occupants")
    private Integer numberOfOccupants = 1;
    
    // Preferences
    @Column(name = "has_pets")
    private Boolean hasPets = false;
    
    @Size(max = 200)
    @Column(name = "pet_description")
    private String petDescription;
    
    @Column(name = "smoker")
    private Boolean smoker = false;
    
    // Background check status
    @Enumerated(EnumType.STRING)
    @Column(name = "background_check_status")
    private BackgroundCheckStatus backgroundCheckStatus = BackgroundCheckStatus.PENDING;
    
    @Column(name = "background_check_date")
    private LocalDateTime backgroundCheckDate;
    
    // Relationships
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    @JsonIgnore
    private Unit unit;
    
    @OneToMany(mappedBy = "tenant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Issue> reportedIssues = new ArrayList<>();
    
    @OneToMany(mappedBy = "tenant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Payment> payments = new ArrayList<>();
    
    // Constructors
    public Tenant() {
        super();
        setRole(Role.TENANT);
    }
    
    public Tenant(String firstName, String lastName, String email, String password) {
        super(firstName, lastName, email, password, Role.TENANT);
    }
    
    // Getters and Setters
    public LocalDateTime getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(LocalDateTime dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    
    public String getEmergencyContactName() {
        return emergencyContactName;
    }
    
    public void setEmergencyContactName(String emergencyContactName) {
        this.emergencyContactName = emergencyContactName;
    }
    
    public String getEmergencyContactPhone() {
        return emergencyContactPhone;
    }
    
    public void setEmergencyContactPhone(String emergencyContactPhone) {
        this.emergencyContactPhone = emergencyContactPhone;
    }
    
    public String getEmployer() {
        return employer;
    }
    
    public void setEmployer(String employer) {
        this.employer = employer;
    }
    
    public String getJobTitle() {
        return jobTitle;
    }
    
    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }
    
    public java.math.BigDecimal getMonthlyIncome() {
        return monthlyIncome;
    }
    
    public void setMonthlyIncome(java.math.BigDecimal monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }
    
    public LocalDateTime getLeaseStartDate() {
        return leaseStartDate;
    }
    
    public void setLeaseStartDate(LocalDateTime leaseStartDate) {
        this.leaseStartDate = leaseStartDate;
    }
    
    public LocalDateTime getLeaseEndDate() {
        return leaseEndDate;
    }
    
    public void setLeaseEndDate(LocalDateTime leaseEndDate) {
        this.leaseEndDate = leaseEndDate;
    }
    
    public LocalDateTime getMoveInDate() {
        return moveInDate;
    }
    
    public void setMoveInDate(LocalDateTime moveInDate) {
        this.moveInDate = moveInDate;
    }
    
    public LocalDateTime getMoveOutDate() {
        return moveOutDate;
    }
    
    public void setMoveOutDate(LocalDateTime moveOutDate) {
        this.moveOutDate = moveOutDate;
    }
    
    public String getStripeCustomerId() {
        return stripeCustomerId;
    }
    
    public void setStripeCustomerId(String stripeCustomerId) {
        this.stripeCustomerId = stripeCustomerId;
    }
    
    public Integer getNumberOfOccupants() {
        return numberOfOccupants;
    }
    
    public void setNumberOfOccupants(Integer numberOfOccupants) {
        this.numberOfOccupants = numberOfOccupants;
    }
    
    public Boolean getHasPets() {
        return hasPets;
    }
    
    public void setHasPets(Boolean hasPets) {
        this.hasPets = hasPets;
    }
    
    public String getPetDescription() {
        return petDescription;
    }
    
    public void setPetDescription(String petDescription) {
        this.petDescription = petDescription;
    }
    
    public Boolean getSmoker() {
        return smoker;
    }
    
    public void setSmoker(Boolean smoker) {
        this.smoker = smoker;
    }
    
    public BackgroundCheckStatus getBackgroundCheckStatus() {
        return backgroundCheckStatus;
    }
    
    public void setBackgroundCheckStatus(BackgroundCheckStatus backgroundCheckStatus) {
        this.backgroundCheckStatus = backgroundCheckStatus;
    }
    
    public LocalDateTime getBackgroundCheckDate() {
        return backgroundCheckDate;
    }
    
    public void setBackgroundCheckDate(LocalDateTime backgroundCheckDate) {
        this.backgroundCheckDate = backgroundCheckDate;
    }
    
    public Unit getUnit() {
        return unit;
    }
    
    public void setUnit(Unit unit) {
        this.unit = unit;
    }
    
    public List<Issue> getReportedIssues() {
        return reportedIssues;
    }
    
    public void setReportedIssues(List<Issue> reportedIssues) {
        this.reportedIssues = reportedIssues;
    }
    
    public List<Payment> getPayments() {
        return payments;
    }
    
    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }
    
    // Utility methods
    public boolean isCurrentTenant() {
        LocalDateTime now = LocalDateTime.now();
        return leaseStartDate != null && leaseEndDate != null &&
               now.isAfter(leaseStartDate) && now.isBefore(leaseEndDate);
    }
    
    public boolean hasValidLease() {
        return leaseStartDate != null && leaseEndDate != null &&
               leaseEndDate.isAfter(LocalDateTime.now());
    }
    
    public void addReportedIssue(Issue issue) {
        reportedIssues.add(issue);
        issue.setTenant(this);
    }
    
    public void removeReportedIssue(Issue issue) {
        reportedIssues.remove(issue);
        issue.setTenant(null);
    }
    
    public void addPayment(Payment payment) {
        payments.add(payment);
        payment.setTenant(this);
    }
    
    public void removePayment(Payment payment) {
        payments.remove(payment);
        payment.setTenant(null);
    }
    
    public int getAge() {
        if (dateOfBirth != null) {
            return java.time.Period.between(dateOfBirth.toLocalDate(), 
                                          LocalDateTime.now().toLocalDate()).getYears();
        }
        return 0;
    }
}
