import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Minneapolis, MN (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Minneapolis–St. Paul. Which halal mortgage providers serve Minnesota, the structures offered, and what to verify before you apply.',
  keywords: ['halal mortgage minneapolis', 'islamic home loan minneapolis', 'islamic mortgage minnesota', 'muslim mortgage minneapolis', 'sharia home loan twin cities'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-minneapolis' },
  openGraph: {
    title: 'Halal Mortgage in Minneapolis, MN (2026)',
    description: 'Shariah-compliant home financing for Twin Cities Muslims — providers serving Minnesota, structures, local notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-minneapolis',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Minneapolis',
  state: 'Minnesota',
  stateAbbr: 'MN',
  intro:
    'The Twin Cities are home to one of the largest Somali and East African Muslim communities in the United States, concentrated in neighborhoods like Cedar-Riverside and across the surrounding suburbs. Demand for Shariah-compliant home financing is correspondingly strong, and Minnesota has been a notable market for Islamic finance education and advocacy.',
  marketNote:
    'Minneapolis–St. Paul is a mid-priced metro — more affordable than the coasts, with a stable market and solid suburban inventory. As in any cold-climate metro, budget for higher heating and maintenance costs alongside the purchase, and weigh them in a rent-versus-buy comparison.',
  providerNote:
    'Minnesota is served by the national halal financiers. Guidance Residential and UIF Corporation operate in the state, with Devon Bank available to buyers across most US states. The Twin Cities have also seen community-led Islamic financing initiatives over the years, so ask locally as well — but confirm any program\'s Shariah review and current terms.',
  providers: ['Guidance Residential', 'UIF Corporation', 'Devon Bank'],
  localFaq: [
    {
      q: 'Which halal mortgage providers serve the Twin Cities?',
      a: 'The national providers Guidance Residential and UIF Corporation are the most commonly used in Minnesota, with Devon Bank also available in most states. Community-based programs have appeared locally over time, so it is worth asking within your community as well — just verify the Shariah review.',
    },
    {
      q: 'Is halal financing available across Minneapolis and St. Paul suburbs?',
      a: 'Yes. Availability is statewide, so a provider licensed in Minnesota can finance homes throughout the metro — Minneapolis, St. Paul, Bloomington, Eden Prairie, and the surrounding suburbs.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
