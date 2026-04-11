import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Barakah Trust & Security | Encryption, Privacy & Data Protection',
  description:
    'Learn how Barakah protects your financial data with AES-256 encryption, httpOnly sessions, bcrypt hashing, Plaid bank security, and Stripe PCI compliance. Built by a cybersecurity professional.',
  alternates: {
    canonical: 'https://trybarakah.com/trust',
  },
};

const securityPillars = [
  {
    title: 'Encryption at Rest & in Transit',
    icon: '🔐',
    body: 'All financial data is encrypted at rest using AES-256 and in transit using TLS 1.2+. Database connections use encrypted channels. Backups are stored with server-side encryption. Your data is never stored in plaintext.',
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
    title: 'Zero Third-Party Data Sharing',
    icon: '🚫',
    body: 'Barakah does not sell, rent, share, or trade your personal or financial data with any third party. We do not run ads. We do not monetize your data. Your financial information exists exclusively to serve you.',
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

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <div className="mb-12 text-center">
          <p className="mb-4 text-4xl">🛡️</p>
          <h1 className="mb-4 text-4xl font-extrabold text-[#1B5E20]">Trust & Security</h1>
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
        <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Technical Security</h2>
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
        <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Operational Trust</h2>
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
          <h2 className="mb-3 text-xl font-bold text-[#1B5E20]">Data Residency & Infrastructure</h2>
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
          <h2 className="mb-3 text-xl font-bold text-[#1B5E20]">Incident & Breach Response</h2>
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
          <h2 className="mb-3 text-xl font-bold text-[#1B5E20]">What Barakah Does Not Claim</h2>
          <ul className="space-y-3 text-sm leading-7 text-gray-700">
            <li>It does not replace a qualified scholar for case-specific rulings.</li>
            <li>It does not replace a lawyer for estate documents or jurisdiction-specific compliance.</li>
            <li>It does not guarantee that a bank or transaction description is perfectly labeled, which is why review tools remain visible to the user.</li>
          </ul>
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
