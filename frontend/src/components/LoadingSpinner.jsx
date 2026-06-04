import React from 'react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
      <div style={{
        width: 40, height: 40, border: '4px solid #eaf2f8',
        borderTop: '4px solid #1a5276', borderRadius: '50%',
        animation: 'spin 1s linear infinite', margin: '0 auto 16px',
      }} />
      <p>{message}</p>
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
  );
}
