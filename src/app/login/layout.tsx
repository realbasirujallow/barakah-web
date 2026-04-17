import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In to Barakah',
  description: 'Sign in to Barakah to manage zakat, daily money, family finances, and estate readiness in one fiqh-aware household finance system.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://trybarakah.com/login' },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
