import React from 'react';
import { formatNPR, getMatchColor, formatProviderType } from '../utils/formatters';

const styles = {
  resultCard: {
    background: '#f0f9f0', borderRadius: '8px', padding: '16px',
    margin: '10px 0', borderLeft: '4px solid #27ae60',
  },
  partialCard: {
    background: '#fef9e7', borderRadius: '8px', padding: '16px',
    margin: '10px 0', borderLeft: '4px solid #f39c12',
  },
  tag: {
    display: 'inline-block', padding: '4px 10px', borderRadius: '12px',
    fontSize: '0.8em', fontWeight: 600, marginRight: '6px', marginBottom: '6px',
  },
};

export default function MatchCard({ result, isPartial = false }) {
  const scoreColor = getMatchColor(result.matchScore);
  const cardStyle = isPartial ? styles.partialCard : styles.resultCard;

  return (
    <div style={cardStyle}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', flexWrap: 'wrap',
      }}>
        <div>
          <h4 style={{ margin: '0 0 4px' }}>{result.productName}</h4>
          <p style={{ margin: 0, color: '#555' }}>
            {result.provider} ({formatProviderType(result.providerType)})
          </p>
        </div>
        <div style={{
          background: scoreColor, color: 'white', padding: '4px 12px',
          borderRadius: '12px', fontSize: '0.85em', fontWeight: 600,
        }}>
          {result.matchScore}% Match
        </div>
      </div>
      <div style={{ display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap' }}>
        <span style={styles.tag}>💰 {formatNPR(result.estimatedAmount)}</span>
        <span style={styles.tag}>📊 Rate: {result.estimatedRate}</span>
      </div>
      <p style={{ fontSize: '0.9em', color: '#555', margin: '8px 0 0' }}>{result.reasoning}</p>
    </div>
  );
}
