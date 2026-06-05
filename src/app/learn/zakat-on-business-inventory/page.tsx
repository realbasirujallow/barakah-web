import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zakat on Business Inventory — Trade Goods at Market Value (AAOIFI)',
  description:
    'Trading inventory is zakatable at its current market (retail) value; operating equipment is not. The AAOIFI valuation rule, the trade-goods test, and worked examples for retail, restaurants, e-commerce and professional services.',
  keywords: [
    'zakat on business inventory',
    'zakat on trade goods',
    'zakat on stock inventory',
    'zakat on e-commerce',
    'zakat business assets',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-business-inventory' },
  openGraph: {
    title: 'Zakat on Business Inventory — Valuing Trade Goods at Market Value',
    description:
      'Why retail stock is zakatable at market value but kitchen equipment is not — the AAOIFI rule, with worked examples by business type.',
    url: 'https://trybarakah.com/learn/zakat-on-business-inventory',
    siteName: 'Barakah',
    type: 'article',
  },
};

export default function ZakatBusinessInventoryPage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          {' / '}
          <Link href="/learn" className="hover:text-[#1B5E20]">Learn</Link>
          {' / '}
          <span className="text-gray-700">Zakat on Business Inventory</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-3">
          Zakat on business inventory — trading goods vs operating equipment
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Last reviewed: 2026-05-06 · Methodology summary, not a fatwa. Business-zakat is one of
          the more nuanced areas — consult a qualified scholar for your specific case.
        </p>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">The simple test</h2>
          <p className="text-base text-gray-700 mb-3">
            Ask yourself: <strong>Is this asset something I sell, or something I use to run the
            business?</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
            <li><strong>Trading inventory (urud al-tijarah)</strong> — items held for resale → ZAKATABLE at fair market value (or cost, depending on madhab).</li>
            <li><strong>Operating equipment (urud al-qunyah)</strong> — items used to operate, not sold → NOT ZAKATABLE.</li>
          </ul>
          <p className="text-base text-gray-700 mt-3">
            The intent at the moment of acquisition usually settles the question. A sewing
            machine in a factory is operating equipment; the same machine sitting on a retailer&apos;s
            shelf for sale is trading inventory.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Worked examples by business type</h2>

          <div className="space-y-5">
            <div className="border-l-4 border-[#1B5E20] pl-4">
              <h3 className="font-bold text-gray-900">Retail clothing store</h3>
              <ul className="text-base text-gray-700 mt-2 space-y-1">
                <li><strong>Zakatable:</strong> All clothes on the shelves (trading inventory).</li>
                <li><strong>Not zakatable:</strong> Display racks, mannequins, point-of-sale system, building, fixtures.</li>
              </ul>
            </div>

            <div className="border-l-4 border-[#1B5E20] pl-4">
              <h3 className="font-bold text-gray-900">Restaurant</h3>
              <ul className="text-base text-gray-700 mt-2 space-y-1">
                <li><strong>Zakatable:</strong> Raw food ingredients held in inventory (frozen meat, dry goods, beverages waiting to be sold).</li>
                <li><strong>Not zakatable:</strong> Ovens, grills, freezers, tables, chairs, plates, cutlery — all operating equipment.</li>
              </ul>
            </div>

            <div className="border-l-4 border-[#1B5E20] pl-4">
              <h3 className="font-bold text-gray-900">E-commerce / Amazon FBA</h3>
              <ul className="text-base text-gray-700 mt-2 space-y-1">
                <li><strong>Zakatable:</strong> Inventory held in Amazon warehouses or in your fulfilment centre, valued at fair market sale price (or wholesale cost — scholarly difference).</li>
                <li><strong>Not zakatable:</strong> Computers, software subscriptions, photography setup used to list products.</li>
                <li><strong>Cash:</strong> Operating cash (separated from inventory) is zakatable as cash, not as inventory.</li>
              </ul>
            </div>

            <div className="border-l-4 border-[#1B5E20] pl-4">
              <h3 className="font-bold text-gray-900">Professional services (consulting, law, accounting)</h3>
              <ul className="text-base text-gray-700 mt-2 space-y-1">
                <li><strong>Zakatable:</strong> Cash on hand, accounts receivable that are reasonably collectable.</li>
                <li><strong>Not zakatable:</strong> Office equipment, software licences, library, professional reference materials.</li>
                <li>Service businesses generally have less zakatable wealth than retail because there&apos;s no trading inventory.</li>
              </ul>
            </div>

            <div className="border-l-4 border-[#1B5E20] pl-4">
              <h3 className="font-bold text-gray-900">Manufacturing</h3>
              <ul className="text-base text-gray-700 mt-2 space-y-1">
                <li><strong>Zakatable:</strong> Raw materials and finished goods held for sale.</li>
                <li><strong>Not zakatable:</strong> Machinery, tools, factory building. </li>
                <li><strong>Work-in-progress:</strong> Most scholars treat WIP as zakatable inventory at the materials-cost portion (the labour-added value isn&apos;t a tangible good yet).</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Cost vs market value</h2>
          <p className="text-base text-gray-700 mb-3">
            Two scholarly positions on how to value trading inventory:
          </p>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
            <li><strong>Wholesale cost (the price you paid).</strong> Simpler; conservative position favoured by Hanafi-aligned scholars for ease of computation.</li>
            <li><strong>Fair market sale value (what you would sell for).</strong> Larger zakat base; favoured by many contemporary scholars including AMJA-aligned positions because it captures realised value.</li>
          </ul>
          <p className="text-base text-gray-700 mt-3">
            Pick a method and stick with it across years for consistency. Document which one you
            used in your zakat ledger.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Use Barakah for the math</h2>
          <p className="text-base text-gray-700 mb-4">
            The Barakah dashboard supports a business-assets section where you can record
            inventory at either cost or market value, with separate tracking for operating
            equipment that&apos;s excluded from the base.
          </p>
          <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] hover:bg-[#0d3a14] text-white font-semibold px-6 py-3 rounded-lg transition">
            Open the zakat calculator →
          </Link>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Related</h2>
          <ul className="space-y-2 text-base">
            <li>· <Link href="/learn/zakat-on-business-assets" className="text-[#1B5E20] underline">Zakat on business assets (broader)</Link></li>
            <li>· <Link href="/learn/zakat-on-receivables-and-business-debts" className="text-[#1B5E20] underline">Zakat on receivables and business debts</Link></li>
            <li>· <Link href="/methodology" className="text-[#1B5E20] underline">Full methodology + sources</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
