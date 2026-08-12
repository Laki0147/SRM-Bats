'use client';
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */
import { ArrowRight, ArrowDown, Database, Server, Globe, CreditCard, Mail } from 'lucide-react';
import type { FeatureDoc } from '@/lib/dev-docs';
import { DB_MODELS, apiById, serviceById } from '@/lib/dev-docs';

const INK = '#2c1f14';
const BODY = '#6b6358';
const ACCENT = '#8b5e3c';
const LINE = 'rgba(44,31,20,0.10)';

function Node({
  children,
  tone = 'surface',
}: {
  children: React.ReactNode;
  tone?: 'surface' | 'ink' | 'accent';
}) {
  const s = {
    surface: { background: '#f7f2ea', color: INK, border: `1px solid ${LINE}` },
    ink: { background: '#2c1f14', color: '#f2ebe0', border: '1px solid #2c1f14' },
    accent: {
      background: 'rgba(139,94,60,.1)',
      color: ACCENT,
      border: '1px solid rgba(139,94,60,.3)',
    },
  }[tone];
  return (
    <div
      className="min-w-[110px] rounded-lg px-3.5 py-2.5 text-center font-body text-[13px] font-medium"
      style={s}
    >
      {children}
    </div>
  );
}

// ---- Architecture: layered system diagram ----
export function ArchitectureDiagram() {
  return (
    <div className="rounded-xl p-5" style={{ background: '#faf6f0', border: `1px solid ${LINE}` }}>
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-0">
        <div className="flex-1">
          <Node tone="surface">
            <Globe size={15} className="-mt-0.5 mr-1.5 inline" style={{ color: ACCENT }} />
            apps/web
            <div className="mt-0.5 font-mono text-[10px]" style={{ color: '#a09588' }}>
              Next.js 14 · :3000
            </div>
          </Node>
        </div>
        <Connector />
        <div className="flex-1">
          <Node tone="ink">
            <Server size={15} className="-mt-0.5 mr-1.5 inline" style={{ color: '#c4956a' }} />
            apps/api
            <div className="mt-0.5 font-mono text-[10px]" style={{ color: '#a89a86' }}>
              NestJS · :3001
            </div>
          </Node>
        </div>
        <Connector />
        <div className="flex-1">
          <Node tone="surface">
            <Database size={15} className="-mt-0.5 mr-1.5 inline" style={{ color: ACCENT }} />
            packages/database
            <div className="mt-0.5 font-mono text-[10px]" style={{ color: '#a09588' }}>
              Prisma · PostgreSQL
            </div>
          </Node>
        </div>
      </div>
      <div className="my-3 flex items-center justify-center">
        <ArrowDown
          size={16}
          style={{ color: '#c4956a' }}
          className="rotate-0 md:hidden md:-rotate-90"
        />
      </div>
      <div
        className="mt-4 grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3"
        style={{ borderTop: `1px dashed ${LINE}` }}
      >
        <p
          className="font-sc text-center text-[10px] font-semibold uppercase tracking-[2px] sm:col-span-3"
          style={{ color: '#a09588' }}
        >
          External services (called by apps/api)
        </p>
        <Node tone="accent">
          <CreditCard size={14} className="-mt-0.5 mr-1.5 inline" />
          Razorpay
        </Node>
        <Node tone="accent">
          <Database size={14} className="-mt-0.5 mr-1.5 inline" />
          PostgreSQL
        </Node>
        <Node tone="accent">
          <Mail size={14} className="-mt-0.5 mr-1.5 inline" />
          SMTP email
        </Node>
      </div>
    </div>
  );
}
function Connector() {
  return (
    <div className="flex items-center justify-center px-1">
      <ArrowRight size={18} style={{ color: '#c4956a' }} className="hidden md:block" />
      <ArrowDown size={16} style={{ color: '#c4956a' }} className="md:hidden" />
    </div>
  );
}

// ---- Data flow: canonical request lifecycle ----
export function DataFlowDiagram() {
  const layers = [
    { label: 'UI Page', sub: 'app/**/page.tsx', tone: 'surface' as const },
    { label: 'Store / Hook', sub: 'zustand · useEffect', tone: 'surface' as const },
    { label: 'API client', sub: 'lib/api.ts · apiFetch', tone: 'accent' as const },
    { label: 'Controller', sub: 'NestJS @Guard', tone: 'ink' as const },
    { label: 'Service', sub: 'business logic', tone: 'ink' as const },
    { label: 'Prisma', sub: 'PostgreSQL', tone: 'surface' as const },
  ];
  return (
    <div className="rounded-xl p-5" style={{ background: '#faf6f0', border: `1px solid ${LINE}` }}>
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:flex-wrap md:items-center md:gap-0">
        {layers.map((l, i) => (
          <div key={l.label} className="flex flex-col items-center md:flex-row">
            <div className="min-w-[130px]">
              <Node tone={l.tone}>
                {l.label}
                <div className="mt-0.5 font-mono text-[10px] opacity-70">{l.sub}</div>
              </Node>
            </div>
            {i < layers.length - 1 && <Connector />}
          </div>
        ))}
      </div>
      <p className="mt-4 font-body text-[12.5px]" style={{ color: BODY }}>
        Auth requests attach{' '}
        <code className="font-mono" style={{ color: ACCENT }}>
          Authorization: Bearer &lt;token&gt;
        </code>
        ; a 401 triggers a one-time refresh via{' '}
        <code className="font-mono" style={{ color: ACCENT }}>
          POST /auth/refresh
        </code>{' '}
        then a single retry. Product reads use ISR (
        <code className="font-mono" style={{ color: ACCENT }}>
          revalidate: 60
        </code>
        ). Each endpoint&apos;s specific flow is listed on its card.
      </p>
    </div>
  );
}

