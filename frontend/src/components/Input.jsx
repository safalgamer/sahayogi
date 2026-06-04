import React from 'react';

const styles = {
  wrapper: { marginBottom: '12px' },
  label: { display: 'block', fontWeight: 600, marginBottom: '4px', fontSize: '0.9em' },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '0.95em',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  inputError: { borderColor: '#e74c3c' },
  error: { color: '#e74c3c', fontSize: '0.8em', marginTop: '4px' },
};

export default function Input({ label, error, ...props }) {
  const inputStyle = {
    ...styles.input,
    ...(error ? styles.inputError : {}),
    ...(props.style || {}),
  };

  return (
    <div style={{ ...styles.wrapper, ...(props.wrapperStyle || {}) }}>
      {label && <label style={styles.label}>{label}</label>}
      <input {...props} style={inputStyle} />
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}
