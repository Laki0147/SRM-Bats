'use client';
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */
import { Fragment } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import type { ApiDoc, DbModel, FeatureDoc } from '@/lib/dev-docs';
import {
  API_DOCS,
  FEATURES,
  EXTERNAL_SERVICES,
  DB_MODELS,
  DB_ENUMS,
  DRIFT,
  MODULES,
  toPostmanCollection,
  toOpenApi,
  toMarkdown,
  fullJson,
  apiById,
} from '@/lib/dev-docs';
import {
  SectionHeader,
  CodeBlock,
  Pill,
  MethodChip,
  AuthBadge,
  DownloadButton,
  Collapsible,
} from './ui';
import { EndpointCard } from './EndpointCard';
import { DbModelCard } from './DbModelCard';
import { ArchitectureDiagram, DataFlowDiagram, RelationshipDiagram, FeatureMap } from './diagrams';

const INK = '#2c1f14';
const BODY = '#6b6358';
const ACCENT = '#8b5e3c';
const LINE = 'rgba(44,31,20,0.10)';

export interface SectionProps {
  query: string;
  apis: ApiDoc[];
  models: DbModel[];
  features: FeatureDoc[];
  openAll: boolean;
  expandKey: number;
}

function Stat({ n, label }: { n: number | string; label: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{ background: '#f7f2ea', border: `1px solid ${LINE}` }}
    >
      <div className="font-display text-[30px] font-bold leading-none" style={{ color: INK }}>
        {n}
      </div>
      <div className="font-sc mt-1 text-[10px] uppercase tracking-[2px]" style={{ color: ACCENT }}>
        {label}
      </div>
    </div>
  );
}

// ---------- Overview ----------
export function Overview() {
  return (
    <div>
      <SectionHeader
        eyebrow="Developer Documentation"
        title="SRM Bats — Integration Reference"
        intro="A living map of the frontend↔backend integration layer and database. APIs, features, and external services are curated in a typed registry; the database schema and controller inventory are auto-generated from source. Everything below renders statically — no runtime calls."
      />
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat n={API_DOCS.length} label="Endpoints" />
        <Stat n={DB_MODELS.length} label="DB models" />
        <Stat n={FEATURES.length} label="Features" />
        <Stat n={EXTERNAL_SERVICES.length} label="Services" />
      </div>

      <div
        className="mb-6 flex items-start gap-3 rounded-xl p-4"
        style={{
          background: DRIFT.inSync ? 'rgba(45,106,79,.07)' : 'rgba(180,83,9,.08)',
          border: `1px solid ${DRIFT.inSync ? 'rgba(45,106,79,.25)' : 'rgba(180,83,9,.3)'}`,
        }}
      >
        {DRIFT.inSync ? (
          <CheckCircle2 size={20} style={{ color: '#2d6a4f' }} />
        ) : (
          <AlertTriangle size={20} style={{ color: '#b45309' }} />
        )}
        <div>
          <p className="font-body text-[14px] font-semibold" style={{ color: INK }}>
            {DRIFT.inSync
              ? 'Registry in sync with backend controllers'
              : `${DRIFT.undocumented.length + DRIFT.phantom.length} drift discrepancies`}
          </p>
          <p className="mt-0.5 font-body text-[13px]" style={{ color: BODY }}>
            {DRIFT.documentedCount} documented endpoints · {DRIFT.codeCount} found in controllers.
            See the APIs section for details.
          </p>
        </div>
      </div>

      <h3 className="font-display mb-2 text-[20px] font-bold" style={{ color: INK }}>
        Keeping docs fresh
      </h3>
      <p className="mb-3 max-w-[70ch] font-body text-[14px] leading-[1.7]" style={{ color: BODY }}>
        The database schema (
        <code className="font-mono" style={{ color: ACCENT }}>
          db-schema.generated.ts
        </code>
        ) and controller inventory (
        <code className="font-mono" style={{ color: ACCENT }}>
          endpoints.generated.ts
        </code>
        ) regenerate from source. The generator runs automatically on
        <code className="font-mono" style={{ color: ACCENT }}>
          {' '}
          predev
        </code>{' '}
        and{' '}
        <code className="font-mono" style={{ color: ACCENT }}>
          prebuild
        </code>
        , or on demand:
      </p>
      <CodeBlock
        code={'# from repo root\npnpm gen:docs\n\n# or directly\nnode scripts/gen-dev-docs.mjs'}
        language="bash"
      />
      <p
        className="mt-3 max-w-[70ch] font-body text-[13.5px] leading-[1.7]"
        style={{ color: BODY }}
      >
        To add or change an API, edit{' '}
        <code className="font-mono" style={{ color: ACCENT }}>
          apps/web/src/lib/dev-docs/registry.ts
        </code>{' '}
        — the single source of truth. The drift report will flag any endpoint that exists in code
        but is missing from the registry (or vice-versa).
      </p>
    </div>
  );
}

