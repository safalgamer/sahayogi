import React from 'react';

const variants = {
  primary: { background: '#1a5276', color: 'white', border: 'none' },
  secondary: { background: '#eaf2f8', color: '#1a5276', border: 'none' },
  outline: { background: 'white', color: '#1a5276', border: '2px solid #1a5276' },
  danger: { background: '#e74c3c', color: 'white', border: 'none' },
};

const sizes = {
  sm: { padding: '6px 12px', fontSize: '0.85em' },
  md: { padding: '10px 20px', fontSize: '0.95em' },
  lg: { padding: '14px 32px', fontSize: '1.1em' },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  type = 'button',
  style = {},
}) {
  const baseStyle = {
    borderRadius: '8px',
    cursor: loading || disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    opacity: loading || disabled ? 0.7 : 1,
    width: fullWidth ? '100%' : 'auto',
    transition: 'opacity 0.2s',
    ...variants[variant] || variants.primary,
    ...sizes[size] || sizes.md,
    ...style,
  };

  return (
    <button type={type} style={baseStyle} onClick={onClick} disabled={disabled || loading}>
      {loading ? 'Loading...' : children}
    </button>
  );
}
