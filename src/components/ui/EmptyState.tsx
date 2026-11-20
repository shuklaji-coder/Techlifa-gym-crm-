import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-slate-800/80 border border-slate-700/30',
        className
      )}
    />
  );
};

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-dark-850/50 rounded-2xl border border-slate-800 my-4">
      <div className="p-3.5 bg-dark-750 text-[#C6FF00] rounded-2xl border border-slate-700/60 mb-3 shadow-inner">
        {icon}
      </div>
      <h4 className="text-base font-bold text-white tracking-wide">{title}</h4>
      <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-[#C6FF00] text-black font-semibold text-xs rounded-xl hover:bg-[#B5EB00] transition-all shadow-[0_0_15px_rgba(198,255,0,0.2)]"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
