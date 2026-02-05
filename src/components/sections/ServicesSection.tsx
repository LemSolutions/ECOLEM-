'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Section, { SectionHeader } from '@/components/ui/Section';
import Card, { CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Service } from '@/types/database';

// Funzione helper per validare URL immagini
const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string' || url.trim() === '') return false;
  const trimmedUrl = url.trim();
  return trimmedUrl.startsWith('http://') || 
         trimmedUrl.startsWith('https://') || 
         trimmedUrl.startsWith('/');
};

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (Array.isArray(data)) {
          // Solo servizi attivi
          setServices(data.filter((s: Service) => s.is_active));
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
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

  // Non mostrare la sezione se non ci sono servizi
  if (!loading && services.length === 0) {
    return null;
  }

  return (
    <Section id="servizi" variant="default" size="lg" ref={sectionRef} showTricolor>
      <SectionHeader 
        eyebrow="Il Sistema LEM" 
        title="Tecnologia Integrata per la Fotoceramica" 
        subtitle="Ogni componente del sistema LEM CERAMIC è progettato per lavorare in perfetta sinergia: stampanti, toner, carte speciali e know-how produttivo per risultati professionali." 
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-8 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-xl mb-6" />
              <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card 
              key={service.id} 
              variant="default" 
              padding="lg" 
              tricolorAccent
              className={`group h-full flex flex-col ${isVisible ? 'animate-fade-up' : 'opacity-0'}`} 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {service.image_url && isValidImageUrl(service.image_url) ? (
                <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={service.image_url}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      console.error('Errore caricamento immagine:', service.image_url);
                      const target = e.target as HTMLImageElement;
                      if (target.parentElement) {
                        target.parentElement.style.display = 'none';
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 mb-6 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-primary)] transition-all duration-300 text-3xl flex-shrink-0">
                  {service.icon || '🛠️'}
                </div>
              )}
              <CardTitle className="mb-3 flex-shrink-0">{service.title}</CardTitle>
              <div className="mb-6 min-h-[6rem] flex-shrink-0">
                <CardDescription>{service.description}</CardDescription>
              </div>
              {service.features && service.features.length > 0 ? (
                <ul className="space-y-2 flex-grow">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-[var(--color-dark-gray)]">
                      <svg className="w-4 h-4 text-[var(--color-accent)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex-grow"></div>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="text-center mt-16">
        <p className="text-[var(--color-dark-gray)] mb-6">
          Vuoi scoprire la soluzione più adatta alle tue esigenze produttive?
        </p>
        <Button variant="primary" size="lg" href="#support">
          Richiedi Informazioni
        </Button>
      </div>
    </Section>
  );
}
