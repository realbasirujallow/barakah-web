import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Chicago, IL (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Chicago. Which halal mortgage providers serve Illinois (including Chicago-based Devon Bank), the structures offered, and what to verify before you apply.',
  keywords: ['halal mortgage chicago', 'islamic home loan chicago', 'islamic mortgage illinois', 'muslim mortgage chicago', 'sharia home loan chicago'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-chicago' },
  openGraph: {
    title: 'Halal Mortgage in Chicago, IL (2026)',
    description: 'Shariah-compliant home financing for Chicago Muslims — providers serving Illinois, structures, and how to choose.',
    url: 'https://trybarakah.com/learn/halal-mortgage-chicago',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Chicago',
  state: 'Illinois',
  stateAbbr: 'IL',
  intro:
    "Chicago is home to one of the oldest and largest Muslim communities in the United States, spread across the city and suburbs like Bridgeview, Skokie, and Naperville. It's also unusually well-served for halal home financing — one of the country's pioneering Islamic-finance banks is headquartered right here.",
  marketNote:
    'Compared with coastal metros, Chicago remains one of the more attainable large US housing markets, with a wide range of price points between the city neighborhoods and the collar counties. That makes the down-payment math for a diminishing-musharaka purchase more reachable for many families — though property taxes in Cook County are notably high and should be built into any rent-versus-buy comparison.',
  providerNote:
    'Devon Bank, a community bank headquartered on Chicago\'s North Side, has run Islamic financing programs for decades and is one of the most recognizable local options. Alongside it, the national providers — Guidance Residential and UIF Corporation — are licensed to serve Illinois, and Ameen Housing has historically operated in the state. That gives Chicago buyers more competing halal options than most US cities.',
  providers: ['Devon Bank (Chicago)', 'Guidance Residential', 'UIF Corporation', 'Ameen Housing'],
  localFaq: [
    {
      q: 'Is there a Chicago-based halal mortgage provider?',
      a: 'Yes. Devon Bank, headquartered in Chicago, has offered Islamic home financing for many years using murabaha and diminishing-musharaka structures. Being locally based, it is a common starting point for Chicago-area buyers, though you should still compare its effective cost against the national providers.',
    },
    {
      q: 'Do high Cook County property taxes affect a halal mortgage?',
      a: 'Property taxes are charged by the county regardless of how you finance the home, so they apply equally to halal and conventional buyers. In a diminishing-musharaka arrangement you are a co-owner from day one, so budget for the full property-tax bill as a homeowner, not a renter.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
