export const formatAmount = (amount: number) => {
  if (amount === 0) return '0';

  if (amount < 1) {
    return amount.toFixed(6).replace(/\.?0+$/, '');
  }

  // For amounts between 1 and 1000
  if (amount < 1000) {
    return amount.toFixed(4).replace(/\.?0+$/, '');
  }

  // For amounts 1000 and above
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact',
    compactDisplay: 'short',
  }).format(amount);
};
