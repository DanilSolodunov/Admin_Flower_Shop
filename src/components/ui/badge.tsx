import React from 'react';
import clsx from 'clsx';

export type BadgeVariant = 'default' | 'secondary' | 'success' | 'error';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-slate-200 text-slate-800',
    secondary: 'bg-slate-500 text-white',
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
  };

  return (
    <span
      className={clsx(
        'px-2 py-1 rounded-full text-sm font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};