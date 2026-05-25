import type { Metadata } from 'next';
import CityHalalMortgage, { type CityMortgageData } from '../../../components/CityHalalMortgage';

export const metadata: Metadata = {
  title: 'Halal Mortgage in Phoenix, AZ (2026) — Islamic Home Financing Guide',
  description:
    'How to get a Shariah-compliant home loan in Phoenix and the Valley. Which halal mortgage providers serve Arizona, the structures offered, and what local buyers should verify.',
  keywords: ['halal mortgage phoenix', 'islamic home loan phoenix', 'halal mortgage arizona', 'islamic mortgage tempe chandler', 'muslim mortgage phoenix'],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-phoenix' },
  openGraph: {
    title: 'Halal Mortgage in Phoenix, AZ (2026)',
    description: 'Shariah-compliant home financing for Phoenix-area Muslims — providers serving Arizona, structures, local notes.',
    url: 'https://trybarakah.com/learn/halal-mortgage-phoenix',
    type: 'article',
  },
};

const data: CityMortgageData = {
  city: 'Phoenix',
  state: 'Arizona',
  stateAbbr: 'AZ',
  intro:
    'The Phoenix metro has a growing Muslim community spread across the Valley, with notable concentrations in the East Valley cities of Tempe, Chandler, and Mesa, partly anchored by the universities and tech employers in the area. Arizona is served by national halal financing providers, so Shariah-compliant ownership is a practical option for Valley families.',
  marketNote:
    'Phoenix is a fast-growing Sun Belt market where home prices climbed sharply during the recent boom, though it remains more affordable than the California metros that many newcomers move from. Because the area is still growing quickly, prices and inventory can shift noticeably between neighborhoods and suburbs — compare carefully, and remember that a halal purchase requires saving a real down payment regardless of how the market is moving.',
  providerNote:
    'AMJA\'s Resident Fatwa Committee found Guidance Residential\'s declining-balance co-ownership model permissible, and Guidance is licensed in Arizona. AMJA permitted some other companies only in cases of dire need, and ruled that certain providers whose contracts contain disguised interest are not permissible — so confirm a provider\'s AMJA status and current Arizona availability, and consult a qualified scholar, before committing.',
  providers: ['Guidance Residential — AMJA-permissible'],
  localFaq: [
    {
      q: 'Which halal mortgage providers are recommended for Arizona?',
      a: 'AMJA\'s Resident Fatwa Committee found Guidance Residential\'s co-ownership model permissible, and Guidance holds an Arizona mortgage license. AMJA permitted some other companies only in cases of dire need and ruled others — whose contracts contain disguised interest — impermissible. Confirm a provider\'s current AMJA status and Arizona availability before applying, and consult a qualified scholar about the specific contract.',
    },
    {
      q: 'Where do most Phoenix-area Muslim buyers look for homes?',
      a: 'Many families gravitate to the East Valley — Tempe, Chandler, Mesa, and Gilbert — where there is an established community presence and proximity to universities and major employers. Halal financing is licensed at the state level, though, so any provider authorized in Arizona can finance a home anywhere in the metro, including the West Valley and central Phoenix.',
    },
  ],
};

export default function Page() {
  return <CityHalalMortgage data={data} />;
}
