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
  <div className="rounded-lg bg-white p-4 shadow-sm space-y-3">
    <Skeleton className="h-8 w-1/3" />
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className="h-10 w-full" />
    ))}
  </div>
);
