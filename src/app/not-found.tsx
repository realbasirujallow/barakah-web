import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">🕌</p>
        <h1 className="text-4xl font-bold text-[#1B5E20] mb-2">404</h1>
        <h2 className="text-xl font-semibold text-[#2E7D32] mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-[#1B5E20] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2E7D32] transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
