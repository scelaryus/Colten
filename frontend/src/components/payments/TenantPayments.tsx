import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/payment';
import { mockPaymentService, type MockPaymentResponse, type MockPaymentMethod } from '../../services/mockPayment';
import type { Payment } from '../../types/api';

const TenantPayments: React.FC = () => {
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<MockPaymentMethod[]>([]);
  const [nextPaymentDue, setNextPaymentDue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    setLoading(true);
    try {
      console.log('Loading tenant payment data from API...');
      
      // Try to load real payment data first, fallback to mock for payment methods and next due
      const [realHistory, methods, nextDue] = await Promise.all([
        paymentService.getPayments().catch(() => []), // Fallback to empty array if API fails
        mockPaymentService.getPaymentMethods(), // Use mock for payment methods (Stripe integration)
        mockPaymentService.getNextPaymentDue() // Use mock for next payment due
      ]);

      console.log('Loaded payment history:', realHistory);
      setPaymentHistory(realHistory);
      setPaymentMethods(methods);
      setNextPaymentDue(nextDue);
      setPaymentAmount(nextDue.amount);
      
      if (methods.length > 0) {
        setSelectedPaymentMethod(methods[0].id);
      }
    } catch (err) {
      console.error('Failed to load payment data:', err);
      setError('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod || paymentAmount <= 0) {
      setError('Please select a payment method and enter a valid amount');
      return;
    }

    setProcessingPayment(true);
    setError('');
    setSuccess('');

    try {
      const paymentResult = await mockPaymentService.processPayment({
        amount: paymentAmount,
        paymentType: 'RENT',
        description: 'Monthly rent payment',
        paymentMethodId: selectedPaymentMethod
      });

      setSuccess(`Payment of $${paymentAmount.toFixed(2)} processed successfully! Transaction ID: ${paymentResult.transactionId}`);
      setShowPaymentForm(false);
      
      // Refresh payment history
      const updatedHistory = await mockPaymentService.getPaymentHistory();
      setPaymentHistory([paymentResult, ...updatedHistory]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPaymentMethodDisplay = (method: MockPaymentMethod) => {
    if (method.type === 'CREDIT_CARD') {
      return `${method.brand} •••• ${method.last4}`;
    } else {
      return `${method.accountType} •••• ${method.last4}`;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading payment information...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Payments</h1>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          color: '#dc2626'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #86efac',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          color: '#16a34a'
        }}>
          {success}
        </div>
      )}

      {/* Next Payment Due */}
      {nextPaymentDue && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h2 style={{ margin: '0 0 15px 0', color: '#92400e' }}>Next Payment Due</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#92400e' }}>
                {formatCurrency(nextPaymentDue.amount)}
              </div>
              <div style={{ color: '#92400e', marginTop: '5px' }}>
                Due: {formatDate(nextPaymentDue.dueDate)}
              </div>
              <div style={{ color: '#92400e', fontSize: '14px', marginTop: '5px' }}>
                {nextPaymentDue.description}
              </div>
            </div>
            <button
              onClick={() => setShowPaymentForm(true)}
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Pay Now
            </button>
          </div>
        </div>
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginTop: 0 }}>Make Payment</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Payment Amount
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                min="0"
                step="0.01"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Payment Method
              </label>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>
                    {getPaymentMethodDisplay(method)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPaymentForm(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={processingPayment}
                style={{
                  backgroundColor: processingPayment ? '#9ca3af' : '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  cursor: processingPayment ? 'not-allowed' : 'pointer',
                  minWidth: '120px'
                }}
              >
                {processingPayment ? 'Processing...' : `Pay ${formatCurrency(paymentAmount)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div>
        <h2>Payment History</h2>
        {paymentHistory.length === 0 ? (
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            No payment history available
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {paymentHistory.map(payment => (
              <div
                key={payment.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                      {formatCurrency(payment.amount)}
                    </div>
                    <div style={{ color: '#6b7280', marginBottom: '5px' }}>
                      {payment.description}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Paid to: {payment.recipientInfo.ownerName}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Transaction ID: {payment.transactionId}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      backgroundColor: payment.status === 'COMPLETED' ? '#dcfce7' : '#fee2e2',
                      color: payment.status === 'COMPLETED' ? '#16a34a' : '#dc2626',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginBottom: '5px'
                    }}>
                      {payment.status}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {formatDate(payment.paymentDate)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantPayments;