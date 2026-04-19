import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zakat and Related Giving Obligations: Al-Mal, Al-Fitr, Fidyah & Kaffarah | Barakah',
  description:
    'Zakat al-mal and zakat al-fitr are true zakat obligations. This guide also explains related obligations Muslims often ask about — fidyah, kaffarah, and sadaqah — with links to deeper guides.',
  keywords: [
    'types of zakat',
    'zakat al-mal',
    'zakat al-fitr',
    'zakat al-fitrah',
    'fidyah',
    'kaffarah',
    'zakat on savings',
    'zakat on gold',
    'zakat on stocks',
  ],
  alternates: {
    canonical: 'https://trybarakah.com/learn/types-of-zakat',
  },
  openGraph: {
    title: 'Zakat and Related Giving Obligations: Al-Mal, Al-Fitr, Fidyah & Kaffarah | Barakah',
    description:
      'Clear distinctions between zakat al-mal, zakat al-fitr, fidyah, kaffarah, and sadaqah, with links to deeper Barakah guides.',
    url: 'https://trybarakah.com/learn/types-of-zakat',
    type: 'article',
  },
};

const types = [
  {
    name: 'Zakat al-Mal',
    arabicName: 'زكاة المال',
    label: 'True zakat',
    summary: 'Zakat on wealth — the "main" zakat. 2.5% on savings, investments, gold, silver, business assets, and receivables held above nisab for a full lunar year.',
    who: 'Any Muslim whose zakatable wealth is above nisab and has completed a hawl.',
    amount: '2.5% of the zakatable total.',
    links: [
      { href: '/learn/what-is-zakat', label: 'What is zakat (the fundamentals)' },
      { href: '/learn/zakat-on-savings', label: 'Zakat on savings & bank accounts' },
      { href: '/learn/zakat-on-gold', label: 'Zakat on gold' },
      { href: '/learn/zakat-on-stocks', label: 'Zakat on stocks' },
      { href: '/learn/zakat-on-401k', label: 'Zakat on 401(k) / retirement' },
      { href: '/learn/zakat-on-rental-property', label: 'Zakat on rental property' },
      { href: '/learn/zakat-on-business-assets', label: 'Zakat on business assets' },
      { href: '/learn/zakat-on-crypto', label: 'Zakat on cryptocurrency' },
    ],
  },
  {
    name: 'Zakat al-Fitr',
    arabicName: 'زكاة الفطر',
    label: 'True zakat',
    summary: 'The Ramadan-end charity due on every Muslim (including children and dependents). A fixed food-staple amount per person, paid before Eid al-Fitr prayer.',
    who: 'Every Muslim who has at least one day\'s food beyond their needs on Eid night — paid by the head of household on behalf of all dependents.',
    amount: 'One ṣāʿ (≈2.5–3kg) of a local staple food per person. Many scholars permit the cash equivalent (Hanafi primary position); others require food distribution (Shafi\'i/Maliki primary).',
    links: [
      { href: '/learn/zakat-al-fitr', label: 'Zakat al-Fitr full guide' },
      { href: '/learn/zakat-al-fitr-calculator', label: 'Zakat al-Fitr 2026 calculator' },
      { href: '/learn/ramadan-giving-tracker', label: 'Ramadan giving tracker' },
    ],
  },
  {
    name: 'Fidyah',
    arabicName: 'فدية',
    label: 'Related obligation',
    summary: 'The compensation paid when a person is permanently unable to fast Ramadan (due to chronic illness, old age). Also applicable in specific Hajj/pilgrimage scenarios.',
    who: 'Muslims whose condition makes missed fasts impossible to make up — e.g., elderly, terminally ill, permanently unable.',
    amount: 'Feeding one poor person per missed fast day (typically the cost of ~2 meals — most scholars reference $10–$20 USD per missed day in 2026).',
    links: [
      { href: '/learn/what-is-zakat', label: 'Where fidyah fits in giving' },
    ],
  },
  {
    name: 'Kaffarah',
    arabicName: 'كفارة',
    label: 'Related obligation',
    summary: 'Expiation for intentionally broken fasts, broken oaths, or certain ritual violations. Much heavier than fidyah because it addresses deliberate transgression.',
    who: 'Muslims who intentionally broke a Ramadan fast without a valid excuse or broke a specific oath.',
    amount: 'Varies by scenario — for a broken Ramadan fast: 60 consecutive days of fasting OR feeding 60 poor people per day missed.',
    links: [
      { href: '/learn/what-is-zakat', label: 'Zakat vs charity vs expiation' },
    ],
  },
  {
    name: 'Sadaqah (voluntary giving)',
    arabicName: 'صدقة',
    label: 'Voluntary charity',
    summary: 'Voluntary charity. Not a type of zakat technically — but often confused. Unlike zakat, sadaqah has no threshold, no calendar, no fixed amount. Any act of giving counts.',
    who: 'Any Muslim — at any time, in any amount.',
    amount: 'Entirely discretionary.',
    links: [
      { href: '/learn/sadaqah-vs-zakat', label: 'Sadaqah vs zakat — what\'s the difference?' },
    ],
  },
];

