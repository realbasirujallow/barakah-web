import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Columbus, OH (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Columbus, Ohio. Which halal mortgage providers serve Ohio, the structures offered, and why this affordable Midwest market suits halal home buyers.',
  keywords: ['halal mortgage columbus', 'islamic home loan columbus ohio', 'halal mortgage ohio', 'islamic mortgage columbus', 'muslim mortgage columbus'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-columbus' },
  openGraph: {
    title: 'Halal Mortgage in Columbus, OH (2026)',
    description: 'Shariah-compliant home financing for Columbus-area Muslims — providers serving Ohio, structures, local notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-columbus',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Columbus',
  state: 'Ohio',
  stateAbbr: 'OH',
  intro:
    'Columbus is home to one of the largest Somali and East African Muslim communities in the United States, alongside a broad and growing Muslim population across the metro. It also sits in an affordable Midwest housing market that is served by national halal financing providers, which makes Shariah-compliant ownership genuinely reachable here.',
  marketNote:
    'Compared with the coasts, Columbus is an affordable major metro, with home prices well below those of cities like San Jose or Seattle. That lower entry point is the single biggest advantage for halal buyers: because halal financing requires a real down payment, a more modest purchase price means the upfront share is easier to save. As always, weigh neighborhood-level differences in price, property taxes, and resale before buying.',
  providerNote:
    'AMJA\'s Resident Fatwa Committee found Guidance Residential\'s declining-balance co-ownership model permissible, and Guidance is licensed in Ohio. Devon Bank, a Chicago-based bank with a long-running Islamic financing program focused on the Midwest, was permitted by AMJA only in cases of dire need. AMJA ruled that certain other companies whose contracts contain disguised interest are not permissible — so confirm a provider\'s AMJA status and current Ohio availability, and consult a qualified scholar, before committing.',
  providers: ['Guidance Residential — AMJA-permissible', 'Devon Bank — AMJA-permissible in dire need only'],
  localFaq: [
    {
      q: 'Why is Columbus considered a good market for a halal home purchase?',
      a: 'Mainly affordability. Halal financing still requires a down payment and often a larger initial co-ownership stake, so a lower purchase price directly shrinks the hardest part of the process. Columbus’s relatively low home prices, combined with a large and well-networked Muslim community, make it one of the more accessible major metros for first-time halal buyers.',
    },
    {
      q: 'Is there a Midwest-focused Islamic financing provider for Ohio?',
      a: 'Devon Bank, based in Chicago, has run an Islamic home financing program for many years and concentrates on the Midwest. Note that AMJA\'s Resident Fatwa Committee permitted Devon only in cases of dire need, while it found Guidance Residential\'s co-ownership model permissible more generally. Compare the structure and effective cost of each, confirm current Ohio availability, and consult a scholar before committing.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
