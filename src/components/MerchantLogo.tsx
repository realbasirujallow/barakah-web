// 2026-05-06 (founder report): merchant logo for transaction rows.
//
// Bug we're closing: previously the row avatar showed the BANK logo
// (Chase, Wells Fargo) via BankLogo because the slot was keyed on
// transaction.sourceInstitutionName. The user reported: "when I use
// my Chase card to buy something on Amazon, the row shows the Chase
// logo instead of Amazon's." The merchant is what the user wants to
// recognise — the card issuer is meta-data.
//
// New rule: prefer merchant logo (Amazon, Costco, Starbucks, …) keyed
// on transaction.merchantName or a clean parse of transaction.description.
// Fall back to the institution domain only for cases where there's
// genuinely no merchant (Zelle / internal transfer). Final fallback is
// the existing initial bubble so the slot is never blank.

'use client';

import { useState } from 'react';

interface MerchantLogoProps {
  /** Best-known merchant name. Plaid populates `merchantName` for imported
   *  transactions; for manual / CSV imports pass a prettified description. */
  merchantName?: string | null;
  /** Used only when no merchant maps. Lets bank-to-bank rows still show a
   *  logo (Zelle, internal transfer). */
  institutionFallback?: string | null;
  /** Transaction category — drives a meaningful fallback icon (a house for
   *  housing/mortgage, a car for transport, …) instead of the source bank. */
  category?: string | null;
  size?: number;
  bubbleClassName?: string;
}

/**
 * Category / merchant-keyword → emoji fallback. Checked when no brand logo
 * resolves, so a "Freedom Mortgage" row shows a house — never the source
 * bank's logo (which lies about where the money went). Keyword match on the
 * merchant name wins (catches "* Mortgage", "* Insurance"), then category.
 */
function fallbackIcon(merchantName?: string | null, category?: string | null): string | null {
  const m = (merchantName ?? '').toLowerCase();
  const c = (category ?? '').toLowerCase();
  const hay = `${m} ${c}`;
  const has = (...keys: string[]) => keys.some(k => hay.includes(k));
  if (has('mortgage', 'rent', 'housing', 'hoa', 'property tax', 'home loan')) return '🏠';
  if (has('insurance', 'takaful')) return '🛡️';
  if (has('gas', 'fuel', 'auto', 'car ', 'vehicle', 'transport', 'parking', 'toll')) return '🚗';
  if (has('grocer', 'supermarket')) return '🛒';
  if (has('restaurant', 'dining', 'food', 'coffee', 'cafe')) return '🍽️';
  if (has('utilit', 'electric', 'water', 'internet', 'phone', 'cable')) return '💡';
  if (has('health', 'medical', 'pharmacy', 'doctor', 'dental', 'clinic')) return '🏥';
  if (has('zakat', 'sadaqah', 'charity', 'donation', 'waqf')) return '🤲';
  if (has('education', 'tuition', 'school', 'student loan')) return '🎓';
  if (has('travel', 'flight', 'hotel', 'airline')) return '✈️';
  if (has('entertain', 'streaming', 'subscription', 'movie', 'music', 'game')) return '🎬';
  if (has('salary', 'payroll', 'income', 'deposit', 'refund')) return '💰';
  if (has('transfer', 'withdrawal', 'atm')) return '🔁';
  if (has('shopping', 'retail', 'merchandise')) return '🛍️';
  return null;
}

