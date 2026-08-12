'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */

// Floating control to switch between design variants live on the running site.
// Deliberately neutral (ink card, works over both the light and dark looks).
import { useEffect, useRef, useState } from 'react';
import { useDesignVariant, type DesignVariant } from '@/lib/design-variant';

const OPTIONS: { id: DesignVariant; name: string; desc: string }[] = [
  { id: 'heritage', name: 'Heritage', desc: 'The current warm, cinematic look.' },
  { id: 'atelier', name: 'Atelier', desc: 'New editorial “specimen” look.' },
];

export function VariantSwitcher() {
  const { variant, setVariant, ready } = useDesignVariant();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Avoid rendering until hydrated so the label matches the applied variant.
  if (!ready) return null;

  const current = OPTIONS.find((o) => o.id === variant) ?? OPTIONS[0];

  return (
    <div
      ref={rootRef}
      className="fixed bottom-4 right-4 z-[100] font-body"
      style={{ colorScheme: 'dark' }}
    >
      {open && (
        <div
          role="dialog"
          aria-label="Design preview switcher"
          className="mb-2 w-[264px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
          style={{ background: 'rgba(26,18,11,0.97)', backdropFilter: 'blur(12px)' }}
        >
          <div className="border-b border-white/10 px-4 py-3">
            <p
              className="text-[10px] font-semibold uppercase tracking-[2.5px]"
              style={{ color: '#c4956a' }}
            >
              Live preview
            </p>
            <p className="mt-0.5 text-[12px] leading-snug" style={{ color: '#a09588' }}>
              Compare the two designs — your choice is remembered on this device.
            </p>
          </div>
          <div className="p-2">
            {OPTIONS.map((o) => {
              const active = o.id === variant;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setVariant(o.id)}
                  aria-pressed={active}
                  className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                  style={{ background: active ? 'rgba(196,149,106,0.14)' : 'transparent' }}
                >
                  <span
                    aria-hidden
                    className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                    style={{ borderColor: active ? '#c4956a' : 'rgba(255,255,255,0.25)' }}
                  >
                    {active && (
                      <span className="h-2 w-2 rounded-full" style={{ background: '#c4956a' }} />
                    )}
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold" style={{ color: '#f2ebe0' }}>
                      {o.name}
                    </span>
                    <span className="block text-[11.5px] leading-snug" style={{ color: '#a09588' }}>
                      {o.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Switch design — currently ${current.name}`}
        className="flex items-center gap-2 rounded-full border border-white/10 py-2.5 pl-3 pr-4 shadow-xl transition-transform hover:-translate-y-0.5"
        style={{ background: 'rgba(26,18,11,0.97)', backdropFilter: 'blur(12px)' }}
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full"
          style={{ background: '#8b5e3c' }}
        >
          {/* palette / swatch glyph */}
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
            <circle cx="7" cy="7" r="5.4" stroke="#f2ebe0" strokeWidth="1.3" />
            <path d="M7 1.6V12.4M1.6 7H12.4" stroke="#f2ebe0" strokeWidth="1.1" opacity="0.55" />
          </svg>
        </span>
        <span className="text-left leading-tight">
          <span
            className="block text-[8.5px] font-semibold uppercase tracking-[2px]"
            style={{ color: '#a09588' }}
          >
            Design
          </span>
          <span className="block text-[12.5px] font-semibold" style={{ color: '#f2ebe0' }}>
            {current.name}
          </span>
        </span>
      </button>
    </div>
  );
}
