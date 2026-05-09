'use client';

import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

// R11 audit (2026-04-22): the prior "all financial data is encrypted at
// rest with AES-256 and never stored in plaintext" copy overstated what
// the app actually implements. Today:
//   - Plaid access tokens, refresh tokens, and other bearer secrets use
//     application-layer AES-256 via EncryptedStringConverter.
//   - All other financial records rely on managed-disk encryption at
//     rest (Railway/Postgres) + TLS in transit, NOT field-level
//     encryption.
// Narrowed the copy to what the code actually enforces so the claim
// survives scrutiny in a diligence review or a customer audit.
const securityPillars = [
  {
    title: 'Encryption in Transit + Sensitive-Field Encryption at Rest',
    icon: '🔐',
    body: 'Every connection uses TLS 1.2 or newer. Plaid access tokens and other bearer secrets are wrapped in application-layer AES-256-GCM before they reach the database. Financial records sit on managed-disk-encrypted Postgres with encrypted backups. Passwords are never stored in any form — only a bcrypt hash.',
  },
  {
    title: 'httpOnly Cookie Sessions',
    icon: '🍪',
    body: 'The web app uses httpOnly, Secure, SameSite cookies for session management. Authentication tokens are never accessible to browser JavaScript, protecting against cross-site scripting (XSS) attacks. Tokens are cryptographically signed JWTs with short expiration windows.',
  },
  {
    title: 'bcrypt Password Hashing',
    icon: '🗝️',
    body: 'Passwords are hashed using bcrypt with a high work factor before storage. We never store plaintext passwords. Even Barakah staff cannot see or recover your password — only you can reset it through verified email.',
  },
  {
    title: 'Plaid Bank Security',
    icon: '🏦',
    body: 'Bank linking is handled by Plaid, the same provider trusted by Venmo, Robinhood, and Coinbase. Plaid connects directly to your bank using bank-level encryption. Barakah never sees or stores your bank credentials.',
  },
  {
    title: 'Stripe PCI Compliance',
    icon: '💳',
    body: 'Payments are processed by Stripe, a PCI DSS Level 1 certified payment processor handling over $1 trillion annually. Barakah never handles, stores, or transmits your credit card number.',
  },
  {
    title: 'No Data Selling',
    icon: '🚫',
    body: 'Barakah does not sell, rent, or trade your personal or financial data. We only use trusted service providers, such as Plaid for bank linking and Stripe for billing, when they are needed to operate the product. We do not run ads or monetize user data.',
  },
];

const operationalPillars = [
  {
    title: 'Live Pricing With Freshness Signals',
    body: 'Barakah surfaces live gold and silver data with source and staleness information instead of pretending stale values are fresh. If a live feed is unavailable, the product falls back carefully and tells the user what happened.',
  },
  {
    title: 'Human Support',
    body: 'Contact submissions, user outreach details, and support paths are retained so Barakah can follow up quickly when something looks wrong or when a user needs help understanding a result.',
  },
  {
    title: 'Scholarly Boundaries',
    body: 'Barakah is intentionally clear about where the app assists and where a qualified scholar is still needed. That boundary is part of trust, not a weakness.',
  },
  {
    title: 'Full Account Deletion',
    body: 'When you delete your account, all personal data, financial records, transactions, assets, and linked accounts are permanently removed. We do not retain shadow profiles or anonymized usage data.',
  },
];

