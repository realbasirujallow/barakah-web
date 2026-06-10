import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com',
  fr: 'https://trybarakah.com/fr',
  ar: 'https://trybarakah.com/ar',
  ur: 'https://trybarakah.com/ur',
  'x-default': 'https://trybarakah.com',
};

export const metadata: Metadata = {
  title: 'Barakah — app de finance islamique : zakat et budget halal',
  description:
    "Une seule app pour tout votre argent, conforme à la charia : calcul automatique de la zakat, du nisab et du hawl, détection du riba dans vos transactions, filtrage d'actions halal, budget familial et suivi de la sadaqa — en français.",
  keywords: ['application finance islamique', 'calculateur zakat', 'budget halal', 'détection riba', 'actions halal', 'app zakat'],
  alternates: { canonical: LANGS.fr, languages: LANGS },
  openGraph: {
    title: 'Barakah — app de finance islamique',
    description: 'Zakat, budget halal, détection du riba et filtrage d’actions — dans une seule app.',
    url: LANGS.fr, siteName: 'Barakah', type: 'website', locale: 'fr_FR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
          <Link href="/fr" className="font-extrabold text-[#1B5E20] text-lg">Barakah</Link>
          <div className="flex items-center gap-3 text-gray-600">
            <Link href="/" className="hover:text-[#1B5E20]">English</Link>
            <Link href="/ar" className="hover:text-[#1B5E20]">العربية</Link>
            <Link href="/ur" className="hover:text-[#1B5E20]">اردو</Link>
            <Link href="/login" className="hover:text-[#1B5E20]">Se connecter</Link>
          </div>
        </div>
      </nav>
      <main className="flex-1" lang="fr">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <h1 className="mb-4 text-4xl md:text-6xl font-extrabold text-[#1B5E20] leading-tight">
            Tout votre argent, conforme à la charia, dans une seule app
          </h1>
          <p className="text-lg leading-9 text-gray-700 mb-8 max-w-2xl">
            Barakah calcule automatiquement votre zakat, votre nisab et votre hawl, détecte les sources de riba dans vos transactions,
            filtre vos actions selon le standard AAOIFI, et vous aide à tenir le budget familial et vos dons — sans prétendre émettre de fatwas,
            avec une méthodologie publiée dont vous choisissez l&apos;école.
          </p>
          <div className="flex flex-wrap gap-3 mb-14">
            <Link href="/signup" className="rounded-full bg-[#1B5E20] px-6 py-3 text-base font-bold text-white hover:bg-[#2E7D32] transition">Commencer gratuitement</Link>
            <Link href="/fr/zakat-calculator" className="rounded-full bg-amber-300 px-6 py-3 text-base font-bold text-amber-900 hover:bg-amber-200 transition">Calculer ma zakat</Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-14">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">🌙 La zakat sans casse-tête</h2>
              <p className="text-sm leading-7 text-gray-700">Nisab en direct au cours de l&apos;or, suivi du hawl en calendrier hégirien, calcul automatique sur l&apos;épargne, l&apos;or et les actions, avec l&apos;historique de vos versements.</p>
              <Link href="/fr/learn/what-is-zakat" className="text-sm font-semibold text-[#1B5E20] underline mt-2 inline-block">Qu&apos;est-ce que la zakat ? →</Link>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">🚫 Détection du riba</h2>
              <p className="text-sm leading-7 text-gray-700">Repère les intérêts entrants et sortants sur vos comptes, et vous aide à planifier leur élimination et la purification de ce qui a été perçu.</p>
              <Link href="/fr/learn/riba-elimination" className="text-sm font-semibold text-[#1B5E20] underline mt-2 inline-block">Éliminer le riba →</Link>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">📈 Actions halal</h2>
              <p className="text-sm leading-7 text-gray-700">Filtrage charia selon les ratios AAOIFI en direct pour les actions américaines, du Golfe et britanniques, avec le calcul de la part à purifier.</p>
              <Link href="/fr/learn/halal-stocks" className="text-sm font-semibold text-[#1B5E20] underline mt-2 inline-block">Guide des actions halal →</Link>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">👨‍👩‍👧 Budget familial</h2>
              <p className="text-sm leading-7 text-gray-700">Un budget qui met les obligations avant le superflu, un compte partagé pour la famille, et le suivi de la sadaqa, du waqf et du testament.</p>
              <Link href="/fr/learn/halal-budgeting" className="text-sm font-semibold text-[#1B5E20] underline mt-2 inline-block">Le budget halal →</Link>
            </div>
          </div>

          <section className="rounded-2xl bg-white p-6 shadow-sm mb-14">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-3">À lire en français</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/fr/learn/what-is-zakat" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">Qu&apos;est-ce que la zakat ?</Link>
              <Link href="/fr/learn/nisab" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">Le nisab</Link>
              <Link href="/fr/learn/hawl" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">Le hawl</Link>
              <Link href="/fr/learn/zakat-on-gold" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">Zakat sur l&apos;or</Link>
              <Link href="/fr/learn/types-of-zakat" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">Types de zakat</Link>
              <Link href="/fr/learn/what-is-sukuk" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">Les sukuk</Link>
              <Link href="/fr/learn/application-finance-islamique" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">App de finance islamique</Link>
              <Link href="/fr/learn/how-much-zakat-do-i-owe" className="rounded-full bg-[#FFF8E1] px-3 py-1 text-sm font-semibold text-[#1B5E20]">Combien de zakat ?</Link>
            </div>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-8 text-white text-center">
            <h2 className="mb-3 text-2xl font-bold">Commencez votre chemin vers un argent plus pur</h2>
            <p className="mb-5 text-sm leading-7 text-green-100 max-w-xl mx-auto">
              Méthodologie publiée sur <Link href="/methodology" className="underline">la page méthodologie</Link>. Nous ne vendons pas vos données — prestataires de service uniquement.
              Barakah n&apos;émet pas de fatwas ; pour vos cas particuliers, référez-vous aux gens de science.
            </p>
            <Link href="/signup" className="inline-block rounded-full bg-amber-300 px-8 py-3 text-base font-bold text-amber-900 hover:bg-amber-200 transition">Commencer gratuitement →</Link>
          </section>
        </div>
      </main>
    </div>
  );
}
