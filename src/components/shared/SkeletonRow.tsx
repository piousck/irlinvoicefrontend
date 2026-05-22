import React from 'react';

export const SkeletonRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-3 py-3">
        <div className="h-4 animate-pulse rounded bg-slate-200" style={{ width: `${60 + (i % 3) * 20}%` }} />
      </td>
    ))}
  </tr>
);

export const SkeletonCard: React.FC = () => (
  <div className="rounded-lg bg-white p-4 shadow-sm">
    <div className="mb-3 h-5 w-2/5 animate-pulse rounded bg-slate-200" />
    <div className="space-y-2">
      <div className="h-4 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
      <div className="h-4 w-3/5 animate-pulse rounded bg-slate-200" />
    </div>
  </div>
);
