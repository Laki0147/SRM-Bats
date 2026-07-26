'use client';
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */
// Shared primitives for /dev-docs: copy button, code block (in-house JSON
// highlighter), collapsible, field table, method/auth chips, section header.
import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Copy, Check, ChevronDown, Download } from 'lucide-react';

const INK = '#2c1f14';
const BODY = '#6b6358';
const ACCENT = '#8b5e3c';
const LINE = 'rgba(44,31,20,0.10)';

// ---- method + auth color system (the reference-manual "signature") ----
export const METHOD_COLOR: Record<string, string> = {
  GET: '#2d6a4f',
  POST: '#8b5e3c',
  PUT: '#b45309',
  PATCH: '#3b6ea5',
  DELETE: '#9b2335',
};

export function MethodChip({ method }: { method: string }) {
  const c = METHOD_COLOR[method] ?? ACCENT;
  return (
    <span
      className="rounded px-2 py-[3px] font-mono text-[11px] font-bold tracking-wide"
      style={{ color: c, background: `${c}1a`, border: `1px solid ${c}33` }}
    >
      {method}
    </span>
  );
}

export function AuthBadge({ type }: { type: string }) {
  const isPublic = type === 'Public';
  const c = isPublic ? '#2d6a4f' : '#8b5e3c';
  return (
    <span
      className="font-sc rounded-full px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[2px]"
      style={{ color: c, background: `${c}14`, border: `1px solid ${c}2e` }}
    >
      {isPublic ? 'Public' : type}
    </span>
  );
}

// ---- copy button ----
export function CopyButton({
  text,
  label = 'Copy',
  className = '',
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — no-op */
    }
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      className={`font-sc inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] transition-colors ${className}`}
      style={{
        color: copied ? '#2d6a4f' : ACCENT,
        background: copied ? 'rgba(45,106,79,.1)' : 'rgba(139,94,60,.08)',
      }}
      aria-label={copied ? 'Copied' : label}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : label}
    </button>
  );
}

// ---- JSON syntax highlighter (no dependency) ----
function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
export function highlightJson(value: unknown): string {
  const json = JSON.stringify(value, null, 2) ?? 'null';
  return escapeHtml(json).replace(
    /("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false)\b|\bnull\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'num';
      if (/^"/.test(match)) cls = /:$/.test(match.trim()) ? 'key' : 'str';
      else if (/true|false/.test(match)) cls = 'bool';
      else if (/null/.test(match)) cls = 'null';
      return `<span class="djson-${cls}">${match}</span>`;
    }
  );
}

// ---- code block (dark inset) ----
export function CodeBlock({
  code,
  json,
  language = 'text',
  title,
  download,
  maxHeight = 420,
}: {
  code?: string;
  json?: unknown;
  language?: string;
  title?: string;
  download?: { filename: string; content: string };
  maxHeight?: number;
}) {
  const isJson = json !== undefined;
  const text = isJson ? (JSON.stringify(json, null, 2) ?? 'null') : (code ?? '');
  return (
    <div className="overflow-hidden rounded-lg" style={{ border: '1px solid rgba(44,31,20,.35)' }}>
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ background: '#241a10', borderBottom: '1px solid rgba(242,235,224,.08)' }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[2px]"
          style={{ color: '#a89a86' }}
        >
          {title ?? language}
        </span>
        <div className="flex items-center gap-1.5">
          {download && <DownloadButton filename={download.filename} content={download.content} />}
          <CopyButton text={text} />
        </div>
      </div>
      <pre
        className="m-0 overflow-auto p-3.5 font-mono text-[12.5px] leading-[1.65]"
        style={{ background: '#2c1f14', color: '#f2ebe0', maxHeight }}
      >
        {isJson ? (
          <code dangerouslySetInnerHTML={{ __html: highlightJson(json) }} />
        ) : (
          <code>{text}</code>
        )}
      </pre>
    </div>
  );
}

export function DownloadButton({
  filename,
  content,
  label = 'Download',
  type = 'application/json',
}: {
  filename: string;
  content: string;
  label?: string;
  type?: string;
}) {
  const onClick = () => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-sc inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] transition-colors"
      style={{ color: '#c4956a', background: 'rgba(196,149,106,.12)' }}
    >
      <Download size={12} /> {label}
    </button>
  );
}

