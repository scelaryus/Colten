import { useState, useCallback } from 'react';

export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const setNamedLoading = useCallback((name: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [name]: loading,
    }));
  }, []);

  const isNamedLoading = useCallback((name: string) => {
    return loadingStates[name] || false;
  }, [loadingStates]);

  const withLoading = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    name?: string
  ): Promise<T> => {
    if (name) {
      setNamedLoading(name, true);
    } else {
      setLoading(true);
    }

    try {
      const result = await asyncFn();
      return result;
    } finally {
      if (name) {
        setNamedLoading(name, false);
      } else {
        setLoading(false);
      }
    }
  }, [setLoading, setNamedLoading]);

  return {
    isLoading,
    isNamedLoading,
    setLoading,
    setNamedLoading,
    withLoading,
  };
};