export default function TrustPageClient() {
  // 2026-05-08 (W-P1-3): localize the H1 and the section H2s only. Body
  // copy is intentionally next-pass — these surface-level headings give
  // a non-English visitor enough scaffolding to navigate, and the
  // technology names (TLS, bcrypt, Stripe, Plaid) stay English by intent
  // since they are proper nouns / API names that don't translate.
  const { t } = useI18n();
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com/' },
      { '@type': 'ListItem', position: 2, name: 'Trust', item: 'https://trybarakah.com/trust' },
    ],
  };
  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <div className="mb-12 text-center">
          <p className="mb-4 text-4xl">🛡️</p>
          <h1 className="mb-4 text-4xl font-extrabold text-[#1B5E20]">{t('trustHeroTitle')}</h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-700">
            Barakah handles sensitive financial and personal information. This page explains exactly
            how we protect it — with specific technologies, not marketing language.
          </p>
        </div>

        {/* Founder Trust Banner */}
        <div className="mb-12 flex flex-col sm:flex-row items-center gap-5 rounded-2xl bg-[#1B5E20] p-6 text-white">
          <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
            BJ
          </div>
          <div>
            <p className="font-bold text-lg">Built by a cybersecurity professional</p>
            <p className="text-green-100 text-sm mt-1">
              Basiru Jallow — 10+ years in enterprise identity &amp; access management including federal work at Deloitte GPS (Social Security Administration) and Fortune 200 security operations at CBRE Group. Security is a core competency, not an afterthought.
            </p>
          </div>
        </div>

        {/* Technical Security */}
        <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">{t('trustTechnicalSecurityH2')}</h2>
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {securityPillars.map((pillar) => (
            <section key={pillar.title} className="rounded-2xl border border-gray-200 bg-[#FFF8E1] p-6">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{pillar.icon}</span>
                <h3 className="text-lg font-bold text-[#1B5E20]">{pillar.title}</h3>
              </div>
              <p className="text-sm leading-7 text-gray-700">{pillar.body}</p>
            </section>
          ))}
        </div>

        {/* Operational Trust */}
        <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">{t('trustOperationalH2')}</h2>
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {operationalPillars.map((pillar) => (
            <section key={pillar.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-bold text-[#1B5E20]">{pillar.title}</h3>
              <p className="text-sm leading-7 text-gray-700">{pillar.body}</p>
            </section>
          ))}
        </div>

        {/* Data Residency */}
        <section className="rounded-2xl border border-gray-200 bg-[#FFF8E1] p-6 mb-12">
          <h2 className="mb-3 text-xl font-bold text-[#1B5E20]">{t('trustDataResidencyH2')}</h2>
          <ul className="space-y-3 text-sm leading-7 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#1B5E20] mt-0.5 font-bold">✓</span>
              Application hosted on cloud infrastructure with data centers in the United States.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1B5E20] mt-0.5 font-bold">✓</span>
              Database backups encrypted with AES-256 and stored in geo-redundant storage.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1B5E20] mt-0.5 font-bold">✓</span>
              HTTPS enforced on all endpoints — HTTP requests are automatically redirected.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1B5E20] mt-0.5 font-bold">✓</span>
              Rate limiting and input validation on all API endpoints to prevent abuse.
            </li>
          </ul>
        </section>

        {/* Breach Policy */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-12">
          <h2 className="mb-3 text-xl font-bold text-[#1B5E20]">{t('trustIncidentH2')}</h2>
          <p className="text-sm leading-7 text-gray-700 mb-4">
            In the unlikely event of a security breach affecting user data:
          </p>
          <ul className="space-y-3 text-sm leading-7 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#1B5E20] mt-0.5 font-bold">1.</span>
              We will notify all affected users via email within 72 hours of discovery.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1B5E20] mt-0.5 font-bold">2.</span>
              We will publish a transparent disclosure on this page detailing what happened, what data was affected, and what we are doing about it.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1B5E20] mt-0.5 font-bold">3.</span>
              We will revoke all active sessions and require password resets for affected accounts.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1B5E20] mt-0.5 font-bold">4.</span>
              We will report the incident to relevant authorities as required by applicable law.
            </li>
          </ul>
        </section>

        {/* What We Don't Claim */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-12">
          <h2 className="mb-3 text-xl font-bold text-[#1B5E20]">{t('trustWhatNotClaimedH2')}</h2>
          <ul className="space-y-3 text-sm leading-7 text-gray-700">
            <li>It does not replace a qualified scholar for case-specific rulings.</li>
            <li>It does not replace a lawyer for estate documents or jurisdiction-specific compliance.</li>
            <li>It does not guarantee that a bank or transaction description is perfectly labeled, which is why review tools remain visible to the user.</li>
          </ul>
        </section>

        {/* Scholar Review Status — RC-hardening 2026-05-08 */}
        <section
          id="scholar-review-status"
          className="rounded-2xl border-2 border-[#1B5E20]/20 bg-[#FFF8E1] p-6 mb-12"
        >
          <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">{t('trustScholarReviewH2')}</h2>
          <p className="text-sm leading-7 text-gray-800 mb-4">
            We get this question a lot, so here is the honest answer in one place. We are not a fatwa
            authority and we are not pretending to be one. What we are is an opinionated, fully
            inspectable Islamic-finance app whose math you can audit, whose methodology you can
            change, and whose limits we will name out loud.
          </p>

          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#1B5E20] mb-1">Can I trust the zakat calculations?</h3>
              <p className="text-sm leading-7 text-gray-700">
                The zakat math is deterministic — same inputs always produce the same number. We follow
                the AAOIFI / AMJA accessible-balance methodology by default (used by Zakat Foundation of
                America, Islamic Relief, NZF UK and most North-American mosque programmes). Each calculation
                produces an integrity hash you can verify on{' '}
                <Link href="/verify" className="text-[#1B5E20] underline">/verify</Link> so the figure you
                saw last year is the exact figure that ran. Beyond the math, the app surfaces the
                <em> assumptions </em> it used (which madhab, which methodology, which fiqh toggles)
                so a scholar can validate the inputs, not just the output.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1B5E20] mb-1">What if my madhab differs?</h3>
              <p className="text-sm leading-7 text-gray-700">
                Hanafi, Shafi&apos;i, Maliki, and Hanbali users land on different defaults for nisab
                threshold (gold vs silver), retirement-account treatment (Al-Qaradawi&apos;s {' '}
                <em>1/3 of value</em> vs full balance), and hawl reset rule. Every choice is exposed in{' '}
                <Link href="/dashboard/fiqh" className="text-[#1B5E20] underline">Settings → Fiqh</Link>.
                Pick the madhab you follow; the dashboard recomputes with that lens. If your scholar
                tells you something different from what Barakah calculated, the scholar is right —
                update the toggle and the math follows.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1B5E20] mb-1">What if Barakah is wrong?</h3>
              <p className="text-sm leading-7 text-gray-700">
                We assume we will be wrong sometimes — bank-feed data is messy, FX rates drift, fiqh
                edges are subtle. Three checks make it easy to catch us:
              </p>
              <ul className="mt-2 space-y-1.5 text-sm leading-7 text-gray-700 list-disc pl-6">
                <li>The transaction-review queue surfaces every uncategorized or ambiguous row before
                  it counts in zakat or insights.</li>
                <li>The integrity hash on each zakat snapshot lets you (or anyone) re-derive the
                  number from the inputs months later, even if the dashboard has changed.</li>
                <li><Link href="/contact" className="text-[#1B5E20] underline">Contact Barakah</Link> if a
                  number looks off — corrections to the methodology page and to the calculator land
                  in the public{' '}
                  <Link href="/methodology/changelog" className="text-[#1B5E20] underline">methodology changelog</Link>.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1B5E20] mb-1">Is this scholar reviewed?</h3>
              <p className="text-sm leading-7 text-gray-700">
                The defaults Barakah ships with — gold-nisab, AAOIFI / AMJA accessible-balance,
                multi-madhab toggles, hawl reset rules — track mainstream fiqh references and the same
                methodology North-American mosque zakat programmes use. We do not currently claim a
                named scholar has formally reviewed and signed every line of the calculator. A
                pre-launch independent review is on our roadmap and will be published on this page
                with the scholar&apos;s name, the scope of their review, and the date the review was
                completed. We will not claim &quot;scholar approved&quot; before that page exists.
              </p>
            </div>

            <div className="rounded-xl bg-white border border-[#1B5E20]/30 p-4 mt-2">
              <p className="text-xs text-gray-700 leading-6">
                <strong>Plain rule:</strong> Barakah is a calculator, an aggregator, and a tracker — not
                a fatwa. For high-stakes situations (large estate planning, complex inheritance,
                disputed business ownership, edge-case riba structures), consult a qualified scholar
                you trust. The app exists to handle the 95% of routine cases consistently and to give
                you the inputs you need to ask the right question on the other 5%.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-col gap-3 rounded-2xl bg-[#1B5E20] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Questions or concerns?</h2>
            <p className="mt-1 text-sm text-green-100">
              Reach out if you want something reviewed or corrected. Trust grows when issues are surfaced and fixed quickly.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50"
            >
              Contact Barakah
            </Link>
            <Link
              href="/security"
              className="inline-flex items-center justify-center rounded-xl border border-white px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#1B5E20]"
            >
              Security FAQ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
