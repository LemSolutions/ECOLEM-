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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-white/80 backdrop-blur-sm py-5'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="relative z-10 flex items-center gap-3 group" aria-label="Torna alla home">
              <Image 
                src="/images/CERAMIC PRINTING.png" 
                alt="LEM Solutions Logo" 
                width={280} 
                height={70} 
                className="h-14 md:h-16 w-auto transition-transform group-hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
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
          
          <ul className="flex flex-col items-center gap-6 mb-12">
            {navItems.map((item, index) => (
              <li key={item.href} className={`transform transition-all duration-500 ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: `${index * 75}ms` }}>
                <a href={item.href} onClick={(e) => handleNavClick(e, item.href)} className={`text-3xl font-heading font-medium transition-colors duration-300 ${activeSection === item.href.replace('#', '') ? 'text-[var(--color-accent)]' : 'text-white hover:text-[var(--color-accent)]'}`}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
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
