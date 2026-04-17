import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connecting Your Bank | Barakah',
  description:
    'Finishing your secure bank connection via Plaid. You will be returned to Barakah automatically once the handshake completes.',
  // Plaid OAuth callback URL — never index; short-lived per-session.
  robots: { index: false, follow: false },
};

export default function PlaidOAuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
