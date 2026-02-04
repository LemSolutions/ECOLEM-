import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Admin | LEM Solutions',
  description: 'Area riservata per la gestione del sito',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
