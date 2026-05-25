import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Dallas, TX (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Dallas–Fort Worth. Which halal mortgage providers serve Texas, the structures offered, and how local affordability and property taxes shape the decision.',
  keywords: ['halal mortgage dallas', 'islamic home loan dallas', 'islamic mortgage texas', 'muslim mortgage dallas', 'sharia home loan dallas fort worth'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-dallas' },
  openGraph: {
    title: 'Halal Mortgage in Dallas, TX (2026)',
    description: 'Shariah-compliant home financing for Dallas–Fort Worth Muslims — providers serving Texas, structures, local notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-dallas',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Dallas',
  state: 'Texas',
  stateAbbr: 'TX',
  intro:
    'The Dallas–Fort Worth metroplex has a large and fast-growing Muslim community, with major concentrations in Richardson, Plano, and Irving. Strong job growth and a steady supply of suburban housing have made Shariah-compliant home financing a common goal for DFW families.',
  marketNote:
    'Dallas–Fort Worth is moderately priced for a large, high-growth metro — generally more affordable than the coasts but pricier than San Antonio, with rapid appreciation in the northern suburbs. Texas has no state income tax but relatively high property taxes, so factor the full property-tax bill into any rent-versus-buy comparison.',
  providerNote:
    'As a Texas market, DFW is covered by the national halal financiers: Guidance Residential and UIF Corporation are active in the state, and Ameen Housing has historically operated in Texas. Compare structures and effective cost before committing.',
  providers: ['Guidance Residential', 'UIF Corporation', 'Ameen Housing'],
  localFaq: [
    {
      q: 'Which suburbs do halal mortgage providers cover around Dallas?',
      a: 'Availability is statewide, so any provider licensed in Texas can finance homes across the metroplex — Richardson, Plano, Frisco, Irving, McKinney, and Fort Worth included.',
    },
    {
      q: 'Is Dallas affordable enough to buy halal instead of renting?',
      a: 'For many families, yes — though prices in the popular northern suburbs have risen quickly. Run a rent-versus-buy comparison over your expected time in the home, including high Texas property taxes, before deciding.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
