import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { unitService } from '../../services/unit';
import { buildingService } from '../../services/building';
import { UNIT_TYPE_LABELS, MESSAGES, formatLeaseStartDate, formatLeaseEndDate } from '../../utils/constants';
import type { CreateUnitRequest, UpdateUnitRequest, UnitType } from '../../types/unit';
import type { Building } from '../../types/building';
import './Units.css';

interface UnitFormData {
  unitNumber: string;
  floor: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  monthlyRent: number;
  securityDeposit: number;
  unitType: UnitType;
  description: string;
  furnished: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  hasAirConditioning: boolean;
  hasWashingMachine: boolean;
  hasDishwasher: boolean;
  hasBalcony: boolean;
  isAvailable: boolean;
  leaseStartDate: string;
  leaseEndDate: string;
  buildingId: number;
}

export const UnitForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<UnitFormData>({
    unitNumber: '',
    floor: 1,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 500,
    monthlyRent: 1000,
    securityDeposit: 1000,
    unitType: 'APARTMENT',
    description: '',
    furnished: false,
    petsAllowed: false,
    smokingAllowed: false,
    hasAirConditioning: true,
    hasWashingMachine: false,
    hasDishwasher: false,
    hasBalcony: false,
    isAvailable: true,
    leaseStartDate: '',
    leaseEndDate: '',
    buildingId: 0,
  });

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load buildings and unit data if editing
  useEffect(() => {
    loadBuildings();
    if (isEditing && id) {
      loadUnit(parseInt(id));
    }
  }, [isEditing, id]);

  const loadBuildings = async () => {
    try {
      const buildingsData = await buildingService.getBuildings();
      setBuildings(buildingsData);
      if (buildingsData.length > 0 && formData.buildingId === 0) {
        setFormData(prev => ({ ...prev, buildingId: buildingsData[0].id }));
      }
    } catch (err) {
      console.error('Failed to load buildings:', err);
      setError('Failed to load buildings. Please try again.');
    }
  };

  const loadUnit = async (unitId: number) => {
    try {
      const unit = await unitService.getUnitById(unitId);
      setFormData({
        unitNumber: unit.unitNumber,
        floor: unit.floor,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        squareFeet: unit.squareFeet,
        monthlyRent: unit.monthlyRent,
        securityDeposit: unit.securityDeposit || 0,
        unitType: unit.unitType,
        description: unit.description || '',
        furnished: unit.furnished || false,
        petsAllowed: unit.petsAllowed || false,
        smokingAllowed: unit.smokingAllowed || false,
        hasAirConditioning: unit.hasAirConditioning || false,
        hasWashingMachine: unit.hasWashingMachine || false,
        hasDishwasher: unit.hasDishwasher || false,
        hasBalcony: unit.hasBalcony || false,
        isAvailable: unit.isAvailable,
        leaseStartDate: unit.leaseStartDate || '',
        leaseEndDate: unit.leaseEndDate || '',
        buildingId: unit.building.id,
      });
    } catch (err) {
      console.error('Failed to load unit:', err);
      setError('Failed to load unit data. Please try again.');
    }
  };

  const validateForm = (): boolean => {
    setError('');

    if (!formData.unitNumber.trim()) {
      setError('Unit number is required');
      return false;
    }
    if (formData.floor < 1) {
      setError('Floor must be at least 1');
      return false;
    }
    if (formData.bedrooms < 0) {
      setError('Bedrooms cannot be negative');
      return false;
    }
    if (formData.bathrooms < 0.5) {
      setError('Bathrooms must be at least 0.5');
      return false;
    }
    if (formData.squareFeet < 100) {
      setError('Square feet must be at least 100');
      return false;
    }
    if (formData.monthlyRent < 0) {
      setError('Monthly rent cannot be negative');
      return false;
    }
    if (formData.securityDeposit < 0) {
      setError('Security deposit cannot be negative');
      return false;
    }
    if (formData.buildingId === 0) {
      setError('Please select a building');
      return false;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && id) {
        // Create update data
        const updateData: UpdateUnitRequest = {
          unitNumber: formData.unitNumber,
          floor: formData.floor,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          squareFeet: formData.squareFeet,
          monthlyRent: formData.monthlyRent,
          securityDeposit: formData.securityDeposit || undefined,
          unitType: formData.unitType,
          description: formData.description || undefined,
          furnished: formData.furnished,
          petsAllowed: formData.petsAllowed,
          smokingAllowed: formData.smokingAllowed,
          hasAirConditioning: formData.hasAirConditioning,
          hasWashingMachine: formData.hasWashingMachine,
          hasDishwasher: formData.hasDishwasher,
          hasBalcony: formData.hasBalcony,
          isAvailable: formData.isAvailable,
          leaseStartDate: formData.leaseStartDate ? formatLeaseStartDate(formData.leaseStartDate) : undefined,
          leaseEndDate: formData.leaseEndDate ? formatLeaseEndDate(formData.leaseEndDate) : undefined,
        };
        await unitService.updateUnit(parseInt(id), updateData);
      } else {
        // Create unit data with building reference
        const createData: CreateUnitRequest = {
          unitNumber: formData.unitNumber,
          floor: formData.floor,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          squareFeet: formData.squareFeet,
          monthlyRent: formData.monthlyRent,
          buildingId: formData.buildingId,
          ...(formData.securityDeposit && { securityDeposit: formData.securityDeposit }),
          ...(formData.description && { description: formData.description }),
          ...(formData.unitType && { unitType: formData.unitType }),
          ...(formData.leaseStartDate && { leaseStartDate: formatLeaseStartDate(formData.leaseStartDate) }),
          ...(formData.leaseEndDate && { leaseEndDate: formatLeaseEndDate(formData.leaseEndDate) }),
          hasBalcony: formData.hasBalcony,
          hasDishwasher: formData.hasDishwasher,
          hasWashingMachine: formData.hasWashingMachine,
          hasAirConditioning: formData.hasAirConditioning,
          furnished: formData.furnished,
          petsAllowed: formData.petsAllowed,
          smokingAllowed: formData.smokingAllowed,
          isAvailable: formData.isAvailable,
        };
        await unitService.createUnit(createData);
      }
      
      navigate('/units');
    } catch (err) {
      console.error('Failed to save unit:', err);
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.SERVER_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="units-container">
      <div className="units-content">
        {/* Premium Header */}
        <div className="units-header">
          <div className="units-hero">
            <h1 className="units-title">
              {isEditing ? '✏️ Edit Unit' : '✨ Create New Unit'}
            </h1>
            <p className="units-subtitle">
              {isEditing 
                ? 'Update unit details to keep your property listings current'
                : 'Add a new rental unit to your property portfolio'
              }
            </p>
            <div className="units-actions">
              <button
                onClick={() => navigate('/units')}
                className="form-btn form-btn-secondary"
              >
                ← Back to Units
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="units-error">
            ⚠️ {error}
          </div>
        )}

        {/* Premium Form */}
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Unit Information</h2>
            <p className="form-subtitle">
              Complete the details below to {isEditing ? 'update' : 'create'} your unit
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form-content">
            <div className="form-grid">
              {/* Building Selection */}
              <div className="form-group">
                <label className="form-label">
                  🏢 Building *
                </label>
                <select
                  name="buildingId"
                  value={formData.buildingId}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  <option value={0}>Select a building</option>
                  {buildings.map(building => (
                    <option key={building.id} value={building.id}>
                      {building.name} - {building.address}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit Number */}
              <div className="form-group">
                <label className="form-label">
                  🚪 Unit Number *
                </label>
                <input
                  type="text"
                  name="unitNumber"
                  value={formData.unitNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 101, A1, 2B"
                  className="form-input"
                />
              </div>

              {/* Floor */}
              <div className="form-group">
                <label className="form-label">
                  📶 Floor *
                </label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="form-input"
                />
              </div>

              {/* Unit Type */}
              <div className="form-group">
                <label className="form-label">
                  🏠 Unit Type *
                </label>
                <select
                  name="unitType"
                  value={formData.unitType}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  {Object.entries(UNIT_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div className="form-group">
                <label className="form-label">
                  🛏️ Bedrooms *
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="form-input"
                />
              </div>

              {/* Bathrooms */}
              <div className="form-group">
                <label className="form-label">
                  🚿 Bathrooms *
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0.5"
                  step="0.5"
                  required
                  className="form-input"
                />
              </div>

              {/* Square Feet */}
              <div className="form-group">
                <label className="form-label">
                  📐 Square Feet *
                </label>
                <input
                  type="number"
                  name="squareFeet"
                  value={formData.squareFeet}
                  onChange={handleInputChange}
                  min="100"
                  required
                  className="form-input"
                />
              </div>

              {/* Monthly Rent */}
              <div className="form-group">
                <label className="form-label">
                  💰 Monthly Rent *
                </label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="form-input"
                />
              </div>

              {/* Security Deposit */}
              <div className="form-group">
                <label className="form-label">
                  🔒 Security Deposit *
                </label>
                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">
                📝 Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Optional description of the unit..."
                className="form-textarea"
              />
            </div>

            {/* Features */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 600, 
                color: '#334155', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ⭐ Features & Amenities
              </h3>
              <div className="form-checkbox-group">
                {[
                  { key: 'furnished', label: '🛋️ Furnished' },
                  { key: 'petsAllowed', label: '🐕 Pets Allowed' },
                  { key: 'smokingAllowed', label: '🚬 Smoking Allowed' },
                  { key: 'hasAirConditioning', label: '❄️ Air Conditioning' },
                  { key: 'hasWashingMachine', label: '🧺 Washing Machine' },
                  { key: 'hasDishwasher', label: '🍽️ Dishwasher' },
                  { key: 'hasBalcony', label: '🌿 Balcony' },
                ].map(({ key, label }) => (
                  <div key={key} className="form-checkbox">
                    <input
                      type="checkbox"
                      name={key}
                      checked={formData[key as keyof UnitFormData] as boolean}
                      onChange={handleInputChange}
                    />
                    <label className="form-checkbox label">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability & Lease Information */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 600, 
                color: '#334155', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                📅 Availability & Lease Information
              </h3>
              
              <div className="form-grid">
                {/* Available Status */}
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <label htmlFor="isAvailable" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                    ✅ Unit is Available for Rent
                  </label>
                </div>

                {/* Lease Start Date */}
                <div className="form-group">
                  <label className="form-label">
                    📅 Lease Start Date
                  </label>
                  <input
                    type="date"
                    name="leaseStartDate"
                    value={formData.leaseStartDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                {/* Lease End Date */}
                <div className="form-group">
                  <label className="form-label">
                    📅 Lease End Date
                  </label>
                  <input
                    type="date"
                    name="leaseEndDate"
                    value={formData.leaseEndDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/units')}
                className="form-btn form-btn-secondary"
              >
                ❌ Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="form-btn form-btn-primary"
                style={{ opacity: isLoading ? 0.5 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
              >
                {isLoading ? '⏳ Saving...' : (isEditing ? '✅ Update Unit' : '✨ Create Unit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
