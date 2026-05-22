import React from 'react';

export const PageWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <main
    className={`h-full overflow-y-auto bg-[#f7f6f2] p-5 ${className}`}
  >
    {children}
  </main>
);
