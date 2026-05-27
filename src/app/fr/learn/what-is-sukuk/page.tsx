/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/what-is-sukuk',
  fr: 'https://trybarakah.com/fr/learn/what-is-sukuk',
  ar: 'https://trybarakah.com/ar/learn/what-is-sukuk',
  ur: 'https://trybarakah.com/ur/learn/what-is-sukuk',
  'x-default': 'https://trybarakah.com/learn/what-is-sukuk',
};

export const metadata: Metadata = {
  title: "Qu'est-ce que les sukuk ? Les obligations islamiques expliquées (2026)",
  description:
    "Qu'est-ce que les sukuk ? Guide simple des certificats d'investissement islamiques — différences avec les obligations classiques, principaux types (ijara, murabaha, musharaka, mudaraba, wakala), conformité halal et risques.",
  keywords: ['qu\'est-ce que les sukuk', 'sukuk', 'définition sukuk', 'obligations islamiques', 'sukuk halal', 'ijara'],
  alternates: { canonical: LANGS.fr, languages: LANGS },
  openGraph: {
    title: "Qu'est-ce que les sukuk ? Les obligations islamiques expliquées (2026)",
    description: "Fonctionnement des sukuk, différences avec les obligations classiques, principaux types et conformité halal.",
    url: LANGS.fr, siteName: 'Barakah', type: 'article', locale: 'fr_FR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const sukukTypes = [
  { name: 'Sukuk Ijara', desc: "Adossés à un actif loué ; les porteurs perçoivent un revenu locatif. Structure la plus répandue." },
  { name: 'Sukuk Murabaha', desc: "Basés sur une vente à coût majoré ; le rendement provient de la marge déclarée." },
  { name: 'Sukuk Musharaka', desc: "Partenariat ou coentreprise ; les porteurs partagent les profits et pertes réels." },
  { name: 'Sukuk Mudaraba', desc: "L'un apporte le capital, l'autre la gestion ; les profits sont partagés selon un ratio convenu." },
  { name: 'Sukuk Wakala', desc: "Un mandataire investit les fonds pour le compte des porteurs contre commission et un rendement cible." },
];

const faqItems = [
  {
    q: "Qu'est-ce que les sukuk en termes simples ?",
    a: "Les sukuk sont des certificats d'investissement islamiques souvent appelés « obligations islamiques ». Au lieu de prêter de l'argent à intérêt, chaque certificat représente une part de propriété dans un actif réel, un projet ou une activité économique, et le porteur perçoit une part des revenus que cet actif génère — loyer ou profit, et non un intérêt.",
  },
  {
    q: "Les sukuk sont-ils halal ?",
    a: "Oui, à condition qu'ils soient correctement structurés et validés par un conseil de conformité Shariah. Ils doivent reposer sur des actifs ou des activités tangibles permis, partager un risque réel, et ne pas comporter d'intérêt (riba), d'incertitude excessive (gharar) ni d'activités interdites. De nombreuses émissions souveraines et d'entreprises répondent à ces critères ; vérifiez toujours la fatwa accompagnant l'émission.",
  },
  {
    q: "Quelle est la différence entre les sukuk et les obligations classiques ?",
    a: "Une obligation classique est un prêt à intérêt fixe — l'émetteur doit le principal et les coupons quelle que soit la performance. Un sukuk représente une part dans un actif ou un projet ; le rendement dépend des revenus que l'actif génère. Économiquement, certains sukuk peuvent se rapprocher d'obligations (notamment les ijara), mais la base juridique et la nature du risque diffèrent fondamentalement.",
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
    { '@type': 'ListItem', position: 3, name: "Qu'est-ce que les sukuk ?", item: LANGS.fr },
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
          <span className="text-gray-900">Qu'est-ce que les sukuk ?</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Qu'est-ce que les sukuk ?</h1>
          <p className="text-base text-gray-600 mb-6">Les obligations islamiques expliquées — 2026</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">En bref</h2>
            <p className="text-base leading-7 text-gray-800">
              Les sukuk (صكوك, singulier <em>sakk</em>) sont des certificats d'investissement conformes à la Shariah qui représentent une part de propriété dans un actif, un projet ou une activité, et non un prêt à intérêt. Les porteurs perçoivent une part des revenus réels (loyer ou profit) plutôt que des coupons d'intérêt.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Les principaux types de sukuk</h2>
            <ul className="space-y-2 text-base leading-7 text-gray-800">
              {sukukTypes.map((t) => (
                <li key={t.name}><strong>{t.name}</strong> — {t.desc}</li>
              ))}
            </ul>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Les sukuk sont-ils halal ?</h2>
            <p className="text-base leading-7 text-gray-800">
              Lorsqu'ils sont correctement structurés et validés par un conseil de conformité Shariah, les sukuk sont halal. Ils doivent reposer sur des actifs ou des activités permises, partager un risque économique réel, et exclure l'intérêt (riba), l'incertitude excessive (gharar) et les activités interdites. Vérifiez toujours la fatwa attachée à chaque émission.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Risques à connaître</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Risque de l'actif sous-jacent (vacance, défaut du locataire, dépréciation).</li>
              <li>Risque souverain ou de crédit de l'émetteur.</li>
              <li>Risque de marché secondaire — la liquidité varie selon l'émetteur.</li>
              <li>Risque de conformité — une structure mal conçue peut perdre son caractère halal.</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Pour aller plus loin</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Barakah Plus vous aide à suivre votre zakat sur les sukuk et autres investissements halal, et à vérifier la conformité Shariah de vos avoirs.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fr/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Qu'est-ce que la zakat ?</Link>
              <Link href="/fr/learn/nisab" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Le nisab</Link>
              <Link href="/signup" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">Commencer gratuitement →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
