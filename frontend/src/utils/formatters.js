export function formatNPR(amount) {
  if (amount == null || isNaN(amount)) return 'NPR 0';
  return `NPR ${Number(amount).toLocaleString('en-IN')}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatProviderType(type) {
  return (type || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function formatLoanType(type) {
  return (type || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function getMatchColor(score) {
  if (score >= 60) return '#27ae60';
  if (score >= 30) return '#f39c12';
  return '#e74c3c';
}
