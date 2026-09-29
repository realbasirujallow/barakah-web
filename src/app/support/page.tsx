import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Barakah Support | Getting Started, Billing, and Account Help',
  description: 'Find practical help with getting started, bank connections, billing, security, and your Barakah account.',
  alternates: { canonical: 'https://trybarakah.com/support' },
  openGraph: {
    title: 'Barakah Support',
    description: 'Practical help with your Barakah account, bank connections, billing, and security.',
    url: 'https://trybarakah.com/support',
    siteName: 'Barakah',
    type: 'website',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630, alt: 'Barakah support' }],
  },
  twitter: { card: 'summary_large_image', title: 'Barakah Support', description: 'Help with your account, billing, and financial tools.', images: ['https://trybarakah.com/og-image.png'] },
};

const topics = [
  { title: 'Getting started', body: 'Start with one useful record: a zakat calculation, your first transaction, or a savings goal. You can add more detail as your household routine develops.', href: '/learn', label: 'Explore practical guides' },
  { title: 'Bank connections and imports', body: 'Bank connections are optional. If an institution is not available or you prefer not to link it, you can keep using manual entries or import your transaction history.', href: '/security', label: 'Read security practices' },
  { title: 'Billing and subscriptions', body: 'Your subscription is managed by the place where you bought it: the web, App Store, or Google Play. The exact plan and price are always shown before confirmation.', href: '/pricing', label: 'View plans and pricing' },
  { title: 'Zakat and Islamic finance tools', body: 'Barakah provides planning and organisational tools. Where rulings differ, review the published methodology and consult a qualified scholar for your circumstances.', href: '/methodology', label: 'Read the methodology' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Do I need to connect a bank account to use Barakah?', acceptedAnswer: { '@type': 'Answer', text: 'No. Bank connections are optional. You can use manual entries and imports to build your financial picture.' } },
    { '@type': 'Question', name: 'Where do I manage my Barakah subscription?', acceptedAnswer: { '@type': 'Answer', text: 'Manage a subscription through the place where it was purchased: the web, Apple App Store, or Google Play.' } },
    { '@type': 'Question', name: 'Does Barakah provide personal financial or Shariah advice?', acceptedAnswer: { '@type': 'Answer', text: 'No. Barakah provides educational, planning, and organisational tools. Consult regulated professionals and qualified scholars for advice specific to your circumstances.' } },
  ],
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E1] px-6 py-16 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[#1B5E20]">Barakah Support</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">Clear answers for your financial routine.</h1>
          <p className="mt-5 text-lg leading-8 text-gray-700">Start with the guide that matches the task in front of you. For account-specific help, send our support team a message.</p>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-2" aria-label="Support topics">
          {topics.map((topic) => (
            <article key={topic.title} className="border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-[#1B5E20]">{topic.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">{topic.body}</p>
              <Link href={topic.href} className="mt-5 inline-block text-sm font-bold text-[#1B5E20] hover:underline">{topic.label} →</Link>
            </article>
          ))}
        </section>

        <section className="mt-10 border border-green-200 bg-green-50 p-7">
          <h2 className="text-2xl font-bold text-[#1B5E20]">Need account-specific help?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-700">Tell us what you were trying to do, the device you are using, and any error message you saw. Never include passwords, full card numbers, or bank credentials.</p>
          <Link href="/contact" className="mt-5 inline-block bg-[#1B5E20] px-5 py-3 text-sm font-bold text-white hover:bg-[#124117]">Contact support</Link>
          <p className="mt-4 text-sm text-gray-600">You can also email <a className="font-semibold text-[#1B5E20] hover:underline" href="mailto:support@trybarakah.com">support@trybarakah.com</a>.</p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-bold text-[#1B5E20]">Common questions</h2>
          <dl className="mt-5 divide-y divide-gray-200 border-y border-gray-200 bg-white">
            <div className="p-5"><dt className="font-bold">Can I use Barakah without linking a bank?</dt><dd className="mt-2 text-sm leading-6 text-gray-700">Yes. Manual entries and imports are available when a bank connection is not suitable for you.</dd></div>
            <div className="p-5"><dt className="font-bold">Where should I manage a subscription?</dt><dd className="mt-2 text-sm leading-6 text-gray-700">Use the place where you subscribed: the web, Apple App Store, or Google Play.</dd></div>
            <div className="p-5"><dt className="font-bold">Can Barakah decide what is right for my circumstances?</dt><dd className="mt-2 text-sm leading-6 text-gray-700">No. Use Barakah to organise information and understand its methodology, then consult qualified professionals and scholars for personal decisions.</dd></div>
          </dl>
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