const MERCHANT_DOMAINS: Record<string, string[]> = {
  // Big-box + e-commerce
  'amazon.com':       ['amazon', 'amzn'],
  'apple.com':        ['apple.com', 'apple store', 'app store', 'itunes', 'apple music', 'icloud'],
  'bestbuy.com':      ['best buy', 'bestbuy'],
  'costco.com':       ['costco'],
  'ebay.com':         ['ebay'],
  'etsy.com':         ['etsy'],
  'homedepot.com':    ['home depot', 'homedepot'],
  'ikea.com':         ['ikea'],
  'lowes.com':        ["lowe's", 'lowes'],
  'macys.com':        ["macy's", 'macys'],
  'nordstrom.com':    ['nordstrom'],
  'samsclub.com':     ["sam's club", 'sams club'],
  'sephora.com':      ['sephora'],
  'shein.com':        ['shein'],
  'target.com':       ['target'],
  'tjx.com':          ['t.j.maxx', 'tjmaxx', 'tj maxx', 'marshalls', 'homegoods'],
  'ulta.com':         ['ulta'],
  'walmart.com':      ['walmart', 'walmart.com'],
  'wayfair.com':      ['wayfair'],

  // Grocery + food
  'albertsons.com':   ['albertsons'],
  'aldi.us':          ['aldi'],
  'doordash.com':     ['doordash', 'dash pass'],
  'grubhub.com':      ['grubhub'],
  'instacart.com':    ['instacart'],
  'kroger.com':       ['kroger'],
  'publix.com':       ['publix'],
  'safeway.com':      ['safeway'],
  'sprouts.com':      ['sprouts farmers'],
  'traderjoes.com':   ['trader joe', 'traderjoe'],
  'ubereats.com':     ['uber eats', 'ubereats'],
  'wholefoodsmarket.com': ['whole foods', 'wholefoods'],

  // Restaurants + coffee
  'chick-fil-a.com':  ['chick-fil-a', 'chick fil a'],
  'chipotle.com':     ['chipotle'],
  'dominos.com':      ["domino's", 'dominos pizza'],
  'dunkindonuts.com': ["dunkin'", 'dunkin donuts', 'dunkin'],
  'mcdonalds.com':    ["mcdonald's", 'mcdonalds'],
  'panerabread.com':  ['panera'],
  'pizzahut.com':     ['pizza hut'],
  'starbucks.com':    ['starbucks', 'sbux'],
  'subway.com':       ['subway'],

  // Streaming + software + subscriptions
  'adobe.com':        ['adobe'],
  'audible.com':      ['audible'],
  'disneyplus.com':   ['disney+', 'disney plus'],
  'dropbox.com':      ['dropbox'],
  'github.com':       ['github'],
  'google.com':       ['google one', 'google storage', 'google workspace', 'youtube premium'],
  'hbomax.com':       ['hbo max', 'hbomax'],
  'hulu.com':         ['hulu'],
  'linkedin.com':     ['linkedin premium'],
  'microsoft.com':    ['microsoft 365', 'office 365', 'xbox', 'msft'],
  'netflix.com':      ['netflix'],
  'notion.so':        ['notion'],
  'nytimes.com':      ['new york times', 'nytimes'],
  'openai.com':       ['openai', 'chatgpt'],
  'paramount.com':    ['paramount+', 'paramount plus'],
  'patreon.com':      ['patreon'],
  'peacocktv.com':    ['peacock'],
  'spotify.com':      ['spotify'],
  'twitch.tv':        ['twitch'],
  'wsj.com':          ['wsj', 'wall street journal'],
  'youtube.com':      ['youtube'],
  'zoom.us':          ['zoom.us', 'zoom video'],

  // Travel + ride-share
  'airbnb.com':       ['airbnb'],
  'booking.com':      ['booking.com'],
  'delta.com':        ['delta air lines'],
  'expedia.com':      ['expedia'],
  'hotels.com':       ['hotels.com'],
  'kayak.com':        ['kayak'],
  'lyft.com':         ['lyft'],
  'marriott.com':     ['marriott'],
  'southwest.com':    ['southwest air'],
  'uber.com':         ['uber trip', 'uber rides', 'uber bv', 'uber.com'],
  'united.com':       ['united airlines'],

  // Telecom + utilities
  'att.com':          ['at&t', 'at and t'],
  'comcast.com':      ['comcast'],
  'spectrum.com':     ['spectrum'],
  'tmobile.com':      ['t-mobile', 'tmobile'],
  'verizon.com':      ['verizon'],
  'xfinity.com':      ['xfinity'],

  // Insurance
  'geico.com':        ['geico'],
  'progressive.com':  ['progressive'],
  'statefarm.com':    ['state farm', 'statefarm'],

  // Mortgage + home lenders / servicers
  'freedommortgage.com': ['freedom mortgage'],
  'rocketmortgage.com':  ['rocket mortgage', 'quicken loans'],
  'mrcooper.com':        ['mr. cooper', 'mr cooper', 'nationstar'],
  'chase.com':           ['chase mortgage'],
  'wellsfargo.com':      ['wells fargo home', 'wells fargo mortgage'],
  'pennymac.com':        ['pennymac'],
  'newrez.com':          ['newrez', 'shellpoint'],
  'lakeviewloanservicing.com': ['lakeview loan'],

  // Gas
  'chevron.com':      ['chevron'],
  'exxon.com':        ['exxon', 'exxonmobil', 'mobil station'],
  'shell.com':        ['shell oil'],

  // Charity + giving
  'islamic-relief.org':    ['islamic relief'],
  'zakat.org':             ['zakat foundation'],
  'launchgood.com':        ['launchgood'],
  'penny-appeal.org':      ['penny appeal'],
};

const BANK_FALLBACK: Record<string, string[]> = {
  'chase.com':         ['chase', 'jpmorgan'],
  'wellsfargo.com':    ['wells fargo'],
  'bankofamerica.com': ['bank of america', 'bofa'],
  'citi.com':          ['citibank'],
  'capitalone.com':    ['capital one'],
  'paypal.com':        ['paypal'],
  'venmo.com':         ['venmo'],
  'cash.app':          ['cash app'],
  'zelle.com':         ['zelle'],
};

function lookup(map: Record<string, string[]>, raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = raw.toLowerCase();
  for (const [domain, patterns] of Object.entries(map)) {
    for (const p of patterns) {
      if (s.includes(p)) return domain;
    }
  }
  return null;
}

export function MerchantLogo({
  merchantName,
  institutionFallback,
  category,
  size = 32,
  bubbleClassName = 'bg-emerald-600 text-white',
}: MerchantLogoProps) {
  const [errored, setErrored] = useState(false);
  // 2026-05-08 (founder report): when a Chase user paid down a Wells Fargo
  // card the transaction row showed the CHASE logo (the source-account
  // institution) instead of Wells Fargo. Root cause: BANK_FALLBACK was
  // only consulted for the source-institution string, never for the
  // merchant name itself — so a merchant that happens to be a bank
  // (credit-card payments, ACH transfers, 529 contributions to a bank
  // custodian) silently fell through to the source account.
  //
  // Fix: try merchant lookups in priority order — merchant brand, then
  // merchant-name-as-bank. If the merchant is clearly a transfer/payment
  // to an UNKNOWN destination (529 contributions, generic ACH, internal
  // transfers), don't fall back to the source institution — that just
  // mislabels the destination. Show an initial bubble instead so the
  // logo doesn't lie about where the money went.
  const isAmbiguousTransfer = (() => {
    if (!merchantName) return false;
    const s = merchantName.toLowerCase();
    return /\b(529|ccpymt|web id|ach contrib|ach pmt|ach payment|direct dep|funds transfer|internal transfer|external transfer|external xfer|incoming wire|outgoing wire)\b/.test(s);
  })();

  const merchantDomain =
    lookup(MERCHANT_DOMAINS, merchantName)
    ?? lookup(BANK_FALLBACK, merchantName);

  // A NAMED merchant must never borrow the source bank's logo (that mislabels
  // where the money went — e.g. "Freedom Mortgage" showing the Chase logo).
  // Only consult the source institution when there is genuinely no merchant.
  const hasNamedMerchant = !!(merchantName && merchantName.trim());

  const domain =
    merchantDomain
    ?? ((isAmbiguousTransfer || hasNamedMerchant)
          ? null
          : (lookup(MERCHANT_DOMAINS, institutionFallback)
              ?? lookup(BANK_FALLBACK, institutionFallback)));

  if (!domain || errored) {
    // Prefer a meaningful category/keyword icon (🏠 for mortgage/housing) over
    // an opaque initial bubble.
    const icon = fallbackIcon(merchantName, category);
    if (icon) {
      return (
        <div
          className="flex items-center justify-center rounded-full bg-gray-100"
          style={{ width: size, height: size, fontSize: size * 0.5 }}
          aria-hidden="true"
        >
          {icon}
        </div>
      );
    }
    const initial = ((merchantName ?? institutionFallback)?.trim()[0] ?? '?').toUpperCase();
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

  // Same gstatic faviconV2 backend as BankLogo — proxy.ts already
  // allowlists t0.gstatic.com.
  const px = Math.min(64, Math.round(size * 2));
  const upstream = encodeURIComponent(`https://${domain}`);
  const url = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${upstream}&size=${px}`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={`${merchantName ?? 'merchant'} logo`}
      width={size}
      height={size}
      onError={() => setErrored(true)}
      className="rounded-full object-cover bg-gray-100"
      style={{ width: size, height: size }}
    />
  );
}
