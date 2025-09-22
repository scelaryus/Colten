import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService, type OwnerDashboardData } from '../services/dashboard';
import { buildingService } from '../services/building';
import { unitService } from '../services/unit';
import { tenantService } from '../services/tenant';
import { issueService } from '../services/issue';
import { paymentService } from '../services/payment';
import { MESSAGES } from '../utils/constants';
import type { Building, Unit, Tenant, Issue, Payment } from '../types/api';
import './Dashboard.css';

// Using the OwnerDashboardData interface from the dashboard service

const OwnerDashboard: React.FC = () => {
  const { getUserDisplayName } = useAuth();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [dashboardData, setDashboardData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Loading owner dashboard data from multiple API endpoints...');
      
      // Load all data from individual endpoints in parallel
      const [
        ownerBuildings,
        ownerUnits,
        ownerTenants,
        ownerIssues,
        ownerPayments
      ] = await Promise.all([
        buildingService.getBuildings().catch(() => []),
        unitService.getUnits().catch(() => []),
        tenantService.getTenants().catch(() => []),
        issueService.getOwnerIssues().catch(() => []),
        paymentService.getPayments().catch(() => [])
      ]);
      
      console.log('Loaded data:', {
        buildings: ownerBuildings.length,
        units: ownerUnits.length,
        tenants: ownerTenants.length,
        issues: ownerIssues.length,
        payments: ownerPayments.length
      });
      
      // Calculate all dashboard metrics from real data
      const totalBuildings = ownerBuildings.length;
      const totalUnits = ownerUnits.length;
      const occupiedUnits = ownerUnits.filter(unit => !unit.isAvailable).length;
      const availableUnits = ownerUnits.filter(unit => unit.isAvailable).length;
      const totalTenants = ownerTenants.length;
      const openIssues = ownerIssues.filter(issue => 
        issue.status === 'OPEN' || issue.status === 'IN_PROGRESS'
      ).length;
      
      // Calculate revenue from completed payments
      const completedPayments = ownerPayments.filter(payment => payment.status === 'COMPLETED');
      const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
      
      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = completedPayments
        .filter(payment => {
          const paymentDate = new Date(payment.paymentDate);
          return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        })
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      // Get recent issues and payments (last 5 of each)
      const recentIssues = ownerIssues
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      const recentPayments = ownerPayments
        .sort((a, b) => new Date(b.paymentDate || b.dueDate).getTime() - new Date(a.paymentDate || a.dueDate).getTime())
        .slice(0, 5);
      
      const calculatedDashboardData: OwnerDashboardData = {
        totalBuildings,
        totalUnits,
        occupiedUnits,
        availableUnits,
        totalTenants,
        openIssues,
        totalRevenue,
        monthlyRevenue,
        recentIssues,
        recentPayments
      };
      
      console.log('Calculated dashboard data:', calculatedDashboardData);
      
      setDashboardData(calculatedDashboardData);
      setBuildings(ownerBuildings);
      
    } catch (err) {
      console.error('Failed to load dashboard data from APIs:', err);
      setError('Failed to load dashboard data from server');
      
      // Fallback to empty state
      setDashboardData({
        totalBuildings: 0,
        totalUnits: 0,
        occupiedUnits: 0,
        availableUnits: 0,
        totalTenants: 0,
        openIssues: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        recentIssues: [],
        recentPayments: []
      });
      setBuildings([]);
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

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    console.log('Current hour:', hour);
    
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const getUserName = () => {
    const displayName = getUserDisplayName();
    console.log('User display name from auth context:', displayName);
    
    if (displayName && displayName.trim()) {
      return displayName;
    }
    return 'Property Owner';
  };

  return (
    <div className="dashboard-container">
      {/* Premium Dashboard Header */}
      <div className="dashboard-hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
          <div className="hero-glow"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-icon">👑</span>
            <span className="hero-badge-text">Property Owner Portal</span>
          </div>
          
          <h1 className="hero-title">
            <span className="hero-greeting">{getTimeBasedGreeting()}</span>
            <span className="hero-name">{getUserName()}</span>
          </h1>
          
          <p className="hero-description">
            Your property portfolio at a glance. Monitor performance, track revenue, and 
            <strong> manage your properties</strong> with real-time insights.
          </p>
          
          <div className="hero-stats-preview">
            <div className="hero-stat">
              <div className="hero-stat-icon">🏢</div>
              <div className="hero-stat-content">
                <span className="hero-stat-number">{loading ? '...' : dashboardData?.totalBuildings || 0}</span>
                <span className="hero-stat-label">Properties</span>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-icon">📈</div>
              <div className="hero-stat-content">
                <span className="hero-stat-number">{loading ? '...' : dashboardData ? `${((dashboardData.occupiedUnits / dashboardData.totalUnits) * 100).toFixed(0)}%` : '0%'}</span>
                <span className="hero-stat-label">Occupied</span>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-icon">💰</div>
              <div className="hero-stat-content">
                <span className="hero-stat-number">{loading ? '...' : formatCurrency(dashboardData?.monthlyRevenue || 0).replace('.00', '')}</span>
                <span className="hero-stat-label">Revenue</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Error Message */}
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
              to="/buildings/create"
              className="dashboard-action-card blue"
            >
              <div className="dashboard-action-title">Add Building</div>
              <div className="dashboard-action-subtitle">Create new property</div>
            </Link>
            <Link
              to="/units/create"
              className="dashboard-action-card green"
            >
              <div className="dashboard-action-title">Add Unit</div>
              <div className="dashboard-action-subtitle">Create new unit</div>
            </Link>
            <Link
              to="/units"
              className="dashboard-action-card purple"
            >
              <div className="dashboard-action-title">Manage Units</div>
              <div className="dashboard-action-subtitle">View all units</div>
            </Link>
            <Link
              to="/tenants"
              className="dashboard-action-card orange"
            >
              <div className="dashboard-action-title">View Tenants</div>
              <div className="dashboard-action-subtitle">Manage tenants</div>
            </Link>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Portfolio Overview</h2>
          <div className="dashboard-grid-4">
            <div className="dashboard-stat-card blue">
              <div className="dashboard-stat-value">{dashboardData?.totalBuildings || 0}</div>
              <div className="dashboard-stat-label">Total Buildings</div>
            </div>
            <div className="dashboard-stat-card green">
              <div className="dashboard-stat-value">{dashboardData?.totalUnits || 0}</div>
              <div className="dashboard-stat-label">Total Units</div>
            </div>
            <div className="dashboard-stat-card purple">
              <div className="dashboard-stat-value">
                {dashboardData ? ((dashboardData.occupiedUnits / dashboardData.totalUnits) * 100).toFixed(1) : '0.0'}%
              </div>
              <div className="dashboard-stat-label">Occupancy Rate</div>
            </div>
            <div className="dashboard-stat-card orange">
              <div className="dashboard-stat-value">{formatCurrency(dashboardData?.monthlyRevenue || 0)}</div>
              <div className="dashboard-stat-label">Monthly Revenue</div>
            </div>
          </div>
        </div>

        {/* Unit Status */}
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Unit Status</h2>
          <div className="dashboard-grid-2">
            <div className="dashboard-status-card">
              <div className="dashboard-status-info">
                <div className="dashboard-stat-value" style={{ color: '#16a34a' }}>{dashboardData?.availableUnits || 0}</div>
                <div className="dashboard-stat-label">Available Units</div>
              </div>
              <div className="dashboard-status-icon green">
                <div className="dashboard-status-dot green"></div>
              </div>
            </div>
            <div className="dashboard-status-card">
              <div className="dashboard-status-info">
                <div className="dashboard-stat-value" style={{ color: '#ef4444' }}>{dashboardData?.occupiedUnits || 0}</div>
                <div className="dashboard-stat-label">Occupied Units</div>
              </div>
              <div className="dashboard-status-icon red">
                <div className="dashboard-status-dot red"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Buildings List */}
        <div className="dashboard-section">
          <div className="dashboard-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 0 }}>
            <span style={{ paddingLeft: '1rem' }}>Your Buildings</span>
            <Link
              to="/buildings"
              className="dashboard-building-action"
              style={{ flex: 'none', fontSize: '0.875rem' }}
            >
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="dashboard-loading">
              <div className="dashboard-spinner"></div>
              {MESSAGES.LOADING.LOADING_BUILDINGS}
            </div>
          ) : buildings.length === 0 ? (
            <div className="dashboard-card" style={{ textAlign: 'center' }}>
              <div style={{ color: '#64748b', marginBottom: '1.5rem' }}>No buildings found</div>
              <Link
                to="/buildings/create"
                className="dashboard-action-card blue"
                style={{ display: 'inline-block', padding: '1rem 2rem', maxWidth: '300px' }}
              >
                <div className="dashboard-action-title">Create Your First Building</div>
              </Link>
            </div>
          ) : (
            <div className="dashboard-grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
              {buildings.slice(0, 6).map((building: Building) => (
                <div key={building.id} className="dashboard-building-card">
                  <div className="dashboard-building-header">
                    <div>
                      <h3 className="dashboard-building-title">{building.name}</h3>
                      <p className="dashboard-building-address">
                        {building.address}, {building.city}, {building.state}
                      </p>
                    </div>
                    <div className="dashboard-building-badge">
                      {building.floors} floors
                    </div>
                  </div>
                  <div className="dashboard-building-actions">
                    <Link
                      to={`/buildings/${building.id}`}
                      className="dashboard-building-action"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/units`}
                      className="dashboard-building-action"
                    >
                      Manage Units
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Issues */}
        {dashboardData && dashboardData.recentIssues && dashboardData.recentIssues.length > 0 && (
          <div className="dashboard-section">
            <div className="dashboard-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 0 }}>
              <span style={{ paddingLeft: '1rem' }}>Recent Issues ({dashboardData.openIssues} open)</span>
              <Link
                to="/issues"
                className="dashboard-building-action"
                style={{ flex: 'none', fontSize: '0.875rem' }}
              >
                View All Issues
              </Link>
            </div>
            
            <div className="dashboard-grid-2">
              {dashboardData.recentIssues.slice(0, 4).map((issue) => (
                <div key={issue.id} className="dashboard-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{issue.title}</h4>
                    <span style={{
                      backgroundColor: issue.priority === 'URGENT' || issue.priority === 'EMERGENCY' ? '#dc2626' : 
                                     issue.priority === 'HIGH' ? '#ef4444' : '#f59e0b',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {issue.priority}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280' }}>
                    {issue.description.length > 100 ? `${issue.description.substring(0, 100)}...` : issue.description}
                  </p>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {issue.tenant && `${issue.tenant.firstName} ${issue.tenant.lastName}`} • 
                    {issue.unit && ` Unit ${issue.unit.unitNumber}`} • 
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Payments */}
        {dashboardData && dashboardData.recentPayments && dashboardData.recentPayments.length > 0 && (
          <div className="dashboard-section">
            <div className="dashboard-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 0 }}>
              <span style={{ paddingLeft: '1rem' }}>Recent Payments</span>
              <Link
                to="/payments"
                className="dashboard-building-action"
                style={{ flex: 'none', fontSize: '0.875rem' }}
              >
                View All Payments
              </Link>
            </div>
            
            <div className="dashboard-grid-2">
              {dashboardData.recentPayments.slice(0, 4).map((payment) => (
                <div key={payment.id} className="dashboard-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>
                      {formatCurrency(payment.amount)}
                    </div>
                    <span style={{
                      backgroundColor: payment.status === 'COMPLETED' ? '#10b981' : 
                                     payment.status === 'PENDING' ? '#f59e0b' : '#ef4444',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {payment.status}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#6b7280' }}>
                    {payment.description}
                  </p>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {payment.tenant && `${payment.tenant.firstName} ${payment.tenant.lastName}`} • 
                    {payment.unit && ` Unit ${payment.unit.unitNumber}`} • 
                    {new Date(payment.paymentDate || payment.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
