import React from 'react';
import Header from './Header';
import Footer from './Footer';

const styles = {
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: { flex: 1 },
};

export default function Layout({ children, currentPage, onNavigate }) {
  return (
    <div style={styles.container}>
      <Header currentPage={currentPage} onNavigate={onNavigate} />
      <main style={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
