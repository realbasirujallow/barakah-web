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
  title: "Barakah - Islamic Household Finance & Zakat Platform",
  description:
    "Fiqh-aware household finance for Muslims. Track daily money, zakat, hawl, sadaqah, family budgets, and estate readiness in one Shariah-conscious platform.",
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
    title: "Barakah - Islamic Household Finance & Zakat Platform",
    description:
      "Track daily money, zakat, hawl, family budgets, and estate readiness in one fiqh-aware platform for Muslim households.",
    url: "https://trybarakah.com",
    siteName: "Barakah",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://trybarakah.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Barakah - Islamic Household Finance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barakah - Islamic Household Finance & Zakat Platform",
    description:
      "Fiqh-aware finance for Muslim households: zakat, hawl, family budgeting, and estate readiness.",
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
    description: 'Fiqh-aware household finance for Muslims, connecting daily money, zakat, family accountability, and estate readiness.',
    sameAs: [
      'https://www.tiktok.com/@trybarakah',
      'https://www.instagram.com/trybarakah/',
      'https://apps.apple.com/us/app/barakah-islamic-finance/id6761279229',
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
    name: 'Barakah - Islamic Household Finance',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B5E20" />
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
