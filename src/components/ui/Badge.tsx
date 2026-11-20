import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lime' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'slate' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'sm',
  className,
}) => {
  const variantStyles = {
    lime: 'bg-[#C6FF00]/15 text-[#C6FF00] border-[#C6FF00]/30 shadow-[0_0_10px_rgba(198,255,0,0.1)]',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
    outline: 'bg-transparent text-slate-300 border-slate-700',
  }[variant];

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full font-medium',
    md: 'text-xs px-3 py-1 rounded-full font-semibold',
  }[size];

  return (
    <span className={cn('inline-flex items-center gap-1.5 border tracking-wide uppercase', variantStyles, sizeStyles, className)}>
      {children}
    </span>
  );
};
