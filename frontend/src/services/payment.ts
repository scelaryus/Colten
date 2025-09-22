// Payment service for API calls
import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import type { Payment } from '../types/api';

export interface PaymentCreateRequest {
  amount: number;
  paymentType: string;
  description: string;
  stripePaymentMethodId: string;
}

class PaymentService {
  // Create a payment (TENANT only, Stripe integration)
  async createPayment(data: PaymentCreateRequest): Promise<Payment> {
    return await apiService.post<Payment>(API_ENDPOINTS.PAYMENTS.BASE, data);
  }

  // Get payments (OWNER sees all, TENANT sees own)
  async getPayments(): Promise<Payment[]> {
    return await apiService.get<Payment[]>(API_ENDPOINTS.PAYMENTS.BASE);
  }

  // Get payment by ID (OWNER can view all, TENANT can view own)
  async getPaymentById(id: number): Promise<Payment> {
    return await apiService.get<Payment>(API_ENDPOINTS.PAYMENTS.BY_ID(id));
  }

  // Get payments for specific tenant (OWNER only)
  async getTenantPayments(tenantId: number): Promise<Payment[]> {
    return await apiService.get<Payment[]>(API_ENDPOINTS.PAYMENTS.BY_TENANT(tenantId));
  }

  // Update payment status (OWNER only)
  async updatePaymentStatus(id: number, status: string): Promise<Payment> {
    const params = new URLSearchParams({ status });
    
    return await apiService.put<Payment>(
      `${API_ENDPOINTS.PAYMENTS.UPDATE_STATUS(id)}?${params.toString()}`
    );
  }

  // Get payment statistics for owner
  async getPaymentStats(): Promise<{
    totalRevenue: number;
    monthlyRevenue: number;
    pendingPayments: number;
    overduePayments: number;
    collectionRate: number;
  }> {
    try {
      const payments = await this.getPayments();
      
      const completedPayments = payments.filter(p => p.status === 'COMPLETED');
      const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = completedPayments
        .filter(p => {
          const paymentDate = new Date(p.paymentDate);
          return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        })
        .reduce((sum, p) => sum + p.amount, 0);
      
      const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
      const overduePayments = payments.filter(p => 
        p.status === 'PENDING' && new Date(p.dueDate) < new Date()
      ).length;
      
      // Calculate collection rate based on unique tenants
      const totalTenants = [...new Set(payments.map(p => p.tenant.id))].length;
      const paidTenants = [...new Set(completedPayments.map(p => p.tenant.id))].length;
      const collectionRate = totalTenants > 0 ? (paidTenants / totalTenants) * 100 : 0;

      return {
        totalRevenue,
        monthlyRevenue,
        pendingPayments,
        overduePayments,
        collectionRate
      };
    } catch (error) {
      console.error('Failed to get payment stats:', error);
      return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        pendingPayments: 0,
        overduePayments: 0,
        collectionRate: 0
      };
    }
  }

  // Get upcoming payments due (for tenant dashboard)
  async getUpcomingPayments(): Promise<Payment[]> {
    try {
      const payments = await this.getPayments();
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      return payments.filter(payment => 
        payment.status === 'PENDING' && 
        new Date(payment.dueDate) >= now &&
        new Date(payment.dueDate) <= thirtyDaysFromNow
      );
    } catch (error) {
      console.error('Failed to get upcoming payments:', error);
      return [];
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;