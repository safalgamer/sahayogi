import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import { showToast } from '../components/Toast';

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      showToast('Logged in successfully', 'success');
      onNavigate && onNavigate('home');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Card>
        <h2 style={{ color: '#1a5276', marginTop: 0 }}>Login</h2>
        <ErrorMessage message={error} onDismiss={() => setError('')} />
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
          <Button type="submit" size="lg" fullWidth loading={loading} style={{ marginTop: '8px' }}>
            Login
          </Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', color: '#7f8c8d' }}>
          Don't have an account?{' '}
          <span
            style={{ color: '#1a5276', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => onNavigate && onNavigate('register')}
          >
            Register
          </span>
        </p>
      </Card>
    </div>
  );
}
