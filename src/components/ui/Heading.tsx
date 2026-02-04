'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'display' | 'hero' | 'section' | 'subsection' | 'card' | 'small';
  variant?: 'default' | 'white' | 'accent' | 'gradient';
  children: ReactNode;
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Component = 'h2', size = 'section', variant = 'default', children, className = '', ...props }, ref) => {
    const sizeClasses = {
      display: 'text-5xl sm:text-6xl lg:text-7xl font-bold',
      hero: 'text-4xl sm:text-5xl lg:text-6xl font-bold',
      section: 'text-3xl sm:text-4xl lg:text-5xl font-semibold',
      subsection: 'text-2xl sm:text-3xl font-semibold',
      card: 'text-xl lg:text-2xl font-semibold',
      small: 'text-lg font-medium',
    };

    const variantClasses = {
      default: 'text-[var(--color-primary)]',
      white: 'text-white',
      accent: 'text-[var(--color-accent)]',
      gradient: 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-secondary)] bg-clip-text text-transparent',
    };

    const combinedClasses = `font-heading leading-tight ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.replace(/\s+/g, ' ').trim();

    return (
      <Component ref={ref} className={combinedClasses} {...props}>
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

export default Heading;

export const Eyebrow = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement> & { children: ReactNode }>(
  ({ children, className = '', ...props }, ref) => (
    <span ref={ref} className={`block text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)] mb-4 ${className}`} {...props}>
      {children}
    </span>
  )
);
Eyebrow.displayName = 'Eyebrow';

export const Text = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement> & { size?: 'sm' | 'base' | 'lg' | 'xl'; variant?: 'default' | 'muted' | 'white'; children: ReactNode }>(
  ({ size = 'base', variant = 'default', children, className = '', ...props }, ref) => {
    const sizeClasses = { sm: 'text-sm', base: 'text-base lg:text-lg', lg: 'text-lg lg:text-xl', xl: 'text-xl lg:text-2xl' };
    const variantClasses = { default: 'text-[var(--color-charcoal)]', muted: 'text-[var(--color-dark-gray)]', white: 'text-white/90' };

    return (
      <p ref={ref} className={`leading-relaxed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`} {...props}>
        {children}
      </p>
    );
  }
);
Text.displayName = 'Text';
