'use client';
import Link from 'next/link';
import posthog from 'posthog-js';

export default function Home() {
  const handleGetStarted = () => {
    posthog.capture('cta_clicked', { button: 'get_started', location: 'hero' });
  };

  const handleLaunchApp = () => {
    posthog.capture('cta_clicked', { button: 'launch_app', location: 'nav' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-emerald-600">Barakah</h1>
            </div>
            <Link
              href="/dashboard"
              onClick={handleLaunchApp}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Islamic Finance Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your assets, calculate Zakat, manage transactions, and ensure halal investments - all in one place.
          </p>
          <Link
            href="/dashboard"
            onClick={handleGetStarted}
            className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition"
          >
            Get Started Free
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <FeatureCard
            icon="💰"
            title="Zakat Calculator"
            description="Automatically calculate your Zakat obligations based on your assets"
          />
          <FeatureCard
            icon="📊"
            title="Asset Tracking"
            description="Monitor your wealth across cash, gold, investments, and property"
          />
          <FeatureCard
            icon="💸"
            title="Transactions"
            description="Track income and expenses with detailed categorization"
          />
          <FeatureCard
            icon="📈"
            title="Halal Checker"
            description="Verify if stocks and investments are Shariah-compliant"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}