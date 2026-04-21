import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL } from '../../lib/trial';

export const metadata: Metadata = {
  title: 'Try Barakah Free — Islamic Finance App',
  description:
    `Start your ${DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL} free trial of Barakah today. Get a fiqh-aware finance platform with zakat calculator, halal stock screener, budgeting, and family finance tools — no credit card required.`,
  alternates: {
    canonical: 'https://trybarakah.com/try',
  },
  openGraph: {
    title: 'Try Barakah Free — Islamic Finance App',
    description:
      `Start your ${DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL} free trial of Barakah today. Get a fiqh-aware finance platform with zakat calculator, halal stock screener, budgeting, and family finance tools — no credit card required.`,
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
      `Start your ${DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL} free trial of Barakah today. Get a fiqh-aware finance platform with zakat calculator, halal stock screener, budgeting, and family finance tools — no credit card required.`,
    images: ['https://trybarakah.com/og-image.png'],
  },
};

export default function TryPage() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com/' },
      { '@type': 'ListItem', position: 2, name: 'Try', item: 'https://trybarakah.com/try' },
    ],
  };
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {/* Round 18: added the marketing header so users landing from ads
          aren't stranded. Previously the page had zero navigation —
          visitors who wanted pricing or more info had to close the tab. */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#1B5E20]">&#127769; Barakah</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
            <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
            <Link href="/trust" className="hover:text-[#1B5E20] transition">Trust</Link>
            <Link href="/contact" className="hover:text-[#1B5E20] transition">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-4 text-[#1B5E20]">
          Try Barakah Free
        </h1>
        <p className="text-lg text-center text-gray-600 max-w-xl mb-8">
          Start your {DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL} free trial. No credit card required. Get access to
          zakat calculation, halal stock screening, budgeting tools, and more &mdash;
          all in one Shariah-conscious platform.
        </p>
        <Link
          href="/signup"
          className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Get Started Free
        </Link>
      </main>
    </div>
  );
}
