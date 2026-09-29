'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { trackEvent } from '../../../lib/analytics';

export default function DangoteIpoGuideClient() {
  useEffect(() => {
    trackEvent('content_campaign_viewed', {
      content_slug: 'dangote-refinery-ipo-guide',
      market: 'nigeria',
      topic: 'ipo_due_diligence',
    });
  }, []);

  return (
    <section className="mt-12 rounded-lg bg-[#1B5E20] p-7 text-white sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-wide text-green-200">Plan before you participate</p>
      <h2 className="mt-2 text-2xl font-bold">Make room for the decision in your wider financial plan.</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-green-100">
        Barakah can help you record a planned investment, keep a cash buffer visible, and revisit your zakat and household priorities. It does not recommend this or any other security.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/signup?utm_source=nigeria_community&utm_medium=community&utm_campaign=dangote_refinery_ipo_2026&utm_content=guide_cta"
          className="rounded-md bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50"
        >
          Start a free plan
        </Link>
        <Link
          href="/learn/halal-investing-guide"
          className="rounded-md border border-green-200 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
        >
          Read the halal investing guide
        </Link>
      </div>
    </section>
  );
}
