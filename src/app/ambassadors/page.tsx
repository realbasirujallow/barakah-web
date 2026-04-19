import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Become a Barakah Ambassador (2026) | Barakah',
  description:
    'Join the Barakah Ambassador Program — free Family plan, early access to new features, monthly founder Q&A, and a platform to serve your community. Open to creators, scholars, and Muslim-finance educators.',
  keywords: [
    'barakah ambassador',
    'islamic finance creator program',
    'muslim influencer partnership',
    'halal finance ambassador',
    'scholar partnership barakah',
  ],
  alternates: { canonical: 'https://trybarakah.com/ambassadors' },
  openGraph: {
    title: 'Barakah Ambassador Program | Barakah',
    description: 'Free Family plan, early access, monthly founder Q&A, and a platform to serve your community.',
    url: 'https://trybarakah.com/ambassadors',
    type: 'website',
  },
};

const benefits = [
  {
    title: 'Free Barakah Family',
    desc: 'Unlimited access to all premium features for you and up to 5 family members. $179/yr value.',
  },
  {
    title: 'Early feature access',
    desc: 'Preview new calculators, dashboards, and integrations 2-4 weeks before public launch.',
  },
  {
    title: 'Monthly founder Q&A',
    desc: 'Small-group calls with the founding team — ask anything about roadmap, methodology, or your community needs.',
  },
  {
    title: 'Co-authored content',
    desc: 'We help you produce high-quality zakat, halal-investing, or wasiyyah content for your audience. You keep rights.',
  },
  {
    title: 'Ambassador badge',
    desc: 'Show the community you vet the tools you recommend. Badge is revocable if the product ever stops meeting your standards.',
  },
  {
    title: 'Revenue share',
    desc: 'For high-impact ambassadors (10k+ engaged community), 10% of new-subscription revenue from your referrals.',
  },
];

const idealCandidates = [
  'Islamic finance creators (YouTube, Instagram, TikTok, podcasts)',
  'Qualified scholars writing or speaking on contemporary fiqh al-mu\u2019amalat',
  'Imams at US/UK/Canada mosques with active zakat-committee involvement',
  'Muslim personal-finance writers (blogs, newsletters, Substack)',
  'Islamic-finance professors or curriculum writers',
  'Qur\u2019an + finance hybrid educators serving families',
];

export default function AmbassadorsPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
          <div className="flex items-center gap-3">
            <Link href="/learn" className="text-sm text-[#1B5E20] font-medium hover:underline">Learn</Link>
            <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">Get Started</Link>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Ambassadors</span>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">
            Become a Barakah Ambassador
          </h1>
          <p className="text-lg leading-8 text-gray-800 mb-6">
            The Barakah Ambassador Program is an invitation-only cohort of creators, scholars, and
            educators who help Muslim households manage their money the halal way. Ambassadors get
            free product, early access, a direct line to our founding team, and — where they&apos;re
            ready for it — a revenue share.
          </p>

          <section className="mb-10 grid gap-4 md:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#1B5E20] mb-2">{b.title}</h3>
                <p className="text-sm text-gray-700 leading-6">{b.desc}</p>
              </div>
            ))}
          </section>

          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">We&apos;re looking for</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              {idealCandidates.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section className="mb-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-xl font-bold text-amber-900">What ambassadors are NOT</h2>
            <ul className="list-disc space-y-1 pl-6 text-sm leading-7 text-amber-900">
              <li><strong>Not paid endorsers.</strong> We pay for product and content, never for statements.</li>
              <li><strong>Not bound.</strong> You can leave anytime. If Barakah stops meeting your standards, say so publicly.</li>
              <li><strong>Not required to post.</strong> There&apos;s no quota. Recommend Barakah only when it&apos;s the right answer for your audience.</li>
              <li><strong>Not a substitute for Scholar Board.</strong> Ambassadors amplify; our Scholar Board (forming Q3 2026) reviews methodology.</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">How to apply</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Send a short note to <strong>ambassadors@trybarakah.com</strong> with: a link to your
              primary platform, an estimate of engaged community size, and one sentence on why
              Barakah fits your audience. We reply within 7 days. Accepted ambassadors get an
              onboarding call with the founding team.
            </p>
            <a
              href="mailto:ambassadors@trybarakah.com?subject=Ambassador%20Application"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50"
            >
              Apply via email →
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
