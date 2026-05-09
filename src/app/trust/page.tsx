import type { Metadata } from 'next';
import TrustPageClient from './TrustPageClient';

export const metadata: Metadata = {
  title: 'Barakah Trust & Security | Encryption, Privacy & Data Protection',
  description:
    'Learn how Barakah protects your financial data with TLS 1.2+ in transit, AES-256 application-layer encryption for bank-linking secrets, managed-disk encryption at rest, httpOnly session cookies, bcrypt password hashing, and PCI-compliant Stripe billing.',
  alternates: {
    canonical: 'https://trybarakah.com/trust',
  },
};

// 2026-05-08 (W-P1-3 top-of-funnel i18n pass): /trust had zero useI18n
// calls. Splitting into a server wrapper (this file) that owns the
// Metadata export and a client component (TrustPageClient) that owns the
// rendering. Mirrors the pricing/PricingPageClient pattern so the H1
// and section H2s can react to the locale picker without losing SEO.
export default function TrustPage() {
  return <TrustPageClient />;
}
