import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { VALIDATION, MESSAGES } from '../../utils/constants';
import type { RegisterRequest } from '../../types/api';
import { Role } from '../../types/api';
import './Register.css';

const OwnerRegister: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: Role.OWNER,
    companyName: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (formData.password.length < VALIDATION.PASSWORD.MIN_LENGTH) {
      setError(`Password must be at least ${VALIDATION.PASSWORD.MIN_LENGTH} characters`);
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
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!VALIDATION.PHONE.PATTERN.test(formData.phone)) {
      setError(VALIDATION.PHONE.MESSAGE);
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
      // Clean up the data before sending
      const registrationData = {
        ...formData,
        // Remove companyName if it's empty
        companyName: formData.companyName?.trim() || undefined,
      };
      
      console.log('Submitting registration data:', registrationData);
      await register(registrationData);
      // Registration successful - redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.SERVER_ERROR);
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
                  <path d="M12 2L22 7v10c0 5.55-3.84 9.74-9 11-5.16-1.26-9-5.45-9-11V7l10-5z" 
                        fill="currentColor" fillOpacity="0.9"/>
                  <path d="M12 7v10M9 9l6 6M15 9l-6 6" stroke="white" strokeWidth="1.5" 
                        strokeLinecap="round"/>
                </svg>
              </div>
              <div className="logo-glow"></div>
            </div>
            <div className="brand-text">
              <span className="brand-name">Colten</span>
              <span className="brand-tagline">Property Management</span>
            </div>
          </div>
          
          <div className="header-content">
            <div className="header-badge">
              <span className="badge-text">Owner Portal</span>
              <div className="badge-shine"></div>
            </div>
            <h1 className="header-title">
              <span className="title-main">Welcome to Your</span>
              <span className="title-highlight">Property Empire</span>
            </h1>
            <p className="header-description">
              Join thousands of successful property owners who trust Colten to 
              <span className="description-highlight"> streamline their operations</span> and 
              <span className="description-highlight"> maximize their returns</span>.
            </p>
            
            <div className="header-features">
              <div className="feature-item">
                <div className="feature-icon">🏢</div>
                <span>Manage Properties</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <span>Track Analytics</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💰</div>
                <span>Maximize Revenue</span>
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

          <div className="form-group">
            <label className="form-label">Company Name (Optional)</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Your property management company"
              className="form-input"
            />
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
              'Create Owner Account'
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
              Looking to rent?{' '}
              <Link to="/tenant-register" className="register-link">
                Register as Tenant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerRegister;
