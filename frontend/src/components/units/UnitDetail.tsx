import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { unitService } from '../../services/unit';
import { buildingService } from '../../services/building';
import { UNIT_TYPE_LABELS, MESSAGES } from '../../utils/constants';
import type { Unit } from '../../types/unit';
import type { Building } from '../../types/building';
import './Units.css';

export const UnitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [unit, setUnit] = useState<Unit | null>(null);
  const [building, setBuilding] = useState<Building | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadUnitData(parseInt(id));
    }
  }, [id]);

  const loadUnitData = async (unitId: number) => {
    setLoading(true);
    setError('');
    try {
      const unitData = await unitService.getUnitById(unitId);
      setUnit(unitData);
      
      // Load building data
      const buildingData = await buildingService.getBuildingById(unitData.building.id);
      setBuilding(buildingData);
    } catch (err) {
      console.error('Failed to load unit data:', err);
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUnit = async () => {
    if (!unit || !confirm('Are you sure you want to delete this unit? This action cannot be undone.')) {
      return;
    }

    try {
      await unitService.deleteUnit(unit.id);
      navigate('/units');
    } catch (err) {
      console.error('Failed to delete unit:', err);
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.SERVER_ERROR);
    }
  };

  const handleRegenerateRoomCode = async () => {
    if (!unit) return;

    try {
      const response = await unitService.regenerateRoomCode(unit.id);
      setUnit({ ...unit, roomCode: response.roomCode });
      alert(`New room code generated: ${response.roomCode}`);
    } catch (err) {
      console.error('Failed to regenerate room code:', err);
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.SERVER_ERROR);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">{MESSAGES.LOADING.LOADING_UNITS}</div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Unit not found'}
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/units')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Units
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/units')}
            className="text-blue-600 hover:text-blue-800 mb-2"
          >
            ← Back to Units
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Unit {unit.unitNumber}
          </h1>
          {building && (
            <p className="text-lg text-gray-600">{building.name}</p>
          )}
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/units/${unit.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Edit Unit
          </Link>
          <button
            onClick={handleDeleteUnit}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Delete Unit
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Unit Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                unit.isAvailable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {unit.isAvailable ? 'Available' : 'Occupied'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unit Type:</span>
              <span className="font-medium">{UNIT_TYPE_LABELS[unit.unitType as keyof typeof UNIT_TYPE_LABELS]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Floor:</span>
              <span className="font-medium">{unit.floor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bedrooms:</span>
              <span className="font-medium">{unit.bedrooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bathrooms:</span>
              <span className="font-medium">{unit.bathrooms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Square Feet:</span>
              <span className="font-medium">{unit.squareFeet.toLocaleString()} sq ft</span>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Rent:</span>
              <span className="font-semibold text-green-600 text-lg">
                {formatCurrency(unit.monthlyRent)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Security Deposit:</span>
              <span className="font-medium">{unit.securityDeposit ? formatCurrency(unit.securityDeposit) : 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price per sq ft:</span>
              <span className="font-medium">
                {formatCurrency(unit.monthlyRent / unit.squareFeet)}
              </span>
            </div>
          </div>
        </div>

        {/* Room Code */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Code</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <span className="text-2xl font-mono font-bold text-blue-600">
                  {unit.roomCode}
                </span>
              </div>
              <p className="text-sm text-gray-600 text-center mt-2">
                Share this code with tenants for registration
              </p>
            </div>
            <button
              onClick={handleRegenerateRoomCode}
              className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
            >
              Regenerate Room Code
            </button>
          </div>
        </div>

        {/* Amenities & Features */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities & Features</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'furnished', label: 'Furnished' },
              { key: 'petsAllowed', label: 'Pets Allowed' },
              { key: 'smokingAllowed', label: 'Smoking Allowed' },
              { key: 'hasAirConditioning', label: 'Air Conditioning' },
              { key: 'hasWashingMachine', label: 'Washing Machine' },
              { key: 'hasDishwasher', label: 'Dishwasher' },
              { key: 'hasBalcony', label: 'Balcony' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  unit[key as keyof Unit] ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <span className={`text-sm ${
                  unit[key as keyof Unit] ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {unit.description && (
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{unit.description}</p>
          </div>
        )}

        {/* Building Information */}
        {building && (
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Building Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Building Name:</span>
                <span className="ml-2 font-medium">{building.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Floors:</span>
                <span className="ml-2 font-medium">{building.floors}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600">Address:</span>
                <span className="ml-2 font-medium">
                  {building.address}, {building.city}, {building.state} {building.zipCode}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Lease Information */}
        {(unit.leaseStartDate || unit.leaseEndDate) && (
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Lease Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unit.leaseStartDate && (
                <div>
                  <span className="text-gray-600">Lease Start:</span>
                  <span className="ml-2 font-medium">{formatDate(unit.leaseStartDate)}</span>
                </div>
              )}
              {unit.leaseEndDate && (
                <div>
                  <span className="text-gray-600">Lease End:</span>
                  <span className="ml-2 font-medium">{formatDate(unit.leaseEndDate)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span>Created:</span>
              <span className="ml-2">{formatDate(unit.createdAt)}</span>
            </div>
            <div>
              <span>Last Updated:</span>
              <span className="ml-2">{unit.updatedAt ? formatDate(unit.updatedAt) : 'Never'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
