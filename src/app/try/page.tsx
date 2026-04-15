import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Try Barakah Free — Islamic Finance App',
  description:
    'Start your free trial of Barakah today. Get a fiqh-aware finance platform with zakat calculator, halal stock screener, budgeting, and family finance tools — no credit card required.',
  alternates: {
    canonical: 'https://trybarakah.com/try',
  },
  openGraph: {
    title: 'Try Barakah Free — Islamic Finance App',
    description:
      'Start your free trial of Barakah today. Get a fiqh-aware finance platform with zakat calculator, halal stock screener, budgeting, and family finance tools — no credit card required.',
    url: 'https://trybarakah.com/try',
    siteName: 'Barakah',
    images: [
      {
        url: 'https://trybarakah.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Barakah — Islamic Finance App',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Try Barakah Free — Islamic Finance App',
    description:
      'Start your free trial of Barakah today. Get a fiqh-aware finance platform with zakat calculator, halal stock screener, budgeting, and family finance tools — no credit card required.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

export default function TryPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-4">
        Try Barakah Free
      </h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 max-w-xl mb-8">
        Start your 7-day free trial. No credit card required. Get access to
        zakat calculation, halal stock screening, budgeting tools, and more —
        all in one Shariah-conscious platform.
      </p>
      <Link
        href="/signup"
        className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
      >
        Get Started Free
      </Link>
    </main>
  );
}
