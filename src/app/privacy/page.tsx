'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';

export default function PrivacyPage() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if iubenda script is already loaded
    const checkIubendaLoaded = () => {
      if (typeof window === 'undefined') return false;
      const win = window as any;
      // Check for iubenda.js (for embed functionality)
      if (win.iubenda || win._iub) {
        setIsScriptLoaded(true);
        return true;
      }
      // Check if script tag already exists
      const existingScript = document.querySelector('script[src*="iubenda.js"]');
      if (existingScript) {
        // Script tag exists, wait a bit for it to load
        setTimeout(() => {
          if (win.iubenda || win._iub) {
            setIsScriptLoaded(true);
          }
        }, 500);
        return false;
      }
      return false;
    };

    // If already loaded, set state immediately
    if (checkIubendaLoaded()) {
      return;
    }

    // Otherwise wait for script to load (with timeout)
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    const checkInterval = setInterval(() => {
      attempts++;
      if (checkIubendaLoaded() || attempts >= maxAttempts) {
        clearInterval(checkInterval);
        if (attempts >= maxAttempts) {
          // Script didn't load, but we'll still show the link
          setIsScriptLoaded(true);
        }
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-off-white)]">
      {/* Load Iubenda script if not already loaded */}
      {!isScriptLoaded && (
        <Script
          id="iubenda-privacy-script"
          src="https://cdn.iubenda.com/iubenda.js"
          strategy="lazyOnload"
          onLoad={() => setIsScriptLoaded(true)}
        />
      )}

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
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none">
            {isScriptLoaded ? (
              <a 
                href="https://www.iubenda.com/privacy-policy/43054480" 
                className="iubenda-nostyle iubenda-noiframe iubenda-embed iubenda-noiframe" 
                title="Privacy Policy"
              >
                Privacy Policy
              </a>
            ) : (
              <div className="text-center py-8">
                <p className="text-[var(--color-medium-gray)] mb-4">Caricamento Privacy Policy...</p>
                <a 
                  href="https://www.iubenda.com/privacy-policy/43054480" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  Visualizza Privacy Policy su iubenda.com
                </a>
              </div>
            )}
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
              <Link href="/privacy" className="text-[var(--color-accent)] text-sm font-medium">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-[var(--color-medium-gray)] hover:text-[var(--color-primary)] text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
