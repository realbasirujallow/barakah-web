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
      "Free zakat calculator, halal stock screener, riba tracker, Islamic will planner, and family budgeting — all fiqh-aware. Start free, no credit card required.",
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
    // Add your Google Search Console verification token here once you have it
    // google: 'your-verification-token',
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
