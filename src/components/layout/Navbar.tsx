'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'Sistema', href: '#servizi' },
  { label: 'Prodotti', href: '#prodotti' },
  { label: 'Chi Siamo', href: '#chi-siamo' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contatti', href: '#support' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '-50% 0px', threshold: 0 };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    navItems.forEach((item) => {
      const element = document.getElementById(item.href.replace('#', ''));
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.getElementById(href.replace('#', ''));
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-white/80 backdrop-blur-sm py-3'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="relative z-10 flex items-center gap-3 group" aria-label="Torna alla home">
              <Image 
                src="/images/CERAMIC PRINTING.png" 
                alt="LEM Solutions Logo" 
                width={350} 
                height={88} 
                className="h-14 md:h-18 lg:h-20 w-auto transition-transform group-hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <ul className="flex items-center gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} onClick={(e) => handleNavClick(e, item.href)} className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${activeSection === item.href.replace('#', '') ? 'text-[var(--color-accent)]' : 'text-[var(--color-primary)] hover:text-[var(--color-accent)]'}`}>
                      {item.label}
                      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[var(--color-accent)] transition-all duration-300 ${activeSection === item.href.replace('#', '') ? 'w-6' : 'w-0'}`} />
                    </a>
                  </li>
                ))}
              </ul>
              
              <Button variant="primary" size="sm" href="#support" onClick={(e) => handleNavClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, '#support')}>
                Contattaci
              </Button>
              
              {/* Social Icons */}
              <div className="flex items-center gap-3 pl-8 ml-4 border-l border-gray-200">
                <a 
                  href="https://www.instagram.com/lem__solutions?igsh=ZnFoMTVqOHZpM2Zq" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f09433" />
                        <stop offset="25%" stopColor="#e6683c" />
                        <stop offset="50%" stopColor="#dc2743" />
                        <stop offset="75%" stopColor="#cc2366" />
                        <stop offset="100%" stopColor="#bc1888" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.facebook.com/share/18EkjvKG7H/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-300"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.tiktok.com/@lem.solutions.cer?_r=1&_t=ZN-92vP4jDZAsk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-300"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a 
                  href="https://it.linkedin.com/in/lino-morano-2ba8712b8?utm_source=share&utm_medium=member_mweb&utm_campaign=share_via&utm_content=profile" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-300"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="#0077B5" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.025H3.555V9h3.564v11.458zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button type="button" className="lg:hidden relative z-10 p-2 -mr-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}>
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 w-full rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2 bg-white' : 'bg-[var(--color-primary)]'}`} />
                <span className={`block h-0.5 w-full rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 bg-white' : 'bg-[var(--color-primary)]'}`} />
                <span className={`block h-0.5 w-full rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2 bg-white' : 'bg-[var(--color-primary)]'}`} />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-[var(--color-primary)] backdrop-blur-lg transition-all duration-500 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <nav className="h-full flex flex-col items-center justify-center px-8">
          {/* Logo in mobile menu */}
          <div className="mb-12">
            <Image 
              src="/images/CERAMIC PRINTING.png" 
              alt="LEM Solutions Logo" 
              width={280} 
              height={80} 
              className="h-16 w-auto"
            />
          </div>
          
          <ul className="flex flex-col items-center gap-6 mb-8">
            {navItems.map((item, index) => (
              <li key={item.href} className={`transform transition-all duration-500 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: `${index * 75}ms` }}>
                <a href={item.href} onClick={(e) => handleNavClick(e, item.href)} className={`text-3xl font-heading font-medium transition-colors duration-300 ${activeSection === item.href.replace('#', '') ? 'text-[var(--color-accent)]' : 'text-white hover:text-[var(--color-accent)]'}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          
          {/* Social Icons Mobile */}
          <div className={`flex items-center gap-4 mb-8 transform transition-all duration-500 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '350ms' }}>
            <a 
              href="https://www.instagram.com/lem__solutions?igsh=ZnFoMTVqOHZpM2Zq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-300"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="instagram-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <path fill="url(#instagram-gradient-mobile)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://www.facebook.com/share/18EkjvKG7H/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-300"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://www.tiktok.com/@lem.solutions.cer?_r=1&_t=ZN-92vP4jDZAsk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-300"
              aria-label="TikTok"
            >
              <svg className="w-6 h-6" fill="#FFFFFF" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a 
              href="https://it.linkedin.com/in/lino-morano-2ba8712b8?utm_source=share&utm_medium=member_mweb&utm_campaign=share_via&utm_content=profile" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-300"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="#0077B5" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.025H3.555V9h3.564v11.458zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
          
          <div className={`transform transition-all duration-500 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
            <Button variant="primary" size="lg" href="#support" onClick={(e) => handleNavClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, '#support')}>
              Richiedi Informazioni
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
