import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Denver, CO (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Denver and the Front Range. Which halal mortgage providers serve Colorado, the structures offered, and what local buyers should verify.',
  keywords: ['halal mortgage denver', 'islamic home loan denver', 'halal mortgage colorado', 'islamic mortgage denver', 'muslim mortgage denver'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-denver' },
  openGraph: {
    title: 'Halal Mortgage in Denver, CO (2026)',
    description: 'Shariah-compliant home financing for Denver-area Muslims — providers serving Colorado, structures, local notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-denver',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Denver',
  state: 'Colorado',
  stateAbbr: 'CO',
  intro:
    'The Denver metro and the wider Front Range have a growing and diverse Muslim community, including East African and other immigrant families as well as professionals drawn by the region\'s economy. Colorado is served by national halal financing providers, so Shariah-compliant ownership is a realistic option for Denver-area families.',
  marketNote:
    'Denver\'s housing market climbed substantially over the past decade as the region grew, so the down payment is usually the biggest hurdle for first-time buyers. Prices differ widely between the city, the closer suburbs, and the outer Front Range communities, so it pays to compare across the metro. A halal purchase requires saving a real upfront share regardless of where prices sit in the cycle.',
  providerNote:
    'AMJA\'s Resident Fatwa Committee found Guidance Residential\'s declining-balance co-ownership model permissible, and Guidance is licensed in Colorado. AMJA permitted some other companies only in cases of dire need, and ruled that certain providers whose contracts contain disguised interest are not permissible — so confirm a provider\'s AMJA status and current Colorado availability, and consult a qualified scholar, before committing.',
  providers: ['Guidance Residential — AMJA-permissible'],
  localFaq: [
    {
      q: 'Which halal mortgage providers are recommended for Colorado?',
      a: 'AMJA\'s Resident Fatwa Committee found Guidance Residential\'s co-ownership model permissible, and Guidance is licensed in Colorado. AMJA permitted some other companies only in cases of dire need and ruled others — whose contracts contain disguised interest — impermissible. Confirm a provider\'s current AMJA status and Colorado availability before applying, and consult a qualified scholar about the specific contract.',
    },
    {
      q: 'How much do I need to save for a halal home purchase in Denver?',
      a: 'There is no single figure — it depends on the home price and the provider\'s required initial share, which is often larger than a conventional down payment. Because Denver prices have risen, many buyers plan a longer savings runway or consider more affordable parts of the Front Range. Build a clear savings target around a realistic price range before applying.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
