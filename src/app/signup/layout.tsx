import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Barakah Account',
  description: 'Sign up for Barakah to start with free household finance tools for Muslims, including zakat planning, budgeting, hawl tracking, and guided financial setup.',
  alternates: { canonical: 'https://trybarakah.com/signup' },
  robots: { index: true, follow: true },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
