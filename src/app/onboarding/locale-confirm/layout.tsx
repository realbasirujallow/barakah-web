import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set Up Your Preferences',
  description: 'Confirm your language and currency to finish setting up Barakah.',
  // 2026-06-12 (sweep R3 #20): authenticated onboarding interstitial —
  // never index. Without this layout it inherited the root metadata
  // (index:true + homepage canonical + hreflang map).
  robots: { index: false, follow: false },
};

export default function LocaleConfirmLayout({ children }: { children: React.ReactNode }) {
  return children;
}
