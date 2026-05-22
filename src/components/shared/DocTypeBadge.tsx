import React from 'react';
import type { DocumentType } from '../../types';
import { cn } from '../../utils/cn';

const typeStyles: Record<string, string> = {
  invoice: 'bg-blue-100 text-blue-800',
  credit_note: 'bg-orange-100 text-orange-800',
  receipt: 'bg-teal-100 text-teal-800',
  statement: 'bg-indigo-100 text-indigo-800',
  unknown: 'bg-slate-200 text-slate-700',
};

const typeLabels: Record<string, string> = {
  invoice: 'Invoice',
  credit_note: 'Credit Note',
  receipt: 'Receipt',
  statement: 'Statement',
  unknown: 'Unknown',
};

export const DocTypeBadge: React.FC<{ type: DocumentType }> = ({ type }) => {
  const key = type ?? 'unknown';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        typeStyles[key]
      )}
    >
      {typeLabels[key]}
    </span>
  );
};
