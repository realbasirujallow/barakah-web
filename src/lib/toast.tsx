'use client';
import { createContext, useContext, useState, useCallback, useMemo, useRef, ReactNode } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'error' | 'success' | 'info';
}

interface ToastContextType {
  toast: (message: string, type?: 'error' | 'success' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((message: string, type: 'error' | 'success' | 'info' = 'error') => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const dismiss = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  // HIGH BUG FIX (H-9): memoize the context value so consumers don't re-render
  // every time ToastProvider re-renders. `toast` is already stable via
  // useCallback, so this memo's identity only changes when we ever add
  // another field — in practice, never.
  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
          {toasts.map(t => (
            // Round 22: differentiated ARIA live-region semantics.
            // `role="alert"` (implicit `aria-live="assertive"`) is right
            // for errors — interrupts screen-reader output to deliver
            // the message immediately. Success / info should use
            // `role="status"` (polite) so confirmations don't barge
            // over whatever the user was reading.
            <div
              key={t.id}
              role={t.type === 'error' ? 'alert' : 'status'}
              aria-live={t.type === 'error' ? 'assertive' : 'polite'}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm max-w-sm transition-all ${
                t.type === 'error' ? 'bg-red-600' :
                t.type === 'success' ? 'bg-green-600' : 'bg-blue-600'
              }`}
            >
              <span>{t.type === 'error' ? '⚠️' : t.type === 'success' ? '✅' : 'ℹ️'}</span>
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="ml-2 text-white/70 hover:text-white shrink-0"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}
