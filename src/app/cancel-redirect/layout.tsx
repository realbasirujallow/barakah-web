import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redirecting',
  description: 'Returning you to Barakah.',
  // 2026-06-12 (sweep R3 #20): client-only interstitial — without this
  // layout it inherited the ROOT metadata verbatim (index:true + the
  // homepage canonical + the full hreflang map), polluting the index.
  // Mirrors plaid/oauth/layout.tsx.
  robots: { index: false, follow: false },
};

export default function CancelRedirectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
