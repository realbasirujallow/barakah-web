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
  title: "Barakah - Islamic Finance Tracker",
  description:
    "The all-in-one halal finance app. Track spending, calculate zakat, screen halal stocks, manage family budgets, and grow your wealth — the Islamic way.",
  keywords: [
    "islamic finance",
    "halal finance",
    "zakat calculator",
    "halal stocks",
    "muslim budgeting",
    "hawl tracker",
    "sadaqah tracker",
    "waqf",
    "riba checker",
    "barakah",
  ],
  openGraph: {
    title: "Barakah - Islamic Finance Tracker",
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
    title: "Barakah - Islamic Finance Tracker",
    description:
      "The all-in-one halal finance app. Zakat, halal stocks, budgeting, and more.",
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply dark mode class before paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('barakah_dark_mode')==='true')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
