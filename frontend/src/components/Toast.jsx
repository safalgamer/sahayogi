import React, { useEffect, useState, useCallback } from 'react';

let toastListeners = [];
export function showToast(message, type = 'info') {
  toastListeners.forEach(fn => fn(message, type));
}

const styles = {
  container: {
    position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  toast: {
    padding: '12px 20px', borderRadius: '8px', color: 'white',
    fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    maxWidth: '400px', animation: 'slideIn 0.3s ease-out',
  },
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => { toastListeners = toastListeners.filter(fn => fn !== addToast); };
  }, [addToast]);

  const bgColors = { success: '#27ae60', error: '#e74c3c', info: '#2e86c1', warning: '#f39c12' };

  return (
    <div style={styles.container}>
      {toasts.map(t => (
        <div key={t.id} style={{ ...styles.toast, background: bgColors[t.type] || bgColors.info }}>
          {t.message}
        </div>
      ))}
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
