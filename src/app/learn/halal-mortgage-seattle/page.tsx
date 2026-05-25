import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Seattle, WA (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Seattle and the Puget Sound area. Which halal mortgage providers serve Washington State, the structures offered, and what local buyers should verify.',
  keywords: ['halal mortgage seattle', 'islamic home loan seattle', 'halal mortgage washington state', 'islamic mortgage puget sound', 'muslim mortgage seattle'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-seattle' },
  openGraph: {
    title: 'Halal Mortgage in Seattle, WA (2026)',
    description: 'Shariah-compliant home financing for Seattle-area Muslims — providers serving Washington State, structures, local notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-seattle',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Seattle',
  state: 'Washington',
  stateAbbr: 'WA',
  intro:
    'The greater Seattle area is home to a sizeable and growing Muslim community, including a large East African population concentrated in south King County communities such as SeaTac, Tukwila, and Kent. Washington State is served by national halal home financing providers, so Shariah-compliant ownership is a realistic path for local families.',
  marketNote:
    'Seattle is a high-cost, competitive housing market where prices have risen substantially over the last decade, so the down payment is often the biggest hurdle for first-time buyers. One factor that works in buyers’ favor here is that Washington has no state income tax, which can leave more room in a household budget to save toward an upfront share — though high home prices offset much of that advantage. Compare your saving timeline against local rents before deciding.',
  providerNote:
    'AMJA\'s Resident Fatwa Committee found Guidance Residential\'s declining-balance co-ownership model permissible, and Guidance is licensed in Washington State. AMJA permitted some other companies only in cases of dire need, and ruled that certain providers whose contracts contain disguised interest are not permissible — so confirm a provider\'s AMJA status and current Washington availability, and consult a qualified scholar, before committing.',
  providers: ['Guidance Residential — AMJA-permissible'],
  localFaq: [
    {
      q: 'Which halal mortgage providers are recommended for Washington State?',
      a: 'AMJA\'s Resident Fatwa Committee found Guidance Residential\'s co-ownership model permissible, and Guidance is licensed in Washington. AMJA permitted some other companies only in cases of dire need and ruled others — whose contracts contain disguised interest — impermissible. Confirm a provider\'s current AMJA status and Washington availability before applying, and consult a qualified scholar about the specific contract.',
    },
    {
      q: 'Does Washington having no state income tax help with a halal home purchase?',
      a: 'Indirectly. Halal financing avoids interest (riba) regardless of where you live, so the tax has no effect on the structure. But the absence of a state income tax can leave a household with more take-home pay to put toward a down payment, which is usually the hardest part of buying in an expensive market like Seattle.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