// ---------- Features ----------
export function Features({ features }: SectionProps) {
  return (
    <div>
      <SectionHeader
        eyebrow="Ownership"
        title="Features"
        intro="Each feature mapped to the pages, components, APIs, tables, and services that implement it."
      />
      {features.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid gap-4">
          {features.map((f) => (
            <div key={f.id} id={`feature-${f.id}`} className="scroll-mt-[150px]">
              <FeatureMap feature={f} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Pages ----------
export function Pages({ apis }: SectionProps) {
  const map = new Map<string, { file?: string; apis: ApiDoc[] }>();
  for (const a of apis) {
    for (const u of a.usedIn) {
      if (u.kind !== 'page') continue;
      const cur = map.get(u.label) ?? { file: u.file, apis: [] };
      cur.apis.push(a);
      if (!cur.file) cur.file = u.file;
      map.set(u.label, cur);
    }
  }
  const pages = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  return (
    <div>
      <SectionHeader
        eyebrow="Frontend"
        title="Pages → APIs"
        intro="Which endpoints each user-facing page calls. Store-wrapped calls (auth, cart) are attributed to the pages that consume the store."
      />
      {pages.length === 0 ? (
        <Empty />
      ) : (
        <div className="flex flex-col gap-3">
          {pages.map(([label, info]) => (
            <div
              key={label}
              className="rounded-xl p-4"
              style={{ background: '#f7f2ea', border: `1px solid ${LINE}` }}
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-display text-[17px] font-bold" style={{ color: INK }}>
                  {label}
                </span>
                {info.file && (
                  <code className="font-mono text-[11.5px]" style={{ color: '#a09588' }}>
                    {info.file}
                  </code>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {info.apis.map((a) => (
                  <a
                    key={a.id}
                    href={`#${a.id}`}
                    className="inline-flex items-center gap-1.5 rounded px-2 py-1 font-mono text-[11.5px] hover:underline"
                    style={{
                      color: INK,
                      background: 'rgba(139,94,60,.07)',
                      border: `1px solid ${LINE}`,
                    }}
                  >
                    <MethodChip method={a.method} />
                    {a.path}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- APIs ----------
export function Apis({ apis, openAll, expandKey }: SectionProps) {
  const byModule = MODULES.map((m) => ({
    module: m,
    list: apis.filter((a) => a.module === m),
  })).filter((g) => g.list.length > 0);
  return (
    <div>
      <SectionHeader
        eyebrow="Reference"
        title="API Endpoints"
        intro="Every endpoint the app exposes: purpose, auth, where it's used, request/response specs, error codes, ready-to-run snippets, and data flow."
      />

      {!DRIFT.inSync && (
        <div
          className="mb-5 rounded-xl p-4"
          style={{ background: 'rgba(180,83,9,.08)', border: '1px solid rgba(180,83,9,.3)' }}
        >
          <p
            className="flex items-center gap-2 font-body text-[13.5px] font-semibold"
            style={{ color: '#b45309' }}
          >
            <AlertTriangle size={16} /> Drift detected
          </p>
          {DRIFT.undocumented.length > 0 && (
            <p className="mt-1 font-body text-[13px]" style={{ color: BODY }}>
              In code but undocumented:{' '}
              {DRIFT.undocumented.map((e) => `${e.method} ${e.path}`).join(', ')}
            </p>
          )}
          {DRIFT.phantom.length > 0 && (
            <p className="mt-1 font-body text-[13px]" style={{ color: BODY }}>
              Documented but not in code:{' '}
              {DRIFT.phantom.map((e) => `${e.method} ${e.path}`).join(', ')}
            </p>
          )}
        </div>
      )}

      {byModule.length === 0 ? (
        <Empty />
      ) : (
        byModule.map((g) => (
          <div key={g.module} className="mb-7">
            <h3
              id={`module-${g.module}`}
              className="font-display mb-3 scroll-mt-[150px] text-[21px] font-bold"
              style={{ color: INK }}
            >
              {g.module}{' '}
              <span className="font-mono text-[12px] font-normal" style={{ color: '#a09588' }}>
                · {g.list.length}
              </span>
            </h3>
            <div className="flex flex-col gap-2.5">
              {g.list.map((a) => (
                <EndpointCard key={`${expandKey}-${a.id}`} api={a} defaultOpen={openAll} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ---------- Database ----------
export function Database({ models, openAll, expandKey, query }: SectionProps) {
  const enums = DB_ENUMS.filter(
    (e) =>
      !query ||
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.values.some((v) => v.toLowerCase().includes(query.toLowerCase()))
  );
  return (
    <div>
      <SectionHeader
        eyebrow="Persistence"
        title="Database Schema"
        intro="Auto-generated from packages/database/prisma/schema.prisma. Columns, keys, relationships, CRUD ownership, sample records, and copyable SQL."
      />

      {!query && (
        <div className="mb-6">
          <h3 className="font-display mb-2 text-[19px] font-bold" style={{ color: INK }}>
            Entity relationships
          </h3>
          <RelationshipDiagram />
        </div>
      )}

      <h3 className="font-display mb-3 text-[19px] font-bold" style={{ color: INK }}>
        Models
      </h3>
      {models.length === 0 ? (
        <Empty />
      ) : (
        <div className="mb-7 flex flex-col gap-2.5">
          {models.map((m) => (
            <DbModelCard key={`${expandKey}-${m.name}`} model={m} defaultOpen={openAll} />
          ))}
        </div>
      )}

      {enums.length > 0 && (
        <>
          <h3 className="font-display mb-3 text-[19px] font-bold" style={{ color: INK }}>
            Enums
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {enums.map((e) => (
              <div
                key={e.name}
                className="rounded-xl p-4"
                style={{ background: '#f7f2ea', border: `1px solid ${LINE}` }}
              >
                <span className="font-mono text-[14px] font-bold" style={{ color: INK }}>
                  {e.name}
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {e.values.map((v) => (
                    <Pill key={v}>{v}</Pill>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Authentication ----------
export function Authentication() {
  const rows = API_DOCS.filter((a) => a.module !== 'System');
  return (
    <div>
      <SectionHeader
        eyebrow="Security"
        title="Authentication"
        intro="JWT Bearer auth. Access tokens are attached to every request; a 401 triggers a one-time refresh + retry."
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Info
          title="Token storage"
          body={
            <>
              Access + refresh tokens in{' '}
              <code className="font-mono" style={{ color: ACCENT }}>
                localStorage
              </code>{' '}
              as{' '}
              <code className="font-mono" style={{ color: ACCENT }}>
                srm_access_token
              </code>{' '}
              /{' '}
              <code className="font-mono" style={{ color: ACCENT }}>
                srm_refresh_token
              </code>
              .
            </>
          }
        />
        <Info
          title="Header"
          body={
            <>
              Protected requests send{' '}
              <code className="font-mono" style={{ color: ACCENT }}>
                Authorization: Bearer &lt;accessToken&gt;
              </code>
              .
            </>
          }
        />
        <Info
          title="Refresh flow"
          body={
            <>
              On{' '}
              <code className="font-mono" style={{ color: ACCENT }}>
                401
              </code>
              ,{' '}
              <code className="font-mono" style={{ color: ACCENT }}>
                apiFetch
              </code>{' '}
              calls{' '}
              <code className="font-mono" style={{ color: ACCENT }}>
                POST /auth/refresh
              </code>{' '}
              once, stores new tokens, and retries the original request a single time.
            </>
          }
        />
        <Info
          title="Guard"
          body={
            <>
              Backend uses a single{' '}
              <code className="font-mono" style={{ color: ACCENT }}>
                JwtAuthGuard
              </code>
              . Any authenticated user passes — there is no role gating today.
            </>
          }
        />
      </div>
      <h3 className="font-display mb-3 text-[19px] font-bold" style={{ color: INK }}>
        Endpoint access
      </h3>
      <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${LINE}` }}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr style={{ background: 'rgba(139,94,60,.06)' }}>
              {['Endpoint', 'Auth', 'Authorization'].map((h) => (
                <th
                  key={h}
                  className="font-sc px-3 py-2 text-[10px] font-semibold uppercase tracking-[1.5px]"
                  style={{ color: ACCENT }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => (
              <tr
                key={a.id}
                style={{
                  borderTop: `1px solid ${LINE}`,
                  background: i % 2 ? 'transparent' : 'rgba(255,255,255,.35)',
                }}
              >
                <td className="px-3 py-2">
                  <a
                    href={`#${a.id}`}
                    className="inline-flex items-center gap-1.5 font-mono text-[12.5px] hover:underline"
                    style={{ color: INK }}
                  >
                    <MethodChip method={a.method} />
                    {a.path}
                  </a>
                </td>
                <td className="px-3 py-2">
                  <AuthBadge type={a.authType} />
                </td>
                <td className="px-3 py-2 font-body text-[12.5px]" style={{ color: BODY }}>
                  {a.authorization}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Info({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ background: '#f7f2ea', border: `1px solid ${LINE}` }}>
      <h4
        className="font-sc mb-1.5 text-[11px] font-semibold uppercase tracking-[2px]"
        style={{ color: ACCENT }}
      >
        {title}
      </h4>
      <p className="font-body text-[13.5px] leading-[1.65]" style={{ color: BODY }}>
        {body}
      </p>
    </div>
  );
}

// ---------- External Services ----------
export function ExternalServices() {
  return (
    <div>
      <SectionHeader
        eyebrow="Integrations"
        title="External Services"
        intro="Third-party systems the backend talks to. Secrets live in environment variables and never reach the frontend bundle."
      />
      <div className="flex flex-col gap-4">
        {EXTERNAL_SERVICES.map((s) => (
          <div
            key={s.id}
            id={`service-${s.id}`}
            className="scroll-mt-[150px] rounded-xl p-4"
            style={{ background: '#f7f2ea', border: `1px solid ${LINE}` }}
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-display text-[19px] font-bold" style={{ color: INK }}>
                {s.name}
              </span>
              <Pill tone="accent">{s.kind}</Pill>
            </div>
            <p className="mb-3 mt-1 font-body text-[13.5px] leading-[1.65]" style={{ color: BODY }}>
              {s.usedFor}
            </p>
            <div
              className="grid gap-x-6 gap-y-2 font-body text-[13px] sm:grid-cols-2"
              style={{ color: BODY }}
            >
              <div>
                <span
                  className="font-sc mb-0.5 block text-[10px] font-semibold uppercase tracking-[1.5px]"
                  style={{ color: ACCENT }}
                >
                  Integration
                </span>
                {s.integration}
              </div>
              {s.endpointsOrDsn && (
                <div>
                  <span
                    className="font-sc mb-0.5 block text-[10px] font-semibold uppercase tracking-[1.5px]"
                    style={{ color: ACCENT }}
                  >
                    Endpoint / DSN
                  </span>
                  <code className="font-mono text-[12px]">{s.endpointsOrDsn}</code>
                </div>
              )}
              <div>
                <span
                  className="font-sc mb-0.5 block text-[10px] font-semibold uppercase tracking-[1.5px]"
                  style={{ color: ACCENT }}
                >
                  Config (env)
                </span>
                <span className="flex flex-wrap gap-1.5">
                  {s.configKeys.map((k) => (
                    <Pill key={k}>{k}</Pill>
                  ))}
                </span>
              </div>
              {s.usedByApiIds.length > 0 && (
                <div>
                  <span
                    className="font-sc mb-0.5 block text-[10px] font-semibold uppercase tracking-[1.5px]"
                    style={{ color: ACCENT }}
                  >
                    Used by
                  </span>
                  <span className="flex flex-wrap gap-1.5">
                    {s.usedByApiIds.map((id) => {
                      const a = apiById(id);
                      return a ? (
                        <a key={id} href={`#${id}`}>
                          <Pill>
                            {a.method} {a.path}
                          </Pill>
                        </a>
                      ) : null;
                    })}
                  </span>
                </div>
              )}
            </div>
            {s.notes && (
              <p className="mt-3 font-body text-[12.5px] italic" style={{ color: '#a09588' }}>
                {s.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Data Flow ----------
export function DataFlow() {
  return (
    <div>
      <SectionHeader
        eyebrow="Lifecycle"
        title="Data Flow"
        intro="How a request travels from a page to the database and back."
      />
      <DataFlowDiagram />
      <h3 className="font-display mb-3 mt-8 text-[19px] font-bold" style={{ color: INK }}>
        Per-feature flow
      </h3>
      <div className="flex flex-col gap-3">
        {FEATURES.map((f) => (
          <div
            key={f.id}
            className="rounded-xl p-4"
            style={{ background: '#f7f2ea', border: `1px solid ${LINE}` }}
          >
            <span className="font-display text-[17px] font-bold" style={{ color: INK }}>
              {f.name}
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {f.apiIds.map((id, i) => {
                const a = apiById(id);
                return a ? (
                  <Fragment key={id}>
                    <a
                      href={`#${id}`}
                      className="rounded px-2 py-1 font-mono text-[11.5px] hover:underline"
                      style={{
                        color: INK,
                        background: 'rgba(139,94,60,.07)',
                        border: `1px solid ${LINE}`,
                      }}
                    >
                      {a.method} {a.path}
                    </a>
                    {i < f.apiIds.length - 1 && (
                      <ArrowRight size={12} style={{ color: '#c4956a' }} />
                    )}
                  </Fragment>
                ) : null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Architecture ----------
export function Architecture() {
  return (
    <div>
      <SectionHeader
        eyebrow="System"
        title="Architecture"
        intro="A pnpm + Turbo monorepo: a Next.js web app, a NestJS API, and a shared Prisma database package."
      />
      <ArchitectureDiagram />
      <h3 className="font-display mb-3 mt-8 text-[19px] font-bold" style={{ color: INK }}>
        Workspace layout
      </h3>
      <CodeBlock
        language="text"
        code={[
          'srm-bats/',
          '├─ apps/',
          '│  ├─ web/        Next.js 14 App Router  → http://localhost:3000',
          '│  └─ api/        NestJS REST API        → http://localhost:3001',
          '└─ packages/',
          '   └─ database/   Prisma schema + client (@srm-bats/database → PostgreSQL)',
        ].join('\n')}
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Info
          title="Web env"
          body={
            <>
              <code className="font-mono" style={{ color: ACCENT }}>
                NEXT_PUBLIC_API_URL
              </code>{' '}
              (defaults to{' '}
              <code className="font-mono" style={{ color: ACCENT }}>
                http://localhost:3001
              </code>
              ).
            </>
          }
        />
        <Info
          title="API env"
          body={
            <>
              <code className="font-mono" style={{ color: ACCENT }}>
                PORT
              </code>
              ,{' '}
              <code className="font-mono" style={{ color: ACCENT }}>
                DATABASE_URL
              </code>
              ,{' '}
              <code className="font-mono" style={{ color: ACCENT }}>
                JWT_SECRET
              </code>
              ,{' '}
              <code className="font-mono" style={{ color: ACCENT }}>
                FRONTEND_URL
              </code>
              , Razorpay + SMTP keys.
            </>
          }
        />
      </div>
    </div>
  );
}

// ---------- Settings / Export ----------
export function Settings({
  baseUrl,
  onBaseUrl,
  openAll,
  onToggleAll,
}: {
  baseUrl: string;
  onBaseUrl: (v: string) => void;
  openAll: boolean;
  onToggleAll: () => void;
}) {
  const DEFAULT_BASE = API_DOCS[0]?.baseUrl ?? 'http://localhost:3001';
  const rebase = (s: string) =>
    baseUrl === DEFAULT_BASE ? s : s.split(DEFAULT_BASE).join(baseUrl);
  const postman = rebase(JSON.stringify(toPostmanCollection(API_DOCS), null, 2));
  const openapi = rebase(JSON.stringify(toOpenApi(API_DOCS), null, 2));
  const markdown = rebase(toMarkdown({ apis: API_DOCS, models: DB_MODELS }));
  const json = rebase(JSON.stringify(fullJson(), null, 2));
  return (
    <div>
      <SectionHeader
        eyebrow="Tools"
        title="Settings & Export"
        intro="Base URL, expand controls, and downloadable artifacts derived from the registry."
      />

      <div
        className="mb-4 rounded-xl p-4"
        style={{ background: '#f7f2ea', border: `1px solid ${LINE}` }}
      >
        <h4
          className="font-sc mb-2 text-[11px] font-semibold uppercase tracking-[2px]"
          style={{ color: ACCENT }}
        >
          Display base URL
        </h4>
        <p className="mb-2 font-body text-[12.5px]" style={{ color: BODY }}>
          Shown in snippets and endpoint chips (does not change what the app calls at runtime).
        </p>
        <div className="flex flex-wrap gap-2">
          {['http://localhost:3001', 'https://api.srmbats.com'].map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => onBaseUrl(u)}
              className="rounded px-3 py-1.5 font-mono text-[12px] transition-colors"
              style={{
                color: baseUrl === u ? '#f7f2ea' : INK,
                background: baseUrl === u ? ACCENT : 'rgba(139,94,60,.08)',
                border: `1px solid ${LINE}`,
              }}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <div
        className="mb-4 flex items-center justify-between rounded-xl p-4"
        style={{ background: '#f7f2ea', border: `1px solid ${LINE}` }}
      >
        <div>
          <h4
            className="font-sc text-[11px] font-semibold uppercase tracking-[2px]"
            style={{ color: ACCENT }}
          >
            Expand all cards
          </h4>
          <p className="mt-0.5 font-body text-[12.5px]" style={{ color: BODY }}>
            Open or collapse every endpoint & model card in one click.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleAll}
          className="font-sc rounded px-4 py-2 text-[11px] font-semibold uppercase tracking-[1.5px] transition-colors"
          style={{ color: '#f7f2ea', background: ACCENT }}
        >
          {openAll ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <h3 className="font-display mb-3 mt-6 text-[19px] font-bold" style={{ color: INK }}>
        Exports
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <ExportCard
          title="Postman collection"
          desc="Import into Postman (v2.1). Grouped by module, with an accessToken variable."
          btn={
            <DownloadButton
              filename="srm-bats.postman_collection.json"
              content={postman}
              label="Download .json"
            />
          }
        />
        <ExportCard
          title="OpenAPI 3.0"
          desc="Machine-readable spec derived from the registry. Paste into any OpenAPI validator/viewer."
          btn={
            <DownloadButton
              filename="srm-bats.openapi.json"
              content={openapi}
              label="Download .json"
            />
          }
        />
        <ExportCard
          title="Markdown"
          desc="Human-readable docs — endpoints, examples, and schema — in one file."
          btn={
            <DownloadButton
              filename="srm-bats-dev-docs.md"
              content={markdown}
              label="Download .md"
              type="text/markdown"
            />
          }
        />
        <ExportCard
          title="JSON snapshot"
          desc="The full registry + generated schema + drift report as one JSON blob."
          btn={
            <DownloadButton
              filename="srm-bats-dev-docs.json"
              content={json}
              label="Download .json"
            />
          }
        />
      </div>

      <div className="mt-4">
        <Collapsible
          title={
            <span
              className="font-sc text-[11px] font-semibold uppercase tracking-[1.5px]"
              style={{ color: ACCENT }}
            >
              Preview OpenAPI
            </span>
          }
        >
          <CodeBlock code={openapi} language="json" title="openapi.json" maxHeight={500} />
        </Collapsible>
      </div>
    </div>
  );
}
function ExportCard({ title, desc, btn }: { title: string; desc: string; btn: React.ReactNode }) {
  return (
    <div
      className="flex flex-col rounded-xl p-4"
      style={{ background: '#f7f2ea', border: `1px solid ${LINE}` }}
    >
      <h4 className="font-display text-[16px] font-bold" style={{ color: INK }}>
        {title}
      </h4>
      <p
        className="mb-3 mt-1 flex-1 font-body text-[12.5px] leading-[1.55]"
        style={{ color: BODY }}
      >
        {desc}
      </p>
      <div>{btn}</div>
    </div>
  );
}

function Empty() {
  return (
    <div
      className="rounded-xl p-8 text-center"
      style={{ background: '#f7f2ea', border: `1px dashed ${LINE}` }}
    >
      <p className="font-body text-[14px]" style={{ color: '#a09588' }}>
        No matches. Try a different search term or clear the filters.
      </p>
    </div>
  );
}
