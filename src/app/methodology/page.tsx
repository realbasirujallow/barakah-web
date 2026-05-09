import type { Metadata } from 'next';
import MethodologyClient from './MethodologyClient';

// 2026-05-08 (W-P2-1 SEO recovery): the methodology page lost its
// `Metadata` export when it was converted to a client component for
// locale reactivity. Restoring SEO metadata here on the server side
// while delegating rendering to MethodologyClient — same server-wraps-
// client pattern used by app/pricing/page.tsx.
export const metadata: Metadata = {
  title: 'Barakah Methodology | Zakat, Nisab, Hawl, Riba, Wasiyyah Methodology',
  description:
    'How Barakah calculates zakat, nisab, hawl continuity, and riba detection — and where wasiyyah and scholar review fit in. Transparent methodology behind the calculator, the dashboard, and the fiqh toggles.',
  alternates: {
    canonical: 'https://trybarakah.com/methodology',
  },
  openGraph: {
    title: 'Barakah Methodology | Zakat, Nisab, Hawl, Riba, Wasiyyah Methodology',
    description:
      'Transparent methodology behind every Barakah calculation: zakat, nisab thresholds, hawl continuity, riba detection, and wasiyyah recording.',
    url: 'https://trybarakah.com/methodology',
    siteName: 'Barakah',
    type: 'article',
  },
};

export default function MethodologyPage() {
  return <MethodologyClient />;
}
