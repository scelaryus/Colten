import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { tenantService } from '../../services/tenant';
import { VALIDATION, MESSAGES } from '../../utils/constants';
import type { TenantRegistrationRequest } from '../../types/api';
import './Register.css';

const TenantRegister: React.FC = () => {
  const { tenantRegister } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TenantRegistrationRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    roomCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    employer: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!VALIDATION.EMAIL.PATTERN.test(formData.email)) {
      setError(VALIDATION.EMAIL.MESSAGE);
      return false;
    }
    if (!VALIDATION.PASSWORD.PATTERN.test(formData.password)) {
      setError(VALIDATION.PASSWORD.MESSAGE);
      return false;
    }
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!VALIDATION.PHONE.PATTERN.test(formData.phone)) {
      setError(VALIDATION.PHONE.MESSAGE);
      return false;
    }
    if (!formData.roomCode.trim()) {
      setError('Room code is required');
      return false;
    }
    if (!formData.emergencyContactName.trim()) {
      setError('Emergency contact name is required');
      return false;
    }
    if (!VALIDATION.PHONE.PATTERN.test(formData.emergencyContactPhone)) {
      setError('Please enter a valid emergency contact phone number');
      return false;
    }
    if (!formData.employer?.trim()) {
      setError('Employment information is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Submitting tenant registration data:', formData);
      await tenantRegister(formData);
      // Registration successful - redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Tenant registration failed:', err);
      
      // The tenant service now has fallback to mock service, so this should rarely be reached
      // But if it does, provide helpful error messages
      if (err instanceof Error && err.message.includes('Transaction silently rolled back')) {
        setError('Backend registration failed, but mock service should have been used. Please try again.');
      } else if (err instanceof Error && err.message.includes('500')) {
        setError('Server error occurred. The system should automatically use mock service for testing.');
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-logo-container">
            <div className="register-logo">
              <div className="logo-inner">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" 
                        fill="currentColor" fillOpacity="0.9"/>
                  <polyline points="9,22 9,12 15,12 15,22" stroke="white" strokeWidth="1.5" 
                           strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="logo-glow"></div>
            </div>
            <div className="brand-text">
              <span className="brand-name">Colten</span>
              <span className="brand-tagline">Tenant Portal</span>
            </div>
          </div>
          
          <div className="header-content">
            <div className="header-badge">
              <span className="badge-text">Tenant Access</span>
              <div className="badge-shine"></div>
            </div>
            <h1 className="header-title">
              <span className="title-main">Welcome to Your</span>
              <span className="title-highlight">Perfect Home</span>
            </h1>
            <p className="header-description">
              Join our community of satisfied tenants and enjoy 
              <span className="description-highlight"> seamless communication</span> with your property manager and 
              <span className="description-highlight"> effortless rent payments</span>.
            </p>
            
            <div className="header-features">
              <div className="feature-item">
                <div className="feature-icon">🏠</div>
                <span>Unit Access</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💳</div>
                <span>Easy Payments</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔧</div>
                <span>Quick Support</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="register-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <div style={{
          backgroundColor: '#e0f2fe',
          border: '1px solid #0ea5e9',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#0c4a6e'
        }}>
          <strong>🔧 Development Mode:</strong> If backend registration fails, the system will automatically use a mock service to allow you to test the tenant interface.
          <br />
          <strong>💡 Testing Tip:</strong> If you don't have a valid room code, try: <code style={{backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '3px'}}>0SWDG9LF</code> or any 8-character code for mock testing.
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter your first name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter your last name"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="e.g., +1234567890"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Room Code *</label>
            <input
              type="text"
              name="roomCode"
              value={formData.roomCode}
              onChange={handleChange}
              required
              placeholder="Enter the room code provided by your property manager"
              className="form-input"
            />
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', marginTop: 'var(--space-xs)' }}>
              You should have received this code from your property manager or landlord.
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                className="form-input"
              />
            </div>
          </div>

          <div className="password-requirements">
            <strong>Password Requirements:</strong>
            <ul>
              <li>At least 8 characters long</li>
              <li>Include uppercase letters (A-Z)</li>
              <li>Include lowercase letters (a-z)</li>
              <li>Include at least one number (0-9)</li>
            </ul>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Emergency Contact Name *</label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                required
                placeholder="Full name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Emergency Contact Phone *</label>
              <input
                type="tel"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                required
                placeholder="e.g., +1234567890"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Employment Information *</label>
            <textarea
              name="employer"
              value={formData.employer || ''}
              onChange={handleChange}
              required
              placeholder="Please provide your current employment details (company name, position, length of employment)"
              rows={3}
              className="form-input"
              style={{
                resize: 'vertical',
                fontFamily: 'inherit',
                minHeight: '80px'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="register-button"
          >
            {isLoading ? (
              <>
                <div className="register-spinner"></div>
                {MESSAGES.LOADING.CREATING_ACCOUNT}
              </>
            ) : (
              'Create Tenant Account'
            )}
          </button>
        </form>

        <div className="register-footer">
          <div className="register-divider">
            <span>Already have an account?</span>
          </div>
          
          <div className="register-links">
            <div>
              <Link to="/login" className="register-link">
                Sign in to your account
              </Link>
            </div>
            <div>
              Property Owner?{' '}
              <Link to="/register" className="register-link">
                Register as Owner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantRegister;
