import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-none tracking-wider uppercase text-xs disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[11px] gap-1.5',
    md: 'px-5 py-2.5 text-xs gap-2',
    lg: 'px-8 py-3.5 text-sm gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-apsara-espresso text-apsara-alabaster hover:bg-apsara-walnut hover:shadow-lg border border-apsara-espresso',
    secondary: 'bg-apsara-cream text-apsara-espresso hover:bg-apsara-frosted-sand border border-apsara-camel/30',
    outline: 'bg-transparent text-apsara-espresso border border-apsara-espresso/40 hover:border-apsara-espresso hover:bg-apsara-frosted-sand/50',
    ghost: 'bg-transparent text-apsara-espresso hover:text-apsara-camel hover:bg-apsara-frosted-sand/40',
    gold: 'bg-gradient-to-r from-[#B8976C] via-[#D4AF37] to-[#B8976C] bg-size-200 text-apsara-espresso font-semibold hover:shadow-glass-gold border border-apsara-sandstone/50 hover:brightness-105',
    dark: 'bg-apsara-smoked-wood text-apsara-champagne border border-apsara-camel/20 hover:border-apsara-sandstone/60 hover:shadow-admin-card',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
