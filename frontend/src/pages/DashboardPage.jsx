import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { default: apiClient } = await import('../api/client');
        const data = await apiClient('/eligibility/history');
        setHistory(data.checks || []);
      } catch (err) {
        setError('Could not load history');
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div>
      <Card>
        <h2 style={{ color: '#1a5276', margin: '0 0 5px' }}>Dashboard</h2>
        <p style={{ color: '#555', margin: 0 }}>
          Welcome back, {user?.name || user?.email}
        </p>
      </Card>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <Card>
        <h3 style={{ color: '#1a5276' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ padding: '8px 16px', background: '#eaf2f8', borderRadius: '8px', cursor: 'pointer', color: '#1a5276', fontWeight: 600 }}
            onClick={() => onNavigate && onNavigate('eligibility')}>
            Check Eligibility
          </span>
          <span style={{ padding: '8px 16px', background: '#eaf2f8', borderRadius: '8px', cursor: 'pointer', color: '#1a5276', fontWeight: 600 }}
            onClick={() => onNavigate && onNavigate('products')}>
            Browse Products
          </span>
        </div>
      </Card>

      <Card>
        <h3 style={{ color: '#1a5276' }}>Eligibility History ({history.length})</h3>
        {history.length === 0 && (
          <p style={{ color: '#7f8c8d' }}>No eligibility checks yet.</p>
        )}
        {history.map((check, i) => (
          <div key={i} style={{
            padding: '10px', margin: '8px 0', background: '#f8f9fa',
            borderRadius: '8px', fontSize: '0.9em',
          }}>
            <div>{new Date(check.createdAt).toLocaleDateString()}</div>
            <div style={{ color: '#555' }}>
              {check.inputData?.businessType} — NPR {check.inputData?.loanAmount?.toLocaleString('en-IN')}
            </div>
            <div style={{ color: '#27ae60', fontWeight: 600 }}>
              Top match: {check.topMatch || 'N/A'}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
