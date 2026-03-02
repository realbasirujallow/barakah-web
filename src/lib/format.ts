/**
 * Shared currency formatter.
 * TODO: Read user's preferredCurrency from profile instead of hardcoding USD.
 */
export function fmt(n: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);
}
