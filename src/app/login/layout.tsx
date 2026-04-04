import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In to Barakah — Islamic Finance Dashboard',
  description: 'Log in to your Barakah account to track zakat, manage halal investments, and monitor your Islamic financial goals.',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
