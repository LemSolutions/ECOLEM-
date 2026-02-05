'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Section, { SectionHeader } from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Product } from '@/types/database';

export default function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) {
          // Solo prodotti attivi
          setProducts(data.filter((p: Product) => p.is_active));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

  const formatPrice = (product: Product) => {
    if (product.price_type === 'on_request') return 'Su misura';
    if (!product.price) return 'Su misura';
    const formatted = `€${product.price.toLocaleString('it-IT')}`;
    return product.price_type === 'starting_from' ? `Da ${formatted}` : formatted;
  };

  const getPriceNote = (product: Product) => {
    if (product.price_type === 'on_request') return 'preventivo personalizzato';
    return 'IVA esclusa';
  };

  // Non mostrare la sezione se non ci sono prodotti
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <Section id="prodotti" variant="cream" size="lg" ref={sectionRef} showTricolor>
      <SectionHeader 
        eyebrow="Stampanti e Consumabili" 
        title="Prodotti LEM CERAMIC" 
        subtitle="Stampanti professionali, toner ceramici e carte speciali. Ogni prodotto è sviluppato per garantire qualità fotografica e stabilità cromatica dopo la cottura."
      />

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4 w-1/2 mx-auto" />
              <div className="h-4 bg-gray-200 rounded mb-6 w-3/4 mx-auto" />
              <div className="h-12 bg-gray-200 rounded mb-8 w-1/3 mx-auto" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className={`relative ${isVisible ? 'animate-fade-up' : 'opacity-0'}`} 
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {product.is_featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center px-4 py-1.5 bg-[var(--color-accent)] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                    Alta Gamma
                  </span>
                </div>
              )}
              <Card 
                variant={product.is_featured ? 'elevated' : 'bordered'} 
                padding="lg" 
                hover={false} 
                className={`h-full flex flex-col ${product.is_featured ? 'border-2 border-[var(--color-accent)] ring-4 ring-[var(--color-accent)]/20 bg-white' : 'bg-white border-gray-200'}`}
              >
                {product.image_url && (
                  <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="font-heading font-semibold text-2xl mb-2 text-[var(--color-primary)]">
                    {product.name}
                  </h3>
                  <p className="text-sm mb-6 text-[var(--color-dark-gray)]">
                    {product.description}
                  </p>
                  <div className="mb-2">
                    <span className="font-heading font-bold text-4xl text-[var(--color-primary)]">
                      {formatPrice(product)}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-dark-gray)]">
                    {getPriceNote(product)}
                  </p>
                </div>
                {product.features && product.features.length > 0 && (
                  <ul className="flex-grow space-y-4 mb-8">
                    {product.features.map((feature) => (
                      <li 
                        key={feature} 
                        className="flex items-start gap-3 text-sm text-[var(--color-charcoal)]"
                      >
                        <svg className="w-5 h-5 flex-shrink-0 text-[var(--color-accent)]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                <Button 
                  variant={product.is_featured ? 'primary' : 'secondary'} 
                  fullWidth 
                  href="#support"
                >
                  {product.price_type === 'on_request' ? 'Contattaci' : 'Richiedi Preventivo'}
                </Button>
              </Card>
            </div>
          ))}
        </div>
      )}

      <div className={`mt-16 text-center ${isVisible ? 'animate-fade-up delay-500' : 'opacity-0'}`}>
        <p className="text-[var(--color-dark-gray)] text-sm max-w-2xl mx-auto">
          * LEM SOLUTIONS garantisce risultati eccellenti utilizzando esclusivamente componenti del sistema LEM CERAMIC. 
          Contattaci per un preventivo personalizzato.
        </p>
      </div>
    </Section>
  );
}
