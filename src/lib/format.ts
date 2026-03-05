/**
 * Raw currency formatter — always formats in the given currency (defaults to USD).
 *
 * For React components, prefer the `useCurrency()` hook from `./useCurrency`
 * which automatically respects the user's preferred currency from their profile.
 *
 *   const { fmt } = useCurrency();   // reads user's preferredCurrency automatically
 *
 * Use this raw fmt() only in non-React contexts (e.g. utility functions).
 */
export function fmt(n: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);
}
