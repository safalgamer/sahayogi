import React from 'react';

const styles = {
  footer: { textAlign: 'center', padding: '20px', color: '#7f8c8d', marginTop: '40px' },
};

export default function Footer() {
  return (
    <div style={styles.footer}>
      <p>Sahayogi - Empowering Nepalese SMEs with financial access</p>
      <p style={{ fontSize: '0.85em' }}>
        Data sourced from Nepal Rastra Bank and partner financial institutions
      </p>
    </div>
  );
}
