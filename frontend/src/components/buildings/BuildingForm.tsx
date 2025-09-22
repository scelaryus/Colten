import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { buildingService } from '../../services/building';
import { MESSAGES } from '../../utils/constants';
import type { CreateBuildingRequest, UpdateBuildingRequest } from '../../types/building';
import './Buildings.css';

interface BuildingFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description: string;
  floors: number;
  yearBuilt: number;
  parkingSpaces: number;
  hasElevator: boolean;
  hasLaundry: boolean;
  hasGym: boolean;
  hasPool: boolean;
  petFriendly: boolean;
  imageUrl: string;
}

export const BuildingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<BuildingFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    description: '',
    floors: 1,
    yearBuilt: new Date().getFullYear(),
    parkingSpaces: 0,
    hasElevator: false,
    hasLaundry: false,
    hasGym: false,
    hasPool: false,
    petFriendly: false,
    imageUrl: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      loadBuildingData(parseInt(id));
    }
  }, [isEditing, id]);

  const loadBuildingData = async (buildingId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const building = await buildingService.getBuildingById(buildingId);
      setFormData({
        name: building.name,
        address: building.address,
        city: building.city || '',
        state: building.state || '',
        zipCode: building.zipCode || '',
        country: building.country || 'USA',
        description: building.description || '',
        floors: building.floors,
        yearBuilt: building.yearBuilt || new Date().getFullYear(),
        parkingSpaces: building.parkingSpaces || 0,
        hasElevator: building.hasElevator || false,
        hasLaundry: building.hasLaundry || false,
        hasGym: building.hasGym || false,
        hasPool: building.hasPool || false,
        petFriendly: building.petFriendly || false,
        imageUrl: building.imageUrl || '',
      });
    } catch (err) {
      console.error('Failed to load building:', err);
      setError('Failed to load building data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    setError(null);

    if (!formData.name.trim()) {
      setError('Building name is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    if (formData.floors < 1) {
      setError('Number of floors must be at least 1');
      return false;
    }
    if (formData.yearBuilt && (formData.yearBuilt < 1800 || formData.yearBuilt > new Date().getFullYear() + 5)) {
      setError('Please enter a valid year built');
      return false;
    }
    if (formData.parkingSpaces < 0) {
      setError('Parking spaces cannot be negative');
      return false;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && id) {
        // Create update data without undefined/empty values
        const updateData: UpdateBuildingRequest = {};
        if (formData.name.trim()) updateData.name = formData.name.trim();
        if (formData.address.trim()) updateData.address = formData.address.trim();
        if (formData.city.trim()) updateData.city = formData.city.trim();
        if (formData.state.trim()) updateData.state = formData.state.trim();
        if (formData.zipCode.trim()) updateData.zipCode = formData.zipCode.trim();
        if (formData.country.trim()) updateData.country = formData.country.trim();
        if (formData.description.trim()) updateData.description = formData.description.trim();
        if (formData.imageUrl.trim()) updateData.imageUrl = formData.imageUrl.trim();
        updateData.floors = formData.floors;
        updateData.yearBuilt = formData.yearBuilt;
        updateData.parkingSpaces = formData.parkingSpaces;
        updateData.hasElevator = formData.hasElevator;
        updateData.hasLaundry = formData.hasLaundry;
        updateData.hasGym = formData.hasGym;
        updateData.hasPool = formData.hasPool;
        updateData.petFriendly = formData.petFriendly;
        
        await buildingService.updateBuilding(parseInt(id), updateData);
      } else {
        // Create building data
        const createData: CreateBuildingRequest = {
          name: formData.name.trim(),
          address: formData.address.trim(),
          floors: formData.floors,
          ...(formData.city.trim() && { city: formData.city.trim() }),
          ...(formData.state.trim() && { state: formData.state.trim() }),
          ...(formData.zipCode.trim() && { zipCode: formData.zipCode.trim() }),
          ...(formData.country.trim() && { country: formData.country.trim() }),
          ...(formData.description.trim() && { description: formData.description.trim() }),
          ...(formData.imageUrl.trim() && { imageUrl: formData.imageUrl.trim() }),
          ...(formData.yearBuilt && { yearBuilt: formData.yearBuilt }),
          ...(formData.parkingSpaces && { parkingSpaces: formData.parkingSpaces }),
          hasElevator: formData.hasElevator,
          hasLaundry: formData.hasLaundry,
          hasGym: formData.hasGym,
          hasPool: formData.hasPool,
          petFriendly: formData.petFriendly,
        };
        await buildingService.createBuilding(createData);
      }
      
      navigate('/buildings');
    } catch (err) {
      console.error('Failed to save building:', err);
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.SERVER_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  // US States for dropdown
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="buildings-container">
      <div className="buildings-content">
        {/* Premium Header */}
        <div className="buildings-header">
          <div className="buildings-hero">
            <h1 className="buildings-title">
              {isEditing ? '✏️ Edit Building' : '🏗️ Create New Building'}
            </h1>
            <p className="buildings-subtitle">
              {isEditing 
                ? 'Update building details to keep your property information current'
                : 'Add a new building to expand your property portfolio'
              }
            </p>
            <div className="buildings-actions">
              <button
                onClick={() => navigate('/buildings')}
                className="form-btn form-btn-secondary"
              >
                ← Back to Buildings
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="buildings-error">
            ⚠️ {error}
          </div>
        )}

        {/* Premium Form */}
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Building Information</h2>
            <p className="form-subtitle">
              Complete the details below to {isEditing ? 'update' : 'create'} your building
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form-content">
            <div className="form-grid">
              {/* Building Name */}
              <div className="form-group">
                <label className="form-label">
                  🏢 Building Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Sunset Apartments, Downtown Complex"
                  className="form-input"
                />
              </div>

              {/* Number of Floors */}
              <div className="form-group">
                <label className="form-label">
                  �️ Number of Floors *
                </label>
                <input
                  type="number"
                  name="floors"
                  value={formData.floors}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="form-input"
                />
              </div>

              {/* Address */}
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">
                  📍 Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 123 Main Street, Suite 100"
                  className="form-input"
                />
              </div>

              {/* City */}
              <div className="form-group">
                <label className="form-label">
                  🌆 City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., San Francisco"
                  className="form-input"
                />
              </div>

              {/* State */}
              <div className="form-group">
                <label className="form-label">
                  🗺️ State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  <option value="">Select a state</option>
                  {states.map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* ZIP Code */}
              <div className="form-group">
                <label className="form-label">
                  📮 ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 94102"
                  pattern="[0-9]{5}(-[0-9]{4})?"
                  className="form-input"
                />
              </div>
            </div>

            {/* Optional Building Details */}
            <div style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 600, 
                color: '#334155', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🏢 Additional Building Details
              </h3>
              
              <div className="form-grid">
                {/* Country */}
                <div className="form-group">
                  <label className="form-label">
                    🌍 Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="e.g., USA"
                    className="form-input"
                  />
                </div>

                {/* Year Built */}
                <div className="form-group">
                  <label className="form-label">
                    📅 Year Built
                  </label>
                  <input
                    type="number"
                    name="yearBuilt"
                    value={formData.yearBuilt}
                    onChange={handleInputChange}
                    min="1800"
                    max={new Date().getFullYear() + 5}
                    className="form-input"
                  />
                </div>

                {/* Parking Spaces */}
                <div className="form-group">
                  <label className="form-label">
                    🚗 Parking Spaces
                  </label>
                  <input
                    type="number"
                    name="parkingSpaces"
                    value={formData.parkingSpaces}
                    onChange={handleInputChange}
                    min="0"
                    className="form-input"
                  />
                </div>

                {/* Image URL */}
                <div className="form-group">
                  <label className="form-label">
                    📸 Building Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/building-image.jpg"
                    className="form-input"
                  />
                </div>

                {/* Description */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">
                    📝 Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the building, its features, and amenities..."
                    className="form-input"
                    rows={4}
                    style={{ resize: 'vertical', minHeight: '100px' }}
                  />
                </div>
              </div>

              {/* Amenities Section */}
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: 600, 
                  color: '#334155', 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  ✨ Building Amenities
                </h4>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1rem' 
                }}>
                  {/* Elevator */}
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id="hasElevator"
                      name="hasElevator"
                      checked={formData.hasElevator}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="hasElevator" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                      🛗 Has Elevator
                    </label>
                  </div>

                  {/* Laundry */}
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id="hasLaundry"
                      name="hasLaundry"
                      checked={formData.hasLaundry}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="hasLaundry" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                      🧺 Laundry Facility
                    </label>
                  </div>

                  {/* Gym */}
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id="hasGym"
                      name="hasGym"
                      checked={formData.hasGym}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="hasGym" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                      💪 Fitness Center
                    </label>
                  </div>

                  {/* Pool */}
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id="hasPool"
                      name="hasPool"
                      checked={formData.hasPool}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="hasPool" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                      🏊 Swimming Pool
                    </label>
                  </div>

                  {/* Pet Friendly */}
                  <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      id="petFriendly"
                      name="petFriendly"
                      checked={formData.petFriendly}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="petFriendly" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                      🐕 Pet Friendly
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div style={{ 
              marginTop: '2rem', 
              padding: '1.5rem', 
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03), rgba(118, 75, 162, 0.03))',
              borderRadius: '1rem',
              border: '1px solid rgba(102, 126, 234, 0.1)'
            }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 600, 
                color: '#334155', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                💡 Pro Tips
              </h3>
              <ul style={{ 
                color: '#64748b', 
                fontSize: '0.875rem', 
                lineHeight: '1.6',
                margin: 0,
                paddingLeft: '1.5rem'
              }}>
                <li>Choose a descriptive building name that tenants can easily remember</li>
                <li>Ensure the address is complete and accurate for delivery and emergency services</li>
                <li>The number of floors is required - this helps with elevator requirements</li>
                <li>Adding amenities helps attract quality tenants</li>
                <li>Building images increase tenant interest - use high-quality photos</li>
              </ul>
            </div>

            {/* Submit Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/buildings')}
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
                {isLoading ? '⏳ Saving...' : (isEditing ? '✅ Update Building' : '🏗️ Create Building')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
