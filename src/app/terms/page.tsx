import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0E8] to-white">
      {/* Header */}
      <header className="bg-[#1B5E20] text-white py-6">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">&#9770; Barakah</Link>
          <Link href="/" className="text-sm bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 transition">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <h1 className="text-3xl font-bold text-[#1B5E20]">Terms of Service</h1>
        <p className="text-sm text-gray-500">Last updated: May 15, 2026</p>

        <p className="text-gray-700 leading-relaxed">
          {/* 2026-05-13: App Store + Play Store reviews flagged that this
              policy did not mention the registered app name. "Barakah"
              appears throughout, but the stores register the app as
              "Try Barakah" (com.trybarakah.app on Google Play,
              id6761279229 on the App Store). Naming both the registered
              name and the bundle identifiers in the opening paragraph
              satisfies the standard reviewer check.
              2026-05-15: Removed the "TikTok Login Kit" line from the
              third-party-integrations bullet — that integration is not
              implemented in the app. Terms must describe what the app
              actually does. Re-add when (and only when) the TikTok SDK
              is shipped. */}
          These Terms of Service govern your use of <strong>Try Barakah</strong> (also referred to in this document as &ldquo;Barakah&rdquo;, the &ldquo;App&rdquo;, or the &ldquo;Service&rdquo;), including:
        </p>
        <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-1">
          <li>the <strong>Try Barakah</strong> iOS mobile application (App Store ID <code>id6761279229</code>);</li>
          <li>the <strong>Try Barakah</strong> Android mobile application (package <code>com.trybarakah.app</code>);</li>
          <li>the Try Barakah web dashboard at <a href="https://trybarakah.com" className="text-[#1B5E20] underline">https://trybarakah.com</a>;</li>
          <li>third-party integrations offered within Try Barakah (Plaid for bank-linking and RevenueCat for subscription billing).</li>
        </ul>
        <p className="text-gray-700 leading-relaxed">
          Welcome to Try Barakah. By creating an account or using the Service, you agree to the following terms. Please read them carefully.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using Barakah, you agree to be bound by these Terms of Service and our <Link href="/privacy" className="text-[#1B5E20] underline">Privacy Policy</Link>. If you do not agree, please do not use the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">2. Description of Service</h2>
          <p className="text-gray-700 leading-relaxed">
            Barakah is an Islamic finance management tool that helps users track assets, debts, budgets, investments, zakat obligations, and other financial matters in accordance with Islamic principles. The Service includes features such as halal stock screening, riba detection, debt tracking, and zakat calculation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">3. Not Financial or Religious Advice</h2>
          <p className="text-gray-700 leading-relaxed">
            Barakah is a <strong>financial tracking and educational tool</strong>. It does not constitute financial advice, investment advice, or a religious ruling (fatwa). The calculations and classifications provided are based on general principles of Islamic jurisprudence and should be verified with a qualified Islamic scholar for your specific circumstances. See our <Link href="/disclaimer" className="text-[#1B5E20] underline">Disclaimer</Link> for more details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">4. Account Registration</h2>
          <p className="text-gray-700 leading-relaxed">
            You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">5. User Data and Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Your privacy is important to us. We handle your data in accordance with our <Link href="/privacy" className="text-[#1B5E20] underline">Privacy Policy</Link>. You retain ownership of all financial data you enter into the Service. We do not sell your data to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">6. Account Deletion</h2>
          <p className="text-gray-700 leading-relaxed">
            You may delete your account at any time directly from the app by going to Settings &gt; Delete Account. When you delete your account, all your data is permanently removed from our servers. This action cannot be undone. You may also request account deletion by contacting <a href="mailto:support@trybarakah.com" className="text-[#1B5E20] underline">support@trybarakah.com</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">7. Acceptable Use</h2>
          <p className="text-gray-700 leading-relaxed">You agree not to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to the Service or its related systems</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            <li>Use automated means to access the Service without our permission</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">8. Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed">
            The Service, including its design, features, and content, is owned by Barakah and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works based on the Service without our written consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">9. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            Barakah is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any damages arising from your use of the Service, including but not limited to financial losses based on calculations or classifications provided by the app. You use the Service at your own risk.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">10. Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update these Terms from time to time. We will notify you of significant changes through the app or by email. Your continued use of the Service after changes are posted constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">11. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions about these Terms, please contact us:
          </p>
          <p className="text-gray-700">
            Email: <a href="mailto:support@trybarakah.com" className="text-[#1B5E20] underline">support@trybarakah.com</a><br />
            Website: <a href="https://trybarakah.com" className="text-[#1B5E20] underline">trybarakah.com</a>
          </p>
        </section>

        <div className="border-t pt-6 text-sm text-gray-500">
          &copy; 2026 Barakah. All rights reserved.
        </div>
      </main>
    </div>
  );
}
