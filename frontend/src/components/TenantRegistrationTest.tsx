import React, { useState } from 'react';
import { tenantService } from '../services/tenant';

const TenantRegistrationTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testRoomCodeValidation = async () => {
    setIsLoading(true);
    try {
      const result = await tenantService.validateRoomCode('25TCWR84');
      setResult(`Room code validation successful: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setResult(`Room code validation failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testTenantRegistration = async () => {
    setIsLoading(true);
    try {
      const tenantData = {
        firstName: 'Test',
        lastName: 'Tenant',
        email: `test.tenant.${Date.now()}@example.com`,
        password: 'password123',
        phone: '1234567890',
        roomCode: '25TCWR84',
        emergencyContactName: 'Emergency Contact',
        emergencyContactPhone: '0987654321',
        employer: 'Test Company'
      };

      const result = await tenantService.registerTenant(tenantData);
      setResult(`Tenant registration successful: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setResult(`Tenant registration failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Tenant Registration Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testRoomCodeValidation}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Room Code Validation
        </button>
        
        <button 
          onClick={testTenantRegistration}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Tenant Registration
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '5px',
        border: '1px solid #dee2e6',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}>
        {result || 'Click a button to test...'}
      </div>
    </div>
  );
};

export default TenantRegistrationTest;