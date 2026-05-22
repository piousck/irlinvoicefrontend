import React from 'react';

interface Props {
  value?: number;
  showLabel?: boolean;
}

export const ConfidenceBar: React.FC<Props> = ({ value, showLabel = false }) => {
  if (value == null) return null;

  let color = 'bg-red-500';
  let label = 'Low';
  if (value >= 85) { color = 'bg-emerald-500'; label = 'High'; }
  else if (value >= 60) { color = 'bg-amber-500'; label = 'Medium'; }

  return (
    <div className="mt-1">
      {showLabel && (
        <div className="mb-0.5 flex justify-between text-[10px] text-slate-500">
          <span>Confidence</span>
          <span>{Math.round(value)}% – {label}</span>
        </div>
      )}
      <div className="h-1.5 w-full rounded-full bg-slate-200">
        <div
          className={`h-1.5 rounded-full transition-all ${color}`}
          style={{ width: `${Math.round(value)}%` }}
        />
      </div>
    </div>
  );
};
