import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Raleigh-Durham, NC (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Raleigh, Durham, and the Research Triangle. Which halal mortgage providers serve North Carolina, the structures offered, and what to verify.',
  keywords: ['halal mortgage raleigh', 'islamic home loan raleigh durham', 'halal mortgage north carolina', 'islamic mortgage research triangle', 'muslim mortgage raleigh'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-raleigh' },
  openGraph: {
    title: 'Halal Mortgage in Raleigh-Durham, NC (2026)',
    description: 'Shariah-compliant home financing for the Research Triangle\'s Muslims — providers serving North Carolina, structures, local notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-raleigh',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Raleigh-Durham',
  state: 'North Carolina',
  stateAbbr: 'NC',
  intro:
    'The Raleigh-Durham area — the Research Triangle — has a growing, highly educated Muslim community anchored by its universities, research institutions, and technology and healthcare employers. North Carolina is served by national halal financing providers, so Shariah-compliant ownership is a practical option for Triangle families.',
  marketNote:
    'The Triangle has been one of the faster-growing regions in the country, and home prices have risen with that growth, though it remains more affordable than the largest coastal metros. Prices vary noticeably between Raleigh, Durham, Cary, and the surrounding towns, so it is worth comparing across the area. As always, a halal purchase requires saving a real down payment regardless of how quickly the market is moving.',
  providerNote:
    'AMJA\'s Resident Fatwa Committee found Guidance Residential\'s declining-balance co-ownership model permissible, and Guidance is licensed in North Carolina. AMJA permitted some other companies only in cases of dire need, and ruled that certain providers whose contracts contain disguised interest are not permissible — so confirm a provider\'s AMJA status and current North Carolina availability, and consult a qualified scholar, before committing.',
  providers: ['Guidance Residential — AMJA-permissible'],
  localFaq: [
    {
      q: 'Which halal mortgage providers are recommended for North Carolina?',
      a: 'AMJA\'s Resident Fatwa Committee found Guidance Residential\'s co-ownership model permissible, and Guidance is licensed in North Carolina. AMJA permitted some other companies only in cases of dire need and ruled others — whose contracts contain disguised interest — impermissible. Confirm a provider\'s current AMJA status and North Carolina availability before applying, and consult a qualified scholar about the specific contract.',
    },
    {
      q: 'Is the Research Triangle a good place to buy with halal financing?',
      a: 'For many families, yes. The Triangle\'s relative affordability compared with large coastal metros, combined with a strong job market in research, tech, and healthcare, makes saving a down payment more attainable. The financing structures are the same as elsewhere — diminishing musharaka, ijara, or murabaha — so the main work is comparing providers and saving the upfront share.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
