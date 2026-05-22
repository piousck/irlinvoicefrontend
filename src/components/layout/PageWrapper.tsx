import React from 'react';

export const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-full overflow-auto bg-warm-off p-5">{children}</div>
);
