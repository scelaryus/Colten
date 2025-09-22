import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTenants } from '../../hooks/useTenants';
import { useBuildings } from '../../hooks/useBuildings';
import { ApiErrorDisplay } from '../ApiErrorDisplay';
import './Tenants.css';
import type { Tenant } from '../../types/api';

export const TenantList: React.FC = () => {
  const navigate = useNavigate();
  const { tenants, stats, error, isLoading, loadTenants, clearError } = useTenants();
  const { buildings, loadBuildings } = useBuildings();
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBuildings();
  }, [loadBuildings]);

  const handleBuildingFilter = (buildingId: number | null) => {
    setSelectedBuildingId(buildingId);
    loadTenants(buildingId || undefined);
  };

  const filteredTenants = tenants.filter(tenant =>
    searchTerm === '' ||
    `${tenant.firstName} ${tenant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.unit?.unitNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getLeaseStatus = (tenant: Tenant) => {
    if (!tenant.leaseStartDate || !tenant.leaseEndDate) return 'No Lease';
    
    const now = new Date();
    const startDate = new Date(tenant.leaseStartDate);
    const endDate = new Date(tenant.leaseEndDate);
    
    if (now < startDate) return 'Future';
    if (now > endDate) return 'Expired';
    return 'Active';
  };

  const getLeaseStatusClass = (status: string) => {
    switch (status) {
      case 'Active': return 'lease-status-active';
      case 'Expired': return 'lease-status-expired';
      case 'Future': return 'lease-status-future';
      default: return 'lease-status-none';
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">Loading tenants...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Tenants</h1>
          <p className="page-subtitle">Manage your tenant relationships</p>
        </div>
      </div>

      {error && (
        <ApiErrorDisplay 
          error={error} 
          onRetry={() => loadTenants(selectedBuildingId || undefined)}
          onDismiss={clearError}
        />
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tenants</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active Leases</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.inactive}</div>
          <div className="stat-label">Inactive</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.recentMoveIns}</div>
          <div className="stat-label">Recent Move-ins</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label className="filter-label">Filter by Building:</label>
          <select
            value={selectedBuildingId || ''}
            onChange={(e) => handleBuildingFilter(e.target.value ? Number(e.target.value) : null)}
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

        <div className="filter-group">
          <label className="filter-label">Search Tenants:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or unit..."
            className="filter-input"
          />
        </div>
      </div>

      {/* Tenants List */}
      {filteredTenants.length === 0 ? (
        <div className="empty-state">
          <h3>No tenants found</h3>
          <p>
            {searchTerm || selectedBuildingId 
              ? 'Try adjusting your filters to see more results.'
              : 'Your tenants will appear here once they register with unit room codes.'
            }
          </p>
        </div>
      ) : (
        <div className="tenants-grid">
          {filteredTenants.map(tenant => {
            const leaseStatus = getLeaseStatus(tenant);
            return (
              <div key={tenant.id} className="tenant-card">
                <div className="tenant-card-header">
                  <div className="tenant-info">
                    <h3 className="tenant-name">
                      {tenant.firstName} {tenant.lastName}
                    </h3>
                    <p className="tenant-email">{tenant.email}</p>
                    {tenant.unit && (
                      <p className="tenant-unit">
                        Unit {tenant.unit.unitNumber} • {tenant.unit.building?.name}
                      </p>
                    )}
                  </div>
                  <div className={`lease-status ${getLeaseStatusClass(leaseStatus)}`}>
                    {leaseStatus}
                  </div>
                </div>

                <div className="tenant-card-details">
                  <div className="detail-row">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{tenant.phone || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Move-in Date:</span>
                    <span className="detail-value">{formatDate(tenant.moveInDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Lease End:</span>
                    <span className="detail-value">{formatDate(tenant.leaseEndDate)}</span>
                  </div>
                  {tenant.monthlyIncome && (
                    <div className="detail-row">
                      <span className="detail-label">Monthly Income:</span>
                      <span className="detail-value">${tenant.monthlyIncome.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="tenant-card-actions">
                  <Link
                    to={`/tenants/${tenant.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                  {tenant.unit && (
                    <Link
                      to={`/units/${tenant.unit.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      View Unit
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
