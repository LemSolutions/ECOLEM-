'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  tricolorAccent?: boolean;
  children: ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', hover = true, tricolorAccent = false, children, className = '', ...props }, ref) => {
    const baseClasses = `rounded-xl transition-all duration-300 ease-out overflow-hidden`;

    const variantClasses = {
      default: `bg-white shadow-md ${hover ? 'hover:-translate-y-1 hover:shadow-xl' : ''}`,
      glass: `bg-white/10 backdrop-blur-xl border border-white/20 ${hover ? 'hover:bg-white/15 hover:border-white/30' : ''}`,
      bordered: `bg-white border border-[var(--color-light-gray)] ${hover ? 'hover:border-[var(--color-accent)] hover:-translate-y-1' : ''}`,
      elevated: `bg-white shadow-2xl ${hover ? 'hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]' : ''}`,
    };

    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6 lg:p-8',
      lg: 'p-8 lg:p-12',
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`.replace(/\s+/g, ' ').trim();

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {/* 🇮🇹 Tricolor accent at top */}
        {tricolorAccent && (
          <div className="flex h-1">
            <div className="flex-1 bg-[#009246]" />
            <div className="flex-1 bg-[#f5f5f5]" />
            <div className="flex-1 bg-[#ce2b37]" />
          </div>
        )}
        <div className={paddingClasses[padding]}>
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { children: ReactNode }>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`mb-4 ${className}`} {...props}>{children}</div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; children: ReactNode }>(
  ({ as: Component = 'h3', children, className = '', ...props }, ref) => (
    <Component ref={ref} className={`font-heading font-semibold text-[var(--color-primary)] text-xl lg:text-2xl ${className}`} {...props}>
      {children}
    </Component>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }>(
  ({ children, className = '', ...props }, ref) => (
    <p ref={ref} className={`text-[var(--color-dark-gray)] leading-relaxed ${className}`} {...props}>{children}</p>
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { children: ReactNode }>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={className} {...props}>{children}</div>
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { children: ReactNode }>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`mt-6 pt-4 border-t border-[var(--color-light-gray)] ${className}`} {...props}>{children}</div>
  )
);
CardFooter.displayName = 'CardFooter';

export default Card;
