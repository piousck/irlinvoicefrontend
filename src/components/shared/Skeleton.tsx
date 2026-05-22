import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'animate-pulse rounded-md bg-slate-200',
      className,
    )}
  />
);

export const SkeletonTable: React.FC = () => (
  <div className="space-y-2 rounded-lg bg-white p-4 shadow-sm">
    <Skeleton className="h-8 w-64" />
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-10 w-full" />
    ))}
  </div>
);
