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
  // Round 24: undefined locale → browser default (navigator.language on
  // client, ICU default on server). Matches the R23 useCurrency pattern.
  if (!isFinite(n)) return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(0);
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n);
}

/**
 * Converts a Gregorian date to Hijri date using the Intl.DateTimeFormat API
 * with the Umm al-Qura calendar (the official calendar of Saudi Arabia,
 * widely accepted as the most accurate algorithmic Hijri calendar).
 *
 * The previous Kuwaiti algorithm had a systematic one-month offset bug.
 * The native Intl API is maintained by ICU/CLDR and is authoritative.
 */
export function toHijri(date: Date): { year: number; month: number; day: number; monthName: string } {
  const HIJRI_MONTHS = [
    'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
    'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
  ];

  try {
    // Use the native Intl API with the Umm al-Qura Islamic calendar
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(date);

    const dayStr = parts.find(p => p.type === 'day')?.value ?? '1';
    const monthStr = parts.find(p => p.type === 'month')?.value ?? '1';
    const yearStr = parts.find(p => p.type === 'year')?.value ?? '1';

    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10); // 1-12
    const year = parseInt(yearStr, 10);

    return { year, month, day, monthName: HIJRI_MONTHS[month - 1] ?? '' };
  } catch {
    // Fallback: return approximate values using Julian Day calculation
    // (only triggers on extremely old JS engines without Intl support)
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
}

/**
 * Hijri month names in Arabic (1-indexed: position 0 is empty padding).
 * Used for {@link formatHijriLocalized} when rendering for an Arabic-locale user.
 *
 * 2026-05-08 (item J): rendering "21 Dhul Qadah 1447" verbatim on the
 * `ar` locale was tonally wrong — Latin transliteration of Hijri month
 * names in an Arabic-language UI reads as a translation gap rather than
 * a deliberate choice. True Arabic rendering uses Eastern Arabic
 * numerals (٠١٢٣٤٥٦٧٨٩) plus the Arabic-script month names.
 */
const HIJRI_MONTH_NAMES_AR = [
  '',
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

/** Convert a Latin-numeral string ("1447") to Eastern Arabic numerals ("١٤٤٧"). */
function toArabicNumerals(input: string | number): string {
  const s = typeof input === 'number' ? String(input) : input;
  const map = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return s.replace(/[0-9]/g, (d) => map[parseInt(d, 10)]);
}

/**
 * Render a Hijri date appropriate to the user's locale.
 *
 * - For `ar` (Arabic): "٢١ ذو القعدة ١٤٤٧" — Eastern Arabic numerals plus
 *   Arabic-script month name.
 * - For everything else (en/fr/ur/...): the English form Barakah's
 *   backend already produces, e.g. "21 Dhul Qadah 1447". Urdu uses
 *   Latin transliteration by convention (Urdu speakers are familiar
 *   with the Latin spelling of Hijri months and the dashboard already
 *   pairs the Hijri date with the locale-formatted Gregorian).
 *
 * The function is robust to a missing month number (falls back to the
 * pre-formatted English string) so a backend that hasn't rolled out the
 * 2026-05-08 schema additions still renders something sensible.
 *
 * @param formatted The English-canonical "{day} {monthName} {year}" string
 *                  the backend has always returned. Used as the non-Arabic
 *                  fallback and as the safety fallback if {@code month}
 *                  is missing or out of range.
 * @param day       1-indexed day of the Hijri month.
 * @param month     1-indexed Hijri month number (1 = Muharram, 12 = Dhul Hijjah).
 * @param year      Hijri year.
 * @param locale    BCP-47 locale tag (e.g. "ar-SA", "en-GB", "fr-FR").
 */
export function formatHijriLocalized(
  formatted: string,
  day: number | undefined,
  month: number | undefined,
  year: number | undefined,
  locale: string | undefined,
): string {
  const isArabic = (locale || '').toLowerCase().startsWith('ar');
  if (!isArabic) return formatted;
  if (!day || !month || !year || month < 1 || month > 12) return formatted;
  return `${toArabicNumerals(day)} ${HIJRI_MONTH_NAMES_AR[month]} ${toArabicNumerals(year)}`;
}
