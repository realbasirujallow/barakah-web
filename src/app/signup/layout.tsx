import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Barakah Account — Free Islamic Finance Tools',
  description: 'Sign up for Barakah to access zakat calculators, halal investment screening, hawl tracking, and comprehensive Islamic financial planning tools.',
  robots: { index: false, follow: false },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
