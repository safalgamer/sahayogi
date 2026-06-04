import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

export default function NotFoundPage({ onNavigate }) {
  return (
    <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '4em', color: '#1a5276', margin: '0 0 10px' }}>404</h1>
      <h2 style={{ color: '#555' }}>Page Not Found</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '24px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button onClick={() => onNavigate && onNavigate('home')}>
        Go Home
      </Button>
    </Card>
  );
}
