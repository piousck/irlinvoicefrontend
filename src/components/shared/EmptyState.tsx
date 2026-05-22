import React from 'react';

interface Props {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({ title, description, action, icon }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-8 py-20 text-center shadow-sm">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
      {icon ?? (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      )}
    </div>
    <h3 className="text-base font-semibold text-slate-800">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);
