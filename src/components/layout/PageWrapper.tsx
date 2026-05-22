import React from 'react';

export const PageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`h-full overflow-y-auto bg-warm-off p-5 ${className}`}>{children}</div>
);
