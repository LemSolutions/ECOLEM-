'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';

// 🇮🇹 Tricolor Divider Component
export const TricolorDivider = ({ 
  size = 'md', 
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const heights = {
    sm: 'h-0.5',
    md: 'h-1',
    lg: 'h-1.5'
  };
  
  return (
    <div className={`flex w-full ${heights[size]} ${className}`}>
      <div className="flex-1 bg-[#009246]" />
      <div className="flex-1 bg-white" />
      <div className="flex-1 bg-[#ce2b37]" />
    </div>
  );
};

// Small centered tricolor accent
export const TricolorAccent = ({ 
  width = '80px',
  className = '' 
}: { 
  width?: string;
  className?: string;
}) => (
  <div className={`flex h-1 rounded-full overflow-hidden ${className}`} style={{ width }}>
    <div className="flex-1 bg-[#009246]" />
    <div className="flex-1 bg-[#f5f5f5]" />
    <div className="flex-1 bg-[#ce2b37]" />
  </div>
);

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'dark' | 'cream' | 'accent' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'full';
  container?: boolean;
  containerSize?: 'narrow' | 'default' | 'wide';
  showTricolor?: boolean;
  children: ReactNode;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ variant = 'default', size = 'md', container = true, containerSize = 'default', showTricolor = false, children, className = '', id, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white',
      dark: 'bg-[var(--color-primary)] text-white',
      cream: 'bg-[var(--color-cream)]',
      accent: 'bg-[var(--color-accent)] text-white',
      gradient: 'bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-primary)] text-white',
    };

    const sizeClasses = {
      sm: 'py-12 lg:py-16',
      md: 'py-16 lg:py-24',
      lg: 'py-24 lg:py-32',
      full: 'min-h-screen flex items-center',
    };

    const containerSizeClasses = {
      narrow: 'max-w-4xl',
      default: 'max-w-7xl',
      wide: 'max-w-[1440px]',
    };

    const sectionClasses = `relative overflow-hidden ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.replace(/\s+/g, ' ').trim();
    const containerClasses = `w-full mx-auto px-4 sm:px-6 lg:px-8 ${containerSizeClasses[containerSize]}`.replace(/\s+/g, ' ').trim();

    return (
      <section ref={ref} id={id} className={sectionClasses} {...props}>
        {showTricolor && <TricolorDivider size="sm" className="absolute top-0 left-0 right-0" />}
        {container ? <div className={containerClasses}>{children}</div> : children}
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;

interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  dark?: boolean;
}

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ eyebrow, title, subtitle, align = 'center', dark = false, className = '', ...props }, ref) => {
    const alignClasses = {
      left: 'text-left',
      center: 'text-center mx-auto',
      right: 'text-right ml-auto',
    };

    return (
      <div ref={ref} className={`max-w-3xl mb-12 lg:mb-16 ${alignClasses[align]} ${className}`} {...props}>
        {eyebrow && <span className="lem-eyebrow block mb-4">{eyebrow}</span>}
        <h2 className={`font-heading font-semibold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 ${dark ? 'text-white' : 'text-[var(--color-primary)]'}`}>
          {title}
        </h2>
        {subtitle && (
          <p className={`text-lg lg:text-xl leading-relaxed ${dark ? 'text-white/80' : 'text-[var(--color-dark-gray)]'}`}>
            {subtitle}
          </p>
        )}
        <div className={`mt-6 ${align === 'center' ? 'mx-auto' : ''}`}>
          <TricolorAccent width="80px" className={align === 'center' ? 'mx-auto' : ''} />
        </div>
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';
