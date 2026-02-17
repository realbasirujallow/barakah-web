'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, ReactNode, useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/dashboard/assets', icon: '💰', label: 'Assets' },
  { href: '/dashboard/transactions', icon: '📝', label: 'Transactions' },
  { href: '/dashboard/budget', icon: '📈', label: 'Budget' },
  { href: '/dashboard/debts', icon: '💳', label: 'Debts' },
  { href: '/dashboard/bills', icon: '🔔', label: 'Bills' },
  { href: '/dashboard/zakat', icon: '🕌', label: 'Zakat' },
  { href: '/dashboard/hawl', icon: '⏰', label: 'Hawl Tracker' },
  { href: '/dashboard/sadaqah', icon: '🤲', label: 'Sadaqah' },
  { href: '/dashboard/wasiyyah', icon: '📜', label: 'Wasiyyah' },
  { href: '/dashboard/waqf', icon: '🏛️', label: 'Waqf' },
  { href: '/dashboard/riba', icon: '🛡️', label: 'Riba Detector' },
  { href: '/dashboard/categorize', icon: '🔄', label: 'Auto-Categorize' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FFF8E1]">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1B5E20] text-white transform transition-transform lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-green-800">
          <h1 className="text-xl font-bold">&#127769; Barakah</h1>
          <p className="text-green-300 text-sm mt-1">{user.name}</p>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                pathname === item.href
                  ? 'bg-green-800 text-white font-semibold'
                  : 'text-green-200 hover:bg-green-800/50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-800">
          <button onClick={logout} className="w-full text-left px-4 py-2 text-green-300 hover:text-white text-sm transition">
            &#x2192; Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:justify-end">
          <button className="lg:hidden text-[#1B5E20]" onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-sm text-gray-500">Assalamu Alaikum, <span className="font-semibold text-[#1B5E20]">{user.name}</span></p>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
