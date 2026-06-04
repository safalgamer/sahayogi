import React from 'react';
import { useAuth } from '../hooks/useAuth';

const styles = {
  header: {
    background: 'linear-gradient(135deg, #1a5276, #2e86c1)',
    color: 'white',
    padding: '24px 30px',
    borderRadius: '12px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: { margin: 0, fontSize: '1.8em', cursor: 'pointer' },
  nav: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  navBtn: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: 600,
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    transition: 'background 0.2s',
  },
  navBtnActive: { background: 'rgba(255,255,255,0.35)' },
  userMenu: { display: 'flex', alignItems: 'center', gap: '8px' },
  userName: { fontSize: '0.9em', opacity: 0.9 },
};

export default function Header({ currentPage, onNavigate }) {
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'eligibility', label: 'Check Eligibility' },
    { key: 'products', label: 'Products' },
    { key: 'guide', label: 'Guide' },
  ];

  return (
    <div style={styles.header}>
      <h1 style={styles.title} onClick={() => onNavigate && onNavigate('home')}>
        Sahayogi
      </h1>
      <div style={styles.nav}>
        {navItems.map(item => (
          <button
            key={item.key}
            style={{ ...styles.navBtn, ...(currentPage === item.key ? styles.navBtnActive : {}) }}
            onClick={() => onNavigate && onNavigate(item.key)}
          >
            {item.label}
          </button>
        ))}
        {user ? (
          <div style={styles.userMenu}>
            <span style={styles.userName}>{user.name || user.email}</span>
            {isAdmin && (
              <button style={styles.navBtn} onClick={() => onNavigate && onNavigate('admin')}>
                Admin
              </button>
            )}
            <button style={styles.navBtn} onClick={() => onNavigate && onNavigate('dashboard')}>
              Dashboard
            </button>
            <button style={{ ...styles.navBtn, background: 'rgba(255,255,255,0.1)' }} onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <button style={styles.navBtn} onClick={() => onNavigate && onNavigate('login')}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}
