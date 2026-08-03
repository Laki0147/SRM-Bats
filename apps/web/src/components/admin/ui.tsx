'use client';

import { ReactNode } from 'react';
import { T } from './theme';

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke={T.accent} strokeWidth="3" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={T.accent} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Spinner size={28} />
      <p className="font-body text-[12px]" style={{ color: T.muted }}>
        {label}
      </p>
    </div>
  );
}

// ── Page header ─────────────────────────────────────────────────────────────
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <span
            className="font-sc text-[11px] font-semibold uppercase tracking-[4px]"
            style={{ color: T.accent }}
          >
            {eyebrow}
          </span>
        )}
        <h1
          className="font-display mt-1 text-[32px] font-bold leading-none"
          style={{ color: T.ink, letterSpacing: '-0.5px' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 font-body text-[13px]" style={{ color: T.body }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({
  children,
  className = '',
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  pad?: boolean;
}) {
  return (
    <div
      className={`rounded-[16px] border ${pad ? 'p-5' : ''} ${className}`}
      style={{ background: T.surface, borderColor: T.line }}
    >
      {children}
    </div>
  );
}

// ── Button ─────────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'ghost' | 'danger';
export function AdminButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  size = 'md',
  className = '',
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: BtnVariant;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  title?: string;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-[10px] font-body font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const sizing = size === 'sm' ? 'px-3 py-1.5 text-[12px]' : 'px-4 py-2.5 text-[13px]';
  const styles: Record<BtnVariant, React.CSSProperties> = {
    primary: { background: T.ink, color: T.bg },
    ghost: { background: 'transparent', color: T.accent, border: `1px solid ${T.line}` },
    danger: { background: T.dangerBg, color: T.danger, border: `1px solid rgba(155,35,53,.2)` },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`${base} ${sizing} ${className}`}
      style={styles[variant]}
    >
      {loading && <Spinner size={15} />}
      {children}
    </button>
  );
}

// ── Status pill ────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, { fg: string; bg: string }> = {
  PENDING: { fg: T.warn, bg: T.warnBg },
  CONFIRMED: { fg: T.accent, bg: 'rgba(139,94,60,.12)' },
  PROCESSING: { fg: T.accent, bg: 'rgba(139,94,60,.12)' },
  SHIPPED: { fg: '#2563eb', bg: 'rgba(37,99,235,.1)' },
  DELIVERED: { fg: T.success, bg: T.successBg },
  CANCELLED: { fg: T.danger, bg: T.dangerBg },
  REFUNDED: { fg: T.muted, bg: 'rgba(44,31,20,.07)' },
  PAID: { fg: T.success, bg: T.successBg },
  ACTIVE: { fg: T.success, bg: T.successBg },
  INACTIVE: { fg: T.muted, bg: 'rgba(44,31,20,.07)' },
};

export function StatusPill({ status }: { status: string }) {
  const c = STATUS_COLORS[status?.toUpperCase()] ?? { fg: T.body, bg: 'rgba(44,31,20,.07)' };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.5px]"
      style={{ color: c.fg, background: c.bg }}
    >
      {status}
    </span>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────
export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 disabled:opacity-50"
    >
      <span
        className="relative inline-block h-[22px] w-[38px] rounded-full transition-colors"
        style={{ background: checked ? T.accent : 'rgba(44,31,20,.18)' }}
      >
        <span
          className="absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all"
          style={{ left: checked ? '18px' : '2px' }}
        />
      </span>
      {label && (
        <span className="font-body text-[13px]" style={{ color: T.ink }}>
          {label}
        </span>
      )}
    </button>
  );
}

// ── Field / inputs ─────────────────────────────────────────────────────────
export function Field({
  label,
  children,
  required,
  hint,
  error,
  className = '',
}: {
  label?: string;
  children: ReactNode;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <label
          className="mb-1.5 block font-body text-[11px] font-semibold uppercase tracking-[1px]"
          style={{ color: T.body }}
        >
          {label} {required && <span style={{ color: T.danger }}>*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="mt-1 font-body text-[11px]" style={{ color: T.muted }}>
          {hint}
        </p>
      )}
      {error && (
        <p className="mt-1 font-body text-[11px]" style={{ color: T.danger }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  hint,
  action,
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-[16px] border border-dashed px-6 py-16 text-center"
      style={{ borderColor: T.line }}
    >
      {icon && <div className="mb-3 opacity-25">{icon}</div>}
      <p className="font-body text-[14px] font-semibold" style={{ color: T.ink }}>
        {title}
      </p>
      {hint && (
        <p className="mt-1 max-w-sm font-body text-[12.5px]" style={{ color: T.body }}>
          {hint}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ── Error note ─────────────────────────────────────────────────────────────
export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-[10px] px-4 py-2.5 font-body text-[12px]"
      style={{ background: T.dangerBg, color: T.danger, border: '1px solid rgba(155,35,53,.15)' }}
      role="alert"
    >
      {children}
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────
export function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-5 flex items-center justify-center gap-3">
      <AdminButton variant="ghost" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Previous
      </AdminButton>
      <span className="font-mono text-[12px]" style={{ color: T.body }}>
        {page} / {totalPages}
      </span>
      <AdminButton
        variant="ghost"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
      >
        Next
      </AdminButton>
    </div>
  );
}

// ── Table shell ──────────────────────────────────────────────────────────────
export function TableShell({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[16px] border" style={{ borderColor: T.line }}>
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ background: 'rgba(139,94,60,.06)' }}>
            {headers.map((h) => (
              <th
                key={h}
                className="font-sc whitespace-nowrap px-4 py-3 text-left text-[10.5px] font-semibold uppercase tracking-[1.5px]"
                style={{ color: T.accent }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
