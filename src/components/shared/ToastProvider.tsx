import React, { createContext, useCallback, useContext, useState } from 'react';
import { cn } from '../../utils/cn';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  show: (toast: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const variantBorder: Record<ToastVariant, string> = {
  success: 'border-emerald-300 bg-emerald-50',
  error: 'border-red-300 bg-red-50',
  info: 'border-blue-300 bg-blue-50',
  warning: 'border-amber-300 bg-amber-50',
};

const variantTitle: Record<ToastVariant, string> = {
  success: 'text-emerald-800',
  error: 'text-red-800',
  info: 'text-blue-800',
  warning: 'text-amber-800',
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto min-w-[280px] max-w-sm rounded-lg border px-4 py-3 shadow-lg',
              variantBorder[toast.variant],
            )}
          >
            <p className={cn('text-sm font-semibold', variantTitle[toast.variant])}>{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-xs text-slate-600">{toast.description}</p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
