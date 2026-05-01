import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ZakatVerifiedBadge from '../../../components/ZakatVerifiedBadge';

type MosqueProfile = {
  slug: string;
  name: string;
  city: string;
  state: string;
  website?: string;
  imam?: string;
  zakatEligible: boolean;
  description: string;
  referralBenefit: string;
};

const mosques: MosqueProfile[] = [];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mosqueSlug: string }>;
}): Promise<Metadata> {
  const { mosqueSlug } = await params;
  const m = mosques.find((x) => x.slug === mosqueSlug);
  if (!m) {
    return {
      title: 'Mosque Referral | Barakah',
      description: 'Mosque-branded Barakah referral landing.',
      robots: { index: false, follow: true },
    };
  }
  const title = `${m.name} × Barakah: Manage Your Household's Money the Halal Way`;
  return {
    title,
    description: `${m.name} partners with Barakah to help community members manage zakat, hawl, halal investing, and family budgets. Sign up via this page for community perks.`,
    alternates: { canonical: `https://trybarakah.com/refer/${m.slug}` },
    openGraph: { title, description: `${m.name} × Barakah community referral`, url: `https://trybarakah.com/refer/${m.slug}`, type: 'website' },
  };
}

export default async function MosqueReferralPage({
  params,
}: {
  params: Promise<{ mosqueSlug: string }>;
}) {
  const { mosqueSlug } = await params;
  const mosque = mosques.find((m) => m.slug === mosqueSlug);
  if (!mosque) notFound();

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
          <div className="flex items-center gap-3">
            <Link href="/learn" className="text-sm text-[#1B5E20] font-medium hover:underline">Learn</Link>
            <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
            <Link href={`/signup?ref=mosque-${mosque.slug}`} className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">Get Started</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="mb-4 flex items-center gap-3">
            {mosque.zakatEligible && <ZakatVerifiedBadge mosqueName={mosque.name} size="sm" />}
            <span className="text-sm text-gray-500">
              {mosque.city}, {mosque.state}
            </span>
          </div>

          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">
            {mosque.name} × Barakah
          </h1>
          <p className="text-lg leading-8 text-gray-800 mb-6">
            {mosque.description}
          </p>

          <section className="mb-10 rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-2xl font-bold">Exclusive for the {mosque.name} community</h2>
            <p className="mb-4 text-base leading-7 text-green-100">
              {mosque.referralBenefit}
            </p>
            <Link
              href={`/signup?ref=mosque-${mosque.slug}`}
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50"
            >
              Sign up free →
            </Link>
          </section>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">What you get</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Multi-asset zakat calculator</strong> — cash, gold, stocks, 401(k), crypto, business, rental</li>
              <li><strong>Hawl tracking</strong> — daily nisab check, scholar-aligned methodology (AMJA gold, Classical silver, Lower-of-Two)</li>
              <li><strong>Halal stock screening</strong> — 30,000+ tickers against AAOIFI standards</li>
              <li><strong>Riba detection</strong> — flags interest income on your linked bank accounts</li>
              <li><strong>Faraid calculator + wasiyyah builder</strong> — Islamic will with Qur&apos;anic shares</li>
              <li><strong>Family plan</strong> — share budgets and household zakat across 6 members</li>
            </ul>
          </section>

          {mosque.imam && (
            <section className="mb-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
              <p className="text-sm leading-7 text-amber-900">
                Endorsed by <strong>{mosque.imam}</strong>, {mosque.name}.
              </p>
            </section>
          )}

          {mosque.website && (
            <p className="text-sm text-gray-600">
              Learn more about {mosque.name}:{' '}
              <a
                href={mosque.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1B5E20] underline"
              >
                {mosque.website.replace(/^https?:\/\//, '')}
              </a>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
