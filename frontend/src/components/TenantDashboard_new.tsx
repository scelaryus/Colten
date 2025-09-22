import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MESSAGES } from '../utils/constants';
import './Dashboard.css';

// This would be populated with actual tenant data and services
interface TenantDashboardData {
  unit: {
    unitNumber: string;
    building: string;
    monthlyRent: number;
    leaseEndDate: string;
  } | null;
  pendingIssues: number;
  nextPaymentDue: string | null;
  paymentAmount: number;
}

const TenantDashboard: React.FC = () => {
  const [data, setData] = useState<TenantDashboardData>({
    unit: null,
    pendingIssues: 0,
    nextPaymentDue: null,
    paymentAmount: 0,
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
      // TODO: Implement actual tenant data loading
      // For now, we'll show realistic sample data instead of causing errors
      setTimeout(() => {
        setData({
          unit: {
            unitNumber: 'Unit 205',
            building: 'Maple Heights',
            monthlyRent: 1200,
            leaseEndDate: 'Dec 31, 2025',
          },
          pendingIssues: 1,
          nextPaymentDue: 'Nov 1, 2025',
          paymentAmount: 1200,
        });
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Failed to load tenant data:', err);
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.SERVER_ERROR);
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
              {data.unit ? (
                <div className="dashboard-grid-4">
                  <div className="dashboard-stat-card blue">
                    <div className="dashboard-stat-value">{data.unit.unitNumber}</div>
                    <div className="dashboard-stat-label">Unit Number</div>
                  </div>
                  <div className="dashboard-stat-card purple">
                    <div className="dashboard-stat-value" style={{ fontSize: '1.5rem' }}>{data.unit.building}</div>
                    <div className="dashboard-stat-label">Building</div>
                  </div>
                  <div className="dashboard-stat-card green">
                    <div className="dashboard-stat-value" style={{ fontSize: '1.75rem' }}>
                      {formatCurrency(data.unit.monthlyRent)}
                    </div>
                    <div className="dashboard-stat-label">Monthly Rent</div>
                  </div>
                  <div className="dashboard-stat-card orange">
                    <div className="dashboard-stat-value" style={{ fontSize: '1.25rem' }}>{data.unit.leaseEndDate}</div>
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
                      {data.nextPaymentDue || 'N/A'}
                    </div>
                    <div className="dashboard-stat-label">Next Payment Due</div>
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
