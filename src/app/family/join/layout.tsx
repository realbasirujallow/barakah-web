import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Your Family Plan | Barakah Islamic Finance',
  description:
    "Accept your Barakah Family plan invite and start sharing household finances, zakat tracking, and estate planning with your family in one private space.",
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://trybarakah.com/family/join' },
  openGraph: {
    title: 'Join Your Barakah Family Plan',
    description:
      'Accept an invite to join your family on Barakah — shared household finances and Islamic estate planning.',
    url: 'https://trybarakah.com/family/join',
    siteName: 'Barakah',
    type: 'website',
  },
};

export default function FamilyJoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
