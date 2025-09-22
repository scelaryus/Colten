// Login Component for Colten application
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { testApiConnection, testLoginEndpoint } from '../../utils/apiTest';

// Inline styles for immediate testing
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    margin: 0,
    width: '100%',
    boxSizing: 'border-box' as const
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    boxSizing: 'border-box' as const,
    margin: '0 auto'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 0.5rem 0'
  },
  subtitle: {
    color: '#718096',
    fontSize: '1rem',
    margin: '0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem'
  },
  label: {
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '0.875rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  },
  input: {
    padding: '0.75rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    background: '#f7fafc'
  },
  inputFocus: {
    outline: 'none',
    borderColor: '#667eea',
    background: 'white',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  },
  passwordContainer: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center'
  },
  passwordToggle: {
    position: 'absolute' as const,
    right: '0.75rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    fontSize: '1.125rem',
    color: '#718096'
  },
  button: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '0.875rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  error: {
    color: '#e53e3e',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  footer: {
    marginTop: '2rem',
    textAlign: 'center' as const
  },
  divider: {
    marginBottom: '1.5rem',
    color: '#718096',
    fontSize: '0.875rem'
  },
  registerLinks: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem'
  },
  registerLink: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.875rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    transition: 'all 0.2s ease'
  },
  ownerLink: {
    background: '#f7fafc',
    color: '#2d3748',
    border: '2px solid #e2e8f0'
  },
  tenantLink: {
    background: '#e6fffa',
    color: '#234e52',
    border: '2px solid #b2f5ea'
  }
};

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const { login, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get the page user was trying to access
  const from = (location.state as any)?.from || '/dashboard';

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(from);
    return null;
  }

  // Handle input changes
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof LoginErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'This field is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'This field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    console.log('🔄 Starting login process with:', { email: formData.email });
    
    try {
      // Call real authentication API
      console.log('🔄 Calling login API...');
      const result = await login(formData.email, formData.password);
      console.log('✅ Login API response:', result);
      
      // Redirect to the page user was trying to access or dashboard
      console.log('✅ Login successful, redirecting to:', from);
      navigate(from);
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('❌ Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      
      // Handle different error types from the backend
      let errorMessage = 'Login failed. Please try again.';
      
      if (error?.response?.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (error?.response?.status === 403) {
        errorMessage = 'Account is disabled or not verified.';
      } else if (error?.response?.status === 404) {
        errorMessage = 'Account not found.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setErrors({
        general: errorMessage,
      });
    } finally {
      console.log('🔄 Login process completed, setting loading to false');
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Test API connection for debugging
  const handleTestConnection = async () => {
    console.log('🔧 Testing API connection...');
    const healthTest = await testApiConnection();
    const loginTest = await testLoginEndpoint();
    
    alert(`API Health: ${healthTest.success ? 'OK' : 'FAILED'}\nLogin Endpoint: ${loginTest.success ? 'OK' : 'FAILED'}\n\nCheck console for details.`);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
    }}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome to Colten</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {errors.general && (
            <div style={{ ...styles.error, background: '#fed7d7', border: '1px solid #feb2b2', borderRadius: '6px', padding: '0.75rem', textAlign: 'center' }}>
              {errors.general}
            </div>
          )}

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                ...styles.input,
                ...(errors.email ? { borderColor: '#e53e3e', background: '#fed7d7' } : {})
              }}
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading || authLoading}
            />
            {errors.email && (
              <span style={styles.error}>{errors.email}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  paddingRight: '3rem',
                  width: '100%',
                  boxSizing: 'border-box',
                  ...(errors.password ? { borderColor: '#e53e3e', background: '#fed7d7' } : {})
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading || authLoading}
              />
              <button
                type="button"
                style={styles.passwordToggle}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <span style={styles.error}>{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...((loading || authLoading) ? styles.buttonDisabled : {})
            }}
            disabled={loading || authLoading}
          >
            {(loading || authLoading) ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                ⏳ Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <div style={styles.divider}>
            <span>Don't have an account?</span>
          </div>
          
          <div style={styles.registerLinks}>
            <Link to="/register" style={{ ...styles.registerLink, ...styles.ownerLink }}>
              Register as Property Owner
            </Link>
            <Link to="/tenant-register" style={{ ...styles.registerLink, ...styles.tenantLink }}>
              Register as Tenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
