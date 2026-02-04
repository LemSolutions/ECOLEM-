'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function CookiePage() {
  useEffect(() => {
    // Load Iubenda script
    const loader = () => {
      const s = document.createElement('script');
      s.src = 'https://cdn.iubenda.com/iubenda.js';
      const tag = document.getElementsByTagName('script')[0];
      tag.parentNode?.insertBefore(s, tag);
    };
    
    if (document.readyState === 'complete') {
      loader();
    } else {
      window.addEventListener('load', loader, false);
    }
    
    return () => {
      window.removeEventListener('load', loader);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-off-white)]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/images/CERAMIC PRINTING.png" 
                alt="LEM Solutions Logo" 
                width={200} 
                height={50} 
                className="h-12 w-auto"
              />
            </Link>
            <Link 
              href="/" 
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-dark)] font-medium text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Torna al sito
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-[var(--color-primary)] mb-8">
            Cookie Policy
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <a 
              href="https://www.iubenda.com/privacy-policy/43054480/cookie-policy" 
              className="iubenda-nostyle iubenda-noiframe iubenda-embed iubenda-noiframe" 
              title="Cookie Policy"
            >
              Cookie Policy
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-[var(--color-medium-gray)] text-sm">
              Lem Solutions S.N.C. di Morano Lino Carmine & Ferrario Massimiliano<br />
              P.IVA: IT02961500135 | Via Gondar 6, 20900 Monza (MB)
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[var(--color-medium-gray)] text-sm">
              © {new Date().getFullYear()} LEM Solutions. Tutti i diritti riservati.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-[var(--color-medium-gray)] hover:text-[var(--color-primary)] text-sm">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-[var(--color-accent)] text-sm font-medium">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
