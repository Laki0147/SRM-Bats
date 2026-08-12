'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { T } from './theme';

type ToastKind = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

const KIND_STYLE: Record<ToastKind, { fg: string; bg: string; Icon: typeof CheckCircle2 }> = {
  success: { fg: T.success, bg: T.successBg, Icon: CheckCircle2 },
  error: { fg: T.danger, bg: T.dangerBg, Icon: XCircle },
  info: { fg: T.accent, bg: 'rgba(139,94,60,.1)', Icon: Info },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, kind, message }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  const api = useRef<ToastApi>({
    success: (m: string) => push('success', m),
    error: (m: string) => push('error', m),
    info: (m: string) => push('info', m),
  }).current;

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed bottom-5 right-5 z-[120] flex w-[320px] flex-col gap-2"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const s = KIND_STYLE[t.kind];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 24, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto flex items-start gap-2.5 rounded-[12px] border px-3.5 py-3 shadow-[0_8px_24px_rgba(44,31,20,0.12)]"
                style={{ background: T.bg, borderColor: T.line }}
                role={t.kind === 'error' ? 'alert' : 'status'}
              >
                <s.Icon className="mt-0.5 h-[17px] w-[17px] shrink-0" style={{ color: s.fg }} />
                <p className="flex-1 font-body text-[12.5px] leading-snug" style={{ color: T.ink }}>
                  {t.message}
                </p>
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss notification"
                  className="shrink-0 opacity-40 transition-opacity hover:opacity-80"
                >
                  <X className="h-3.5 w-3.5" style={{ color: T.ink }} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
