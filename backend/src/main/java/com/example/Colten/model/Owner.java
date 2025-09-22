package com.example.Colten.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "owners")
@PrimaryKeyJoinColumn(name = "user_id")
public class Owner extends User {
    
    @NotBlank(message = "Company name is required")
    @Size(max = 100)
    @Column(name = "company_name", nullable = false)
    private String companyName;
    
    @Size(max = 50)
    @Column(name = "business_license")
    private String businessLicense;
    
    @Column(name = "tax_id")
    private String taxId;
    
    @Size(max = 500)
    @Column(name = "bio")
    private String bio;
    
    // One owner can have multiple buildings
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Building> buildings = new ArrayList<>();
    
    // Stripe customer ID for payment processing
    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;
    
    // Bank account details for receiving payments
    @Column(name = "stripe_account_id")
    private String stripeAccountId;
    
    // Constructors
    public Owner() {
        super();
        setRole(Role.OWNER);
    }
    
    public Owner(String firstName, String lastName, String email, String password, String companyName) {
        super(firstName, lastName, email, password, Role.OWNER);
        this.companyName = companyName;
    }
    
    // Getters and Setters
    public String getCompanyName() {
        return companyName;
    }
    
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    
    public String getBusinessLicense() {
        return businessLicense;
    }
    
    public void setBusinessLicense(String businessLicense) {
        this.businessLicense = businessLicense;
    }
    
    public String getTaxId() {
        return taxId;
    }
    
    public void setTaxId(String taxId) {
        this.taxId = taxId;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public List<Building> getBuildings() {
        return buildings;
    }
    
    public void setBuildings(List<Building> buildings) {
        this.buildings = buildings;
    }
    
    public String getStripeCustomerId() {
        return stripeCustomerId;
    }
    
    public void setStripeCustomerId(String stripeCustomerId) {
        this.stripeCustomerId = stripeCustomerId;
    }
    
    public String getStripeAccountId() {
        return stripeAccountId;
    }
    
    public void setStripeAccountId(String stripeAccountId) {
        this.stripeAccountId = stripeAccountId;
    }
    
    // Utility methods
    public void addBuilding(Building building) {
        buildings.add(building);
        building.setOwner(this);
    }
    
    public void removeBuilding(Building building) {
        buildings.remove(building);
        building.setOwner(null);
    }
    
    public int getTotalBuildings() {
        return buildings.size();
    }
    
    public int getTotalUnits() {
        return buildings.stream()
                .mapToInt(building -> building.getUnits().size())
                .sum();
    }
}
