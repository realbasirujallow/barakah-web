import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Your Email — Barakah',
  description: 'Verify your email address to activate your Barakah account.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://trybarakah.com/verify-email' },
};

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
