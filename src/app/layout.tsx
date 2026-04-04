import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Barakah - Islamic Finance Tracker & Zakat Calculator",
  description:
    "The all-in-one halal finance platform with free zakat calculator. Track spending, calculate zakat, screen halal stocks, manage family budgets, and grow your wealth — the Islamic way.",
  keywords: [
    "zakat calculator",
    "islamic finance",
    "halal finance",
    "free zakat calculator",
    "halal stocks",
    "muslim budgeting",
    "hawl tracker",
    "sadaqah tracker",
    "waqf",
    "riba checker",
    "barakah",
    "islamic budgeting",
    "net worth tracker",
    "family finances",
    "wasiyyah planner",
  ],
  openGraph: {
    title: "Barakah - Islamic Finance Tracker & Zakat Calculator",
    description:
      "Track spending, calculate zakat, screen halal stocks, manage family budgets, and grow your wealth — the Islamic way.",
    url: "https://trybarakah.com",
    siteName: "Barakah",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://trybarakah.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Barakah - Islamic Finance Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barakah - Islamic Finance Tracker & Zakat Calculator",
    description:
      "The all-in-one halal finance platform with free zakat calculator. Zakat, halal stocks, budgeting, and more.",
    images: ["https://trybarakah.com/og-image.png"],
  },
  metadataBase: new URL("https://trybarakah.com"),
  alternates: {
    canonical: "https://trybarakah.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Barakah',
    url: 'https://trybarakah.com',
    logo: 'https://trybarakah.com/icon.png',
    description: 'The all-in-one halal finance platform. Track spending, calculate zakat, manage budgets the Islamic way.',
    sameAs: [
      'https://twitter.com/trybarakah',
      'https://instagram.com/trybarakah',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@trybarakah.com',
      contactType: 'customer support',
    },
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Barakah - Islamic Finance Tracker',
    operatingSystem: 'Web, iOS, Android',
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '500',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
        {/* Apply dark mode class before paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('barakah_dark_mode')==='true')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Software Application Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareSchema),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
