import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/payment';
import { useApiError } from './useApiError';
import type { Payment, PaymentStatus } from '../types/api';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0,
    failedPayments: 0,
  });
  
  const { error, isLoading, handleApiCall, clearError } = useApiError();

  const loadPayments = useCallback(async (tenantId?: number) => {
    const result = await handleApiCall(
      async () => {
        let paymentsData: Payment[];
        
        if (tenantId) {
          paymentsData = await paymentService.getPaymentsByTenant(tenantId);
        } else {
          paymentsData = await paymentService.getPayments();
        }

        const statsData = await paymentService.getPaymentStats();
        return { payments: paymentsData, stats: statsData };
      },
      {
        onSuccess: (data) => {
          setPayments(data.payments);
          setStats(data.stats);
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const getTenantPaymentStats = useCallback(async () => {
    const result = await handleApiCall(
      () => paymentService.getTenantPaymentStats()
    );
    return result;
  }, [handleApiCall]);

  const createPayment = useCallback(async (paymentData: any) => {
    const result = await handleApiCall(
      () => paymentService.createPayment(paymentData),
      {
        successMessage: 'Payment created successfully!',
        onSuccess: (newPayment) => {
          setPayments(prev => [newPayment, ...prev]);
        }
      }
    );
    return result;
  }, [handleApiCall]);

  const updatePaymentStatus = useCallback(async (id: number, status: PaymentStatus) => {
    const result = await handleApiCall(
      () => paymentService.updatePaymentStatus(id, status),
      {
        successMessage: 'Payment status updated successfully!',
        onSuccess: (updatedPayment) => {
          setPayments(prev => prev.map(payment => 
            payment.id === id ? updatedPayment : payment
          ));
        }
      }
    );
    return result;
  }, [handleApiCall]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  return {
    payments,
    stats,
    error,
    isLoading,
    loadPayments,
    getTenantPaymentStats,
    createPayment,
    updatePaymentStatus,
    clearError,
  };
};
