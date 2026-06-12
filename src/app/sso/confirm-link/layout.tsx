import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Confirm Sign-In Link',
  description: 'Confirming your Google sign-in link for Barakah.',
  // 2026-06-12 (sweep R3 #20): client-only interstitial — never index;
  // short-lived per-session confirmation surface. Without this layout it
  // inherited the root metadata (index:true + homepage canonical).
  robots: { index: false, follow: false },
};

export default function SsoConfirmLinkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
