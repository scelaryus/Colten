import { useState, useCallback } from 'react';
import { MESSAGES } from '../utils/constants';

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const useApiError = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    options?: {
      loadingMessage?: string;
      successMessage?: string;
      onSuccess?: (data: T) => void;
      onError?: (error: ApiError) => void;
    }
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      
      if (options?.successMessage) {
        // You could integrate with a toast notification system here
        console.log(options.successMessage);
      }
      
      return result;
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.response?.data?.message || err.message || MESSAGES.ERROR.SERVER_ERROR,
        status: err.response?.status,
        code: err.response?.data?.code,
      };

      setError(apiError.message);
      
      if (options?.onError) {
        options.onError(apiError);
      }
      
      console.error('API Error:', apiError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isLoading,
    handleApiCall,
    clearError,
  };
};
