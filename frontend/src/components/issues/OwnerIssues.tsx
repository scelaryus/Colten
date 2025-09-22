import React, { useState, useEffect } from 'react';
import { issueService } from '../../services/issue';
import type { Issue } from '../../types/api';

// Using the real Issue type from API types

const ISSUE_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const OwnerIssues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');
  const [updatingIssue, setUpdatingIssue] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, selectedStatus, selectedPriority, selectedBuilding]);

  const loadIssues = async () => {
    setLoading(true);
    try {
      console.log('Loading owner issues from API...');
      const ownerIssues = await issueService.getOwnerIssues();
      console.log('Loaded issues:', ownerIssues);
      setIssues(ownerIssues);
    } catch (err) {
      console.error('Failed to load issues from API:', err);
      setError('Failed to load issues from server');
      
      // Fallback to empty array instead of mock data
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = [...issues];

    if (selectedStatus !== 'ALL') {
      filtered = filtered.filter(issue => issue.status === selectedStatus);
    }

    if (selectedPriority !== 'ALL') {
      filtered = filtered.filter(issue => issue.priority === selectedPriority);
    }

    if (selectedBuilding !== 'ALL') {
      filtered = filtered.filter(issue => issue.unit.building.name === selectedBuilding);
    }

    // Sort by priority and creation date
    filtered.sort((a, b) => {
      const priorityOrder = { 'EMERGENCY': 5, 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newer first
    });

    setFilteredIssues(filtered);
  };

  const updateIssueStatus = async (issueId: number, newStatus: string, adminNotes?: string) => {
    setUpdatingIssue(issueId);
    setError('');
    setSuccess('');

    try {
      console.log('Updating issue status via API:', { issueId, newStatus, adminNotes });
      const updatedIssue = await issueService.updateIssueStatus(issueId, newStatus, adminNotes);
      
      // Update the local state with the updated issue
      const updatedIssues = issues.map(issue => 
        issue.id === issueId ? updatedIssue : issue
      );
      
      setIssues(updatedIssues);
      setSuccess(`Issue #${issueId} status updated to ${newStatus}`);

      console.log('✅ Issue Status Updated Successfully:', updatedIssue);

    } catch (err) {
      console.error('Failed to update issue status:', err);
      setError('Failed to update issue status');
    } finally {
      setUpdatingIssue(null);
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

  const getUniqueBuildings = () => {
    const buildings = [...new Set(issues.map(issue => issue.unit?.building?.name).filter(Boolean))];
    return buildings;
  };

  const getIssueCounts = () => {
    return {
      total: issues.length,
      open: issues.filter(i => i.status === 'OPEN').length,
      inProgress: issues.filter(i => i.status === 'IN_PROGRESS').length,
      urgent: issues.filter(i => i.priority === 'URGENT' || i.priority === 'EMERGENCY').length
    };
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading issues...</div>
      </div>
    );
  }

  const counts = getIssueCounts();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1>Maintenance Issues</h1>
        <p style={{ color: '#6b7280', margin: '10px 0' }}>
          Manage and track maintenance requests from all your tenants
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

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{counts.total}</div>
          <div style={{ color: '#6b7280' }}>Total Issues</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>{counts.open}</div>
          <div style={{ color: '#6b7280' }}>Open Issues</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>{counts.inProgress}</div>
          <div style={{ color: '#6b7280' }}>In Progress</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>{counts.urgent}</div>
          <div style={{ color: '#6b7280' }}>Urgent/Emergency</div>
        </div>
      </div>

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
              {ISSUE_STATUSES.map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px'
              }}
            >
              <option value="ALL">All Priorities</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
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
        </div>
      </div>

      {/* Issues List */}
      <div>
        {filteredIssues.length === 0 ? (
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>No issues found</div>
            <div>Try adjusting your filters to see more results</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredIssues.map(issue => (
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
                      #{issue.id} - {issue.title}
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
                    <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '10px' }}>
                      <strong>Tenant:</strong> {issue.tenant.firstName} {issue.tenant.lastName} ({issue.tenant.email})
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>
                      <strong>Unit:</strong> {issue.unit.building.name} - Unit {issue.unit.unitNumber}
                      {issue.locationInUnit && ` (${issue.locationInUnit})`}
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
                  <p style={{ margin: '0', color: '#374151' }}>
                    {issue.description}
                  </p>
                </div>

                {issue.adminNotes && (
                  <div style={{
                    backgroundColor: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#374151' }}>
                      Admin Notes:
                    </div>
                    <div style={{ color: '#6b7280' }}>
                      {issue.adminNotes}
                    </div>
                  </div>
                )}

                {/* Status Update Controls */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Update Status:</span>
                  {ISSUE_STATUSES.map(status => (
                    <button
                      key={status}
                      onClick={() => updateIssueStatus(issue.id, status)}
                      disabled={updatingIssue === issue.id || issue.status === status}
                      style={{
                        backgroundColor: issue.status === status ? getStatusColor(status) : '#f3f4f6',
                        color: issue.status === status ? 'white' : '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        cursor: updatingIssue === issue.id || issue.status === status ? 'not-allowed' : 'pointer',
                        opacity: updatingIssue === issue.id ? 0.5 : 1
                      }}
                    >
                      {updatingIssue === issue.id ? 'Updating...' : status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerIssues;