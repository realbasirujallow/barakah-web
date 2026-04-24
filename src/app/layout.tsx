import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Barakah — Free Islamic Finance App: Zakat Calculator, Halal Budgeting & Muslim Money Tracker",
    template: "%s | Barakah",
  },
  description:
    "Free Islamic finance app for Muslim households. Calculate zakat instantly, track halal investments, avoid riba, plan your Islamic will, and manage family budgets — all with fiqh rules built in.",
  keywords: [
    "free zakat calculator",
    "islamic finance app",
    "halal budgeting app",
    "muslim budgeting",
    "zakat calculator 2026",
    "halal stocks screener",
    "islamic finance",
    "halal finance",
    "halal investing",
    "hawl tracker",
    "nisab calculator",
    "muslim money tracker",
    "sadaqah tracker",
    "waqf planner",
    "riba free app",
    "barakah app",
    "islamic budgeting",
    "net worth tracker muslim",
    "islamic will wasiyyah",
    "faraid calculator",
    "mint alternative for muslims",
    "best islamic finance app",
  ],
  openGraph: {
    title: "Barakah — Free Islamic Finance App: Zakat, Halal Budgeting & Muslim Money Tracker",
    description:
      "Free zakat calculator, halal stock screener, riba tracker, Islamic will planner, and family budgeting — all fiqh-aware. Start free, no credit card or debit card required.",
    url: "https://trybarakah.com",
    siteName: "Barakah",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://trybarakah.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Barakah - Free Islamic Finance App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barakah — Free Islamic Finance App for Muslim Households",
    description:
      "Calculate zakat, screen halal stocks, avoid riba, plan your Islamic will, and budget as a Muslim household — free to start.",
    images: ["https://trybarakah.com/og-image.png"],
    creator: "@trybarakah",
    site: "@trybarakah",
  },
  metadataBase: new URL("https://trybarakah.com"),
  alternates: {
    canonical: "https://trybarakah.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    // Read from env so ops can add/rotate without a code change. Empty
    // strings are treated as "not verified yet" by Next's metadata layer
    // (no meta tag emitted), which is what we want during the bootstrap
    // phase. Once Railway/Vercel has the env, the tag appears automatically.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      // Bing Webmaster Tools / Yandex Webmaster — set via env in prod.
      ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : {}),
      ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
        ? { 'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_VERIFICATION }
        : {}),
      // iOS Smart App Banner — shows a "Get the Barakah app" banner to
      // mobile Safari visitors. App-argument is the deep link that the
      // app opens with when the user taps the banner.
      'apple-itunes-app': 'app-id=6761279229, app-argument=https://trybarakah.com',
      // Android Chrome prompts the PWA install banner automatically via
      // manifest.json, and social-share previews already pick up OG
      // image + title. If we want Google Play inline install on mobile
      // Chrome we can add a `google-play-app` meta later — Google is
      // phasing out that specific tag so we skip it here.
    },
  },
  category: "finance",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // R11 audit (2026-04-22): read the per-request nonce set by middleware.ts
  // so our inline dark-mode bootstrap script executes under nonce-based
  // CSP in production. In development the nonce is undefined and the
  // script falls through to the permissive dev CSP.
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Barakah',
    url: 'https://trybarakah.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://trybarakah.com/icon.png',
      width: 512,
      height: 512,
    },
    description: 'Fiqh-aware household finance for Muslims — zakat calculator, halal budgeting, halal investing, Islamic will planner, and family finance in one free app.',
    foundingDate: '2024',
    sameAs: [
      'https://www.tiktok.com/@trybarakah',
      'https://www.instagram.com/trybarakah/',
      'https://twitter.com/trybarakah',
      'https://x.com/trybarakah',
      'https://www.youtube.com/@trybarakah',
      'https://www.linkedin.com/company/trybarakah',
      'https://www.facebook.com/trybarakah',
      'https://apps.apple.com/us/app/barakah-islamic-finance/id6761279229',
      'https://play.google.com/store/apps/details?id=com.trybarakah.app',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@trybarakah.com',
      contactType: 'customer support',
      availableLanguage: 'English',
    },
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Barakah — Islamic Finance App',
    alternateName: ['Barakah App', 'Barakah Islamic Finance', 'trybarakah'],
    operatingSystem: 'Web, iOS, Android',
    applicationCategory: 'FinanceApplication',
    applicationSubCategory: 'Personal Finance',
    description: 'Free Islamic finance app for Muslim households. Zakat calculator, halal stock screener, riba tracker, Islamic will planner, and family budgeting with fiqh rules built in.',
    url: 'https://trybarakah.com',
    downloadUrl: 'https://apps.apple.com/us/app/barakah-islamic-finance/id6761279229',
    screenshot: 'https://trybarakah.com/og-image.png',
    featureList: [
      'Free zakat calculator with live gold and silver nisab prices',
      'Multi-madhab zakat support (Hanafi, Shafi\'i, Maliki, Hanbali)',
      'Hawl anniversary tracking and alerts',
      'Halal stock screener — 30,000+ stocks using AAOIFI-derived criteria',
      'Riba detector and elimination journey',
      'Islamic will (wasiyyah) planner',
      'Faraid inheritance calculator',
      'Muslim family budgeting and expense tracking',
      'Sadaqah and waqf giving tracker',
      'Hajj savings goal planner',
      'Barakah Score — Islamic financial health metric',
      'Shared household finance for up to 6 family members',
    ],
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Plan',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free forever with core zakat calculator and budgeting tools',
      },
      {
        '@type': 'Offer',
        name: 'Plus Plan',
        price: '9.99',
        priceCurrency: 'USD',
        billingIncrement: 'P1M',
        description: 'Full access including bank sync, halal screener, faraid, and Barakah Score',
      },
    ],
    // aggregateRating intentionally omitted: we don't have a verifiable
    // App Store / Play Store review source to cite here, and placeholder
    // numbers (4.8 / 120 was earlier copy) risk being flagged as
    // inflated structured-data by Google. Restore once there is a real
    // ratings feed to back it.
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Barakah',
    url: 'https://trybarakah.com',
    description: 'Free Islamic finance app — zakat calculator, halal budgeting, halal investing, Islamic will, and family finance for Muslim households.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://trybarakah.com/learn?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // FAQPage schema — targets Google's FAQ rich result feature. Each
  // question/answer has to mirror copy that actually appears on a page
  // reachable from the site; the answers below are short summaries of
  // the corresponding /learn/* articles. Keep answers factual + fiqh-
  // accurate; Google will penalise misleading FAQ markup.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Barakah really free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The core zakat calculator, hawl tracking, budget, transactions, and Islamic calendar are free forever. Plus and Family plans add bank sync, halal stock screener, faraid, and shared household finance for $9.99/mo and $14.99/mo respectively.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Barakah calculate zakat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Barakah sums your zakatable wealth (cash, savings, investments, business assets, gold/silver), subtracts deductible debts, compares against the live nisab threshold for your selected madhab (silver for Hanafi, gold for Shafi\'i / Maliki / Hanbali / AMJA), and applies the 2.5% rate once a full lunar year (hawl) has passed.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which madhabs does Barakah support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All four Sunni schools — Hanafi, Shafi\'i, Maliki, Hanbali — plus the AMJA (Assembly of Muslim Jurists of America) gold-standard nisab methodology. You choose once in Fiqh Settings and every calculation respects that school\'s rules.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my bank data safe with Barakah?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Bank connections are via Plaid, the same provider used by Venmo, Coinbase, and American Express. Plaid uses bank-level encryption; Barakah never sees your bank credentials. All stored data is encrypted in transit (TLS 1.2+) and at rest (AES-256).',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Barakah track riba (interest)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The Riba Detector scans every transaction imported from your bank and flags interest credits, mortgage interest, and interest-bearing fees — giving you a running count you can purify or eliminate.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Barakah available on iPhone and Android?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Download from the App Store (apps.apple.com/us/app/barakah-islamic-finance) or Google Play (play.google.com/store/apps/details?id=com.trybarakah.app). The web app at trybarakah.com syncs with both.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Barakah support budgeting like YNAB or Monarch?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Barakah has envelope-style monthly budgets, bills, recurring detection, savings goals, and Plaid-powered transaction import — comparable to YNAB and Monarch but with halal-aware categorization, riba detection, and zakat built in.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I plan my Islamic will in Barakah?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The Wasiyyah planner enforces the 1/3 bequest cap, blocks bequests to Qur\'anic heirs ("La wasiyyata li-warith"), and the Faraid calculator computes Qur\'anic inheritance shares for parents, spouse, children, and siblings automatically.',
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B5E20" />
        {/* Apply dark mode class before paint to avoid flash.
            R11 audit (2026-04-22): nonced so the nonce-based production
            CSP executes this without needing 'unsafe-inline'. */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('barakah_dark_mode')==='true')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        {/* JSON-LD below is `type="application/ld+json"` — browsers do NOT
            execute it as JavaScript, so script-src CSP doesn't apply.
            Leaving nonce off intentionally to avoid confusing SEO tools
            that look for a bare <script type="application/ld+json">. */}
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/<\//g, '<\\/') }}
        />
        {/* Software Application Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema).replace(/<\//g, '<\\/') }}
        />
        {/* FAQPage Schema — surfaces FAQ-style rich results on Google SERP for
            zakat / halal-finance queries. Answers are short + factual so
            Google's structured-data guidelines pass (no marketing fluff). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/<\//g, '<\\/') }}
        />
        {/* WebSite Schema (enables Google Sitelinks Search Box) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/<\//g, '<\\/') }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
