'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  ctaPrimaryText?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryText?: string;
  ctaSecondaryHref?: string;
  youtubeVideoId?: string;
  fallbackImage?: string;
}

export default function HeroSection({
  headline = 'Il Sistema Completo per la Fotoceramica Professionale',
  subheadline = 'Il tuo partner di fiducia per la fotoceramica di alta qualità. Stampanti Canon modificate, toner ceramici esclusivi, carte speciali e know-how produttivo per risultati impeccabili.',
  ctaPrimaryText = 'Richiedi Informazioni',
  ctaPrimaryHref = '#support',
  ctaSecondaryText = 'Scopri il Sistema',
  ctaSecondaryHref = '#servizi',
  youtubeVideoId = 'tAuJQd7cm0w',
  fallbackImage = '/images/hero-fallback.jpg',
}: HeroSectionProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.getElementById(href.replace('#', ''));
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  };

  // YouTube embed URL with background-friendly parameters
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* YouTube Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Fallback image while loading */}
        {!isVideoLoaded && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-[var(--color-primary)]" 
            style={{ backgroundImage: `url(${fallbackImage})` }} 
          />
        )}
        
        {/* YouTube iframe container - scaled to cover */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full h-[56.25vw] min-h-full">
            <iframe
              src={youtubeEmbedUrl}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsVideoLoaded(true)}
              title="Hero Video Background"
              style={{ border: 'none', pointerEvents: 'none' }}
            />
          </div>
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/70 via-[var(--color-primary)]/50 to-[var(--color-primary)]/80" />
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-30" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`, 
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span className="text-white/90 text-sm font-medium tracking-wide">LEM CERAMIC SYSTEM</span>
        </div>

        {/* Headline */}
        <div className="inline-block px-6 py-4 md:px-8 md:py-6 mb-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-up delay-100">
          <h1 
            className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight" 
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
          >
            {headline.split(' ').map((word, index) => (
              <span key={index}>
                {index === headline.split(' ').length - 1 ? (
                  <span className="text-[var(--color-accent)]">{word}</span>
                ) : (
                  `${word} `
                )}
              </span>
            ))}
          </h1>
        </div>

        {/* Subheadline */}
        <div className="inline-block px-6 py-4 md:px-8 md:py-6 mb-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-up delay-200">
          <p className="max-w-2xl mx-auto text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed">
            {subheadline}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fade-up delay-300">
          <Button 
            variant="primary" 
            size="lg" 
            href={ctaPrimaryHref} 
            onClick={(e) => handleScrollTo(e as unknown as React.MouseEvent<HTMLAnchorElement>, ctaPrimaryHref)}
            rightIcon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            }
          >
            {ctaPrimaryText}
          </Button>
          <Button 
            variant="ghost" 
            size="lg" 
            href={ctaSecondaryHref} 
            onClick={(e) => handleScrollTo(e as unknown as React.MouseEvent<HTMLAnchorElement>, ctaSecondaryHref)}
          >
            {ctaSecondaryText}
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
        <a 
          href="#servizi" 
          onClick={(e) => handleScrollTo(e, '#servizi')} 
          className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors" 
          aria-label="Scorri verso il basso"
        >
          <span className="text-xs uppercase tracking-widest">Scopri</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>

      {/* 🇮🇹 Tricolor divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex h-1.5">
        <div className="flex-1 bg-[#009246]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#ce2b37]" />
      </div>
    </section>
  );
}
