'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { T } from './theme';
import { AdminButton } from './ui';

export interface ConfirmState {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export function ConfirmDialog({
  open,
  state,
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  state: ConfirmState | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  // Close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, loading, onCancel]);

  return (
    <AnimatePresence>
      {open && state && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => !loading && onCancel()}
          style={{ background: 'rgba(44,31,20,0.45)', backdropFilter: 'blur(2px)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <motion.div
            className="w-full max-w-[400px] rounded-[16px] border p-6"
            initial={{ scale: 0.96, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 8 }}
            transition={{ duration: 0.16 }}
            onClick={(e) => e.stopPropagation()}
            style={{ background: T.bg, borderColor: T.line }}
          >
            <div className="flex items-start gap-3">
              {state.danger && (
                <div
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ background: T.dangerBg }}
                >
                  <AlertTriangle className="h-[18px] w-[18px]" style={{ color: T.danger }} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3
                  id="confirm-title"
                  className="font-display text-[20px] font-bold leading-tight"
                  style={{ color: T.ink }}
                >
                  {state.title}
                </h3>
                {state.message && (
                  <p
                    className="mt-1.5 font-body text-[13px] leading-relaxed"
                    style={{ color: T.body }}
                  >
                    {state.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <AdminButton variant="ghost" onClick={onCancel} disabled={loading}>
                {state.cancelLabel ?? 'Cancel'}
              </AdminButton>
              <AdminButton
                variant={state.danger ? 'danger' : 'primary'}
                onClick={onConfirm}
                loading={loading}
              >
                {state.confirmLabel ?? 'Confirm'}
              </AdminButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
