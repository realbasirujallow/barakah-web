import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/zakat-on-gold',
  fr: 'https://trybarakah.com/fr/learn/zakat-on-gold',
  ar: 'https://trybarakah.com/ar/learn/zakat-on-gold',
  ur: 'https://trybarakah.com/ur/learn/zakat-on-gold',
  'x-default': 'https://trybarakah.com/learn/zakat-on-gold',
};

export const metadata: Metadata = {
  title: "Zakat sur l'or 2026 — nisab, taux et cas des bijoux",
  description:
    "Comment calculer la zakat sur l'or : nisab de 85 g, taux de 2,5 % après une année lunaire complète, et la divergence des écoles sur les bijoux portés, avec une méthode de calcul au cours du jour.",
  keywords: ["zakat sur l'or", "zakat or", "nisab or", "zakat bijoux", "calcul zakat or", "combien de zakat sur l'or"],
  alternates: { canonical: LANGS.fr, languages: LANGS },
  openGraph: {
    title: "Zakat sur l'or 2026 — nisab, taux et cas des bijoux",
    description: "Nisab de 85 g, taux de 2,5 % après une année lunaire, et la divergence des écoles sur les bijoux d'usage personnel.",
    url: LANGS.fr, siteName: 'Barakah', type: 'article', locale: 'fr_FR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: "Quel est le nisab de l'or ?",
    a: "Le nisab de l'or est d'environ 85 grammes (soit 20 mithqal). Si l'or que vous possédez atteint ou dépasse ce seuil et qu'une année lunaire complète s'est écoulée, la zakat est due au taux de 2,5 %. La valeur se calcule au cours de l'or le jour où la zakat devient exigible, et non au prix d'achat.",
  },
  {
    q: "La zakat est-elle due sur les bijoux portés ?",
    a: "C'est l'une des divergences les plus connues entre les savants. L'école hanafite considère que la zakat est due sur les bijoux en or, même portés. La majorité (malikites, chafiites, hanbalites) considère qu'il n'y a pas de zakat sur les bijoux d'usage personnel licite dans des limites raisonnables ; elle redevient due s'ils sont thésaurisés, destinés au commerce, ou dépassent nettement l'usage habituel. Par précaution, certains s'en acquittent. Référez-vous à un savant qualifié pour votre situation.",
  },
  {
    q: "Comment calculer concrètement la zakat sur l'or ?",
    a: "Pesez votre or en grammes (en tenant compte du titre : 24, 22, 21 ou 18 carats), multipliez le poids par le cours du gramme du jour pour obtenir la valeur. Si cette valeur atteint le nisab (valeur de 85 g d'or pur) et qu'une année lunaire s'est écoulée, prélevez-en 2,5 %. La zakat peut être versée en espèces ou en or.",
  },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};
const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Apprendre', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: "Zakat sur l'or", item: LANGS.fr },
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Accueil</Link>
          <span className="text-gray-300">/</span>
          <Link href="/learn" className="hover:text-[#1B5E20] transition">Apprendre</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Zakat sur l&apos;or</span>
        </div>
      </nav>
      <main className="flex-1" lang="fr">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-sm text-gray-500 mb-2">
            Disponible en :{' '}
            <Link href="/learn/zakat-on-gold" className="underline hover:text-[#1B5E20]">English</Link> ·{' '}
            <Link href="/ar/learn/zakat-on-gold" className="underline hover:text-[#1B5E20]">العربية</Link> ·{' '}
            <Link href="/ur/learn/zakat-on-gold" className="underline hover:text-[#1B5E20]">اردو</Link>
          </p>
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Zakat sur l&apos;or</h1>
          <p className="text-base text-gray-600 mb-6">Dernière révision : 2026-06-09 · Page informative — ne remplace pas l&apos;avis d&apos;un savant</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">En bref</h2>
            <p className="text-base leading-8 text-gray-800">
              La zakat sur l&apos;or est due lorsqu&apos;il atteint le <strong>nisab (environ 85 g)</strong> et qu&apos;une <strong>année lunaire complète</strong> s&apos;est écoulée ;
              son taux est de <strong>2,5 %</strong> de la valeur au cours du jour d&apos;exigibilité. La divergence la plus connue concerne les bijoux portés :
              les hanafites l&apos;imposent, la majorité non. Vérifiez le cours actuel et votre école avant tout calcul.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Conditions d&apos;exigibilité</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-8 text-gray-800">
              <li><strong>Atteindre le nisab :</strong> 85 g d&apos;or pur (24 carats) ou l&apos;équivalent en valeur.</li>
              <li><strong>Écoulement du hawl :</strong> une année lunaire complète sur la possession du nisab.</li>
              <li><strong>Pleine propriété :</strong> l&apos;or vous appartient de façon stable.</li>
              <li><strong>Au-delà des besoins essentiels :</strong> selon la condition retenue dans certains cas de bijoux.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Chiffres clés</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="p-3 font-semibold text-gray-700">Élément</th>
                    <th className="p-3 font-semibold text-gray-700">Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Nisab de l&apos;or</td><td className="p-3">85 g (≈ 20 mithqal)</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Taux de zakat</td><td className="p-3">2,5 % (le quart du dixième)</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Durée</td><td className="p-3">Une année lunaire (≈ 354 jours)</td></tr>
                  <tr><td className="p-3 font-semibold">Valorisation</td><td className="p-3">Cours du marché le jour d&apos;exigibilité</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              Remarque : l&apos;or 22, 21 ou 18 carats se calcule selon sa teneur en or pur ; par commodité, beaucoup retiennent la valeur marchande de la pièce entière.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Le cas des bijoux</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-8 text-gray-800">
              <li><strong>Hanafites :</strong> la zakat est due sur les bijoux en or dès qu&apos;ils atteignent le nisab et qu&apos;une année s&apos;écoule.</li>
              <li><strong>Majorité (malikites, chafiites, hanbalites) :</strong> pas de zakat sur les bijoux d&apos;usage personnel licite ; elle est due s&apos;ils sont thésaurisés, destinés au commerce, ou dépassent nettement l&apos;usage habituel.</li>
            </ul>
            <p className="text-sm italic text-gray-600 mt-3">
              Par précaution, certains s&apos;en acquittent. Référez-vous à un savant qualifié pour le détail de votre situation.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Avertissement religieux</h2>
            <p className="text-sm leading-8 text-amber-900">
              Cette page informative présente les positions des écoles reconnues sur la zakat de l&apos;or. Barakah n&apos;émet pas de fatwas et ne tranche pas en votre faveur entre les avis.
              Choisissez votre méthode avec l&apos;aide d&apos;un savant de confiance : les règles varient selon la nature de l&apos;or, l&apos;intention et l&apos;usage.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Calculez votre zakat avec Barakah</h2>
            <p className="mb-4 text-sm leading-8 text-green-100">
              Barakah suit votre or, votre épargne et vos investissements, calcule automatiquement le nisab et la date du hawl selon la méthode que vous choisissez, et vous rappelle quand la zakat devient exigible.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fr/zakat-calculator" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">Calculateur de zakat →</Link>
              <Link href="/fr/learn/nisab" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Qu&apos;est-ce que le nisab ?</Link>
              <Link href="/fr/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Qu&apos;est-ce que la zakat ?</Link>
              <Link href="/signup" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Commencer gratuitement</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
