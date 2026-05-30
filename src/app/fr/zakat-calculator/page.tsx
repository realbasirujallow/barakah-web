/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next';
import Link from 'next/link';
import Calculator from '../../zakat-calculator/Calculator';

const LANGS = {
  en: 'https://trybarakah.com/zakat-calculator',
  fr: 'https://trybarakah.com/fr/zakat-calculator',
  ar: 'https://trybarakah.com/ar/zakat-calculator',
  ur: 'https://trybarakah.com/ur/zakat-calculator',
  'x-default': 'https://trybarakah.com/zakat-calculator',
};

export const metadata: Metadata = {
  title: 'Calculateur de Zakat 2026 — Calcul gratuit en 60 secondes',
  description:
    "Calculez votre zakat en 60 secondes. Calculateur de zakat gratuit avec nisab en direct (or et argent), prise en compte de la liquidité, du retraite, des actions, et des biens d'entreprise. Conforme aux quatre madhabs.",
  keywords: ['calculateur de zakat', 'calcul de la zakat', 'zakat 2026', 'nisab', 'zakat sur épargne', 'zakat sur or', 'finance islamique', 'comment calculer la zakat'],
  alternates: { canonical: LANGS.fr, languages: LANGS },
  openGraph: {
    title: 'Calculateur de Zakat 2026 — Outil gratuit',
    description: "Calculez votre zakat sur or, argent, espèces, actions, retraite et biens d'entreprise avec le nisab en direct.",
    url: LANGS.fr, siteName: 'Barakah', type: 'website', locale: 'fr_FR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: "Combien représente la zakat ?",
    a: "La zakat représente 2,5 % de votre richesse nette imposable détenue au-dessus du nisab pendant une année lunaire complète (hawl). Sur 10 000 € de richesse nette éligible, la zakat est donc de 250 €.",
  },
  {
    q: "Qu'est-ce que le nisab et comment est-il fixé ?",
    a: "Le nisab est le seuil minimal au-dessus duquel la zakat devient obligatoire. Il équivaut à 85 g d'or ou 595 g d'argent (selon la base que vous choisissez), valorisés au cours du jour. Barakah affiche les deux nisab en temps réel.",
  },
  {
    q: "Dois-je payer la zakat sur mon logement principal ?",
    a: "Non. Le logement principal n'est pas zakatable selon les quatre madhabs. Les revenus locatifs et les biens détenus pour revente le sont en revanche.",
  },
  {
    q: "Quand la zakat est-elle due ?",
    a: "La zakat est due lorsque vous bouclez une année lunaire (hawl) au-dessus du nisab. Beaucoup de musulmans choisissent de la verser pendant Ramadan, mais elle est due à la date anniversaire de votre hawl, quelle qu'elle soit.",
  },
  {
    q: "La zakat s'applique-t-elle aux comptes de retraite ?",
    a: "Les avis divergent. Une approche contemporaine fréquente est de calculer la zakat sur la part réellement accessible aujourd'hui, après impôts et pénalités de sortie estimés. Consultez votre savant pour la position que vous suivez.",
  },
  {
    q: "Quelle est la différence entre zakat et sadaqa ?",
    a: "La zakat est une obligation calculée (2,5 % au-dessus du nisab après une année lunaire) ; la sadaqa est volontaire, sans montant ni moment fixés. Les deux sont importantes ; seule la zakat est l'un des piliers de l'islam.",
  },
];

const howToSteps = [
  { name: "Vérifiez le nisab", text: "Comparez votre richesse imposable nette (actifs moins dettes) au nisab actuel (basé sur 85 g d'or ou 595 g d'argent au cours du jour). Si votre richesse est inférieure, aucune zakat n'est due." },
  { name: "Additionnez votre richesse imposable", text: "Liquidités, épargne, or et argent, actions, biens d'entreprise, revenus locatifs reçus, etc. Évaluez les métaux précieux au cours actuel." },
  { name: "Déduisez vos dettes", text: "Soustrayez les dettes échues (prêts, cartes, autres dettes immédiates). Le seuil de nisab s'applique sur la richesse nette." },
  { name: "Appliquez 2,5 %", text: "Si la richesse nette atteint le nisab, multipliez-la par 0,025. Le résultat est votre zakat. Le taux de 2,5 % est constant entre toutes les écoles." },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};
