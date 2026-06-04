import React from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

const features = [
  { icon: '🏦', title: 'Lender Directory', desc: 'Compare 10+ financial products from banks, microfinance, cooperatives & government schemes' },
  { icon: '✓', title: 'Smart Matching', desc: 'Our algorithm matches your business profile with the best available financing options' },
  { icon: '📋', title: 'Document Checklist', desc: 'Get a personalized list of documents needed for your loan application' },
  { icon: '📚', title: 'Financial Education', desc: 'Learn how to improve your creditworthiness and manage business finances' },
];

const steps = [
  { step: '1', title: 'Tell us about your business', desc: 'Answer a few questions about your business type, revenue, and needs' },
  { step: '2', title: 'Get matched', desc: 'Our system finds the best financing options for your profile' },
  { step: '3', title: 'Compare & apply', desc: 'Review your matches, prepare documents, and contact lenders directly' },
];

export default function HomePage({ onNavigate }) {
  return (
    <div>
      <Card style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#1a5276' }}>Find the Right Financing for Your Business</h2>
        <p style={{ fontSize: '1.1em', color: '#555', lineHeight: 1.6 }}>
          78% of Nepalese SMEs face working capital challenges. Banks reject over 60% of loan applications.
          <br />
          Sahayogi helps you find the right financing option for your business in under 2 minutes.
        </p>
        <Button size="lg" onClick={() => onNavigate && onNavigate('eligibility')}>
          Check Your Eligibility Now
        </Button>
        <p style={{ fontSize: '0.9em', color: '#7f8c8d', marginTop: '15px' }}>
          Free • No registration required • 2 minutes
        </p>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {features.map((item, i) => (
          <Card key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>{item.icon}</div>
            <h3 style={{ color: '#1a5276', margin: '0 0 8px' }}>{item.title}</h3>
            <p style={{ color: '#555', lineHeight: 1.5 }}>{item.desc}</p>
          </Card>
        ))}
      </div>

      <Card style={{ background: '#f8f9fa' }}>
        <h3 style={{ color: '#1a5276' }}>How It Works</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' }}>
          {steps.map((item, i) => (
            <div key={i} style={{
              flex: 1, minWidth: '200px', padding: '15px',
              background: 'white', borderRadius: '8px',
            }}>
              <div style={{
                width: '36px', height: '36px', background: '#1a5276', color: 'white',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 'bold', marginBottom: '10px',
              }}>{item.step}</div>
              <h4 style={{ margin: '0 0 6px' }}>{item.title}</h4>
              <p style={{ color: '#555', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
