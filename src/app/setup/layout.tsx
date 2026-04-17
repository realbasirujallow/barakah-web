import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set Up Your Barakah Account | Islamic Finance Dashboard',
  description:
    'Personalize your Barakah setup — choose your madhab, fiqh preferences, currency, and connect accounts so we can track zakat, hawl, and halal screening accurately for you.',
  // Setup is a post-login flow; do not index.
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://trybarakah.com/setup' },
};

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
