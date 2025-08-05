export const sanitizeInput = (value: string): string => {
  // 1. Remove all non-numeric chars except first decimal point
  let sanitizedValue = value
    .replace(/[^\d.]/g, '') // Strip all non-digits/dots
    .replace(/(\..*)\./g, '$1') // Allow only first decimal
    .replace(/^\./, '0.') // Convert . → 0.
    .replace(/^0+(\d)/, '$1'); // Prevent 042 → 42

  // 2. Handle edge cases
  if (value === '' || value === '0') {
    sanitizedValue = value;
  }

  return sanitizedValue;
};
