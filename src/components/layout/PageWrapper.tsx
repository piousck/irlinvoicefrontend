import React from 'react';

export const PageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`h-full overflow-auto p-4 md:p-6 ${className}`}>{children}</div>
);
