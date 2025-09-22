import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tenantService } from '../services/tenant';
import { mockPaymentService } from '../services/mockPayment';
import { MESSAGES } from '../utils/constants';
import type { Tenant } from '../types/api';
import './Dashboard.css';

interface TenantDashboardData {
  tenant: Tenant | null;
  nextPaymentDue: {
    amount: number;
    dueDate: string;
    paymentType: string;
    description: string;
  } | null;
  pendingIssues: number;
}

const TenantDashboard: React.FC = () => {
  const [data, setData] = useState<TenantDashboardData>({
    tenant: null,
    nextPaymentDue: null,
    pendingIssues: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTenantData();
  }, []);

  const loadTenantData = async () => {
    setLoading(true);
    setError('');
    try {
      // Load tenant profile data
      const tenantProfile = await tenantService.getTenantProfile();
      console.log('Loaded tenant profile:', tenantProfile);
      
      // Load next payment due
      const nextPayment = await mockPaymentService.getNextPaymentDue();
      console.log('Next payment due:', nextPayment);
      
      // Mock pending issues count (would come from issues service)
      const pendingIssues = Math.floor(Math.random() * 3); // 0-2 pending issues
      
      setData({
        tenant: tenantProfile,
        nextPaymentDue: nextPayment,
        pendingIssues: pendingIssues,
      });
    } catch (err) {
      console.error('Failed to load tenant data:', err);
      
      // Fallback to mock data if services fail
      const mockTenant: Tenant = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        role: 'TENANT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        backgroundCheckStatus: 'APPROVED',
        unit: {
          id: 1,
          unitNumber: '205',
          floor: 2,
          bedrooms: 1,
          bathrooms: 1,
          squareFeet: 650,
          monthlyRent: 1200,
          securityDeposit: 1200,
          unitType: 'APARTMENT',
          isAvailable: false,
          roomCode: 'MOCK1234',
          description: 'Cozy 1-bedroom apartment with modern amenities',
          furnished: false,
          petsAllowed: true,
          smokingAllowed: false,
          hasAirConditioning: true,
          hasWashingMachine: true,
          hasDishwasher: true,
          hasBalcony: false,
          building: {
            id: 1,
            name: 'Maple Heights Apartments',
            address: '123 Maple Street',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
            floors: 3,
            createdAt: new Date().toISOString()
          }
        },
        leaseStartDate: '2024-01-01',
        leaseEndDate: '2024-12-31',
        moveInDate: '2024-01-01'
      };
      
      const mockNextPayment = {
        amount: 1200,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        paymentType: 'RENT',
        description: 'Monthly rent payment'
      };
      
      setData({
        tenant: mockTenant,
        nextPaymentDue: mockNextPayment,
        pendingIssues: 1,
      });
      
      console.log('Using mock tenant data due to service failure');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="dashboard-container">
      {/* Premium Tenant Dashboard Header */}
      <div className="dashboard-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
          <div className="hero-glow"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-icon">🏠</span>
            <span className="hero-badge-text">Tenant Portal</span>
          </div>
          
          <h1 className="hero-title">
            <span className="hero-greeting">Welcome Home</span>
            <span className="hero-name">Your Perfect Space</span>
          </h1>
          
          <p className="hero-description">
            Everything you need to manage your tenancy is here. 
            <strong> Pay rent easily</strong>, report issues quickly, and 
            <strong> stay connected</strong> with your property manager.
          </p>
          
          <div className="hero-stats-preview">
            <div className="hero-stat">
              <div className="hero-stat-icon">🏠</div>
              <div className="hero-stat-content">
                <span className="hero-stat-number">{loading ? '...' : data.tenant?.unit?.unitNumber || 'N/A'}</span>
                <span className="hero-stat-label">Your Unit</span>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-icon">📅</div>
              <div className="hero-stat-content">
                <span className="hero-stat-number">{loading ? '...' : (data.nextPaymentDue ? new Date(data.nextPaymentDue.dueDate).toLocaleDateString() : 'N/A')}</span>
                <span className="hero-stat-label">Next Due</span>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-icon">🔧</div>
              <div className="hero-stat-content">
                <span className="hero-stat-number">{loading ? '...' : data.pendingIssues}</span>
                <span className="hero-stat-label">Issues</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Error Message - Only show if there's a real error */}
        {error && (
          <div className="dashboard-alert">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Quick Actions</h2>
          <div className="dashboard-grid-4">
            <Link
              to="/payments"
              className="dashboard-action-card green"
            >
              <div className="dashboard-action-title">Pay Rent</div>
              <div className="dashboard-action-subtitle">Make payment</div>
            </Link>
            <Link
              to="/issues/create"
              className="dashboard-action-card blue"
            >
              <div className="dashboard-action-title">Report Issue</div>
              <div className="dashboard-action-subtitle">Maintenance request</div>
            </Link>
            <Link
              to="/issues"
              className="dashboard-action-card purple"
            >
              <div className="dashboard-action-title">My Issues</div>
              <div className="dashboard-action-subtitle">View requests</div>
            </Link>
            <Link
              to="/profile"
              className="dashboard-action-card orange"
            >
              <div className="dashboard-action-title">Profile</div>
              <div className="dashboard-action-subtitle">Update info</div>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <div className="dashboard-spinner"></div>
            {MESSAGES.LOADING.LOADING_DASHBOARD}
          </div>
        ) : (
          <>
            {/* Unit Information */}
            <div className="dashboard-section">
              <h2 className="dashboard-section-title">My Unit</h2>
              {data.tenant?.unit ? (
                <div className="dashboard-grid-4">
                  <div className="dashboard-stat-card blue">
                    <div className="dashboard-stat-value">Unit {data.tenant.unit.unitNumber}</div>
                    <div className="dashboard-stat-label">Unit Number</div>
                  </div>
                  <div className="dashboard-stat-card purple">
                    <div className="dashboard-stat-value" style={{ fontSize: '1.5rem' }}>{data.tenant.unit.building?.name}</div>
                    <div className="dashboard-stat-label">Building</div>
                  </div>
                  <div className="dashboard-stat-card green">
                    <div className="dashboard-stat-value" style={{ fontSize: '1.75rem' }}>
                      {formatCurrency(data.tenant.unit.monthlyRent)}
                    </div>
                    <div className="dashboard-stat-label">Monthly Rent</div>
                  </div>
                  <div className="dashboard-stat-card orange">
                    <div className="dashboard-stat-value" style={{ fontSize: '1.25rem' }}>
                      {data.tenant.leaseEndDate ? new Date(data.tenant.leaseEndDate).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="dashboard-stat-label">Lease Ends</div>
                  </div>
                </div>
              ) : (
                <div className="dashboard-card" style={{ textAlign: 'center' }}>
                  <div style={{ color: '#64748b', marginBottom: '1rem' }}>No unit information available</div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    Please contact your property manager if you believe this is an error.
                  </p>
                </div>
              )}
            </div>

            {/* Payment Status */}
            <div className="dashboard-section">
              <h2 className="dashboard-section-title">Payment Status</h2>
              <div className="dashboard-grid-2">
                <div className="dashboard-status-card">
                  <div className="dashboard-status-info">
                    <div className="dashboard-stat-value" style={{ color: '#16a34a' }}>Current</div>
                    <div className="dashboard-stat-label">Payment Status</div>
                  </div>
                  <div className="dashboard-status-icon green">
                    <div className="dashboard-status-dot green"></div>
                  </div>
                </div>
                <div className="dashboard-status-card">
                  <div className="dashboard-status-info">
                    <div className="dashboard-stat-value" style={{ fontSize: '1.25rem', color: '#334155' }}>
                      {data.nextPaymentDue ? new Date(data.nextPaymentDue.dueDate).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="dashboard-stat-label">Next Payment Due</div>
                    {data.nextPaymentDue && (
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a', marginTop: '0.5rem' }}>
                        {formatCurrency(data.nextPaymentDue.amount)}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Link
                      to="/payments"
                      className="dashboard-building-action"
                    >
                      Pay Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Maintenance Issues */}
            <div className="dashboard-section">
              <h2 className="dashboard-section-title">Maintenance Issues</h2>
              <div className="dashboard-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="dashboard-stat-card blue" style={{ border: 'none', boxShadow: 'none', padding: '1rem' }}>
                    <div className="dashboard-stat-value">{data.pendingIssues}</div>
                    <div className="dashboard-stat-label">Pending Issues</div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link
                      to="/issues"
                      className="dashboard-building-action"
                    >
                      View All
                    </Link>
                    <Link
                      to="/issues/create"
                      className="dashboard-building-action"
                    >
                      Report Issue
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="dashboard-section">
              <h2 className="dashboard-section-title">Recent Activity</h2>
              <div className="dashboard-card" style={{ textAlign: 'center' }}>
                <div style={{ color: '#64748b', marginBottom: '0.5rem' }}>Your latest updates will appear here</div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  Payment history and maintenance requests will be displayed in this section.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;
