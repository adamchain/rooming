import React, { Suspense } from 'react';

interface ModuleLoaderProps {
  children: React.ReactNode;
}

export function ModuleLoader({ children }: ModuleLoaderProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      {children}
    </Suspense>
  );
}