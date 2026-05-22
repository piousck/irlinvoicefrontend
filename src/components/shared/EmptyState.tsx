import React from 'react';

interface Props {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-white px-8 py-20 text-center">
    <div className="mb-4 flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-primary/10">
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="text-base font-semibold text-slate-800">{title}</h3>
    <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);
