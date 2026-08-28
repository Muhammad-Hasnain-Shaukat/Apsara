import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { OrderStatus } from '../../types';

interface BadgeProps {
  status?: OrderStatus;
  variant?: 'gold' | 'espresso' | 'alabaster' | 'sand' | 'danger' | 'success';
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  variant,
  children,
  className,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[11px]',
  };

  const getStatusStyles = (st?: OrderStatus) => {
    switch (st) {
      case 'pending':
        return 'bg-[#EAE3D8] text-[#8C6D46] border border-[#B8976C]/40';
      case 'processing':
        return 'bg-[#F5EFEB] text-[#9A7B54] border border-[#D4AF37]/60 animate-pulse-subtle';
      case 'shipped':
        return 'bg-[#1F1A17] text-[#E5D3B3] border border-[#B8976C]';
      case 'delivered':
        return 'bg-[#2A3B2A]/15 text-[#2E6B3B] border border-[#2E6B3B]/40 font-medium';
      case 'cancelled':
        return 'bg-[#5B211E]/10 text-[#8C2E2B] border border-[#8C2E2B]/30';
      default:
        return null;
    }
  };

  const variantStyles = {
    gold: 'bg-[#D4AF37]/15 text-[#8C6D46] border border-[#D4AF37]/50',
    espresso: 'bg-apsara-espresso text-apsara-alabaster border border-apsara-espresso',
    alabaster: 'bg-apsara-alabaster text-apsara-espresso border border-apsara-camel/30',
    sand: 'bg-apsara-frosted-sand text-apsara-espresso border border-apsara-camel/20',
    danger: 'bg-red-50 text-red-800 border border-red-200',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  };

  const badgeStyle = status
    ? getStatusStyles(status)
    : (variant ? variantStyles[variant] : variantStyles.sand);

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 uppercase font-sans tracking-widest rounded-none font-medium',
          sizeStyles[size],
          badgeStyle,
          className
        )
      )}
    >
      {status === 'processing' && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8976C] animate-ping" />
      )}
      {children || status}
    </span>
  );
};
