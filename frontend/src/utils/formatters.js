export const formatCurrency = (amount) => {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
};

export const formatPercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};
