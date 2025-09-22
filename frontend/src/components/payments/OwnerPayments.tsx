import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/payment';
import type { Payment } from '../../types/api';

// Using the real Payment type from API types

interface PaymentSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  collectionRate: number;
}

const OwnerPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [error, setError] = useState('');

  useEffect(() => {
    loadPaymentData();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, selectedStatus, selectedBuilding, selectedMonth]);

  const loadPaymentData = async () => {
    setLoading(true);
    try {
      console.log('Loading owner payments from API...');
      
      // Load payments and stats from API
      const [ownerPayments, paymentStats] = await Promise.all([
        paymentService.getPayments(),
        paymentService.getPaymentStats()
      ]);
      
      console.log('Loaded payments:', ownerPayments);
      console.log('Payment stats:', paymentStats);
      
      setPayments(ownerPayments);
      setSummary(paymentStats);

    } catch (err) {
      console.error('Failed to load payment data from API:', err);
      setError('Failed to load payment data from server');
      
      // Fallback to empty arrays instead of mock data
      setPayments([]);
      setSummary({
        totalRevenue: 0,
        monthlyRevenue: 0,
        pendingPayments: 0,
        overduePayments: 0,
        collectionRate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = [...payments];

    if (selectedStatus !== 'ALL') {
      if (selectedStatus === 'OVERDUE') {
        filtered = filtered.filter(payment => 
          payment.status === 'PENDING' && new Date(payment.dueDate) < new Date()
        );
      } else {
        filtered = filtered.filter(payment => payment.status === selectedStatus);
      }
    }

    if (selectedBuilding !== 'ALL') {
      filtered = filtered.filter(payment => payment.unit.building.name === selectedBuilding);
    }

    if (selectedMonth !== 'ALL') {
      const monthIndex = parseInt(selectedMonth);
      filtered = filtered.filter(payment => {
        const paymentDate = payment.paymentDate ? new Date(payment.paymentDate) : new Date(payment.dueDate);
        return paymentDate.getMonth() === monthIndex;
      });
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.paymentDate || a.dueDate);
      const dateB = new Date(b.paymentDate || b.dueDate);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredPayments(filtered);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string, dueDate?: string) => {
    if (status === 'PENDING' && dueDate && new Date(dueDate) < new Date()) {
      return '#dc2626'; // Overdue - red
    }
    switch (status) {
      case 'COMPLETED': return '#10b981';
      case 'PENDING': return '#f59e0b';
      case 'FAILED': return '#ef4444';
      case 'REFUNDED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (payment: Payment) => {
    if (payment.status === 'PENDING' && new Date(payment.dueDate) < new Date()) {
      return 'OVERDUE';
    }
    return payment.status;
  };

  const getUniqueBuildings = () => {
    const buildings = [...new Set(payments.map(payment => payment.unit?.building?.name).filter(Boolean))];
    return buildings;
  };

  const getMonthOptions = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.map((month, index) => ({ name: month, value: index }));
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading payment data...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1>Payment Management</h1>
        <p style={{ color: '#6b7280', margin: '10px 0' }}>
          Track rent payments and revenue from all your properties
        </p>
      </div>

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

      {/* Summary Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
              {formatCurrency(summary.totalRevenue)}
            </div>
            <div style={{ color: '#6b7280' }}>Total Revenue</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
              {formatCurrency(summary.monthlyRevenue)}
            </div>
            <div style={{ color: '#6b7280' }}>This Month</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
              {summary.pendingPayments}
            </div>
            <div style={{ color: '#6b7280' }}>Pending Payments</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc2626' }}>
              {summary.overduePayments}
            </div>
            <div style={{ color: '#6b7280' }}>Overdue</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
              {summary.collectionRate.toFixed(1)}%
            </div>
            <div style={{ color: '#6b7280' }}>Collection Rate</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Building</label>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            >
              <option value="ALL">All Buildings</option>
              {getUniqueBuildings().map(building => (
                <option key={building} value={building}>{building}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            >
              <option value="ALL">All Months</option>
              {getMonthOptions().map(month => (
                <option key={month.value} value={month.value.toString()}>{month.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div>
        {filteredPayments.length === 0 ? (
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>No payments found</div>
            <div>Try adjusting your filters to see more results</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredPayments.map(payment => (
              <div
                key={payment.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#374151' }}>
                        {formatCurrency(payment.amount)}
                      </div>
                      <span style={{
                        backgroundColor: getStatusColor(payment.status, payment.dueDate),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {getStatusText(payment)}
                      </span>
                      <span style={{
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {payment.paymentType.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div style={{ color: '#6b7280', marginBottom: '8px' }}>
                      <strong>Tenant:</strong> {payment.tenant.firstName} {payment.tenant.lastName} ({payment.tenant.email})
                    </div>
                    
                    <div style={{ color: '#6b7280', marginBottom: '8px' }}>
                      <strong>Unit:</strong> {payment.unit.building.name} - Unit {payment.unit.unitNumber}
                    </div>
                    
                    <div style={{ color: '#6b7280', marginBottom: '8px' }}>
                      <strong>Description:</strong> {payment.description}
                    </div>
                    
                    {payment.transactionId && (
                      <div style={{ color: '#6b7280', fontSize: '14px' }}>
                        <strong>Transaction ID:</strong> {payment.transactionId}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ textAlign: 'right', color: '#6b7280', fontSize: '14px', minWidth: '150px' }}>
                    <div style={{ marginBottom: '5px' }}>
                      <strong>Due:</strong> {formatDate(payment.dueDate)}
                    </div>
                    {payment.paymentDate && (
                      <div style={{ marginBottom: '5px' }}>
                        <strong>Paid:</strong> {formatDate(payment.paymentDate)}
                      </div>
                    )}
                    {payment.paymentMethod && (
                      <div>
                        <strong>Method:</strong> {payment.paymentMethod.replace('_', ' ')}
                      </div>
                    )}
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

export default OwnerPayments;