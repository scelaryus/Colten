import React from 'react';
import './ApiErrorDisplay.css';

interface ApiErrorDisplayProps {
  error: string | null;
  onRetry?: () => void;
  onClear?: () => void;
}

export const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  onClear 
}) => {
  if (!error) return null;

  const isNetworkError = error.includes('Network Error') || error.includes('network error');
  const isAuthError = error.includes('403') || error.includes('Forbidden') || error.includes('Unauthorized');

  return (
    <div className="api-error-container">
      <div className={`api-error ${isNetworkError ? 'network-error' : isAuthError ? 'auth-error' : 'general-error'}`}>
        <div className="error-icon">
          {isNetworkError ? '🌐' : isAuthError ? '🔒' : '⚠️'}
        </div>
        <div className="error-content">
          <h4 className="error-title">
            {isNetworkError ? 'Network Error' : isAuthError ? 'Authentication Error' : 'Error'}
          </h4>
          <p className="error-message">{error}</p>
          {isNetworkError && (
            <p className="error-suggestion">
              Please check your internet connection and ensure the backend server is running on port 8080.
            </p>
          )}
          {isAuthError && (
            <p className="error-suggestion">
              Authentication failed. Please log in again or check your credentials.
            </p>
          )}
        </div>
        <div className="error-actions">
          {onRetry && (
            <button className="error-btn retry-btn" onClick={onRetry}>
              🔄 Retry
            </button>
          )}
          {onClear && (
            <button className="error-btn clear-btn" onClick={onClear}>
              ✕ Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
