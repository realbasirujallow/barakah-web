import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Open Barakah | Islamic Finance App for iOS, Android, and Web',
  description:
    'Open Barakah on your preferred platform. iOS and Android apps are available in the App Store and Google Play — or continue in the web dashboard.',
  alternates: { canonical: 'https://trybarakah.com/open' },
  openGraph: {
    title: 'Open Barakah — Islamic Finance',
    description: 'Download Barakah for iOS or Android, or open the web dashboard.',
    url: 'https://trybarakah.com/open',
    siteName: 'Barakah',
    type: 'website',
  },
};

export default function OpenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
