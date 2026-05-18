import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Nastaliq_Urdu, Noto_Sans_Arabic } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import { MaybeMarketingNav } from "../components/MaybeMarketingNav";
import { JsonLdScript } from "../components/JsonLdScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2026-05-10 (B-UR-FONT): Urdu glyph corruption fix. PK user dashboard
// header was rendering "بقتہ، 9 منی، 2026" instead of "ہفتہ، 9 مئی، 2026"
// — Intl.DateTimeFormat with ur-PK locale was producing partial Urdu and
// the fallback browser font was substituting wrong glyphs (Arabic-script
// "ب" instead of Urdu "ہ", "ن" instead of "ئ"). Loading Noto Nastaliq
// Urdu via next/font ensures a font with full Urdu Unicode coverage is
// always available; CSS in globals.css applies it to [lang^='ur'] +
// [dir='rtl'][lang^='ur'] surfaces.
const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaliq-urdu",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

// Also load Noto Sans Arabic so AR users get a clean modern Arabic font
// instead of the OS default (which can be inconsistent on Windows /
// older macOS / Linux).
const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  // 2026-05-06 (overnight A-Z, SEO audit): trimmed default title from 100
  // chars (truncated in SERPs after ~60) to 56 chars. Frontloads the
  // highest-converting keyword cluster ("zakat calculator + Muslim
  // budgeting") instead of the previous feature spray. Description
  // trimmed from 193 chars (over the 160-char SERP cap) to 142 — same
  // three outcomes, less repetition.
  title: {
    // HEAD (admin-journey-tools) won this merge: the 56-char SEO-trimmed
    // version matches the surrounding comment about avoiding SERP
    // truncation past ~60 chars. origin/main's 96-char version was
    // pre-trim copy that would have been cut mid-keyword in Google
    // results, undoing the intended SEO win.
    default: "Try Barakah — Free Zakat Calculator & Muslim Budgeting App",
    template: "%s | Try Barakah",
  },
  description:
    "Calculate zakat in 60 seconds, screen halal stocks, avoid riba, and plan your Islamic will — all fiqh-aware. Free for Muslim households.",
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
    "muslim finance app",
  ],
  openGraph: {
    title: "Try Barakah — Free Islamic Finance App: Zakat, Halal Budgeting & Muslim Money Tracker",
    description:
      "Free zakat calculator, halal stock screener, riba tracker, Islamic will planner, and family budgeting — all fiqh-aware. Start free, no credit card or debit card required.",
    url: "https://trybarakah.com",
    siteName: "Try Barakah",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://trybarakah.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Try Barakah - Free Islamic Finance App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Try Barakah — Free Islamic Finance App for Muslim Households",
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
      availableLanguage: ['English', 'Arabic', 'Urdu', 'French'],
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
      'Halal stock screener — live AAOIFI Standard 21 ratio screening on demand, plus a 30,000+ stock business-activity library',
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

  // FAQPage schema is intentionally NOT emitted globally. Google's
  // structured-data spec allows only one FAQPage per page; emitting one
  // sitewide collided with the per-page FAQPage on every /learn/* article
  // (Search Console flagged "Duplicate field 'FAQPage'", WNC-10030322,
  // 2026-04-25). The homepage FAQ now lives in src/app/page.tsx so it
  // ships only on `/`.

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
        {/* Apply RTL direction + lang attribute before paint when the
            persisted locale is Arabic / Urdu (or other RTL script). Without
            this, Arabic users see one paint in LTR before the client-side
            setLocale() swaps the `dir` attribute — visually jarring on cold
            loads. Key must stay in lock-step with LOCALE_STORAGE_KEY in
            src/lib/i18n.ts. */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem('barakah_locale');if(!l)return;var rtl={ar:1,ur:1,fa:1,he:1};document.documentElement.lang=l;document.documentElement.dir=rtl[l]?'rtl':'ltr';}catch(e){}})();`,
          }}
        />
        {/* JSON-LD below is `type="application/ld+json"` — browsers do NOT
            execute it as JavaScript, so script-src CSP doesn't apply.
            Leaving nonce off intentionally to avoid confusing SEO tools
            that look for a bare <script type="application/ld+json">.

            2026-05-02 audit M-5: emit via JsonLdScript helper so the
            `</` → `<\/` escaping is centralized — no per-call mistake
            can let attacker-controlled schema data break out of the
            <script> tag. */}
        {/* Organization Schema */}
        <JsonLdScript schema={organizationSchema} />
        {/* Software Application Schema */}
        <JsonLdScript schema={softwareSchema} />
        {/* WebSite Schema (enables Google Sitelinks Search Box) */}
        <JsonLdScript schema={websiteSchema} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoNastaliqUrdu.variable} ${notoSansArabic.variable} antialiased`}>
        <Providers>
          {/* 2026-05-01: global MarketingNav. Renders on every public
              marketing page automatically (denylist in the component
              skips /dashboard, /signup, /login, OAuth callbacks, etc.)
              so adding a new SEO page Just Works without remembering to
              mount the nav. Also lets us strip the duplicate per-page
              <nav> blocks that drifted out of sync. */}
          <MaybeMarketingNav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
