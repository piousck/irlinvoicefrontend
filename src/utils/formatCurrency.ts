export function formatCurrency(value?: number | null, currency = 'EUR'): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}
