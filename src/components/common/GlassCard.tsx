import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark' | 'pedestal' | 'gold';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'light',
  hoverEffect = false,
  ...props
}) => {
  const variantStyles = {
    light: 'bg-[#F7F3EE]/80 backdrop-blur-md border border-[#B8976C]/25 text-apsara-espresso shadow-pedestal',
    dark: 'bg-[#181513]/90 backdrop-blur-xl border border-[#B8976C]/20 text-apsara-champagne shadow-admin-card',
    pedestal: 'bg-gradient-to-b from-[#FAF7F2]/90 to-[#EFE8DE]/80 backdrop-blur-lg border border-[#B8976C]/30 shadow-pedestal',
    gold: 'bg-[#F5EFEB]/90 backdrop-blur-md border border-[#D4AF37]/50 shadow-glass-gold',
  };

  const hoverStyles = hoverEffect
    ? 'transition-all duration-500 hover:-translate-y-1.5 hover:shadow-pedestal-hover hover:border-[#D4AF37]/60'
    : '';

  return (
    <div
      className={twMerge(clsx('relative rounded-none p-6', variantStyles[variant], hoverStyles, className))}
      {...props}
    >
      {children}
    </div>
  );
};
