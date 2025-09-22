import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { unitService } from '../../services/unit';
import { buildingService } from '../../services/building';
import { UNIT_TYPE_LABELS, MESSAGES } from '../../utils/constants';
import type { Unit, UnitFilters } from '../../types/unit';
import type { Building } from '../../types/building';
import './Units.css';

export const UnitList: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<UnitFilters>({});

  // Load units and buildings
  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [unitsData, buildingsData] = await Promise.all([
        unitService.getUnits(filters),
        buildingService.getBuildings()
      ]);
      setUnits(unitsData);
      setBuildings(buildingsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUnit = async (unitId: number) => {
    if (!confirm('Are you sure you want to delete this unit? This action cannot be undone.')) {
      return;
    }

    try {
      await unitService.deleteUnit(unitId);
      setUnits(units.filter(unit => unit.id !== unitId));
    } catch (err) {
      console.error('Failed to delete unit:', err);
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.SERVER_ERROR);
    }
  };

  const handleRegenerateRoomCode = async (unitId: number) => {
    try {
      const response = await unitService.regenerateRoomCode(unitId);
      setUnits(units.map(unit => 
        unit.id === unitId 
          ? { ...unit, roomCode: response.roomCode }
          : unit
      ));
      alert(`New room code generated: ${response.roomCode}`);
    } catch (err) {
      console.error('Failed to regenerate room code:', err);
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.SERVER_ERROR);
    }
  };

  const getBuildingName = (unit: Unit) => {
    return unit.building ? unit.building.name : 'Unknown Building';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleFilterChange = (key: keyof UnitFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  if (loading && units.length === 0) {
    return (
      <div className="units-container">
        <div className="units-content">
          <div className="units-loading">
            <div className="loading-spinner"></div>
            <div>{MESSAGES.LOADING.LOADING_UNITS}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="units-container">
      <div className="units-content">
        {/* Premium Header */}
        <div className="units-header">
          <div className="units-hero">
            <h1 className="units-title">Property Management Hub</h1>
            <p className="units-subtitle">
              Efficiently manage all your rental units with our comprehensive dashboard
            </p>
            <div className="units-actions">
              <Link to="/units/create" className="units-add-btn">
                ✨ Add New Unit
              </Link>
            </div>
          </div>
        </div>

        {/* Premium Filters */}
        <div className="units-filters">
          <h2 className="filters-title">Smart Filters</h2>
          <div className="filters-grid">
            {/* Building Filter */}
            <div className="filter-group">
              <label className="filter-label">Building</label>
              <select
                value={filters.buildingId || ''}
                onChange={(e) => handleFilterChange('buildingId', parseInt(e.target.value) || undefined)}
                className="filter-select"
              >
                <option value="">All Buildings</option>
                {buildings.map(building => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit Type Filter */}
            <div className="filter-group">
              <label className="filter-label">Unit Type</label>
              <select
                value={filters.unitType || ''}
                onChange={(e) => handleFilterChange('unitType', e.target.value || undefined)}
                className="filter-select"
              >
                <option value="">All Types</option>
                {Object.entries(UNIT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div className="filter-group">
              <label className="filter-label">Availability</label>
              <select
                value={filters.isAvailable === undefined ? '' : filters.isAvailable.toString()}
                onChange={(e) => handleFilterChange('isAvailable', 
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )}
                className="filter-select"
              >
                <option value="">All Units</option>
                <option value="true">Available</option>
                <option value="false">Occupied</option>
              </select>
            </div>

            {/* Bedrooms Filter */}
            <div className="filter-group">
              <label className="filter-label">Min Bedrooms</label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => handleFilterChange('bedrooms', parseInt(e.target.value) || undefined)}
                className="filter-select"
              >
                <option value="">Any</option>
                <option value="0">Studio</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>

            {/* Bathrooms Filter */}
            <div className="filter-group">
              <label className="filter-label">Min Bathrooms</label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => handleFilterChange('bathrooms', parseFloat(e.target.value) || undefined)}
                className="filter-select"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="1.5">1.5+</option>
                <option value="2">2+</option>
                <option value="2.5">2.5+</option>
                <option value="3">3+</option>
              </select>
            </div>

            {/* Min Rent Filter */}
            <div className="filter-group">
              <label className="filter-label">Min Rent</label>
              <input
                type="number"
                placeholder="$0"
                value={filters.minRent || ''}
                onChange={(e) => handleFilterChange('minRent', parseFloat(e.target.value) || undefined)}
                className="filter-input"
                min="0"
                step="100"
              />
            </div>

            {/* Max Rent Filter */}
            <div className="filter-group">
              <label className="filter-label">Max Rent</label>
              <input
                type="number"
                placeholder="No limit"
                value={filters.maxRent || ''}
                onChange={(e) => handleFilterChange('maxRent', parseFloat(e.target.value) || undefined)}
                className="filter-input"
                min="0"
                step="100"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="units-error">
            ⚠️ {error}
          </div>
        )}

        {/* Units Grid */}
        {units.length === 0 ? (
          <div className="units-empty">
            <div className="empty-icon">🏠</div>
            <h3 className="empty-title">No units found</h3>
            <p className="empty-message">
              Get started by creating your first unit or adjust your filters to see more results
            </p>
            <Link to="/units/create" className="units-add-btn">
              Create Your First Unit
            </Link>
          </div>
        ) : (
          <div className="units-grid">
            {units.map(unit => (
              <div key={unit.id} className="unit-card">
                {/* Unit Header */}
                <div className="unit-card-header">
                  <div className="unit-header-content">
                    <div className="unit-info">
                      <h3 className="unit-number">Unit {unit.unitNumber}</h3>
                      <p className="unit-building">{getBuildingName(unit)}</p>
                    </div>
                    <span className={`unit-status ${unit.isAvailable ? 'available' : 'occupied'}`}>
                      {unit.isAvailable ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                </div>

                {/* Unit Details */}
                <div className="unit-card-body">
                  <div className="unit-details-grid">
                    <div className="unit-detail">
                      <span className="unit-detail-label">Type</span>
                      <span className="unit-detail-value">
                        {UNIT_TYPE_LABELS[unit.unitType as keyof typeof UNIT_TYPE_LABELS]}
                      </span>
                    </div>
                    <div className="unit-detail">
                      <span className="unit-detail-label">Floor</span>
                      <span className="unit-detail-value">{unit.floor}</span>
                    </div>
                    <div className="unit-detail">
                      <span className="unit-detail-label">Bedrooms</span>
                      <span className="unit-detail-value">{unit.bedrooms}</span>
                    </div>
                    <div className="unit-detail">
                      <span className="unit-detail-label">Bathrooms</span>
                      <span className="unit-detail-value">{unit.bathrooms}</span>
                    </div>
                  </div>

                  <div className="unit-detail">
                    <span className="unit-detail-label">Square Feet</span>
                    <span className="unit-detail-value">{unit.squareFeet.toLocaleString()} sq ft</span>
                  </div>

                  <div className="unit-rent">
                    {formatCurrency(unit.monthlyRent)}/month
                  </div>

                  <div className="unit-detail" style={{ marginBottom: '1rem' }}>
                    <span className="unit-detail-label">Room Code</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="unit-detail-value" style={{ fontFamily: 'monospace' }}>
                        {unit.roomCode}
                      </span>
                      <button
                        onClick={() => handleRegenerateRoomCode(unit.id)}
                        className="unit-btn unit-btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        🔄
                      </button>
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {unit.furnished && (
                      <span className="unit-status available" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                        🛋️ Furnished
                      </span>
                    )}
                    {unit.petsAllowed && (
                      <span className="unit-status available" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                        🐕 Pets OK
                      </span>
                    )}
                    {unit.hasAirConditioning && (
                      <span className="unit-status available" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                        ❄️ A/C
                      </span>
                    )}
                    {unit.hasBalcony && (
                      <span className="unit-status available" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                        🌿 Balcony
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="unit-actions">
                    <Link to={`/units/${unit.id}/edit`} className="unit-btn unit-btn-primary">
                      ✏️ Edit
                    </Link>
                    <Link to={`/units/${unit.id}`} className="unit-btn unit-btn-secondary">
                      👁️ Details
                    </Link>
                    <button
                      onClick={() => handleDeleteUnit(unit.id)}
                      className="unit-btn unit-btn-danger"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading overlay */}
        {loading && units.length > 0 && (
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
                {MESSAGES.LOADING.LOADING_UNITS}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
