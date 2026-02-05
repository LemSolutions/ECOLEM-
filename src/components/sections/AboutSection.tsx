'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Section, { SectionHeader } from '@/components/ui/Section';
import type { AboutSection as AboutSectionType } from '@/types/database';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [sections, setSections] = useState<AboutSectionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch('/api/about');
        const data = await res.json();
        if (Array.isArray(data)) {
          // Solo sezioni attive, ordinate per sort_order
          setSections(data.filter((s: AboutSectionType) => s.is_active).sort((a, b) => a.sort_order - b.sort_order));
        }
      } catch (error) {
        console.error('Error fetching about sections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Non mostrare la sezione se non ci sono contenuti
  if (!loading && sections.length === 0) {
    return null;
  }

  return (
    <Section id="chi-siamo" variant="default" size="lg" ref={sectionRef} showTricolor>
      <SectionHeader 
        eyebrow="La Nostra Storia" 
        title="Chi Siamo" 
        subtitle="Scopri la storia e i valori di LEM SOLUTIONS, il tuo partner di fiducia per la fotoceramica professionale." 
      />

      {loading ? (
        <div className="space-y-12">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 w-1/2" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-16">
          {sections.map((section, index) => {
            const hasImage = section.image_url;
            const imagePosition = section.image_position || 'left';
            
            // Layout basato sulla posizione dell'immagine
            const getLayoutClasses = () => {
              switch (imagePosition) {
                case 'top':
                  return 'flex-col';
                case 'bottom':
                  return 'flex-col-reverse';
                case 'right':
                  return 'flex-col md:flex-row-reverse';
                default: // left
                  return 'flex-col md:flex-row';
              }
            };

            const getImageClasses = () => {
              const base = 'relative w-full rounded-lg overflow-hidden bg-gray-100';
              switch (imagePosition) {
                case 'top':
                case 'bottom':
                  return `${base} h-64 md:h-80 mb-6`;
                default:
                  return `${base} h-64 md:h-full md:w-1/2 mb-6 md:mb-0`;
              }
            };

            const getContentClasses = () => {
              const base = 'flex-1';
              switch (imagePosition) {
                case 'right':
                  return `${base} md:mr-6`;
                case 'left':
                  return `${base} md:ml-6`;
                default:
                  return base;
              }
            };

            return (
              <div
                key={section.id}
                className={`flex ${getLayoutClasses()} ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {hasImage && (
                  <div className={getImageClasses()}>
                    <Image
                      src={section.image_url!}
                      alt={section.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className={getContentClasses()}>
                  <h3 className="font-heading font-semibold text-3xl mb-4 text-[var(--color-primary)]">
                    {section.title}
                  </h3>
                  {section.subtitle && (
                    <p className="text-lg text-[var(--color-accent)] font-medium mb-4">
                      {section.subtitle}
                    </p>
                  )}
                  <div 
                    className="prose prose-lg max-w-none text-[var(--color-dark-gray)] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br />') }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
  );
}
