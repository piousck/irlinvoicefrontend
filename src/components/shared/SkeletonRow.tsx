import React from 'react';

export const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-3 py-3">
        <div className="h-4 rounded bg-slate-200" style={{ width: i === 1 ? '70%' : '50%' }} />
      </td>
    ))}
  </tr>
);

export const SkeletonCard: React.FC = () => (
  <div className="animate-pulse rounded-lg bg-white p-4 shadow-sm">
    <div className="mb-3 h-5 w-2/5 rounded bg-slate-200" />
    <div className="space-y-2">
      <div className="h-3 rounded bg-slate-100" />
      <div className="h-3 w-4/5 rounded bg-slate-100" />
      <div className="h-3 w-3/5 rounded bg-slate-100" />
    </div>
  </div>
);
