import React from 'react';

const styles = {
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    marginBottom: '20px',
  },
};

export default function Card({ children, style = {}, onClick }) {
  return (
    <div style={{ ...styles.card, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}
