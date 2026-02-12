'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

declare global {
  interface Window {
    _iub?: {
      csConfiguration?: any;
      cs?: {
        showConsentModal?: () => void;
        showCookiePolicy?: () => void;
        [key: string]: any;
      };
      cons_instructions?: any[];
    };
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if consent was already given - robust check
    const checkConsent = () => {
      if (typeof window === 'undefined') return;
      
      try {
        // Method 1: Check iubenda cookie (_iub_cs-43054480)
        const iubendaCookie = document.cookie
          .split(';')
          .find(c => c.trim().startsWith('_iub_cs-43054480='));
        
        if (iubendaCookie) {
          try {
            const cookieValue = decodeURIComponent(iubendaCookie.split('=').slice(1).join('='));
            const consentData = JSON.parse(cookieValue);
            
            // Check if user has given consent (purposes array not empty)
            if (consentData && consentData.purposes && Array.isArray(consentData.purposes) && consentData.purposes.length > 0) {
              setHasConsent(true);
              setShowConsent(false);
              return;
            }
          } catch (e) {
            // Cookie exists but invalid format, continue checking
          }
        }
        
        // Method 2: Check iubenda consent via localStorage (some implementations use this)
        try {
          const storedConsent = localStorage.getItem('iubenda_consent_43054480');
          if (storedConsent) {
            const consentData = JSON.parse(storedConsent);
            if (consentData && consentData.purposes && Array.isArray(consentData.purposes) && consentData.purposes.length > 0) {
              setHasConsent(true);
              setShowConsent(false);
              return;
            }
          }
        } catch (e) {
          // localStorage check failed, continue
        }
        
        // Method 3: Check if iubenda has already stored consent
        if (window._iub && window._iub.csConfiguration) {
          // Wait a bit for iubenda to initialize and check its internal state
          setTimeout(() => {
            const iubCookie = document.cookie
              .split(';')
              .find(c => c.trim().startsWith('_iub_cs-43054480='));
            if (iubCookie) {
              try {
                const cookieValue = decodeURIComponent(iubCookie.split('=').slice(1).join('='));
                const consentData = JSON.parse(cookieValue);
                if (consentData && consentData.purposes && Array.isArray(consentData.purposes) && consentData.purposes.length > 0) {
                  setHasConsent(true);
                  setShowConsent(false);
                  return;
                }
              } catch (e) {
                // Continue to show consent bar
              }
            }
          }, 500);
        }
        
        // No valid consent found, show bar
        setHasConsent(false);
        setShowConsent(true);
      } catch (error) {
        // On error, don't show consent bar to avoid annoying users
        // Only show if we're sure there's no consent
        setHasConsent(null);
        setShowConsent(false);
      }
    };

    // Check immediately
    checkConsent();
    
    // Also check after a short delay to catch async cookie setting
    const timer1 = setTimeout(checkConsent, 500);
    const timer2 = setTimeout(checkConsent, 1500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleAccept = () => {
    if (typeof window !== 'undefined') {
      // Set consent cookie directly (iubenda format)
      const consentData = {
        timestamp: Date.now(),
        version: 1,
        purposes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        subject: { id: '43054480' }
      };
      
      // Set cookie (expires in 1 year) - use secure format
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      const cookieValue = encodeURIComponent(JSON.stringify(consentData));
      document.cookie = `_iub_cs-43054480=${cookieValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
      
      // Also store in localStorage as backup
      try {
        localStorage.setItem('iubenda_consent_43054480', JSON.stringify(consentData));
      } catch (e) {
        // localStorage might not be available, continue anyway
      }
      
      // Trigger iubenda consent instructions
      if (window._iub?.cons_instructions) {
        window._iub.cons_instructions.push([
          'setConsent',
          consentData
        ]);
      }
      
      // Dispatch custom event for GA
      const acceptEvent = new CustomEvent('_iubConsentGiven', { 
        detail: { purposes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] } 
      });
      window.dispatchEvent(acceptEvent);
      
      // Load Google Analytics script
      const loadGA = () => {
        const existingScript = document.querySelector('script[src*="gtag/js?id=G-5JF0637T6F"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.async = true;
          script.src = 'https://www.googletagmanager.com/gtag/js?id=G-5JF0637T6F';
          document.head.appendChild(script);
          script.onload = () => {
            if (window.gtag) {
              window.gtag('config', 'G-5JF0637T6F');
            }
          };
        } else if (window.gtag) {
          window.gtag('config', 'G-5JF0637T6F');
        }
      };
      
      // Wait a bit for gtag to be initialized
      setTimeout(loadGA, 100);
    }
    
    setHasConsent(true);
    setShowConsent(false);
  };

  const handleReject = () => {
    if (typeof window !== 'undefined') {
      // Set rejection cookie
      const consentData = {
        timestamp: Date.now(),
        version: 1,
        purposes: [],
        subject: { id: '43054480' }
      };
      
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      const cookieValue = encodeURIComponent(JSON.stringify(consentData));
      document.cookie = `_iub_cs-43054480=${cookieValue}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
      
      // Also store in localStorage as backup
      try {
        localStorage.setItem('iubenda_consent_43054480', JSON.stringify(consentData));
      } catch (e) {
        // localStorage might not be available, continue anyway
      }
      
      if (window._iub?.cons_instructions) {
        window._iub.cons_instructions.push([
          'setConsent',
          consentData
        ]);
      }
    }
    
    setHasConsent(false);
    setShowConsent(false);
  };

  const handleCustomize = () => {
    if (typeof window !== 'undefined') {
      // Try to use iubenda's modal if available
      const win = window as Window & { _iub?: { cs?: { showConsentModal?: () => void } } };
      if (win._iub?.cs?.showConsentModal) {
        win._iub.cs.showConsentModal();
      } else {
        // Fallback: redirect to cookie policy page
        window.location.href = '/cookies';
      }
    }
  };

  if (!showConsent || hasConsent === true) {
    return null;
  }

  return (
    <div className="bg-white border-t-2 border-[var(--color-accent)] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-lg text-[var(--color-primary)] mb-2">
              Gestione Cookie e Privacy
            </h3>
            <p className="text-sm text-[var(--color-dark-gray)] mb-2">
              Questo sito utilizza cookie tecnici e di profilazione, anche di terze parti, per migliorare la tua esperienza di navigazione e per inviarti pubblicità personalizzata. 
              Cliccando su "Accetta tutti" acconsenti all'utilizzo di tutti i cookie. 
              Puoi gestire le tue preferenze o rifiutare i cookie cliccando su "Personalizza" o "Rifiuta tutti".
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-[var(--color-medium-gray)]">
              <Link href="/privacy" className="hover:text-[var(--color-accent)] underline">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="hover:text-[var(--color-accent)] underline">
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReject}
              className="px-6 py-2.5 border-2 border-[var(--color-medium-gray)] text-[var(--color-dark-gray)] rounded-lg hover:bg-[var(--color-light-gray)] transition-colors font-medium text-sm whitespace-nowrap"
            >
              Rifiuta tutti
            </button>
            <button
              onClick={handleCustomize}
              className="px-6 py-2.5 border-2 border-[var(--color-accent)] text-[var(--color-accent)] rounded-lg hover:bg-[var(--color-accent)] hover:text-white transition-colors font-medium text-sm whitespace-nowrap"
            >
              Personalizza
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 bg-[var(--color-accent)] text-white rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors font-medium text-sm whitespace-nowrap"
            >
              Accetta tutti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
