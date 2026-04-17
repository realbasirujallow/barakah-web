import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Your Password — Barakah',
  description: 'Request a password reset link for your Barakah account.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://trybarakah.com/forgot-password' },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
