import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issueService } from '../../services/issue';
import type { Issue } from '../../types/api';

// Using the real Issue type from API types

const ISSUE_CATEGORIES = [
  'PLUMBING',
  'ELECTRICAL', 
  'HEATING_COOLING',
  'APPLIANCES',
  'PEST_CONTROL',
  'STRUCTURAL',
  'SAFETY_SECURITY',
  'CLEANING',
  'NOISE_COMPLAINT',
  'WATER_DAMAGE',
  'LOCKS_KEYS',
  'WINDOWS_DOORS',
  'LIGHTING',
  'INTERNET_CABLE',
  'PARKING',
  'GARBAGE_RECYCLING',
  'LANDSCAPING',
  'OTHER'
];

const ISSUE_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'EMERGENCY'];

const TenantIssues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    priority: 'MEDIUM' as const,
    locationInUnit: ''
  });

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    setLoading(true);
    try {
      console.log('Loading tenant issues from API...');
      const tenantIssues = await issueService.getMyIssues();
      console.log('Loaded tenant issues:', tenantIssues);
      setIssues(tenantIssues);
    } catch (err) {
      console.error('Failed to load issues from API:', err);
      setError('Failed to load issues from server');
      
      // Fallback to empty array instead of mock data
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitIssue = async () => {
    if (!newIssue.title.trim() || !newIssue.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      console.log('Submitting issue via API:', newIssue);
      const createdIssue = await issueService.createIssue(newIssue);
      console.log('✅ Issue Created Successfully:', createdIssue);

      setIssues([createdIssue, ...issues]);
      setSuccess('Issue submitted successfully! You will receive updates on its progress.');
      setShowCreateForm(false);
      setNewIssue({
        title: '',
        description: '',
        category: 'OTHER',
        priority: 'MEDIUM',
        locationInUnit: ''
      });
      
    } catch (err) {
      console.error('Failed to submit issue:', err);
      setError('Failed to submit issue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return '#10b981';
      case 'MEDIUM': return '#f59e0b';
      case 'HIGH': return '#ef4444';
      case 'URGENT': return '#dc2626';
      case 'EMERGENCY': return '#991b1b';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return '#3b82f6';
      case 'IN_PROGRESS': return '#f59e0b';
      case 'RESOLVED': return '#10b981';
      case 'CLOSED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading issues...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Maintenance Issues</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Report New Issue
        </button>
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

      {/* Create Issue Form Modal */}
      {showCreateForm && (
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
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginTop: 0 }}>Report Maintenance Issue</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Issue Title *
              </label>
              <input
                type="text"
                value={newIssue.title}
                onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                placeholder="Brief description of the issue"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Detailed Description *
              </label>
              <textarea
                value={newIssue.description}
                onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                placeholder="Please provide detailed information about the issue, when it started, and any relevant details"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Category
                </label>
                <select
                  value={newIssue.category}
                  onChange={(e) => setNewIssue({...newIssue, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  {ISSUE_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Priority
                </label>
                <select
                  value={newIssue.priority}
                  onChange={(e) => setNewIssue({...newIssue, priority: e.target.value as any})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  {ISSUE_PRIORITIES.map(priority => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Location in Unit
              </label>
              <input
                type="text"
                value={newIssue.locationInUnit}
                onChange={(e) => setNewIssue({...newIssue, locationInUnit: e.target.value})}
                placeholder="e.g., Kitchen, Bathroom, Living Room"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateForm(false)}
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
                onClick={handleSubmitIssue}
                disabled={submitting}
                style={{
                  backgroundColor: submitting ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  minWidth: '120px'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Issue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issues List */}
      <div>
        {issues.length === 0 ? (
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>No issues reported yet</div>
            <div>Click "Report New Issue" to submit your first maintenance request</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {issues.map(issue => (
              <div
                key={issue.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'bold' }}>
                      {issue.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{
                        backgroundColor: getPriorityColor(issue.priority),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {issue.priority}
                      </span>
                      <span style={{
                        backgroundColor: getStatusColor(issue.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {issue.status.replace('_', ' ')}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>
                        {issue.category.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', color: '#6b7280', fontSize: '14px' }}>
                    <div>Created: {formatDate(issue.createdAt)}</div>
                    {issue.updatedAt && (
                      <div>Updated: {formatDate(issue.updatedAt)}</div>
                    )}
                    {issue.resolvedAt && (
                      <div>Resolved: {formatDate(issue.resolvedAt)}</div>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 10px 0', color: '#374151' }}>
                    {issue.description}
                  </p>
                  {issue.locationInUnit && (
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>
                      📍 Location: {issue.locationInUnit}
                    </div>
                  )}
                </div>

                {issue.adminNotes && (
                  <div style={{
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '12px',
                    marginTop: '15px'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#374151' }}>
                      Management Notes:
                    </div>
                    <div style={{ color: '#6b7280' }}>
                      {issue.adminNotes}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantIssues;