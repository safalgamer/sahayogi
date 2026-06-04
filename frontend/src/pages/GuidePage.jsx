import React from 'react';
import Card from '../components/Card';

const schemes = [
  {
    name: 'SME Development Bank Loan',
    desc: 'Loans at subsidized rates (6-8%) for registered SMEs',
    eligibility: 'Business registered for at least 2 years, annual turnover up to NPR 50M',
  },
  {
    name: 'Startup Enterprise Credit (2024)',
    desc: 'Subsidized loans under Industrial Enterprise Regulation',
    eligibility: 'Registered startups with innovative business model',
  },
  {
    name: 'Youth Self-Employment Program',
    desc: 'Loans for young entrepreneurs aged 18-40',
    eligibility: 'Nepali citizens aged 18-40 with viable business plan',
  },
];

const documents = [
  'Business registration certificate (Company / PAN)',
  'Tax clearance certificate (last 2 years minimum)',
  'Audited financial statements (P&L, Balance Sheet)',
  'Bank statements (last 6-12 months)',
  'Business proposal / project report',
  'Personal guarantee documents',
  'Collateral documents (property title deed, valuation)',
  'Partnership deed / MOA (if applicable)',
  'Citizenship certificate of owner(s)',
  'Proof of business address (rent agreement or utility bill)',
];

const tips = [
  'Maintain separate business and personal bank accounts',
  'Keep accurate and up-to-date financial records',
  'File your taxes on time every year',
  'Maintain a good credit score by paying loans on time',
  'Prepare a clear business plan explaining loan utilization',
  'Build savings for at least 3 months of operating expenses',
  'Start with smaller loans to build banking relationship',
  'Consider microfinance as a stepping stone to formal banking',
];

export default function GuidePage() {
  return (
    <div>
      <Card>
        <h2 style={{ color: '#1a5276', margin: '0 0 5px' }}>Loan Application Guide</h2>
        <p style={{ color: '#555', margin: 0 }}>
          Essential documents and tips for a successful loan application
        </p>
      </Card>

      <Card>
        <h3 style={{ color: '#1a5276' }}>📋 Required Documents Checklist</h3>
        <ul style={{ lineHeight: 2, paddingLeft: '20px' }}>
          {documents.map((doc, i) => (
            <li key={i}>{doc}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 style={{ color: '#1a5276' }}>🏛 Government Schemes You Should Know</h3>
        {schemes.map((s, i) => (
          <div key={i} style={{ padding: '12px', margin: '10px 0', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 4px' }}>{s.name}</h4>
            <p style={{ margin: '0 0 4px', color: '#555' }}>{s.desc}</p>
            <p style={{ margin: 0, fontSize: '0.9em', color: '#7f8c8d' }}>Eligibility: {s.eligibility}</p>
          </div>
        ))}
      </Card>

      <Card>
        <h3 style={{ color: '#1a5276' }}>💡 Tips to Improve Loan Approval Chances</h3>
        <ol style={{ lineHeight: 2, paddingLeft: '20px' }}>
          {tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