// ---- Relationship diagram: nodes + edge list ----
export function RelationshipDiagram() {
  const edges: { from: string; to: string; kind: string }[] = [];
  for (const m of DB_MODELS) {
    for (const r of m.relations) {
      if (r.references) edges.push({ from: m.name, to: r.target, kind: r.list ? '1:N' : '1:1' });
    }
  }
  return (
    <div className="rounded-xl p-5" style={{ background: '#faf6f0', border: `1px solid ${LINE}` }}>
      <div className="mb-4 flex flex-wrap gap-2">
        {DB_MODELS.map((m) => (
          <a
            key={m.name}
            href={`#model-${m.name}`}
            className="rounded-lg px-3 py-1.5 font-mono text-[12.5px] hover:underline"
            style={{ background: '#f7f2ea', color: INK, border: `1px solid ${LINE}` }}
          >
            {m.name}
          </a>
        ))}
      </div>
      <p
        className="font-sc mb-2 text-[10px] font-semibold uppercase tracking-[2px]"
        style={{ color: '#a09588' }}
      >
        Foreign-key relationships
      </p>
      <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {edges.map((e, i) => (
          <div
            key={`${e.from}-${e.to}-${i}`}
            className="flex items-center gap-2 font-mono text-[12.5px]"
            style={{ color: BODY }}
          >
            <span style={{ color: INK }}>{e.from}</span>
            <ArrowRight size={12} style={{ color: '#c4956a' }} />
            <span style={{ color: ACCENT }}>{e.to}</span>
            <span
              className="rounded px-1.5 text-[10px]"
              style={{ color: '#2d6a4f', background: 'rgba(45,106,79,.1)' }}
            >
              {e.kind}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Feature map card ----
export function FeatureMap({ feature }: { feature: FeatureDoc }) {
  const rows: { label: string; items: React.ReactNode[] }[] = [
    { label: 'Pages', items: feature.pages.map((p) => <Chip key={p}>{p}</Chip>) },
    { label: 'Components', items: feature.components.map((c) => <Chip key={c}>{c}</Chip>) },
    {
      label: 'APIs',
      items: feature.apiIds.map((id) => {
        const a = apiById(id);
        return a ? (
          <a key={id} href={`#${id}`}>
            <Chip link>
              {a.method} {a.path}
            </Chip>
          </a>
        ) : (
          <Chip key={id}>{id}</Chip>
        );
      }),
    },
    {
      label: 'Tables',
      items: feature.tables.map((t) => (
        <a key={t} href={`#model-${t}`}>
          <Chip link>{t}</Chip>
        </a>
      )),
    },
    {
      label: 'Services',
      items: feature.externalServiceIds.map((id) => (
        <Chip key={id}>{serviceById(id)?.name ?? id}</Chip>
      )),
    },
  ];
  return (
    <div className="rounded-xl p-4" style={{ background: '#f7f2ea', border: `1px solid ${LINE}` }}>
      <h3 className="font-display text-[19px] font-bold" style={{ color: INK }}>
        {feature.name}
      </h3>
      <p className="mb-3 mt-1 font-body text-[13px] leading-[1.6]" style={{ color: BODY }}>
        {feature.summary}
      </p>
      <div className="flex flex-col gap-2">
        {rows
          .filter((r) => r.items.length > 0)
          .map((r) => (
            <div key={r.label} className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline">
              <span
                className="font-sc min-w-[92px] text-[10px] font-semibold uppercase tracking-[1.5px]"
                style={{ color: ACCENT }}
              >
                {r.label}
              </span>
              <div className="flex flex-wrap gap-1.5">{r.items}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
function Chip({ children, link }: { children: React.ReactNode; link?: boolean }) {
  return (
    <span
      className={`rounded px-2 py-[2px] font-mono text-[11.5px] ${link ? 'hover:underline' : ''}`}
      style={{
        color: link ? INK : BODY,
        background: 'rgba(44,31,20,.05)',
        border: `1px solid ${LINE}`,
      }}
    >
      {children}
    </span>
  );
}
