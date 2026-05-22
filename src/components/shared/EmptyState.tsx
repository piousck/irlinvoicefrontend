import React from 'react';

interface Props {
  title: string;
  description: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({ title, description, action, icon }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-8 py-20 text-center shadow-sm">
    <div className="mb-4">
      {icon ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          {icon}
        </div>
      ) : (
        <div className="h-12 w-12 animate-bounce rounded-full bg-primary/10" />
      )}
    </div>
    <h3 className="text-base font-semibold text-slate-800">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);
