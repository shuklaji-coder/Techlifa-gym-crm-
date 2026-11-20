import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  badge?: string;
  sparklineData?: number[];
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  subtitle,
  icon,
  badge,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 transition-all duration-300 group glass-panel glow-card hover:-translate-y-0.5',
        className
      )}
    >
      {/* Top micro hairline glow accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C6FF00]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header with Title and Icon */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-sans">
            {title}
          </p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-white mt-1.5 tracking-tight font-display">
            {value}
          </h3>
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-dark-750/80 border border-white/[0.08] text-[#C6FF00] shadow-inner group-hover:scale-110 group-hover:border-[#C6FF00]/40 transition-all duration-300">
            {icon}
          </div>
        )}
      </div>

      {/* Footer with Pill, Subtitle and Badge */}
      <div className="mt-4 flex items-center justify-between gap-2 pt-2.5 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5 min-w-0">
          {change && (
            <span
              className={cn(
                'inline-flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded font-mono',
                changeType === 'positive' && 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
                changeType === 'negative' && 'text-rose-400 bg-rose-500/10 border border-rose-500/20',
                changeType === 'neutral' && 'text-slate-300 bg-dark-750 border border-slate-700/60'
              )}
            >
              {changeType === 'positive' && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
              {changeType === 'negative' && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {changeType === 'neutral' && <Minus className="w-3 h-3 mr-0.5" />}
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-[11px] text-slate-400 truncate font-sans">
              {subtitle}
            </span>
          )}
        </div>

        {badge && (
          <span className="text-[10px] font-mono uppercase bg-dark-750/90 text-slate-300 px-2 py-0.5 rounded-md border border-white/[0.06] shrink-0">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
