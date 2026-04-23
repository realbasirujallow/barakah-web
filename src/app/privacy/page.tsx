import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-bold text-[#1B5E20]">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: March 27, 2026</p>

        <p className="text-gray-700 leading-relaxed">
          Barakah (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use the Barakah mobile application and web dashboard (collectively, the &ldquo;Service&rdquo;).
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">1. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Account Information:</strong> When you create an account, we collect your name, email address, and a securely hashed password. We never store passwords in plain text.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Financial Data You Enter:</strong> You may voluntarily enter financial information such as asset values, debt amounts, budget categories, bill details, investment holdings, and charitable giving records. This data is used solely to provide the Service&apos;s features (zakat calculation, halal stock screening, debt tracking, etc.).
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Usage Data:</strong> We may collect basic usage analytics such as which features you use and how often, to improve the Service. This data is aggregated and not linked to your personal identity.
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Device Information:</strong> We may collect device type, operating system version, and app version for troubleshooting and compatibility purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">2. How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed">We use your information exclusively to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Provide, maintain, and improve the Service</li>
            <li>Calculate zakat, screen stocks, track debts, and power other features you use</li>
            <li>Send you account-related communications (password resets, security alerts)</li>
            <li>Respond to your support requests</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            We do <strong>not</strong> use your data for advertising. We do <strong>not</strong> sell, rent, or share your personal information with third parties for marketing purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">3. Data Storage and Security</h2>
          <p className="text-gray-700 leading-relaxed">
            Every connection uses TLS 1.2 or newer (HTTPS). Plaid access tokens and other bank-linking secrets are wrapped in application-layer AES-256-GCM before they reach the database. All other financial records sit on managed-disk-encrypted Postgres with encrypted backups. Passwords are never stored in any form &mdash; only a bcrypt hash. Authentication uses httpOnly, Secure, SameSite cookies carrying cryptographically-signed JWTs with short expiration windows.
          </p>
          <p className="text-gray-700 leading-relaxed">
            For the full technical breakdown, see our <a href="/trust" className="text-[#1B5E20] underline">Trust &amp; Security</a> page. While we implement commercially reasonable security measures, no system is 100% secure. We encourage you to use a strong, unique password for your Barakah account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">4. Data Sharing</h2>
          <p className="text-gray-700 leading-relaxed">We do not share your personal or financial data with any third parties, except:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Service providers:</strong> We use infrastructure providers (hosting, email delivery) that may process data on our behalf, subject to strict confidentiality obligations.</li>
            <li><strong>Legal requirements:</strong> We may disclose information if required by law, regulation, or legal process.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">5. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Access</strong> your data at any time through the app</li>
            <li><strong>Update</strong> your account information and financial data</li>
            <li><strong>Delete</strong> your account and all associated data directly from the app (Settings &gt; Delete Account), or by contacting us at <a href="mailto:support@trybarakah.com" className="text-[#1B5E20] underline">support@trybarakah.com</a></li>
            <li><strong>Export</strong> your data upon request</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">6. Children&apos;s Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            The Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">7. Cookies and Tracking</h2>
          <p className="text-gray-700 leading-relaxed">
            The web dashboard uses essential cookies for authentication (JWT tokens). We do not use advertising cookies or third-party tracking pixels. We do not participate in ad networks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">8. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or by email. Continued use of the Service after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-[#1B5E20]">9. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have questions about this Privacy Policy or your data, please contact us:
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
