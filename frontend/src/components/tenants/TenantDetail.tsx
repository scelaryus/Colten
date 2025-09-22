import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tenantService } from '../../services/tenant';
import { useApiError } from '../../hooks/useApiError';
import { ApiErrorDisplay } from '../ApiErrorDisplay';
import './Tenants.css';
import type { Tenant } from '../../types/api';

export const TenantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const { error, isLoading, handleApiCall, clearError } = useApiError();

  useEffect(() => {
    if (!id) {
      navigate('/tenants');
      return;
    }

    loadTenant();
  }, [id]);

  const loadTenant = async () => {
    if (!id) return;

    await handleApiCall(
      () => tenantService.getTenantById(Number(id)),
      {
        onSuccess: (tenantData) => {
          setTenant(tenantData);
        }
      }
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getLeaseStatus = () => {
    if (!tenant || !tenant.leaseStartDate || !tenant.leaseEndDate) return 'No Lease';
    
    const now = new Date();
    const startDate = new Date(tenant.leaseStartDate);
    const endDate = new Date(tenant.leaseEndDate);
    
    if (now < startDate) return 'Future Lease';
    if (now > endDate) return 'Lease Expired';
    return 'Active Lease';
  };

  const getLeaseStatusClass = (status: string) => {
    switch (status) {
      case 'Active Lease': return 'status-active';
      case 'Lease Expired': return 'status-expired';
      case 'Future Lease': return 'status-future';
      default: return 'status-none';
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">Loading tenant details...</div>
      </div>
    );
  }

  if (!tenant && !isLoading) {
    return (
      <div className="page-container">
        <div className="error-message">Tenant not found</div>
        <Link to="/tenants" className="btn btn-primary">
          Back to Tenants
        </Link>
      </div>
    );
  }

  const leaseStatus = getLeaseStatus();

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <div className="breadcrumb">
            <Link to="/tenants" className="breadcrumb-link">Tenants</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">
              {tenant?.firstName} {tenant?.lastName}
            </span>
          </div>
          <h1 className="page-title">
            {tenant?.firstName} {tenant?.lastName}
          </h1>
          <div className={`status-badge ${getLeaseStatusClass(leaseStatus)}`}>
            {leaseStatus}
          </div>
        </div>
      </div>

      {error && (
        <ApiErrorDisplay 
          error={error} 
          onRetry={loadTenant}
          onDismiss={clearError}
        />
      )}

      {tenant && (
        <div className="tenant-detail-content">
          {/* Contact Information */}
          <div className="detail-section">
            <h2 className="section-title">Contact Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">
                  <a href={`mailto:${tenant.email}`} className="contact-link">
                    {tenant.email}
                  </a>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">
                  {tenant.phone ? (
                    <a href={`tel:${tenant.phone}`} className="contact-link">
                      {tenant.phone}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date of Birth:</span>
                <span className="detail-value">{formatDate(tenant.dateOfBirth)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email Verified:</span>
                <span className="detail-value">
                  <span className={`verification-status ${tenant.emailVerified ? 'verified' : 'unverified'}`}>
                    {tenant.emailVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Unit Information */}
          {tenant.unit && (
            <div className="detail-section">
              <h2 className="section-title">Unit Information</h2>
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
                <div className="unit-actions">
                  <Link 
                    to={`/units/${tenant.unit.id}`} 
                    className="btn btn-secondary btn-sm"
                  >
                    View Unit Details
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Employment Information */}
          <div className="detail-section">
            <h2 className="section-title">Employment Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Employer:</span>
                <span className="detail-value">{tenant.employer || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Job Title:</span>
                <span className="detail-value">{tenant.jobTitle || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Monthly Income:</span>
                <span className="detail-value">{formatCurrency(tenant.monthlyIncome)}</span>
              </div>
            </div>
          </div>

          {/* Lease Information */}
          <div className="detail-section">
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
              <div className="detail-item">
                <span className="detail-label">Move-out Date:</span>
                <span className="detail-value">{formatDate(tenant.moveOutDate)}</span>
              </div>
            </div>
          </div>

          {/* Household Information */}
          <div className="detail-section">
            <h2 className="section-title">Household Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Number of Occupants:</span>
                <span className="detail-value">{tenant.numberOfOccupants || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Has Pets:</span>
                <span className="detail-value">{tenant.hasPets ? 'Yes' : 'No'}</span>
              </div>
              {tenant.hasPets && tenant.petDescription && (
                <div className="detail-item">
                  <span className="detail-label">Pet Description:</span>
                  <span className="detail-value">{tenant.petDescription}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">Smoker:</span>
                <span className="detail-value">{tenant.smoker ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="detail-section">
            <h2 className="section-title">Emergency Contact</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Contact Name:</span>
                <span className="detail-value">{tenant.emergencyContactName || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Contact Phone:</span>
                <span className="detail-value">
                  {tenant.emergencyContactPhone ? (
                    <a href={`tel:${tenant.emergencyContactPhone}`} className="contact-link">
                      {tenant.emergencyContactPhone}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <Link to="/tenants" className="btn btn-secondary">
              Back to Tenants
            </Link>
            <Link 
              to={`/issues?tenant=${tenant.id}`} 
              className="btn btn-primary"
            >
              View Issues
            </Link>
            <Link 
              to={`/payments?tenant=${tenant.id}`} 
              className="btn btn-primary"
            >
              View Payments
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
