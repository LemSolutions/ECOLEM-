'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Stats = {
  services: number;
  products: number;
  blog: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ services: 0, products: 0, blog: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [services, products, blog] = await Promise.all([
        fetch('/api/services').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/blog').then(r => r.json()),
      ]);
      setStats({
        services: services.length || 0,
        products: products.length || 0,
        blog: blog.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">
              LEM Solutions Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Servizi"
            count={stats.services}
            href="/admin/services"
            color="blue"
            loading={loading}
          />
          <StatsCard
            title="Prodotti"
            count={stats.products}
            href="/admin/products"
            color="emerald"
            loading={loading}
          />
          <StatsCard
            title="Blog Posts"
            count={stats.blog}
            href="/admin/blog"
            color="purple"
            loading={loading}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Azioni Rapide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/services"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
            >
              <span className="text-2xl">🛠️</span>
              <span className="font-medium text-gray-900">Gestisci Servizi</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
            >
              <span className="text-2xl">📦</span>
              <span className="font-medium text-gray-900">Gestisci Prodotti</span>
            </Link>
            <Link
              href="/admin/blog"
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
            >
              <span className="text-2xl">📝</span>
              <span className="font-medium text-gray-900">Gestisci Blog</span>
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-2">💡 Suggerimento</h3>
          <p className="text-sm text-amber-700">
            I contenuti che modifichi qui verranno visualizzati immediatamente sul sito pubblico.
            Assicurati di controllare le modifiche prima di salvare.
          </p>
        </div>
      </main>
    </div>
  );
}

function StatsCard({
  title,
  count,
  href,
  color,
  loading,
}: {
  title: string;
  count: number;
  href: string;
  color: 'blue' | 'emerald' | 'purple';
  loading: boolean;
}) {
  const colors = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
  };

  return (
    <Link href={href}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {loading ? '...' : count}
            </p>
          </div>
          <div className={`w-12 h-12 ${colors[color]} rounded-lg opacity-20`} />
        </div>
      </div>
    </Link>
  );
}