const howToSchema = {
  '@context': 'https://schema.org', '@type': 'HowTo',
  name: 'Comment calculer la zakat', description: "Calcul pas à pas de votre zakat selon la méthodologie AAOIFI et les quatre madhabs.",
  step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
};
const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Calculateur de Zakat', item: LANGS.fr },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        <nav className="bg-white border-b border-gray-100 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1B5E20] transition">Accueil</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">Calculateur de Zakat</span>
          </div>
        </nav>

        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Calculateur de Zakat 2026</h1>
            <p className="text-base text-gray-600 mb-6">Calcul gratuit en 60 secondes · Nisab or et argent en direct · Quatre madhabs</p>

            <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1B5E20] mb-2">En bref</h2>
              <p className="text-base leading-7 text-gray-800">
                La zakat est l'un des cinq piliers de l'islam. Tout musulman dont la richesse imposable nette dépasse le <strong>nisab</strong> (85 g d'or ou 595 g d'argent au cours du jour) et la conserve pendant une <strong>année lunaire complète</strong> (hawl) doit verser <strong>2,5 %</strong> de cette richesse. Cet outil calcule votre zakat sur tous vos actifs : liquidités, or, argent, actions, retraite, biens d'entreprise, et plus.
              </p>
            </section>

            <section className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm leading-6 text-blue-900">
                <strong>À noter :</strong> l'outil de calcul ci-dessous fonctionne actuellement en anglais. Les chiffres, le nisab en direct et la logique fiqh sont identiques pour tous les utilisateurs ; nous traduirons l'interface du calculateur dans une prochaine version.
              </p>
            </section>

            {/* Embed the existing English calculator component */}
            <Calculator />

            <section className="mt-10 mb-8">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Comment calculer la zakat — pas à pas</h2>
              <ol className="list-decimal space-y-2 pl-6 text-base leading-7 text-gray-800">
                {howToSteps.map((s) => (
                  <li key={s.name}><strong>{s.name}.</strong> {s.text}</li>
                ))}
              </ol>
            </section>

            <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Questions fréquentes</h2>
              <div className="space-y-4">
                {faqItems.map((f) => (
                  <details key={f.q} className="rounded-xl border border-gray-200 p-4">
                    <summary className="cursor-pointer text-base font-semibold text-gray-900">{f.q}</summary>
                    <p className="mt-2 text-sm leading-7 text-gray-700">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-2">Note de fiqh</h2>
              <p className="text-sm leading-7 text-amber-900">
                Cet outil applique des positions partagées par les quatre madhabs principaux pour la majorité des actifs, et signale les divergences là où elles existent (par exemple, la zakat sur les bijoux d'or selon les écoles). Pour les cas particuliers (comptes de retraite, options sur actions, biens d'entreprise complexes), consultez un savant qualifié. Barakah n'émet pas de fatwa.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#1B5E20] mb-3">Pour aller plus loin</h2>
              <div className="flex flex-wrap gap-2">
                <Link href="/fr/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Qu'est-ce que la zakat ?</Link>
                <Link href="/fr/learn/nisab" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Le nisab</Link>
                <Link href="/fr/learn/hawl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Le hawl</Link>
                <Link href="/fr/learn/types-of-zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Types de zakat</Link>
                <Link href="/fr/learn/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Actions halal</Link>
                <Link href="/fr/learn/what-is-sukuk" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sukuk</Link>
              </div>
            </section>

            <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
              <h2 className="mb-3 text-xl font-bold">Suivez votre zakat année après année</h2>
              <p className="mb-4 text-sm leading-7 text-green-100">
                Barakah Plus suit automatiquement votre hawl, compare votre richesse au nisab en direct chaque jour, et calcule la zakat sur tous vos actifs — espèces, or, actions, retraite, biens d'entreprise, etc. Sans carte bancaire pour commencer.
              </p>
              <Link href="/signup?source=fr-zakat-calculator" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
                Créer un compte gratuit →
              </Link>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
