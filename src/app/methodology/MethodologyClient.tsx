'use client';

import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

// 2026-05-08 (W-P2-1 SEO recovery): the original /methodology page was
// converted to a client component for locale reactivity, which silently
// dropped the page-level Metadata export (Next.js does not allow
// `export const metadata` from a 'use client' module). This file now
// owns ONLY the rendering. The sibling page.tsx is a thin server
// component that imports this client and re-exports the Metadata,
// mirroring the pattern in app/pricing/page.tsx + PricingPageClient.tsx.

const SECTION_KEYS = [
  { titleKey: 'methodologyZakatTitle',     bodyKey: 'methodologyZakatBody' },
  { titleKey: 'methodologyNisabTitle',     bodyKey: 'methodologyNisabBody' },
  { titleKey: 'methodologyHawlTitle',      bodyKey: 'methodologyHawlBody' },
  { titleKey: 'methodologyRibaTitle',      bodyKey: 'methodologyRibaBody' },
  { titleKey: 'methodologyWasiyyahTitle',  bodyKey: 'methodologyWasiyyahBody' },
] as const;

export default function MethodologyClient() {
  const { t } = useI18n();
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com/' },
      { '@type': 'ListItem', position: 2, name: 'Methodology', item: 'https://trybarakah.com/methodology' },
    ],
  };
  return (
    <main className="min-h-screen bg-[#FFF8E1] px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="mb-4 text-4xl">📘</p>
          <h1 className="mb-4 text-4xl font-extrabold text-[#1B5E20]">{t('methodologyPageTitle')}</h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-700">
            {t('methodologyPageIntro')}
          </p>
        </div>

        <div className="space-y-6">
          {SECTION_KEYS.map(({ titleKey, bodyKey }) => (
            <section key={titleKey} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">{t(titleKey)}</h2>
              <p className="text-sm leading-7 text-gray-700">{t(bodyKey)}</p>
            </section>
          ))}
        </div>

        {/* Backed by Quran & Sunnah */}
        <section className="mt-8 rounded-2xl bg-green-900 p-6 text-white text-center">
          <p className="text-xs uppercase tracking-wider font-semibold text-green-300 mb-3">Grounded in Quran &amp; Sunnah</p>
          <blockquote className="text-base md:text-lg font-semibold mb-3 leading-relaxed italic max-w-2xl mx-auto">
            &ldquo;And establish prayer and give zakat, and whatever good you put forward for yourselves — you will find it with Allah&rdquo;
          </blockquote>
          <p className="text-green-300 text-sm font-medium">Quran 2:110</p>
          <p className="text-green-200 text-xs mt-3 max-w-xl mx-auto">
            Every calculation in Barakah is rooted in Quranic commands and classical jurisprudence. We surface methodology transparently so you can verify our approach against your own scholarship.
          </p>
        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">Important Boundaries</h2>
          <ul className="space-y-3 text-sm leading-7 text-gray-700">
            <li>Barakah is a fiqh-aware decision-support tool, not a personal fatwa service.</li>
            <li>Where scholarly opinions differ, Barakah surfaces the methodology instead of pretending there is no difference.</li>
            <li>Complex family, estate, and jurisdiction-specific cases should still be reviewed with a qualified scholar and legal professional.</li>
          </ul>
        </section>

        {/* Scholar oversight + changelog + open briefs */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">Scholar Oversight</h2>
          <p className="mb-4 text-sm leading-7 text-gray-700">
            Every opinionated fiqh decision in Barakah gets a dedicated review brief. We publish the
            brief alongside the product change, track whether scholar review is still pending or has
            been completed, and add named reviewers only after they have actually engaged and
            approved public disclosure. The goal is honest transparency, not implied endorsement.
          </p>
          <ul className="space-y-3 text-sm leading-7 text-gray-700">
            <li>
              <Link href="/scholars" className="text-[#1B5E20] font-semibold hover:underline">
                Scholar Board →
              </Link>{' '}
              Board formation status, planned engagements, and any named reviewers once confirmed.
            </li>
            <li>
              <Link href="/methodology/changelog" className="text-[#1B5E20] font-semibold hover:underline">
                Methodology changelog →
              </Link>{' '}
              Every fiqh/methodology rule change, when it was made, and why.
            </li>
            <li>
              <strong>Hanafi ↔ silver nisab auto-link</strong> — active. Brief published in-repo at{' '}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                docs/SCHOLAR_REVIEW_HANAFI_SILVER.md
              </code>
              . Awaiting named-scholar response. See the changelog for dates.
            </li>
          </ul>
        </section>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-[#1B5E20] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Want the full product view?</h2>
            <p className="mt-1 text-sm text-green-100">
              See the trust posture, privacy boundaries, and support channels Barakah uses today.
            </p>
          </div>
          <Link
            href="/trust"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50"
          >
            View Trust & Security
          </Link>
        </div>
      </div>
    </main>
  );
}
