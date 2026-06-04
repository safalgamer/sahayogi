import React from 'react';

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div style={{
      background: '#fdedec', color: '#e74c3c', padding: '12px 16px',
      borderRadius: '8px', marginBottom: '16px', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none', border: 'none', color: '#e74c3c',
            cursor: 'pointer', fontSize: '1.2em', padding: '0 4px',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
