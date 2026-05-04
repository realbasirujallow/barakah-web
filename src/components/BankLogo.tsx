// 2026-05-03 (Step 4): institution logo for transaction rows.
//
// Mirrors the Monarch behavior — Chase / Wells Fargo / etc. show
// their actual brand logo next to the merchant name. Uses Clearbit's
// free logo API; falls back to a small initial-bubble when there's
// no domain match or the image fails to load.

'use client';

import { useState } from 'react';

interface BankLogoProps {
  institutionName?: string | null;
  size?: number;
  /** Optional fallback className for the initial bubble. */
  bubbleClassName?: string;
}

// Map of brand-domain → list of substrings to match against the
// institution name. Patterns are checked case-insensitively.
const BANK_DOMAINS: Record<string, string[]> = {
  // Major US banks
  'chase.com':         ['chase', 'jpmorgan'],
  'wellsfargo.com':    ['wells fargo', 'wellsfargo'],
  'bankofamerica.com': ['bank of america', 'bofa', 'bankofamerica'],
  'citi.com':          ['citibank', 'citigroup', ' citi '],
  'capitalone.com':    ['capital one', 'capitalone'],
  'discover.com':      ['discover bank', 'discover card'],
  'americanexpress.com': ['american express', 'amex'],
  'usbank.com':        ['u.s. bank', 'us bank', 'usbank'],
  'pnc.com':           ['pnc bank', 'pnc'],
  'td.com':            ['td bank', 'td ameritrade'],
  'truist.com':        ['truist'],
  'regions.com':       ['regions bank'],
  'huntington.com':    ['huntington'],
  // Online banks / fintech
  'ally.com':          ['ally bank', 'ally financial'],
  'sofi.com':          ['sofi', 'social finance'],
  'marcus.com':        ['marcus', 'goldman sachs'],
  'chime.com':         ['chime'],
  'varomoney.com':     ['varo'],
  'wise.com':          ['wise', 'transferwise'],
  // Brokerages / investments
  'schwab.com':        ['charles schwab', 'schwab'],
  'fidelity.com':      ['fidelity'],
  'vanguard.com':      ['vanguard'],
  'robinhood.com':     ['robinhood'],
  'etrade.com':        ['e*trade', 'etrade'],
  'wealthfront.com':   ['wealthfront'],
  'betterment.com':    ['betterment'],
  'wahedinvest.com':   ['wahed'],
  // Payments / wallets
  'paypal.com':        ['paypal'],
  'venmo.com':         ['venmo'],
  'cash.app':          ['cash app', 'square cash'],
  'apple.com':         ['apple card', 'apple cash'],
  'google.com':        ['google pay', 'google wallet'],
  // Credit unions
  'navyfederal.org':   ['navy federal'],
  'penfed.org':        ['penfed', 'pentagon federal'],
};

function domainFor(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = raw.toLowerCase();
  for (const [domain, patterns] of Object.entries(BANK_DOMAINS)) {
    for (const p of patterns) {
      if (s.includes(p)) return domain;
    }
  }
  return null;
}

export function BankLogo({
  institutionName,
  size = 32,
  bubbleClassName = 'bg-emerald-600 text-white',
}: BankLogoProps) {
  const [errored, setErrored] = useState(false);
  const domain = domainFor(institutionName);

  // No match or load failed → show an initial bubble. First letter of
  // the institution name (or "?" if we have nothing).
  if (!domain || errored) {
    const initial = (institutionName?.trim()[0] ?? '?').toUpperCase();
    return (
      <div
        className={`flex items-center justify-center rounded-full font-bold ${bubbleClassName}`}
        style={{ width: size, height: size, fontSize: size * 0.45 }}
        aria-hidden="true"
      >
        {initial}
      </div>
    );
  }

  // 2026-05-04: switched from logo.clearbit.com to Google's favicon
  // service. Clearbit's free tier returns 503 under any meaningful
  // traffic; Google's S2 service is rock-solid + free + no API key.
  // Resolution caps at 64px but that's plenty for a 32px row avatar.
  const url = `https://www.google.com/s2/favicons?sz=${Math.min(64, Math.round(size * 2))}&domain=${domain}`;
  // eslint-disable-next-line @next/next/no-img-element — external CDN, sized fixed
  return (
    <img
      src={url}
      alt={`${institutionName} logo`}
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className="rounded-full object-cover bg-gray-100"
      style={{ width: size, height: size }}
    />
  );
}
