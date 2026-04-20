import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const HASH_REGEX = /^[a-f0-9]{64}$/;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hash: string }>;
}): Promise<Metadata> {
  const { hash } = await params;
  const safe = hash.slice(0, 8);
  return {
    title: `Verify snapshot ${safe}… | Barakah`,
    description: `Independent verification page for Barakah zakat snapshot integrity hash ${safe}…`,
    robots: { index: false, follow: true },
    alternates: { canonical: `https://trybarakah.com/verify/${hash}` },
  };
}

export default async function VerifyHashPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const normalized = hash.toLowerCase();
  if (!HASH_REGEX.test(normalized)) notFound();

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      {/* Visible status banner. The on-page amber "Public verification
          endpoint: beta" section below spells out what ships in Q3 2026;
          this banner just makes it unmistakable at a glance. */}
      <div className="bg-amber-100 border-b-2 border-amber-400 px-4 py-2 text-center text-xs font-semibold text-amber-900">
        ⚠ BETA · Public anonymous verification opens in Q3 2026 with the Year-end Zakat PDF · account holders can verify today via /dashboard/ledger
      </div>
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
          <div className="flex items-center gap-3">
            <Link href="/methodology" className="text-sm text-[#1B5E20] font-medium hover:underline">Methodology</Link>
            <Link href="/verify" className="text-sm text-[#1B5E20] font-medium hover:underline">Verify</Link>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/verify" className="hover:text-[#1B5E20] transition">Verify</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-mono">{normalized.slice(0, 8)}…</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl font-extrabold text-[#1B5E20]">Snapshot verification</h1>
          <p className="text-sm text-gray-600 mb-2">Input hash:</p>
          <code className="block break-all rounded-xl bg-white p-4 font-mono text-xs text-gray-800 shadow-sm mb-8">
            {normalized}
          </code>

          <section className="mb-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center">
                <svg className="h-5 w-5 text-amber-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <circle cx="12" cy="16" r="0.5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-amber-900 mb-2">Public verification endpoint: beta</h2>
                <p className="text-sm leading-7 text-amber-900 mb-3">
                  The public-verify API that would fetch the signed snapshot document for this hash
                  is currently in beta. It&apos;s available to Barakah account holders via{' '}
                  <Link href="/dashboard/ledger" className="underline font-semibold">
                    /dashboard/ledger
                  </Link>
                  {' '}inside the app.
                </p>
                <p className="text-sm leading-7 text-amber-900">
                  Public anonymous verification will ship with the Year-end Zakat PDF report in Q3 2026
                  — every PDF will include a verify link that opens this page with the PDF&apos;s own
                  hash, so recipients (your accountant, a scholar, or a shared-family viewer) can
                  confirm the calculation independently.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-[#1B5E20]">Verify manually today</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              If you have the snapshot JSON (exportable from your dashboard ledger), you can
              recompute the hash locally:
            </p>
            <pre className="overflow-x-auto rounded-xl bg-gray-900 p-4 text-xs text-green-300">
{`# Canonical-JSON + SHA-256 locally
echo -n "$(cat snapshot.json | jq -cS .)" | shasum -a 256`}
            </pre>
            <p className="text-sm text-gray-600 mt-3">
              The hash must match the one shown on this page exactly (64 lowercase hex characters).
              If it doesn&apos;t match, either the snapshot JSON was modified, or the canonical-JSON
              ordering differs. Use the reference implementation in the{' '}
              <a
                href="https://github.com/realbasirujallow/barakah-backend/tree/main/docs/integrity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1B5E20] underline"
              >
                barakah-backend repo
              </a>{' '}
              to avoid ordering mistakes.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-[#1B5E20]">What&apos;s next</h2>
            <ul className="list-disc space-y-1 pl-6 text-sm leading-7 text-gray-800">
              <li>Paste a different hash to verify another snapshot — <Link href="/verify" className="text-[#1B5E20] underline">back to /verify</Link></li>
              <li>See what the hash commits to — <Link href="/methodology" className="text-[#1B5E20] underline">/methodology</Link></li>
              <li>See every methodology change since launch — <Link href="/methodology/changelog" className="text-[#1B5E20] underline">/methodology/changelog</Link></li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
