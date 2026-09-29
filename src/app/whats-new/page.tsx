import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What’s New at Barakah',
  description: 'A dated record of notable Barakah product, support, and trust updates.',
  alternates: { canonical: 'https://trybarakah.com/whats-new' },
  openGraph: { title: 'What’s New at Barakah', description: 'Notable product, support, and trust updates from Barakah.', url: 'https://trybarakah.com/whats-new', siteName: 'Barakah', type: 'website' },
};

const entries = [
  { date: 'September 29, 2026', title: 'Clearer support and trust resources', body: 'A new Support Center brings together practical account, billing, security, and methodology guidance. We also published a plain-language page about the parts of Barakah designed for scrutiny: inheritance planning, explainable records, and methodology.' },
  { date: 'September 29, 2026', title: 'Investor education guide for a timely Nigerian question', body: 'Our Dangote Refinery IPO guide is a due-diligence checklist. It helps readers verify official channels, understand documents and risk, and keep personal financial obligations separate from an investment decision.' },
];

export default function WhatsNewPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E1] px-6 py-16 text-gray-900">
      <div className="mx-auto max-w-3xl">
        <header><p className="text-sm font-bold uppercase tracking-wide text-[#1B5E20]">Product updates</p><h1 className="mt-3 text-4xl font-extrabold">What&apos;s new at Barakah</h1><p className="mt-5 text-lg leading-8 text-gray-700">A short, dated record of meaningful improvements and public resources. Fiqh and calculation-method changes live in the <Link className="font-semibold text-[#1B5E20] hover:underline" href="/methodology/changelog">Methodology Changelog</Link>.</p></header>
        <div className="mt-10 space-y-5">
          {entries.map((entry) => <article key={entry.title} className="border border-gray-200 bg-white p-6"><p className="text-sm font-bold text-[#1B5E20]">{entry.date}</p><h2 className="mt-2 text-2xl font-bold">{entry.title}</h2><p className="mt-3 text-sm leading-7 text-gray-700">{entry.body}</p></article>)}
        </div>
      </div>
    </main>
  );
}
