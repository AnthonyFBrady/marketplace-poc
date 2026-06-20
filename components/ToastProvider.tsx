'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Toast = { id: number; message: string };
type Ctx = { show: (message: string) => void };

const ToastCtx = createContext<Ctx>({ show: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              background: '#0F0F0E',
              color: '#FAFAF8',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              padding: '10px 20px',
              borderRadius: 'var(--r-badge)',
              boxShadow: 'var(--shadow-high)',
              whiteSpace: 'nowrap',
              animation: 'toast-in 0.2s ease',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