// ---- collapsible ----
export function Collapsible({
  title,
  subtitle,
  defaultOpen = false,
  right,
  children,
  id,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  defaultOpen?: boolean;
  right?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      id={id}
      className="scroll-mt-[150px] overflow-hidden rounded-xl"
      style={{ background: '#f7f2ea', border: `1px solid ${LINE}` }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <ChevronDown
          size={16}
          style={{
            color: ACCENT,
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform .18s',
          }}
        />
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">{title}</div>
        {right}
      </button>
      {subtitle && !open && (
        <div
          className="-mt-1 truncate px-4 pb-3 pl-[43px] font-body text-[13px]"
          style={{ color: BODY }}
        >
          {subtitle}
        </div>
      )}
      {open && (
        <div className="px-4 pb-4 pt-1" style={{ borderTop: `1px solid ${LINE}` }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ---- field table ----
export interface FieldRow {
  field: string;
  type: string;
  required?: boolean;
  nullable?: boolean;
  validation?: string;
  description: string;
}
export function FieldTable({ rows, kind }: { rows: FieldRow[]; kind: 'request' | 'response' }) {
  if (!rows.length) return null;
  return (
    <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${LINE}` }}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr style={{ background: 'rgba(139,94,60,.06)' }}>
            <Th>Field</Th>
            <Th>Type</Th>
            <Th>{kind === 'request' ? 'Required' : 'Nullable'}</Th>
            {kind === 'request' && <Th>Validation</Th>}
            <Th>Description</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.field}
              style={{
                borderTop: `1px solid ${LINE}`,
                background: i % 2 ? 'transparent' : 'rgba(255,255,255,.35)',
              }}
            >
              <Td mono ink>
                {r.field}
              </Td>
              <Td mono>{r.type}</Td>
              <Td>
                {kind === 'request' ? (
                  r.required ? (
                    <Yes />
                  ) : (
                    <span style={{ color: '#a09588' }}>optional</span>
                  )
                ) : r.nullable ? (
                  <span style={{ color: '#9b2335' }}>yes</span>
                ) : (
                  <span style={{ color: '#a09588' }}>no</span>
                )}
              </Td>
              {kind === 'request' && (
                <Td mono muted>
                  {r.validation ?? '—'}
                </Td>
              )}
              <Td>{r.description}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Th({ children }: { children: ReactNode }) {
  return (
    <th
      className="font-sc px-3 py-2 text-[10px] font-semibold uppercase tracking-[1.5px]"
      style={{ color: ACCENT }}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  mono,
  ink,
  muted,
}: {
  children: ReactNode;
  mono?: boolean;
  ink?: boolean;
  muted?: boolean;
}) {
  return (
    <td
      className={`px-3 py-2 align-top text-[12.5px] ${mono ? 'font-mono' : 'font-body'}`}
      style={{ color: ink ? INK : muted ? '#a09588' : BODY }}
    >
      {children}
    </td>
  );
}
function Yes() {
  return (
    <span className="font-semibold" style={{ color: '#9b2335' }}>
      required
    </span>
  );
}

// ---- section header ----
export function SectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
}) {
  return (
    <header className="mb-6">
      <span
        className="font-sc text-[11px] font-semibold uppercase tracking-[4px]"
        style={{ color: ACCENT }}
      >
        {eyebrow}
      </span>
      <h2
        className="font-display mb-2 mt-1 text-[30px] font-bold"
        style={{ color: INK, letterSpacing: '-0.5px' }}
      >
        {title}
      </h2>
      {intro && (
        <p className="max-w-[70ch] font-body text-[14px] leading-[1.7]" style={{ color: BODY }}>
          {intro}
        </p>
      )}
    </header>
  );
}

export function Pill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'accent' | 'sage';
}) {
  const map = {
    neutral: { c: BODY, bg: 'rgba(44,31,20,.05)', b: LINE },
    accent: { c: ACCENT, bg: 'rgba(139,94,60,.08)', b: 'rgba(139,94,60,.2)' },
    sage: { c: '#2d6a4f', bg: 'rgba(45,106,79,.08)', b: 'rgba(45,106,79,.2)' },
  }[tone];
  return (
    <span
      className="rounded px-2 py-[2px] font-mono text-[11px]"
      style={{ color: map.c, background: map.bg, border: `1px solid ${map.b}` }}
    >
      {children}
    </span>
  );
}

// ---- token styles (rendered once at layout root) ----
export function DevDocsStyles() {
  return (
    <style>{`
      .djson-key { color: #c4956a; }
      .djson-str { color: #9bb08a; }
      .djson-num { color: #d99a6c; }
      .djson-bool { color: #c98a8a; }
      .djson-null { color: #8f8578; font-style: italic; }
      .devdocs-scope :focus-visible { outline: 2px solid #8b5e3c; outline-offset: 2px; border-radius: 4px; }
      .devdocs-scope ::-webkit-scrollbar { height: 8px; width: 8px; }
      .devdocs-scope ::-webkit-scrollbar-thumb { background: rgba(139,94,60,.3); border-radius: 8px; }
    `}</style>
  );
}
