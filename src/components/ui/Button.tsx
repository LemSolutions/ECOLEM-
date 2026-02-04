'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      href,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      inline-flex items-center justify-center gap-2
      font-medium tracking-wide uppercase
      border-2 border-transparent
      cursor-pointer
      transition-all duration-300 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    `;

    const variantClasses = {
      primary: `
        bg-[var(--color-accent)] text-[var(--color-primary)]
        border-[var(--color-accent)]
        hover:bg-[var(--color-accent-dark)] hover:border-[var(--color-accent-dark)]
        hover:-translate-y-0.5 hover:shadow-lg
        focus-visible:ring-[var(--color-accent)]
      `,
      secondary: `
        bg-transparent text-[var(--color-accent)]
        border-[var(--color-accent)]
        hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)]
        hover:-translate-y-0.5
        focus-visible:ring-[var(--color-accent)]
      `,
      ghost: `
        bg-transparent text-white
        border-white/80
        hover:bg-white hover:text-[var(--color-primary)]
        focus-visible:ring-white
      `,
      link: `
        bg-transparent text-[var(--color-accent)]
        border-transparent
        hover:underline underline-offset-4
        p-0
        focus-visible:ring-[var(--color-accent)]
      `,
    };

    const sizeClasses = {
      sm: 'text-xs px-4 py-2 rounded',
      md: 'text-sm px-6 py-3 rounded',
      lg: 'text-base px-8 py-4 rounded',
    };

    const combinedClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${variant !== 'link' ? sizeClasses[size] : ''}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.replace(/\s+/g, ' ').trim();

    const Spinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    );

    const content = (
      <>
        {isLoading ? <Spinner /> : leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </>
    );

    if (href && !disabled) {
      return (
        <Link href={href} className={combinedClasses}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClasses} disabled={disabled || isLoading} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
