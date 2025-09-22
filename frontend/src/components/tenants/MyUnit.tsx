import React, { useState, useEffect } from 'react';
import { tenantService } from '../../services/tenant';
import type { Tenant } from '../../types/api';

const MyUnit: React.FC = () => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTenantProfile = async () => {
      try {
        const tenantData = await tenantService.getTenantProfile();
        setTenant(tenantData);
      } catch (err) {
        console.error('Failed to fetch tenant profile:', err);
        setError('Failed to load unit information');
      } finally {
        setLoading(false);
      }
    };

    fetchTenantProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading unit information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <p>{error}</p>
      </div>
    );
  }

  if (!tenant || !tenant.unit) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No unit information available</p>
      </div>
    );
  }

  const { unit } = tenant;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>My Unit</h1>
      
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        marginBottom: '20px'
      }}>
        <h2>{unit.building?.name} - Unit {unit.unitNumber}</h2>
        <p><strong>Address:</strong> {unit.building?.address}</p>
        <p><strong>Floor:</strong> {unit.floor}</p>
        <p><strong>Bedrooms:</strong> {unit.bedrooms}</p>
        <p><strong>Bathrooms:</strong> {unit.bathrooms}</p>
        <p><strong>Square Feet:</strong> {unit.squareFeet}</p>
        <p><strong>Monthly Rent:</strong> ${unit.monthlyRent}</p>
        {unit.description && <p><strong>Description:</strong> {unit.description}</p>}
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3>Unit Features</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          <p>🏠 <strong>Furnished:</strong> {unit.furnished ? 'Yes' : 'No'}</p>
          <p>🐕 <strong>Pets Allowed:</strong> {unit.petsAllowed ? 'Yes' : 'No'}</p>
          <p>🚭 <strong>Smoking Allowed:</strong> {unit.smokingAllowed ? 'Yes' : 'No'}</p>
          <p>❄️ <strong>Air Conditioning:</strong> {unit.hasAirConditioning ? 'Yes' : 'No'}</p>
          <p>🧺 <strong>Washing Machine:</strong> {unit.hasWashingMachine ? 'Yes' : 'No'}</p>
          <p>🍽️ <strong>Dishwasher:</strong> {unit.hasDishwasher ? 'Yes' : 'No'}</p>
          <p>🌅 <strong>Balcony:</strong> {unit.hasBalcony ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {tenant.leaseStartDate && tenant.leaseEndDate && (
        <div style={{
          backgroundColor: '#e7f3ff',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #0ea5e9',
          marginTop: '20px'
        }}>
          <h3>Lease Information</h3>
          <p><strong>Lease Start:</strong> {new Date(tenant.leaseStartDate).toLocaleDateString()}</p>
          <p><strong>Lease End:</strong> {new Date(tenant.leaseEndDate).toLocaleDateString()}</p>
          {tenant.moveInDate && <p><strong>Move-in Date:</strong> {new Date(tenant.moveInDate).toLocaleDateString()}</p>}
        </div>
      )}
    </div>
  );
};

export default MyUnit;