'use client';

import { useEffect, useRef, useState } from 'react';
import Section from '@/components/ui/Section';

interface StatItem {
  value: string;
  label: string;
  suffix?: string;
}

const stats: StatItem[] = [
  { value: '2400', label: 'DPI Risoluzione Max', suffix: '' },
  { value: '20+', label: 'Anni di RICERCA E SVILUPPO', suffix: '' },
  { value: '100%', label: 'Made in Italy', suffix: '' },
  { value: '300+', label: 'CLIENTI SODDISFATTI', suffix: '' },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [countedValues, setCountedValues] = useState<Record<number, number>>({});

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Animate counting for numeric values
          stats.forEach((stat, index) => {
            const numericValue = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
            if (!isNaN(numericValue) && numericValue > 0) {
              animateCount(index, numericValue, stat.value);
            }
          });
        }
      });
    }, { threshold: 0.3 });
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  const animateCount = (index: number, target: number, originalValue: string) => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const hasPlus = originalValue.includes('+');
    const hasPercent = originalValue.includes('%');

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      let displayValue = Math.floor(current).toString();
      if (hasPlus) displayValue += '+';
      if (hasPercent) displayValue = originalValue; // Keep original for percentages
      
      setCountedValues(prev => ({ ...prev, [index]: current }));
    }, duration / steps);
  };

  const getDisplayValue = (stat: StatItem, index: number) => {
    const numericValue = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
    if (!isNaN(numericValue) && numericValue > 0 && countedValues[index] !== undefined) {
      const current = Math.floor(countedValues[index]);
      if (stat.value.includes('+')) return `${current}+`;
      if (stat.value.includes('%')) return stat.value; // Keep original for percentages
      return current.toString();
    }
    return stat.value;
  };

  return (
    <Section id="statistiche" variant="gradient" size="md" ref={sectionRef} showTricolor>
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-3 text-[var(--color-primary)]">
            FOTOCERAMICA
          </h2>
          <p className="text-xl md:text-2xl text-[var(--color-dark-gray)] font-medium">
            Made in Italy
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/40 hover:bg-white/90 transition-all duration-300 shadow-lg">
                <div className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-[var(--color-primary)] mb-3">
                  {getDisplayValue(stat, index)}
                </div>
                <div className="text-sm md:text-base text-[var(--color-dark-gray)] font-medium leading-tight">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
