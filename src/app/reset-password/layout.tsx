import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set New Password — Barakah',
  description: 'Create a new password for your Barakah account.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://trybarakah.com/reset-password' },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
