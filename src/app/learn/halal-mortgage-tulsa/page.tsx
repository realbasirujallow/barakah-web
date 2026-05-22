import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Tulsa, OK (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Tulsa. Which halal mortgage providers serve Oklahoma, the structures offered, and why low local prices make halal ownership reachable.',
  keywords: ['halal mortgage tulsa', 'islamic home loan tulsa', 'islamic mortgage oklahoma', 'muslim mortgage tulsa', 'sharia home loan tulsa'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-tulsa' },
  openGraph: {
    title: 'Halal Mortgage in Tulsa, OK (2026)',
    description: 'Shariah-compliant home financing for Tulsa Muslims — providers serving Oklahoma, structures, and affordability notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-tulsa',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Tulsa',
  state: 'Oklahoma',
  stateAbbr: 'OK',
  intro:
    'Tulsa has a small but growing Muslim community, and Oklahoma\'s low housing costs make it one of the most attainable markets in the country for halal home ownership. The main question for most local buyers is simply which national provider to work with, since there is no large Tulsa-based Islamic financier.',
  marketNote:
    'Tulsa is among the most affordable metros in the US, with home prices well below the national median across much of the area. That low entry point means a halal down payment is reachable for many families relatively quickly, and the financed amount — and therefore the financier\'s profit charge — stays modest compared with coastal markets.',
  providerNote:
    'Oklahoma is served by the national halal financiers rather than a local institution. Guidance Residential and UIF Corporation operate across most states, and LARIBA and Devon Bank are available to buyers nationwide. Confirm current Oklahoma licensing and terms with each provider before you apply.',
  providers: ['Guidance Residential', 'UIF Corporation', 'LARIBA', 'Devon Bank'],
  localFaq: [
    {
      q: 'Can I get a halal mortgage in Tulsa if no provider is based there?',
      a: 'Yes. None of the major Islamic financiers are headquartered in Oklahoma, but the national providers are licensed to serve the state, so Tulsa buyers apply through their programs the same way buyers in larger metros do.',
    },
    {
      q: 'Does Tulsa\'s low cost of living make halal ownership easier?',
      a: 'Generally, yes. Lower home prices mean a smaller down payment and a smaller financed amount, which keeps the monthly obligation under a diminishing-musharaka or ijara structure more manageable. Still run a rent-versus-buy comparison for your situation.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
