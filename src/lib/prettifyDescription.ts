/**
 * 2026-05-03 — bank/ACH description prettifier
 *
 * Plaid (and most CSV imports) hand us transaction descriptions that
 * are raw bank-statement blobs:
 *
 *   "ORIG CO NAME:IN 529 Dir ACH CO ENTRY DESCR:CONTRIB SEC:WEB IND ID:000029897953049 ORIG ID:1356651600"
 *   "EXTERNAL TRANSFER FROM CHASE COLLEGE *5335 ON 05/01"
 *   "POS DEBIT - VISA - SQ *AVON FOUNDATION CTR 4/30"
 *   "AVON RURAL KING FREMONT IN 5042 04/30"
 *
 * Investors will scroll the transaction list during the demo. The raw
 * blob reads like an error — Monarch's "smart merchant detection"
 * compresses these to readable merchant names. This helper does the
 * same compression on the client side. Pure transform, no side
 * effects, easy to unit-test.
 *
 * Strategy: ordered list of patterns, each with a way to extract the
 * merchant. First match wins. If nothing matches, return a lightly
 * cleaned version of the original (strip trailing IDs, trim, collapse
 * whitespace) so we never make things WORSE.
 */

interface Pattern {
  regex: RegExp;
  extract: (match: RegExpMatchArray) => string;
  /** Optional debug label for unit-test diffing. */
  name?: string;
}

const PATTERNS: Pattern[] = [
  // 1. "ORIG CO NAME:<merchant> Dir ACH..." or "ORIG CO NAME:<merchant> ACH CO ENTRY..."
  //    The merchant ends at the next keyword we recognise as ACH boilerplate.
  {
    name: 'ORIG CO NAME',
    regex: /ORIG\s+CO\s+NAME[:=]\s*([^]+?)\s+(?:Dir\s+ACH|DIR\s+ACH|ACH\s+CO\s+ENTRY|CO\s+ENTRY|ENTRY\s+DESCR|SEC[:=]|IND\s+ID|ORIG\s+ID|TYPE[:=])/i,
    extract: m => m[1],
  },
  // 2. "EXTERNAL TRANSFER FROM <merchant> ON ..."
  {
    name: 'EXTERNAL TRANSFER FROM',
    regex: /EXTERNAL\s+TRANSFER\s+FROM\s+([^]+?)\s+(?:ON\s+\d|REF[#:]|\*\d{4})/i,
    extract: m => m[1],
  },
  // 3. "RECEIVED ZELLE PMT ID:... FROM <name>"
  {
    name: 'ZELLE FROM',
    regex: /(?:RECEIVED|SENT)\s+ZELLE\s+(?:PMT|PAYMENT)?\s*(?:ID[:=]\S+\s+)?(?:FROM|TO)\s+([A-Z][A-Z\s.'-]+?)(?:\s+(?:ON|\d{2}\/\d{2}|REF))/i,
    extract: m => `Zelle — ${titleCase(m[1])}`,
  },
  // 4. "POS DEBIT - VISA - SQ *<merchant> <date>"
  //    The "SQ *" prefix is Square; strip it. Other card networks (VISA/MC)
  //    are noise here.
  {
    name: 'POS DEBIT',
    regex: /POS\s+DEBIT\s*[-:]?\s*(?:VISA|MC|MASTERCARD|AMEX|DISCOVER)?\s*[-:]?\s*(?:SQ\s*\*\s*)?([^]+?)\s+\d{1,2}\/\d{1,2}/i,
    extract: m => m[1],
  },
  // 5. "<merchant> <CITY> <STATE> <DIGITS> <DATE>" — common card-statement format.
  //    Heuristic: keep tokens before the first 4+ digit run, OR before a
  //    state abbreviation at end-of-string.
  {
    name: 'card location trail',
    regex: /^([A-Z0-9\s.&'*-]+?)(?:\s+[A-Z]{2})?\s+\d{4,}\s+\d{1,2}\/\d{1,2}\s*$/,
    extract: m => m[1],
  },
  // 6. "PURCHASE AUTHORIZED ON <date> <merchant> <city> <state> <id>"
  {
    name: 'PURCHASE AUTHORIZED',
    regex: /PURCHASE\s+AUTHORIZED\s+ON\s+\d{1,2}\/\d{1,2}\s+([^]+?)\s+(?:[A-Z]{2}\s+\d|S\d{10}|P\d{10}|CARD\s+\d{4})/i,
    extract: m => m[1],
  },
  // 7. "Payment to <merchant>"
  {
    name: 'Payment to',
    regex: /^(?:Payment\s+to|Sent\s+to|Transfer\s+to)\s+([^]+?)(?:\s+REF|\s+ID[:=]|$)/i,
    extract: m => m[1],
  },
];

/**
 * Compress a raw bank/ACH description to a readable merchant name.
 *
 * Returns the prettified string. Always non-empty (falls back to the
 * lightly-cleaned original if no pattern matches). Capped at 60
 * characters to keep transaction rows tidy.
 */
export function prettifyDescription(raw: string | null | undefined): string {
  if (!raw) return '';
  // Collapse repeated whitespace so the regexes don't have to handle every form.
  const compact = raw.replace(/\s+/g, ' ').trim();
  for (const p of PATTERNS) {
    const m = compact.match(p.regex);
    if (m) {
      const extracted = p.extract(m).replace(/\s+/g, ' ').trim();
      if (extracted) return clip(extracted, 60);
    }
  }
  // Fallback: strip trailing ID-looking tokens, then return.
  const stripped = compact
    // "ID:0000xxx" or "ID=0000xxx"
    .replace(/\s+(?:ORIG\s+)?ID[:=]\S+/gi, '')
    .replace(/\s+REF[#:=]\S+/gi, '')
    .replace(/\s+SEC[:=]\S+/gi, '')
    .replace(/\s+TYPE[:=]\S+/gi, '')
    .replace(/\s+IND\s+ID[:=]?\S*/gi, '')
    .replace(/\s+\d{8,}/g, ' ') // long digit runs
    .replace(/\s+/g, ' ')
    .trim();
  return clip(stripped, 60);
}

/**
 * `prettify("hello world", 8)` → `"hello..."`. Three-dot suffix only
 * applied when the result would otherwise be longer than `max`.
 */
function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + '…';
}

/**
 * `titleCase("BASIRU JALLOW")` → `"Basiru Jallow"`. Used for Zelle
 * counter-party names that arrive in shouty all-caps; readable form
 * works better in the row UI.
 */
function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}
