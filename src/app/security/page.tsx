import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Security | How Barakah Protects Your Financial Data',
  description:
    'Learn how Barakah protects your financial data with TLS 1.2+ in transit, application-layer AES-256 encryption for bank-linking secrets, managed-disk encryption at rest, httpOnly sessions, bcrypt password hashing, and zero third-party data sharing.',
  alternates: {
    canonical: 'https://trybarakah.com/security',
  },
};

const securityFAQ = [
  {
    question: 'How does Barakah store my password?',
    answer:
      'Passwords are hashed using bcrypt with a high work factor before storage. We never store plaintext passwords. Even Barakah staff cannot see or recover your password — only you can reset it through verified email.',
  },
  {
    question: 'How are web sessions managed?',
    answer:
      'Barakah uses httpOnly, Secure, SameSite cookies for session management. This means your authentication token is never accessible to JavaScript running in the browser, protecting against cross-site scripting (XSS) attacks. Tokens are cryptographically signed JWTs with short expiration windows.',
  },
  {
    question: 'Is my financial data encrypted?',
    answer:
      'Yes. Every connection uses TLS 1.2+ (HTTPS). Plaid access tokens and other bank-linking secrets are wrapped in application-layer AES-256-GCM before they reach the database. All other financial records sit on managed-disk-encrypted Postgres with encrypted backups. Database connections are encrypted end-to-end.',
  },
  {
    question: 'How does bank linking work?',
    answer:
      'Barakah uses Plaid, the same bank-connectivity provider trusted by Venmo, Robinhood, Coinbase, and thousands of financial apps. Plaid connects directly to your bank using bank-level encryption. Barakah never sees or stores your bank login credentials — Plaid handles all authentication securely.',
  },
  {
    question: 'Does Barakah sell my data to third parties?',
    answer:
      'No. Barakah does not sell, rent, share, or trade your personal or financial data with any third party. Your data is used exclusively to provide the Barakah service to you. We do not run ads. We do not monetize your data.',
  },
  {
    question: 'Who can see my financial information?',
    answer:
      'Only you. Barakah staff do not have access to view individual user financial data in the normal course of operations. Family plan members can see shared household data that you explicitly choose to share — nothing is shared by default.',
  },
  {
    question: 'What happens if I delete my account?',
    answer:
      'When you delete your account, all your personal data, financial records, transactions, assets, and linked accounts are permanently removed from our systems. This action is irreversible. We do not retain your data after deletion.',
  },
  {
    question: 'How does Barakah handle payment information?',
    answer:
      'All payments are processed through Stripe, a PCI DSS Level 1 certified payment processor. Barakah never sees, stores, or handles your credit card number. Stripe processes over $1 trillion annually and is trusted by Amazon, Google, and millions of businesses.',
  },
  {
    question: 'Is Barakah open to security researchers?',
    answer:
      'Yes. If you discover a security vulnerability, please report it to security@trybarakah.com. We take all reports seriously and will respond promptly. We appreciate responsible disclosure and will credit researchers who help us improve.',
  },
  {
    question: 'Who built Barakah and why should I trust it?',
    answer:
      'Barakah is built by Basiru Jallow, a cybersecurity professional with 10+ years of enterprise identity and access management experience, including federal work at Deloitte GPS (supporting the Social Security Administration) and Fortune 200 security operations at CBRE Group. Security is not an afterthought — it is a core competency of the founder.',
  },
];

const securityFeatures = [
  {
    title: 'AES-256 for Bank Secrets',
    desc: 'Plaid access tokens and other bank-linking secrets are wrapped in application-layer AES-256-GCM. All other records sit on managed-disk-encrypted Postgres with encrypted backups.',
    icon: '🔐',
  },
  {
    title: 'TLS 1.2+ in Transit',
    desc: 'All data transmitted between your device and our servers is encrypted with modern TLS.',
    icon: '🔒',
  },
  {
    title: 'httpOnly Sessions',
    desc: 'Authentication tokens stored in httpOnly cookies — inaccessible to browser JavaScript.',
    icon: '🍪',
  },
  {
    title: 'bcrypt Password Hashing',
    desc: 'Passwords hashed with bcrypt before storage. We never store plaintext passwords.',
    icon: '🗝️',
  },
  {
    title: 'Plaid Bank Security',
    desc: 'Bank credentials handled exclusively by Plaid — Barakah never sees your bank login.',
    icon: '🏦',
  },
  {
    title: 'Stripe PCI Compliance',
    desc: 'Payments processed by Stripe (PCI DSS Level 1). We never handle card numbers.',
    icon: '💳',
  },
  {
    title: 'Zero Data Selling',
    desc: 'We do not sell, share, or trade your data. No ads. No data brokers. Ever.',
    icon: '🚫',
  },
  {
    title: 'Account Deletion',
    desc: 'Full data deletion on request. When you leave, your data leaves with you.',
    icon: '🗑️',
  },
];

export default function SecurityPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: securityFAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-white">
      <Script
        id="security-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-[#FFF8E1] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-4xl mb-4">🛡️</p>
          <h1 className="text-4xl font-extrabold text-[#1B5E20] mb-4">
            Security at Barakah
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Your financial data is sacred. Here is exactly how we protect it — no vague promises, just specifics.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/trust" className="text-sm text-[#1B5E20] font-semibold hover:underline">
              Trust & Security →
            </Link>
            <Link href="/privacy" className="text-sm text-[#1B5E20] font-semibold hover:underline">
              Privacy Policy →
            </Link>
          </div>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B5E20] text-center mb-10">
            How We Protect Your Data
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature) => (
              <div
                key={feature.title}
                className="bg-[#FFF8E1] rounded-2xl p-5 border border-gray-100 hover:shadow-md transition"
              >
                <p className="text-2xl mb-3">{feature.icon}</p>
                <h3 className="font-bold text-[#1B5E20] text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Trust Banner */}
      <section className="bg-[#1B5E20] py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-white">
          <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
            BJ
          </div>
          <div>
            <p className="font-bold text-lg">Built by a cybersecurity professional</p>
            <p className="text-green-100 text-sm mt-1">
              Basiru Jallow — 10+ years in enterprise identity &amp; access management. Federal (Deloitte GPS / SSA), Fortune 200 (CBRE Group), and 8+ years building IAM programs at Navient.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1B5E20] text-center mb-10">
            Security FAQ
          </h2>
          <div className="space-y-6">
            {securityFAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-gray-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-gray-900 hover:text-[#1B5E20] transition">
                  {item.question}
                  <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FFF8E1] py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-[#1B5E20] mb-3">Still have questions?</h2>
          <p className="text-gray-600 text-sm mb-6">
            Security is a conversation, not a checkbox. Reach out anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-[#1B5E20] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#2E7D32] transition"
            >
              Contact Us
            </Link>
            <a
              href="mailto:security@trybarakah.com"
              className="inline-block border border-[#1B5E20] text-[#1B5E20] px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-50 transition"
            >
              Report a Vulnerability
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
