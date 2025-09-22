import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buildingService } from '../../services/building';
import { dashboardService } from '../../services/dashboard';
import { MESSAGES } from '../../utils/constants';
import type { Building } from '../../types/building';
import './Buildings.css';

export const BuildingList: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalUnits: 0,
    totalRevenue: 0,
    occupancyRate: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load buildings data
      const buildingsData = await buildingService.getBuildings();
      setBuildings(buildingsData);
      
      // Try to load dashboard stats for comprehensive data
      try {
        const dashboardData = await dashboardService.getOwnerDashboard();
        setStats({
          totalBuildings: dashboardData.totalBuildings,
          totalUnits: dashboardData.totalUnits,
          totalRevenue: dashboardData.totalRevenue,
          occupancyRate: dashboardData.totalUnits > 0 ? (dashboardData.occupiedUnits / dashboardData.totalUnits) * 100 : 0
        });
      } catch (dashboardError) {
        // Fallback to basic stats if dashboard API fails
        console.warn('Dashboard API not available, using basic stats:', dashboardError);
        setStats({
          totalBuildings: buildingsData.length,
          totalUnits: 0,
          totalRevenue: 0,
          occupancyRate: 0
        });
      }
    } catch (err) {
      console.error('Failed to load buildings:', err);
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBuilding = async (buildingId: number) => {
    if (!window.confirm('Are you sure you want to delete this building? This action cannot be undone.')) {
      return;
    }

    try {
      await buildingService.deleteBuilding(buildingId);
      setBuildings(buildings.filter(building => building.id !== buildingId));
    } catch (err) {
      console.error('Failed to delete building:', err);
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.SERVER_ERROR);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBuildingStats = (building: Building) => {
    // Sample stats calculation - in real app this would come from API
    const occupiedUnits = Math.floor(building.numberOfUnits * 0.85);
    const occupancyRate = (occupiedUnits / building.numberOfUnits) * 100;
    const revenue = occupiedUnits * 1850; // Average rent per unit
    
    return {
      occupiedUnits,
      occupancyRate,
      revenue
    };
  };

  if (loading && buildings.length === 0) {
    return (
      <div className="buildings-container">
        <div className="buildings-content">
          <div className="buildings-loading">
            <div className="loading-spinner"></div>
            <div>Loading buildings...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="buildings-container">
      <div className="buildings-content">
        {/* Premium Header */}
        <div className="buildings-header">
          <div className="buildings-hero">
            <h1 className="buildings-title">Building Portfolio</h1>
            <p className="buildings-subtitle">
              Manage your property portfolio with comprehensive building oversight and analytics
            </p>
            <div className="buildings-actions">
              <Link to="/buildings/create" className="buildings-add-btn">
                🏗️ Add New Building
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="buildings-stats">
          <div className="stat-card">
            <span className="stat-icon">🏢</span>
            <div className="stat-value">{stats.totalBuildings}</div>
            <div className="stat-label">Total Buildings</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏠</span>
            <div className="stat-value">{stats.totalUnits}</div>
            <div className="stat-label">Total Units</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
            <div className="stat-label">Monthly Revenue</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <div className="stat-value">{stats.occupancyRate.toFixed(1)}%</div>
            <div className="stat-label">Occupancy Rate</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="buildings-error">
            ⚠️ {error}
          </div>
        )}

        {/* Buildings Grid */}
        {buildings.length === 0 ? (
          <div className="buildings-empty">
            <div className="empty-icon">🏗️</div>
            <h3 className="empty-title">No buildings found</h3>
            <p className="empty-message">
              Start building your property portfolio by adding your first building
            </p>
            <Link to="/buildings/create" className="buildings-add-btn">
              Create Your First Building
            </Link>
          </div>
        ) : (
          <div className="buildings-grid">
            {buildings.map(building => {
              const buildingStats = getBuildingStats(building);
              
              return (
                <div key={building.id} className="building-card">
                  <div className="building-card-header">
                    <h3 className="building-name">{building.name}</h3>
                    <div className="building-address">
                      📍 {building.address}<br />
                      {building.city}, {building.state} {building.zipCode}
                    </div>
                    
                    <div className="building-stats-mini">
                      <div className="building-stat-mini">
                        <div className="building-stat-mini-value">{building.numberOfUnits}</div>
                        <div className="building-stat-mini-label">Total Units</div>
                      </div>
                      <div className="building-stat-mini">
                        <div className="building-stat-mini-value">{buildingStats.occupiedUnits}</div>
                        <div className="building-stat-mini-label">Occupied</div>
                      </div>
                      <div className="building-stat-mini">
                        <div className="building-stat-mini-value">
                          {building.numberOfUnits - buildingStats.occupiedUnits}
                        </div>
                        <div className="building-stat-mini-label">Available</div>
                      </div>
                    </div>
                  </div>

                  <div className="building-card-body">
                    <div className="building-progress">
                      <div className="building-progress-label">
                        <span className="building-progress-text">Occupancy</span>
                        <span className="building-progress-percentage">
                          {buildingStats.occupancyRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="building-progress-bar">
                        <div 
                          className="building-progress-fill"
                          style={{ width: `${buildingStats.occupancyRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="building-revenue">
                      {formatCurrency(buildingStats.revenue)}/month
                    </div>

                    <div className="building-actions">
                      <Link 
                        to={`/buildings/${building.id}`} 
                        className="building-btn building-btn-primary"
                      >
                        👁️ View
                      </Link>
                      <Link 
                        to={`/buildings/${building.id}/edit`} 
                        className="building-btn building-btn-secondary"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteBuilding(building.id)}
                        className="building-btn building-btn-danger"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Loading overlay */}
        {loading && buildings.length > 0 && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '2rem',
              borderRadius: '1rem',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.1)'
            }}>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
              <div style={{ color: '#64748b', textAlign: 'center' }}>
                Loading buildings...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
