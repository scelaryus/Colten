// Mock payment service that simulates payment processing
import type { PaymentRequest } from '../types/api';

export interface MockPaymentResponse {
  id: number;
  amount: number;
  paymentDate: string;
  paymentType: string;
  paymentMethod: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  transactionId: string;
  description: string;
  recipientInfo: {
    ownerName: string;
    propertyName: string;
    unitNumber: string;
  };
}

export interface MockPaymentMethod {
  id: string;
  type: 'CREDIT_CARD' | 'BANK_ACCOUNT';
  last4: string;
  brand?: string;
  accountType?: string;
}

class MockPaymentService {
  private mockPaymentMethods: MockPaymentMethod[] = [
    {
      id: 'card_1',
      type: 'CREDIT_CARD',
      last4: '4242',
      brand: 'Visa'
    },
    {
      id: 'card_2', 
      type: 'CREDIT_CARD',
      last4: '5555',
      brand: 'Mastercard'
    },
    {
      id: 'bank_1',
      type: 'BANK_ACCOUNT',
      last4: '6789',
      accountType: 'Checking'
    }
  ];

  // Get available payment methods
  async getPaymentMethods(): Promise<MockPaymentMethod[]> {
    await this.simulateDelay(500);
    return this.mockPaymentMethods;
  }

  // Process a payment
  async processPayment(paymentData: {
    amount: number;
    paymentType: string;
    description: string;
    paymentMethodId: string;
  }): Promise<MockPaymentResponse> {
    await this.simulateDelay(2000); // Simulate payment processing time

    const paymentMethod = this.mockPaymentMethods.find(pm => pm.id === paymentData.paymentMethodId);
    
    // Simulate occasional payment failures (5% chance)
    const shouldFail = Math.random() < 0.05;
    
    const payment: MockPaymentResponse = {
      id: Math.floor(Math.random() * 10000) + 1000,
      amount: paymentData.amount,
      paymentDate: new Date().toISOString(),
      paymentType: paymentData.paymentType,
      paymentMethod: paymentMethod?.type || 'CREDIT_CARD',
      status: shouldFail ? 'FAILED' : 'COMPLETED',
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      description: paymentData.description,
      recipientInfo: {
        ownerName: 'John Smith Properties',
        propertyName: 'Maple Heights Apartments',
        unitNumber: 'Unit 205'
      }
    };

    console.log('💳 Mock Payment Processed:', payment);
    
    if (payment.status === 'FAILED') {
      throw new Error('Payment failed. Please try again or use a different payment method.');
    }

    return payment;
  }

  // Get payment history
  async getPaymentHistory(): Promise<MockPaymentResponse[]> {
    await this.simulateDelay(800);
    
    const now = new Date();
    const mockHistory: MockPaymentResponse[] = [
      {
        id: 1001,
        amount: 1200.00,
        paymentDate: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
        paymentType: 'RENT',
        paymentMethod: 'CREDIT_CARD',
        status: 'COMPLETED',
        transactionId: 'txn_prev_month_001',
        description: 'Monthly rent payment',
        recipientInfo: {
          ownerName: 'John Smith Properties',
          propertyName: 'Maple Heights Apartments',
          unitNumber: 'Unit 205'
        }
      },
      {
        id: 1002,
        amount: 1200.00,
        paymentDate: new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString(),
        paymentType: 'RENT',
        paymentMethod: 'BANK_ACCOUNT',
        status: 'COMPLETED',
        transactionId: 'txn_prev_month_002',
        description: 'Monthly rent payment',
        recipientInfo: {
          ownerName: 'John Smith Properties',
          propertyName: 'Maple Heights Apartments',
          unitNumber: 'Unit 205'
        }
      }
    ];

    return mockHistory;
  }

  // Get next payment due
  async getNextPaymentDue(): Promise<{
    amount: number;
    dueDate: string;
    paymentType: string;
    description: string;
  }> {
    await this.simulateDelay(300);
    
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    
    return {
      amount: 1200.00,
      dueDate: nextMonth.toISOString(),
      paymentType: 'RENT',
      description: 'Monthly rent payment'
    };
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockPaymentService = new MockPaymentService();
export default mockPaymentService;