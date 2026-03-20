import type { Metadata } from 'next';
import Link from 'next/link';
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
        <SDSPageClient />
      </main>
      <Footer />
    </>
  );
}
