import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Navbar, Footer } from '@/components/layout';
import SDSPageClient from './SDSPageClient';

export const metadata: Metadata = {
  title: 'Safety Data Sheet (SDS)',
  description: 'Schede di sicurezza dei prodotti LEM Solutions. Safety Data Sheet disponibili per download.',
  robots: { index: true, follow: true },
};

export default function SDSPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--color-off-white)] py-16 lg:py-24">
        <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-500">Caricamento...</div>}>
          <SDSPageClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
