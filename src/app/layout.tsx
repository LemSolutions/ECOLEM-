import type { Metadata, Viewport } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import '@/styles/design-system.css';

const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap', variable: '--font-heading', weight: ['400', '500', '600', '700'] });
const dmSans = DM_Sans({ subsets: ['latin'], display: 'swap', variable: '--font-body', weight: ['300', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lemsolutions.it'),
  title: { default: 'LEM CERAMIC SYSTEM | Fotoceramica Professionale', template: '%s | LEM Solutions' },
  description: 'Sistema completo per la fotoceramica professionale. Stampanti Canon modificate, toner ceramici, carte speciali e know-how produttivo. Qualità fotografica e stabilità cromatica garantita.',
  keywords: ['fotoceramica', 'stampanti ceramiche', 'toner ceramico', 'pronto decal', 'paper film', 'stampa su ceramica', 'LEM CERAMIC', 'Canon professionale', 'fotoceramica professionale'],
  authors: [{ name: 'LEM Solutions' }],
  creator: 'LEM Solutions',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: { type: 'website', locale: 'it_IT', url: 'https://lemsolutions.it', siteName: 'LEM Solutions', title: 'LEM CERAMIC SYSTEM | Fotoceramica Professionale', description: 'Sistema completo per la fotoceramica professionale. Stampanti Canon modificate, toner ceramici e carte speciali.', images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'LEM CERAMIC SYSTEM' }] },
  twitter: { card: 'summary_large_image', title: 'LEM CERAMIC SYSTEM | Fotoceramica Professionale', description: 'Sistema completo per la fotoceramica professionale.', images: ['/images/og-image.jpg'] },
  icons: { icon: [{ url: '/favicon.ico', sizes: 'any' }], apple: '/apple-touch-icon.png' },
};

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#0f172a' }, { media: '(prefers-color-scheme: dark)', color: '#0f172a' }],
  width: 'device-width', initialScale: 1, maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Iubenda Cookie Solution - Banner disabilitato, gestione manuale */}
        <Script id="iubenda-cookie-banner" strategy="beforeInteractive">
          {`var _iub = _iub || {}; _iub.csConfiguration = {"askConsentAtCookiePolicyUpdate":true,"enableFadp":true,"enableLgpd":true,"enableUspr":true,"fadpApplies":true,"lgpdApplies":true,"usprApplies":true,"countryDetection":true,"lang":"it","siteId":43054480,"cookiePolicyId":43054480,"banner":{"acceptButtonDisplay":false,"closeButtonDisplay":false,"customizeButtonDisplay":false,"explicitWithdrawal":true,"listPurposes":true,"position":"bottom","rejectButtonDisplay":false,"showTitle":false},"callback": {"onConsentGiven": function() { if (typeof window !== 'undefined' && window._iub && window._iub.cons_instructions) { window._iub.cons_instructions.push(['enableGoogleAnalytics', { 'G-5JF0637T6F': true }]); } }}};`}
        </Script>
        <Script
          id="iubenda-cookie-banner-script"
          strategy="beforeInteractive"
          src="https://cdn.iubenda.com/cs/iubenda_cs.js"
          async
        />
        
        {/* Iubenda Consent Database (frontend quick integration) */}
        <Script id="iubenda-consent-db-init" strategy="beforeInteractive">
          {`var _iub = _iub || {}; _iub.cons_instructions = _iub.cons_instructions || []; _iub.cons_instructions.push(["init", {api_key: "BFoyYds0TEv5lTMXjMeNzbW4bKRPZQVP"}]);`}
        </Script>
        <Script
          id="iubenda-consent-db"
          strategy="beforeInteractive"
          src="https://cdn.iubenda.com/cons/iubenda_cons.js"
          async
        />

        {/* Google Analytics - inizializzazione base, caricamento solo dopo consenso */}
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            window.gtag = gtag;
            
            // Check consent and load GA if consent was already given
            (function checkAndLoadGA() {
              try {
                const consentCookie = document.cookie.split(';').find(c => c.trim().startsWith('_iub_cs-43054480='));
                if (consentCookie) {
                  const cookieValue = consentCookie.split('=')[1];
                  const consentData = JSON.parse(decodeURIComponent(cookieValue));
                  if (consentData && consentData.purposes && Array.isArray(consentData.purposes) && consentData.purposes.length > 0) {
                    // Load GA script
                    const script = document.createElement('script');
                    script.async = true;
                    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-5JF0637T6F';
                    document.head.appendChild(script);
                    script.onload = function() {
                      if (window.gtag) {
                        window.gtag('config', 'G-5JF0637T6F');
                      }
                    };
                  }
                }
              } catch(e) {
                console.warn('Error checking consent for GA:', e);
              }
            })();
            
            // Listen for consent events
            window.addEventListener('_iubConsentGiven', function() {
              const script = document.createElement('script');
              script.async = true;
              script.src = 'https://www.googletagmanager.com/gtag/js?id=G-5JF0637T6F';
              document.head.appendChild(script);
              script.onload = function() {
                if (window.gtag) {
                  window.gtag('config', 'G-5JF0637T6F');
                }
              };
            });
          `}
        </Script>
      </head>
      <body className="font-body bg-[var(--color-off-white)] text-[var(--color-charcoal)] antialiased">
        <a href="#hero" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-[var(--color-primary)] focus:rounded-lg focus:font-medium">Vai al contenuto principale</a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'LEM Solutions S.N.C.', legalName: 'Lem Solutions S.N.C. di Morano Lino Carmine & Ferrario Massimiliano', url: 'https://lemsolutions.it', logo: 'https://lemsolutions.it/images/CERAMIC%20PRINTING.png', description: 'Sistema completo per la fotoceramica professionale. Stampanti Canon modificate, toner ceramici, carte speciali e know-how produttivo.', vatID: 'IT02961500135', address: { '@type': 'PostalAddress', streetAddress: 'Via Gondar 6', addressLocality: 'Monza', addressRegion: 'MB', postalCode: '20900', addressCountry: 'IT' }, contactPoint: { '@type': 'ContactPoint', telephone: '+39-347-480-6300', email: 'info@lemsolutions.it', contactType: 'customer service', availableLanguage: ['Italian', 'English'] } }) }} />
      </body>
    </html>
  );
}
