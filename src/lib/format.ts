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

/**
 * Converts a Gregorian date to Hijri date using the standard Kuwaiti algorithm.
 * Returns an object with year, month (1-12), day, and monthName.
 * This is the authoritative Hijri calculation used across the app.
 */
export function toHijri(date: Date): { year: number; month: number; day: number; monthName: string } {
  const HIJRI_MONTHS = [
    'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
    'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
  ];
  // JD number
  const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
  const l  = jd - 1948440 + 10632;
  const n  = Math.floor((l - 1) / 10631);
  const ll = l - 10631 * n + 354;
  const j  = Math.floor((10985 - ll) / 5316) * Math.floor((50 * ll) / 17719)
           + Math.floor(ll / 5670) * Math.floor((43 * ll) / 15238);
  const ll2 = ll - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
            - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * ll2) / 709);
  const day   = ll2 - Math.floor((709 * month) / 24);
  const year  = 30 * n + j - 30;
  return { year, month: month + 1, day, monthName: HIJRI_MONTHS[month] ?? '' };
}
