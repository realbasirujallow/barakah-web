/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/hawl',
  fr: 'https://trybarakah.com/fr/learn/hawl',
  ar: 'https://trybarakah.com/ar/learn/hawl',
  ur: 'https://trybarakah.com/ur/learn/hawl',
  'x-default': 'https://trybarakah.com/learn/hawl',
};

export const metadata: Metadata = {
  title: "Qu'est-ce que le hawl ? Année lunaire de la zakat expliquée (2026)",
  description:
    "Qu'est-ce que le hawl ? Définition de l'année lunaire islamique pour la zakat, comment elle commence et se termine, ce qui réinitialise le hawl, et comment suivre votre date d'échéance.",
  keywords: ['qu\'est-ce que le hawl', 'hawl', 'année lunaire zakat', 'date de zakat', 'calcul hawl'],
  alternates: { canonical: LANGS.fr, languages: LANGS },
  openGraph: {
    title: "Qu'est-ce que le hawl ? L'année lunaire de la zakat",
    description: "Comment fonctionne l'année lunaire de la zakat (hawl), quand elle commence, ce qui la réinitialise, et comment suivre votre échéance.",
    url: LANGS.fr, siteName: 'Barakah', type: 'article', locale: 'fr_FR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const faqItems = [
  {
    q: "Qu'est-ce que le hawl ?",
    a: "Le hawl est l'année lunaire (environ 354 jours) que votre richesse imposable doit rester au-dessus du nisab pour que la zakat devienne obligatoire. Il se compte selon le calendrier hégirien, pas grégorien.",
  },
  {
    q: "Quand le hawl commence-t-il ?",
    a: "Le hawl commence le jour où votre richesse imposable atteint pour la première fois le seuil du nisab. À partir de cette date, vous comptez une année lunaire complète. Si votre richesse reste supérieure au nisab à la fin de cette année, vous versez 2,5 % de la richesse imposable détenue ce jour-là.",
  },
  {
    q: "Qu'est-ce qui réinitialise le hawl ?",
    a: "Le hawl est réinitialisé si votre richesse imposable tombe sous le nisab à un moment quelconque de l'année. Le nouveau hawl recommencera dès qu'elle dépasse à nouveau le nisab. La plupart des écoles considèrent les fluctuations très brèves dues à des dépenses ordinaires comme tolérables si vous revenez vite au-dessus.",
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
    { '@type': 'ListItem', position: 3, name: "Qu'est-ce que le hawl ?", item: LANGS.fr },
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
          <span className="text-gray-900">Qu'est-ce que le hawl ?</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Qu'est-ce que le hawl ?</h1>
          <p className="text-base text-gray-600 mb-6">L'année lunaire de la zakat — 2026</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">En bref</h2>
            <p className="text-base leading-7 text-gray-800">
              Le hawl (حول) est la période d'une année lunaire complète (≈ 354 jours) pendant laquelle votre richesse imposable doit rester au-dessus du nisab pour que la zakat soit due. Il se compte avec le calendrier hégirien.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Comment le hawl est-il calculé ?</h2>
            <ol className="list-decimal space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li>Votre richesse imposable (espèces, or, argent, actions, etc.) atteint le nisab pour la première fois. Cette date devient votre « date de hawl ».</li>
              <li>Vous comptez une année lunaire complète à partir de cette date.</li>
              <li>Si, à la fin de cette année, vous êtes toujours au-dessus du nisab, vous versez 2,5 % de votre richesse imposable nette ce jour-là.</li>
              <li>Si votre richesse est tombée sous le nisab pendant l'année, le hawl est réinitialisé et recommence lorsque vous repassez au-dessus.</li>
            </ol>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Ce qui réinitialise le hawl</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Une baisse durable de votre richesse imposable sous le nisab.</li>
              <li>La perte ou la disparition involontaire de la richesse (cas particulier, à consulter avec un savant).</li>
            </ul>
            <p className="text-sm italic text-gray-600 mt-3">
              Les variations très brèves au cours d'un mois (paiements de factures, dépenses ordinaires) ne sont en général pas considérées comme une rupture du hawl tant que vous revenez rapidement au-dessus du nisab.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Comment suivre votre hawl</h2>
            <p className="text-base leading-7 text-gray-800">
              Notez la date hégirienne à laquelle votre richesse a franchi le nisab. À la même date, l'année suivante, calculez votre richesse imposable et versez 2,5 %. Barakah suit cela automatiquement : prix vifs du nisab, conversion grégorienne ↔ hégirienne, et rappels avant l'échéance.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Pour aller plus loin</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Barakah suit votre hawl en continu, comparant chaque jour votre richesse imposable au nisab vif et signalant la date où la zakat devient due.
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
