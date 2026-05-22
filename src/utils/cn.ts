export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(amount?: number): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IE');
}