export default function TypesOfZakatPage() {
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">Zakat &amp; Related Obligations</span>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Zakat and Related Giving Obligations</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-19</p>

          <p className="text-lg leading-8 text-gray-800 mb-8">
            Muslims often group several forms of giving together, but they are not all the same in
            fiqh. Strictly speaking, <em>zakat al-mal</em> and <em>zakat al-fitr</em> are zakat.
            Fidyah and kaffarah are separate compensatory or expiatory obligations, and sadaqah is
            voluntary charity. This page keeps that distinction clear while linking you to the right
            Barakah guide for each topic.
          </p>

          <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="mb-2 text-xl font-bold text-amber-900">Important distinction</h2>
            <p className="text-sm leading-7 text-amber-900">
              Only <strong>zakat al-mal</strong> and <strong>zakat al-fitr</strong> are zakat.
              <strong> Fidyah</strong> and <strong>kaffarah</strong> are separate obligations with
              different causes and rules, while <strong>sadaqah</strong> is voluntary. Many people
              search for all of them together, so we explain them together here without flattening
              the fiqh differences.
            </p>
          </section>

          <div className="space-y-8">
            {types.map((t) => (
              <section key={t.name} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-baseline gap-3">
                  <h2 className="text-2xl font-bold text-[#1B5E20]">{t.name}</h2>
                  <span className="text-lg text-gray-400" dir="rtl">{t.arabicName}</span>
                </div>
                <p className="mb-3">
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-[#1B5E20]">
                    {t.label}
                  </span>
                </p>
                <p className="mb-3 text-base leading-7 text-gray-800">{t.summary}</p>
                <dl className="mb-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">Who pays</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700">{t.who}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700">{t.amount}</dd>
                  </div>
                </dl>
                {t.links.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Related in Barakah</p>
                    <ul className="space-y-1">
                      {t.links.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="text-sm text-[#1B5E20] hover:underline">
                            {link.label} →
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Calculate your zakat in-app</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Barakah handles zakat al-mal and zakat al-fitr directly. For fidyah and kaffarah, we
              link to scholar-cited references — not every obligation belongs in an app, and our
              methodology page explains which decisions we shouldn&apos;t automate without
              qualified-scholar sign-off.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/zakat-calculator" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50 text-center">
                Open zakat calculator →
              </Link>
              <Link href="/methodology" className="rounded-xl border-2 border-white px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 text-center">
                Read our methodology →
              </Link>
            </div>
          </section>
        </div>
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <p className="text-sm text-amber-900 mb-3">Scholar-aligned glossary entries covering the Islamic legal terms used on this page.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/sadaqah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sadaqah →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </main>
    </div>
  );
}
