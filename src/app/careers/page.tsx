import type { Metadata } from 'next';
import CareersPage from '../../components/CareersPage';

export const metadata: Metadata = {
  title: 'Careers at Barakah — Content & Video Creator',
  description:
    'Join Barakah as a content and video creator. Apply with a free-form note, a resume upload, or both.',
  alternates: {
    canonical: 'https://trybarakah.com/careers',
  },
  openGraph: {
    title: 'Careers at Barakah — Content & Video Creator',
    description:
      'Help Barakah tell its story through video, education, and trust-building content. Apply online with a note, resume, or both.',
    url: 'https://trybarakah.com/careers',
    siteName: 'Barakah',
    images: [
      {
        url: 'https://trybarakah.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Barakah Careers',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at Barakah — Content & Video Creator',
    description:
      'Help Barakah tell its story through video, education, and trust-building content. Apply online with a note, resume, or both.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

export default function CareersRoute() {
  return <CareersPage />;
}
