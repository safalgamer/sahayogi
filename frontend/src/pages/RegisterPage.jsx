import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import { showToast } from '../components/Toast';

export default function RegisterPage({ onNavigate }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.includes('@')) errs.email = 'Valid email required';
    if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name, email, password);
      showToast('Account created successfully!', 'success');
      onNavigate && onNavigate('home');
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed' });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Card>
        <h2 style={{ color: '#1a5276', marginTop: 0 }}>Create Account</h2>
        {errors.form && <ErrorMessage message={errors.form} onDismiss={() => setErrors({})} />}
        <form onSubmit={handleSubmit}>
          <Input label="Full Name" value={name} onChange={e => setName(e.target.value)}
            required placeholder="Your name" error={errors.name} />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            required placeholder="your@email.com" error={errors.email} />
          <Input label="Password" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            required placeholder="At least 8 characters" error={errors.password} />
          <Input label="Confirm Password" type="password" value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required placeholder="Repeat password" error={errors.confirmPassword} />
          <Button type="submit" size="lg" fullWidth loading={loading} style={{ marginTop: '8px' }}>
            Create Account
          </Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', color: '#7f8c8d' }}>
          Already have an account?{' '}
          <span style={{ color: '#1a5276', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => onNavigate && onNavigate('login')}>
            Login
          </span>
        </p>
      </Card>
    </div>
  );
}
