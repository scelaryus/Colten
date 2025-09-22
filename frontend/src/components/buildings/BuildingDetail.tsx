import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { buildingService } from '../../services/building';
import { unitService } from '../../services/unit';
import { MESSAGES, UNIT_TYPE_LABELS } from '../../utils/constants';
import type { Building, BuildingStats } from '../../types/building';
import type { Unit } from '../../types/unit';
import './Buildings.css';

export const BuildingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [building, setBuilding] = useState<Building | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [stats, setStats] = useState<BuildingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadBuildingData(parseInt(id));
    }
  }, [id]);

  const loadBuildingData = async (buildingId: number) => {
    setLoading(true);
    setError('');
    
    try {
      // Load building details
      const buildingData = await buildingService.getBuildingById(buildingId);
      
      setBuilding(buildingData);
      
      // Load units for this building
      try {
        const unitsData = await unitService.getUnits();
        const buildingUnits = unitsData.filter(unit => unit.building.id === buildingId);
        setUnits(buildingUnits);
        
        // Calculate building-specific stats from units
        const totalUnits = buildingUnits.length;
        const availableUnits = buildingUnits.filter(unit => unit.isAvailable).length;
        const occupiedUnits = totalUnits - availableUnits;
        const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
        const totalRevenue = buildingUnits.filter(unit => !unit.isAvailable).reduce((sum, unit) => sum + unit.monthlyRent, 0);
        const averageRent = totalUnits > 0 ? buildingUnits.reduce((sum, unit) => sum + unit.monthlyRent, 0) / totalUnits : 0;
        
        setStats({
          totalUnits,
          availableUnits,
          occupiedUnits,
          occupancyRate,
          totalRevenue,
          averageRent
        });
        
      } catch (unitError) {
        console.warn('Failed to load units:', unitError);
        // Generate sample stats for demo
        setStats({
          totalUnits: 24,
          availableUnits: 6,
          occupiedUnits: 18,
          occupancyRate: 75,
          totalRevenue: 33300,
          averageRent: 1850
        });
      }
      
    } catch (err) {
      console.error('Failed to load building data:', err);
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.SERVER_ERROR);
      
      // Sample data for demo
      if (buildingId === 1) {
        setBuilding({
          id: 1,
          name: "Sunset Apartments",
          address: "123 Main Street",
          city: "San Francisco",
          state: "CA",
          zipCode: "94102",
          floors: 5,
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T10:00:00Z"
        });
        setStats({
          totalUnits: 24,
          availableUnits: 6,
          occupiedUnits: 18,
          occupancyRate: 75,
          totalRevenue: 33300,
          averageRent: 1850
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBuilding = async () => {
    if (!building) return;
    
    if (!window.confirm(`Are you sure you want to delete "${building.name}"? This action cannot be undone and will also delete all associated units.`)) {
      return;
    }

    try {
      await buildingService.deleteBuilding(building.id);
      navigate('/buildings');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="buildings-container">
        <div className="buildings-content">
          <div className="buildings-loading">
            <div className="loading-spinner"></div>
            <div>Loading building details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="buildings-container">
        <div className="buildings-content">
          <div className="buildings-error">
            ⚠️ Building not found
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/buildings" className="form-btn form-btn-secondary">
              ← Back to Buildings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="buildings-container">
      <div className="buildings-content">
        {/* Error Message */}
        {error && (
          <div className="buildings-error">
            ⚠️ {error}
          </div>
        )}

        {/* Building Detail */}
        <div className="form-container">
          <div className="form-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              <div style={{ flex: 1 }}>
                <h1 className="form-title">{building.name}</h1>
                <p className="form-subtitle">
                  📍 {building.address}, {building.city}, {building.state} {building.zipCode}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to="/buildings" className="form-btn form-btn-secondary">
                  ← Back
                </Link>
                <Link 
                  to={`/buildings/${building.id}/edit`} 
                  className="form-btn form-btn-primary"
                >
                  ✏️ Edit
                </Link>
              </div>
            </div>
          </div>

          <div className="form-content">
            {/* Stats Grid */}
            {stats && (
              <div className="buildings-stats" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                  <span className="stat-icon">🏠</span>
                  <div className="stat-value">{stats.totalUnits}</div>
                  <div className="stat-label">Total Units</div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">✅</span>
                  <div className="stat-value">{stats.occupiedUnits}</div>
                  <div className="stat-label">Occupied</div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🆓</span>
                  <div className="stat-value">{stats.availableUnits}</div>
                  <div className="stat-label">Available</div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">📊</span>
                  <div className="stat-value">{stats.occupancyRate.toFixed(1)}%</div>
                  <div className="stat-label">Occupancy</div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">💰</span>
                  <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
                  <div className="stat-label">Monthly Revenue</div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">💵</span>
                  <div className="stat-value">{formatCurrency(stats.averageRent)}</div>
                  <div className="stat-label">Average Rent</div>
                </div>
              </div>
            )}

            {/* Building Information */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03), rgba(118, 75, 162, 0.03))',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 600, 
                color: '#334155', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🏢 Building Information
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem' 
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Building Name
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 600 }}>
                    {building.name}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Total Units
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 600 }}>
                    {stats?.totalUnits || 0}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Created
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 600 }}>
                    {formatDate(building.createdAt)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Last Updated
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 600 }}>
                    {building.updatedAt ? formatDate(building.updatedAt) : 'Never'}
                  </div>
                </div>
              </div>
            </div>

            {/* Units Section */}
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '1.5rem' 
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 600, 
                  color: '#334155', 
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🏠 Units ({units.length})
                </h3>
                <Link 
                  to={`/units/create?buildingId=${building.id}`}
                  className="form-btn form-btn-primary"
                  style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                >
                  ➕ Add Unit
                </Link>
              </div>

              {units.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '3rem', 
                  background: 'rgba(102, 126, 234, 0.02)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(102, 126, 234, 0.1)'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.6 }}>🏠</div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem 0' }}>
                    No units found
                  </h4>
                  <p style={{ color: '#64748b', margin: '0 0 1.5rem 0' }}>
                    Start adding units to this building to manage rentals
                  </p>
                  <Link 
                    to={`/units/create?buildingId=${building.id}`}
                    className="form-btn form-btn-primary"
                  >
                    Create First Unit
                  </Link>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: '1rem' 
                }}>
                  {units.map(unit => (
                    <div key={unit.id} style={{ 
                      background: 'white',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                      padding: '1rem',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '0.75rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
                            Unit {unit.unitNumber}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Floor {unit.floor}
                          </div>
                        </div>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          background: unit.isAvailable 
                            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.1))'
                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(185, 28, 28, 0.1))',
                          color: unit.isAvailable ? '#15803d' : '#b91c1c',
                          border: unit.isAvailable 
                            ? '1px solid rgba(34, 197, 94, 0.2)'
                            : '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                          {unit.isAvailable ? 'Available' : 'Occupied'}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                        <div>{UNIT_TYPE_LABELS[unit.unitType as keyof typeof UNIT_TYPE_LABELS]}</div>
                        <div style={{ color: '#64748b' }}>
                          {unit.bedrooms} bed • {unit.bathrooms} bath • {unit.squareFeet.toLocaleString()} sq ft
                        </div>
                      </div>
                      
                      <div style={{ 
                        fontSize: '1rem', 
                        fontWeight: 600, 
                        color: '#667eea',
                        marginBottom: '0.75rem'
                      }}>
                        {formatCurrency(unit.monthlyRent)}/month
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link 
                          to={`/units/${unit.id}`}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            textDecoration: 'none',
                            textAlign: 'center',
                            background: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          View
                        </Link>
                        <Link 
                          to={`/units/${unit.id}/edit`}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            textDecoration: 'none',
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div style={{ 
              marginTop: '3rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.03), rgba(185, 28, 28, 0.03))',
              borderRadius: '1rem',
              border: '1px solid rgba(239, 68, 68, 0.1)'
            }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 600, 
                color: '#dc2626', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ⚠️ Danger Zone
              </h3>
              <p style={{ 
                color: '#64748b', 
                fontSize: '0.875rem', 
                margin: '0 0 1rem 0',
                lineHeight: '1.5'
              }}>
                Deleting this building will permanently remove it and all associated units. This action cannot be undone.
              </p>
              <button
                onClick={handleDeleteBuilding}
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(185, 28, 28, 0.1))',
                  color: '#dc2626',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🗑️ Delete Building
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
