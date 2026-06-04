import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import MatchCard from '../components/MatchCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { BUSINESS_TYPES, LOAN_PURPOSES } from '../utils/constants';
import { checkEligibility } from '../api/eligibility';

const inputStyle = {
  width: '100%', padding: '10px 12px', margin: '6px 0',
  border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95em',
  boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle, background: 'white',
};

const initialState = {
  businessType: 'retail',
  establishedYear: 2020,
  monthlyRevenue: 50000,
  employeeCount: 5,
  loanAmount: 200000,
  loanPurpose: 'working_capital',
  hasCollateral: false,
  previousLoan: false,
};

export default function EligibilityPage() {
  const [form, setForm] = useState(initialState);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await checkEligibility(form);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to check eligibility. Is the backend running?');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setResult(null);
    setForm(initialState);
    setError('');
  };

  if (loading) return <LoadingSpinner message="Analyzing your business profile..." />;

  if (result) {
    return (
      <div>
        <Card style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#1a5276', margin: 0 }}>Your Results</h2>
          <p style={{ color: '#555' }}>
            We found {result.totalProductsFound} products matching your profile
          </p>
        </Card>

        {result.recommendations && result.recommendations.length > 0 && (
          <Card>
            <h3 style={{ color: '#27ae60', margin: '0 0 15px' }}>✓ Best Matches for You</h3>
            {result.recommendations.map((r, i) => (
              <MatchCard key={i} result={r} />
            ))}
          </Card>
        )}

        {result.partialMatches && result.partialMatches.length > 0 && (
          <Card>
            <h3 style={{ color: '#f39c12', margin: '0 0 15px' }}>⚠ Partial Matches</h3>
            {result.partialMatches.map((r, i) => (
              <MatchCard key={i} result={r} isPartial />
            ))}
          </Card>
        )}

        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Button variant="outline" onClick={handleReset}>
            Try Different Values
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <h2 style={{ color: '#1a5276', marginTop: 0 }}>Business Profile</h2>
      <p style={{ color: '#555' }}>Fill in your business details to find matching financing options.</p>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '15px' }}>
        <div>
          <label style={{ fontWeight: 600 }}>Business Type</label>
          <select name="businessType" value={form.businessType} onChange={handleChange} style={selectStyle}>
            {BUSINESS_TYPES.map(bt => (
              <option key={bt.value} value={bt.value}>{bt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Year Established</label>
          <input type="number" name="establishedYear" value={form.establishedYear}
            onChange={handleChange} style={inputStyle} min="1900" max="2026" />
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Monthly Revenue (NPR)</label>
          <input type="number" name="monthlyRevenue" value={form.monthlyRevenue}
            onChange={handleChange} style={inputStyle} min="0" />
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Number of Employees</label>
          <input type="number" name="employeeCount" value={form.employeeCount}
            onChange={handleChange} style={inputStyle} min="0" />
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Loan Amount Needed (NPR)</label>
          <input type="number" name="loanAmount" value={form.loanAmount}
            onChange={handleChange} style={inputStyle} min="0" />
        </div>
        <div>
          <label style={{ fontWeight: 600 }}>Loan Purpose</label>
          <select name="loanPurpose" value={form.loanPurpose} onChange={handleChange} style={selectStyle}>
            {LOAN_PURPOSES.map(lp => (
              <option key={lp.value} value={lp.value}>{lp.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', marginTop: '15px', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" name="hasCollateral" checked={form.hasCollateral} onChange={handleChange} />
          <span>I have collateral (property/assets)</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" name="previousLoan" checked={form.previousLoan} onChange={handleChange} />
          <span>I have taken a business loan before</span>
        </label>
      </div>

      <Button size="lg" onClick={handleSubmit} disabled={loading} style={{ marginTop: '16px' }}>
        {loading ? 'Analyzing...' : 'Check Eligibility'}
      </Button>
    </Card>
  );
}
