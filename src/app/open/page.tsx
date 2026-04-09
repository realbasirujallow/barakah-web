import Link from 'next/link';

const IOS_URL = 'https://apps.apple.com/us/app/barakah-islamic-finance/id6761279229';
const ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.trybarakah.app';

export default function OpenBarakahPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E1] px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-[#1B5E20]/10 bg-white p-8 shadow-sm md:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1B5E20]/70">Barakah</p>
        <h1 className="mt-4 text-3xl font-bold text-[#1B5E20] md:text-4xl">Open Barakah the way that fits your day</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
          Use the Barakah app to stay close to your balances, transactions, zakat readiness, and household finances on the go.
          If you are at your desk, the web dashboard is ready too.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <a
            href={IOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-[#1B5E20]/10 bg-[#F8FBF6] p-5 transition hover:-translate-y-0.5 hover:border-[#1B5E20]/30"
          >
            <p className="text-sm font-semibold text-[#1B5E20]">iPhone & iPad</p>
            <p className="mt-2 text-lg font-bold text-gray-900">Open on the App Store</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">Best for people who want Barakah close at hand throughout the day.</p>
          </a>

          <a
            href={ANDROID_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-[#1B5E20]/10 bg-[#F8FBF6] p-5 transition hover:-translate-y-0.5 hover:border-[#1B5E20]/30"
          >
            <p className="text-sm font-semibold text-[#1B5E20]">Android</p>
            <p className="mt-2 text-lg font-bold text-gray-900">Open on Google Play</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">Good for daily check-ins, quick syncs, and payment reminders on the move.</p>
          </a>

          <Link
            href="/dashboard"
            className="rounded-2xl border border-[#1B5E20]/10 bg-[#FFFDF5] p-5 transition hover:-translate-y-0.5 hover:border-[#1B5E20]/30"
          >
            <p className="text-sm font-semibold text-[#1B5E20]">Web</p>
            <p className="mt-2 text-lg font-bold text-gray-900">Use Barakah on the web</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">Best when you want the full dashboard, admin tools, or a larger-screen review.</p>
          </Link>
        </div>

        <div className="mt-8 rounded-2xl bg-[#F8FBF6] p-5">
          <p className="text-sm font-semibold text-[#1B5E20]">One quick tip</p>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Barakah becomes much more helpful once your main accounts are connected and transactions start syncing in.
            That is when budgets, due dates, net worth, zakat readiness, and spending insights become part of your regular routine.
          </p>
        </div>
      </div>
    </main>
  );
}
