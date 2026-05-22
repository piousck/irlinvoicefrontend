import React, { createContext, useCallback, useContext, useState } from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

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

const variantConfig: Record<ToastVariant, { icon: React.ReactNode; border: string; iconColor: string }> = {
  success: { icon: <CheckCircle className="h-4 w-4" />, border: 'border-emerald-200', iconColor: 'text-emerald-500' },
  error: { icon: <XCircle className="h-4 w-4" />, border: 'border-red-200', iconColor: 'text-red-500' },
  info: { icon: <Info className="h-4 w-4" />, border: 'border-blue-200', iconColor: 'text-blue-500' },
  warning: { icon: <AlertTriangle className="h-4 w-4" />, border: 'border-amber-200', iconColor: 'text-amber-500' },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-2" role="region" aria-label="Notifications">
        {toasts.map((toast) => {
          const config = variantConfig[toast.variant];
          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto flex min-w-[300px] max-w-sm items-start gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg',
                config.border
              )}
            >
              <span className={cn('mt-0.5 shrink-0', config.iconColor)}>{config.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-xs text-slate-500">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 text-slate-400 hover:text-slate-600"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
