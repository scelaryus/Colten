package com.example.Colten.dto;

import com.example.Colten.model.IssueCategory;
import com.example.Colten.model.IssuePriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class IssueRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;
    
    @NotNull(message = "Category is required")
    private IssueCategory category;
    
    @NotNull(message = "Priority is required")
    private IssuePriority priority;
    
    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String locationInUnit;
    
    // Constructors
    public IssueRequest() {}
    
    public IssueRequest(String title, String description, IssueCategory category, 
                       IssuePriority priority, String locationInUnit) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.locationInUnit = locationInUnit;
    }
    
    // Getters and Setters
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
    
    public String getLocationInUnit() {
        return locationInUnit;
    }
    
    public void setLocationInUnit(String locationInUnit) {
        this.locationInUnit = locationInUnit;
    }
}
