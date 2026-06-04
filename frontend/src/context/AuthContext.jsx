import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, refreshToken } from '../api/auth';
import { getToken, setTokens, clearTokens } from '../api/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser({ id: payload.id, email: payload.email, role: payload.role });
        } else {
          refreshToken().then(data => {
            setUser({ id: data.user?.id || payload.id, email: payload.email, role: payload.role });
          }).catch(() => {
            clearTokens();
          });
        }
      } catch {
        clearTokens();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setError('');
    try {
      const userData = await apiLogin(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setError('');
    try {
      const userData = await apiRegister(name, email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      clearTokens();
    }
  }, []);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, isAdmin, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
