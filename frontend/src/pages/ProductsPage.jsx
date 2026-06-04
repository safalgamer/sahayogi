import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { formatNPR, formatProviderType, formatLoanType } from '../utils/formatters';
import { getProducts } from '../api/products';

const tagStyle = {
  display: 'inline-block', padding: '4px 10px', borderRadius: '12px',
  fontSize: '0.8em', fontWeight: 600, marginRight: '6px', marginBottom: '6px',
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Could not load products. Is the backend running?');
    }
    setLoading(false);
  };

  return (
    <div>
      <Card>
        <h2 style={{ color: '#1a5276', margin: '0 0 5px' }}>Financial Products</h2>
        <p style={{ color: '#555', margin: 0 }}>
          Browse available financing options from Nepal's financial institutions
        </p>
        <Button style={{ marginTop: '12px' }} onClick={fetchProducts} loading={loading}>
          {loading ? 'Loading...' : 'Load Products'}
        </Button>
      </Card>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {loading && <LoadingSpinner message="Loading products..." />}

      {!loading && products.length === 0 && !error && (
        <Card style={{ textAlign: 'center' }}>
          <p style={{ color: '#7f8c8d' }}>Click "Load Products" to see available financing options.</p>
        </Card>
      )}

      {products.map((p, i) => (
        <Card key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ margin: '0 0 4px' }}>{p.name}</h3>
              <p style={{ margin: '0 0 8px', color: '#555' }}>{p.provider}</p>
            </div>
            <span style={{ ...tagStyle, background: '#eaf2f8', color: '#1a5276' }}>
              {formatProviderType(p.providerType)}
            </span>
          </div>
          <p style={{ color: '#333', lineHeight: 1.5, margin: '8px 0' }}>{p.description}</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={tagStyle}>💰 {formatNPR(p.minAmount)} - {formatNPR(p.maxAmount)}</span>
            <span style={tagStyle}>📊 {p.interestRateMin}% - {p.interestRateMax}%</span>
            <span style={tagStyle}>📅 {p.tenureMinMonths} - {p.tenureMaxMonths} months</span>
            {p.collateralRequired
              ? <span style={{ ...tagStyle, background: '#fdedec', color: '#e74c3c' }}>🏠 Collateral required</span>
              : <span style={{ ...tagStyle, background: '#e8f8f5', color: '#27ae60' }}>✓ No collateral</span>
            }
          </div>
          {p.features && p.features.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              {p.features.map((f, j) => (
                <span key={j} style={{ ...tagStyle, background: '#f0f0f0' }}>{f}</span>
              ))}
            </div>
          )}
          <div style={{ marginTop: '8px', fontSize: '0.85em', color: '#7f8c8d' }}>
            Loan type: {formatLoanType(p.loanType)}
          </div>
        </Card>
      ))}
    </div>
  );
}
