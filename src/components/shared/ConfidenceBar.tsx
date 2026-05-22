import React from 'react';

export const ConfidenceBar: React.FC<{ value?: number }> = ({ value }) => {
  if (value == null) return null;
  let color = 'bg-red-500';
  if (value >= 85) color = 'bg-emerald-500';
  else if (value >= 60) color = 'bg-amber-400';

  return (
    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200">
      <div
        className={`h-1.5 rounded-full transition-all ${color}`}
        style={{ width: `${Math.min(100, Math.round(value))}%` }}
      />
    </div>
  );
};
