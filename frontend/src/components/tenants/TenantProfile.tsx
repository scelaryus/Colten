import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenants } from '../../hooks/useTenants';
import { ApiErrorDisplay } from '../ApiErrorDisplay';
import './Tenants.css';
import type { Tenant } from '../../types/api';

export const TenantProfile: React.FC = () => {
  const navigate = useNavigate();
  const { getTenantProfile, updateTenant, error, isLoading, clearError } = useTenants();
  
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    employer: '',
    jobTitle: '',
    monthlyIncome: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    numberOfOccupants: '',
    hasPets: false,
    petDescription: '',
    smoker: false,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const profile = await getTenantProfile();
    if (profile) {
      setTenant(profile);
      setFormData({
        dateOfBirth: profile.dateOfBirth || '',
        employer: profile.employer || '',
        jobTitle: profile.jobTitle || '',
        monthlyIncome: profile.monthlyIncome?.toString() || '',
        emergencyContactName: profile.emergencyContactName || '',
        emergencyContactPhone: profile.emergencyContactPhone || '',
        numberOfOccupants: profile.numberOfOccupants?.toString() || '',
        hasPets: profile.hasPets || false,
        petDescription: profile.petDescription || '',
        smoker: profile.smoker || false,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    const updateData: any = {
      ...formData,
      monthlyIncome: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : undefined,
      numberOfOccupants: formData.numberOfOccupants ? parseInt(formData.numberOfOccupants) : undefined,
    };

    // Remove empty strings
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '') {
        updateData[key] = undefined;
      }
    });

    const result = await updateTenant(tenant.id, updateData);
    if (result) {
      setTenant(result);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (!tenant && !isLoading) {
    return (
      <div className="page-container">
        <div className="error-message">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your tenant information</p>
        </div>
        <div className="page-actions">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          ) : (
            <div className="button-group">
              <button 
                onClick={() => {
                  setIsEditing(false);
                  loadProfile(); // Reset form data
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={isLoading}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <ApiErrorDisplay 
          error={error} 
          onRetry={loadProfile}
          onDismiss={clearError}
        />
      )}

      {tenant && (
        <div className="profile-content">
          {/* Basic Information (Read-only) */}
          <div className="profile-section">
            <h2 className="section-title">Basic Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{tenant.firstName} {tenant.lastName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{tenant.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{tenant.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Unit Information (Read-only) */}
          {tenant.unit && (
            <div className="profile-section">
              <h2 className="section-title">My Unit</h2>
              <div className="unit-info-card">
                <div className="unit-header">
                  <h3>Unit {tenant.unit.unitNumber}</h3>
                  <p>{tenant.unit.building?.name}</p>
                  <p>{tenant.unit.building?.address}</p>
                </div>
                <div className="unit-details">
                  <div className="unit-detail">
                    <span className="label">Type:</span>
                    <span className="value">{tenant.unit.unitType}</span>
                  </div>
                  <div className="unit-detail">
                    <span className="label">Bedrooms:</span>
                    <span className="value">{tenant.unit.bedrooms}</span>
                  </div>
                  <div className="unit-detail">
                    <span className="label">Bathrooms:</span>
                    <span className="value">{tenant.unit.bathrooms}</span>
                  </div>
                  <div className="unit-detail">
                    <span className="label">Square Feet:</span>
                    <span className="value">{tenant.unit.squareFeet}</span>
                  </div>
                  <div className="unit-detail">
                    <span className="label">Monthly Rent:</span>
                    <span className="value">{formatCurrency(tenant.unit.monthlyRent)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lease Information (Read-only) */}
          <div className="profile-section">
            <h2 className="section-title">Lease Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Lease Start:</span>
                <span className="detail-value">{formatDate(tenant.leaseStartDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Lease End:</span>
                <span className="detail-value">{formatDate(tenant.leaseEndDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Move-in Date:</span>
                <span className="detail-value">{formatDate(tenant.moveInDate)}</span>
              </div>
            </div>
          </div>

          {/* Editable Sections */}
          <form onSubmit={handleSubmit} className="profile-form">
            {/* Personal Information */}
            <div className="profile-section">
              <h2 className="section-title">Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Date of Birth:</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <span className="form-value">{formatDate(tenant.dateOfBirth)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="profile-section">
              <h2 className="section-title">Employment Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Employer:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="employer"
                      value={formData.employer}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter employer name"
                    />
                  ) : (
                    <span className="form-value">{tenant.employer || 'N/A'}</span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Job Title:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter job title"
                    />
                  ) : (
                    <span className="form-value">{tenant.jobTitle || 'N/A'}</span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Income:</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter monthly income"
                      min="0"
                      step="0.01"
                    />
                  ) : (
                    <span className="form-value">{formatCurrency(tenant.monthlyIncome)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="profile-section">
              <h2 className="section-title">Emergency Contact</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Contact Name:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter emergency contact name"
                    />
                  ) : (
                    <span className="form-value">{tenant.emergencyContactName || 'N/A'}</span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone:</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter emergency contact phone"
                    />
                  ) : (
                    <span className="form-value">{tenant.emergencyContactPhone || 'N/A'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Household Information */}
            <div className="profile-section">
              <h2 className="section-title">Household Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Number of Occupants:</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="numberOfOccupants"
                      value={formData.numberOfOccupants}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter number of occupants"
                      min="1"
                    />
                  ) : (
                    <span className="form-value">{tenant.numberOfOccupants || 'N/A'}</span>
                  )}
                </div>
                <div className="form-group checkbox-group">
                  <label className="form-label">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        name="hasPets"
                        checked={formData.hasPets}
                        onChange={handleInputChange}
                        className="form-checkbox"
                      />
                    ) : null}
                    <span>Has Pets: {isEditing ? '' : (tenant.hasPets ? 'Yes' : 'No')}</span>
                  </label>
                </div>
                {(isEditing ? formData.hasPets : tenant.hasPets) && (
                  <div className="form-group">
                    <label className="form-label">Pet Description:</label>
                    {isEditing ? (
                      <textarea
                        name="petDescription"
                        value={formData.petDescription}
                        onChange={handleInputChange}
                        className="form-textarea"
                        placeholder="Describe your pets"
                        rows={3}
                      />
                    ) : (
                      <span className="form-value">{tenant.petDescription || 'N/A'}</span>
                    )}
                  </div>
                )}
                <div className="form-group checkbox-group">
                  <label className="form-label">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        name="smoker"
                        checked={formData.smoker}
                        onChange={handleInputChange}
                        className="form-checkbox"
                      />
                    ) : null}
                    <span>Smoker: {isEditing ? '' : (tenant.smoker ? 'Yes' : 'No')}</span>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
