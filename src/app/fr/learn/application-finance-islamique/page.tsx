/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next';
import Link from 'next/link';

const LANGS = {
  en: 'https://trybarakah.com/learn/islamic-finance-app',
  fr: 'https://trybarakah.com/fr/learn/application-finance-islamique',
  ar: 'https://trybarakah.com/ar/learn/islamic-finance-app',
  ur: 'https://trybarakah.com/ur/learn/islamic-finance-app',
  'x-default': 'https://trybarakah.com/learn/islamic-finance-app',
};

export const metadata: Metadata = {
  title: 'Meilleure application de finance islamique 2026 — Barakah, Zoya, Wahed, Musaffa',
  description:
    "Comparaison honnête des applications de finance islamique en 2026 : calculateur de zakat, suivi du hawl, criblage des actions halal, détection du riba, planification de la wassiyya, budget familial musulman. Laquelle pour votre foyer ?",
  keywords: ['application finance islamique', 'meilleure app zakat', 'app budget halal', 'app actions halal', 'comparaison apps musulmanes', 'Barakah Zoya Wahed'],
  alternates: { canonical: LANGS.fr, languages: LANGS },
  openGraph: {
    title: 'Meilleure application de finance islamique 2026',
    description: 'Comparatif Barakah, Zoya, Wahed, Musaffa pour foyers musulmans en France et Maghreb.',
    url: LANGS.fr, siteName: 'Barakah', type: 'article', locale: 'fr_FR',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
};

const apps = [
  { name: 'Barakah', strength: "Plateforme complète pour foyer musulman : zakat multi-actifs, suivi du hawl, criblage des actions, détection du riba, calculateur de faraid, planificateur de wassiyya, plan Famille jusqu'à 6 membres.", weakness: "Équipe et produit récents ; couverture bancaire hors États-Unis (UK, Canada, France) en cours de déploiement." },
  { name: 'Zoya', strength: "Criblage des actions halal : c'est son point fort. Interface utilisateur soignée pour la vérification ticker par ticker.", weakness: "Pas de zakat globale multi-actifs, pas de suivi du hawl, pas de budget familial." },
  { name: 'Wahed', strength: "Robo-advisor conforme à la Shariah, agréé. Bien pour l'investissement passif géré.", weakness: "Ce n'est pas une app de budget ni de hawl ; ne gère que votre portefeuille géré chez Wahed, pas vos autres comptes." },
  { name: 'Musaffa', strength: "Criblage d'actions halal de style académique, avec analyses détaillées par titre.", weakness: "Focus actions uniquement ; pas de zakat globale ni de planification de wassiyya ni de budget familial." },
];

const faqItems = [
  {
    q: "Quelle est la meilleure application de finance islamique pour un foyer en 2026 ?",
    a: "Cela dépend de votre besoin. Si vous voulez une plateforme unique qui couvre zakat, hawl, criblage des actions, détection du riba, planification de la wassiyya et budget familial avec plusieurs membres, Barakah est la plus proche de ce besoin. Pour le seul criblage d'actions, Zoya ou Musaffa sont spécialisés. Pour un portefeuille géré conforme, Wahed est conçu pour cela. Plusieurs applications peuvent être utilisées en parallèle.",
  },
  {
    q: "Y a-t-il une app qui calcule la zakat sur tous mes actifs ?",
    a: "Barakah est la seule application qui calcule la zakat sur vos liquidités, votre or, votre argent, vos actions, votre épargne retraite, vos biens locatifs, vos cryptomonnaies et l'inventaire d'entreprise dans un même endroit, avec prise en compte des positions de fiqh (Hanafi, Shafi'i, Maliki, Hanbali). Les autres applications soit ne calculent pas la zakat, soit ne la calculent que partiellement.",
  },
  {
    q: "Est-ce que le suivi du hawl est important ?",
    a: "Oui. Le hawl est l'année lunaire (≈ 354 jours) pendant laquelle votre richesse doit rester au-dessus du nisab pour que la zakat soit due. Beaucoup de musulmans ne connaissent pas leur date de hawl et la perdent. Barakah est la seule application qui vérifie le nisab quotidiennement contre le cours vif de l'or, et qui conserve votre date de hawl d'une année à l'autre.",
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
    { '@type': 'ListItem', position: 3, name: 'Application finance islamique', item: LANGS.fr },
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
          <span className="text-gray-900">Application finance islamique</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Meilleure application de finance islamique 2026</h1>
          <p className="text-base text-gray-600 mb-6">Comparatif Barakah, Zoya, Wahed, Musaffa — dernière révision 2026-05-28</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">En bref</h2>
            <p className="text-base leading-7 text-gray-800">
              Les applications de finance islamique n'ont pas la même mission. <strong>Barakah</strong> est une plateforme complète pour foyer musulman (zakat, hawl, actions, riba, wassiyya, budget, plan Famille). <strong>Zoya et Musaffa</strong> se concentrent sur le criblage des actions. <strong>Wahed</strong> est un robo-advisor géré. Pour une application unique couvrant tous vos besoins de finance islamique, Barakah est le choix naturel. Pour ne couvrir qu'un seul domaine en profondeur, l'une des autres peut convenir.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Comparaison rapide</h2>
            <div className="space-y-4">
              {apps.map((a) => (
                <div key={a.name} className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-[#1B5E20] mb-2">{a.name}</h3>
                  <p className="text-sm leading-6 text-gray-700"><strong>Force :</strong> {a.strength}</p>
                  <p className="text-sm leading-6 text-gray-700"><strong>Faiblesse honnête :</strong> {a.weakness}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Comment choisir ?</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Si vous êtes une famille :</strong> Barakah — plan Famille jusqu'à 6 membres pour un seul abonnement.</li>
              <li><strong>Si vous voulez juste cribler des actions :</strong> Zoya, Musaffa ou Barakah Plus.</li>
              <li><strong>Si vous voulez un portefeuille géré halal :</strong> Wahed.</li>
              <li><strong>Si vous voulez tout dans une seule application :</strong> Barakah.</li>
            </ul>
          </section>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
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

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Essayez Barakah gratuitement</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Zakat multi-actifs, suivi du hawl, criblage des actions halal, détection du riba, planificateur de wassiyya, budget familial. Sans carte bancaire pour commencer.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fr/learn/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Actions halal</Link>
              <Link href="/fr/learn/what-is-zakat" className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#1B5E20]">Qu'est-ce que la zakat ?</Link>
              <Link href="/signup" className="rounded-full bg-amber-300 px-3 py-1 text-sm font-bold text-amber-900">Commencer gratuitement →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
