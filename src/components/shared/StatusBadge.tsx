import React from 'react';
import type { DocumentStatus } from '../../types';
import { cn } from '../../utils/cn';

const statusStyles: Record<DocumentStatus, string> = {
  uploaded: 'bg-slate-200 text-slate-800',
  extracted: 'bg-blue-100 text-blue-800',
  analyzed: 'bg-amber-100 text-amber-800',
  reviewed: 'bg-emerald-100 text-emerald-800',
  exported: 'bg-purple-100 text-purple-800',
};

export const StatusBadge: React.FC<{ status: DocumentStatus }> = ({ status }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
      statusStyles[status]
    )}
  >
    {status}
  </span>
);
