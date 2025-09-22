package com.example.Colten.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "issues")
public class Issue {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200)
    @Column(name = "title", nullable = false)
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(max = 2000)
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private IssueCategory category;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private IssuePriority priority = IssuePriority.MEDIUM;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private IssueStatus status = IssueStatus.OPEN;
    
    @Column(name = "location_in_unit")
    private String locationInUnit;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @Column(name = "expected_resolution_date")
    private LocalDateTime expectedResolutionDate;
    
    @Size(max = 1000)
    @Column(name = "resolution_notes")
    private String resolutionNotes;
    
    @Size(max = 1000)
    @Column(name = "admin_notes")
    private String adminNotes;
    
    // Images or attachments related to the issue
    @ElementCollection
    @CollectionTable(name = "issue_attachments", joinColumns = @JoinColumn(name = "issue_id"))
    @Column(name = "attachment_url")
    private List<String> attachmentUrls = new ArrayList<>();
    
    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    @JsonIgnore
    private Tenant tenant;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    @JsonIgnore
    private Unit unit;
    
    // Assigned to (could be owner, maintenance staff, etc.)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;
    
    // Constructors
    public Issue() {}
    
    public Issue(String title, String description, IssueCategory category, Tenant tenant, Unit unit) {
        this.title = title;
        this.description = description;
        this.category = category;
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
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public IssueCategory getCategory() {
        return category;
    }
    
    public void setCategory(IssueCategory category) {
        this.category = category;
    }
    
    public IssuePriority getPriority() {
        return priority;
    }
    
    public void setPriority(IssuePriority priority) {
        this.priority = priority;
    }
    
    public IssueStatus getStatus() {
        return status;
    }
    
    public void setStatus(IssueStatus status) {
        this.status = status;
        if (status == IssueStatus.RESOLVED || status == IssueStatus.CLOSED) {
            this.resolvedAt = LocalDateTime.now();
        }
    }
    
    public String getLocationInUnit() {
        return locationInUnit;
    }
    
    public void setLocationInUnit(String locationInUnit) {
        this.locationInUnit = locationInUnit;
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
    
    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }
    
    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
    
    public LocalDateTime getExpectedResolutionDate() {
        return expectedResolutionDate;
    }
    
    public void setExpectedResolutionDate(LocalDateTime expectedResolutionDate) {
        this.expectedResolutionDate = expectedResolutionDate;
    }
    
    public String getResolutionNotes() {
        return resolutionNotes;
    }
    
    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }
    
    public String getAdminNotes() {
        return adminNotes;
    }
    
    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
    
    public List<String> getAttachmentUrls() {
        return attachmentUrls;
    }
    
    public void setAttachmentUrls(List<String> attachmentUrls) {
        this.attachmentUrls = attachmentUrls;
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
    
    public User getAssignedTo() {
        return assignedTo;
    }
    
    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }
    
    // Utility methods
    public void addAttachment(String attachmentUrl) {
        this.attachmentUrls.add(attachmentUrl);
    }
    
    public void removeAttachment(String attachmentUrl) {
        this.attachmentUrls.remove(attachmentUrl);
    }
    
    public boolean isResolved() {
        return status == IssueStatus.RESOLVED || status == IssueStatus.CLOSED;
    }
    
    public boolean isOverdue() {
        return expectedResolutionDate != null && 
               LocalDateTime.now().isAfter(expectedResolutionDate) && 
               !isResolved();
    }
    
    public long getDaysOpen() {
        LocalDateTime endDate = resolvedAt != null ? resolvedAt : LocalDateTime.now();
        return java.time.Duration.between(createdAt, endDate).toDays();
    }
    
    // Update timestamp before updating
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
