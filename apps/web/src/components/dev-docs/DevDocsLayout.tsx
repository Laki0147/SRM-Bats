'use client';
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X, ChevronRight, List } from 'lucide-react';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import {
  API_DOCS,
  FEATURES,
  DB_MODELS,
  EXTERNAL_SERVICES,
  MODULES,
  METHODS,
  modelDoc,
} from '@/lib/dev-docs';
import { DevDocsStyles } from './ui';
import {
  Overview,
  Features,
  Pages,
  Apis,
  Database,
  Authentication,
  ExternalServices,
  DataFlow,
  Architecture,
  Settings,
  type SectionProps,
} from './sections';

const INK = '#2c1f14';
const BODY = '#6b6358';
const ACCENT = '#8b5e3c';
const LINE = 'rgba(44,31,20,0.10)';
const SURFACE = '#f7f2ea';

const NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'pages', label: 'Pages' },
  { id: 'apis', label: 'APIs' },
  { id: 'database', label: 'Database' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'external', label: 'External Services' },
  { id: 'dataflow', label: 'Data Flow' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'settings', label: 'Settings' },
] as const;

type SectionId = (typeof NAV)[number]['id'];
const AUTH_FILTERS = ['all', 'Public', 'JWT'] as const;

export function DevDocsLayout() {
  const [section, setSection] = useState<SectionId>('overview');
  const [query, setQuery] = useState('');
  const [fMethod, setFMethod] = useState<string>('all');
  const [fModule, setFModule] = useState<string>('all');
  const [fAuth, setFAuth] = useState<string>('all');
  const [baseUrl, setBaseUrl] = useState('http://localhost:3001');
  const [openAll, setOpenAll] = useState(false);
  const [expandKey, setExpandKey] = useState(0);

  const q = query.trim().toLowerCase();

  const apis = useMemo(() => {
    return API_DOCS.filter((a) => {
      const hay = [
        a.name,
        a.path,
        a.purpose,
        a.module,
        a.method,
        ...a.usedIn.map((u) => `${u.label} ${u.file ?? ''}`),
        ...a.sourceRefs.map((s) => s.file),
      ]
        .join(' ')
        .toLowerCase();
      return (
        (!q || hay.includes(q)) &&
        (fMethod === 'all' || a.method === fMethod) &&
        (fModule === 'all' || a.module === fModule) &&
        (fAuth === 'all' ||
          (fAuth === 'Public' ? a.authType === 'Public' : a.authType !== 'Public'))
      );
    });
  }, [q, fMethod, fModule, fAuth]);

  const models = useMemo(() => {
    return DB_MODELS.filter(
      (m) =>
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.columns.some((c) => c.name.toLowerCase().includes(q)) ||
        (modelDoc(m.name)?.purpose ?? '').toLowerCase().includes(q)
    );
  }, [q]);

  const features = useMemo(() => {
    return FEATURES.filter(
      (f) =>
        !q ||
        [f.name, f.summary, ...f.pages, ...f.components, ...f.tables]
          .join(' ')
          .toLowerCase()
          .includes(q)
    );
  }, [q]);

  const sectionProps: SectionProps = { query: q, apis, models, features, openAll, expandKey };

  const toc = useMemo(() => {
    if (section === 'apis')
      return MODULES.filter((m) => apis.some((a) => a.module === m)).map((m) => ({
        id: `module-${m}`,
        label: m,
      }));
    if (section === 'database')
      return models.map((m) => ({ id: `model-${m.name}`, label: m.name }));
    if (section === 'features')
      return features.map((f) => ({ id: `feature-${f.id}`, label: f.name }));
    if (section === 'external')
      return EXTERNAL_SERVICES.map((s) => ({ id: `service-${s.id}`, label: s.name }));
    return [];
  }, [section, apis, models, features]);

  const counts: Partial<Record<SectionId, number>> = q
    ? { apis: apis.length, database: models.length, features: features.length }
    : {};

  const toggleAll = () => {
    setOpenAll((v) => !v);
    setExpandKey((k) => k + 1);
  };

  const activeLabel = NAV.find((n) => n.id === section)?.label ?? '';

  return (
    <div className="devdocs-scope min-h-screen" style={{ background: '#faf6f0' }}>
      <DevDocsStyles />
      <SiteNavbar />
      <main className="pt-[68px]">
        {/* sticky search + filters + breadcrumbs */}
        <div
          className="sticky top-[68px] z-30"
          style={{
            background: 'rgba(250,246,240,.92)',
            backdropFilter: 'blur(8px)',
            borderBottom: `1px solid ${LINE}`,
          }}
        >
          <div className="mx-auto max-w-[1280px] px-4 py-3 sm:px-6">
            <nav
              className="mb-2.5 flex items-center gap-1.5 font-body text-[12px]"
              style={{ color: '#a09588' }}
              aria-label="Breadcrumb"
            >
              <Link href="/" className="hover:underline" style={{ color: ACCENT }}>
                Home
              </Link>
              <ChevronRight size={12} />
              <span style={{ color: ACCENT }}>Developer Docs</span>
              <ChevronRight size={12} />
              <span style={{ color: INK }}>{activeLabel}</span>
            </nav>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#a09588' }}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search endpoints, tables, components, files…"
                  className="w-full rounded-lg py-2 pl-9 pr-9 font-body text-[13.5px] outline-none"
                  style={{ background: SURFACE, color: INK, border: `1px solid ${LINE}` }}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                    aria-label="Clear search"
                  >
                    <X size={15} style={{ color: '#a09588' }} />
                  </button>
                )}
              </div>
              {/* mobile section picker */}
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as SectionId)}
                className="rounded-lg px-3 py-2 font-body text-[13.5px] outline-none lg:hidden"
                style={{ background: SURFACE, color: INK, border: `1px solid ${LINE}` }}
              >
                {NAV.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
            {section === 'apis' && (
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <FilterChips
                  label="Method"
                  value={fMethod}
                  onChange={setFMethod}
                  options={['all', ...METHODS]}
                  render={(m) => (m === 'all' ? 'All' : m)}
                />
                <FilterChips
                  label="Auth"
                  value={fAuth}
                  onChange={setFAuth}
                  options={[...AUTH_FILTERS]}
                  render={(a) => (a === 'all' ? 'All' : a)}
                />
                <label className="flex items-center gap-1.5">
                  <span
                    className="font-sc text-[10px] font-semibold uppercase tracking-[1.5px]"
                    style={{ color: ACCENT }}
                  >
                    Module
                  </span>
                  <select
                    value={fModule}
                    onChange={(e) => setFModule(e.target.value)}
                    className="rounded px-2 py-1 font-body text-[12.5px] outline-none"
                    style={{ background: SURFACE, color: INK, border: `1px solid ${LINE}` }}
                  >
                    <option value="all">All</option>
                    {MODULES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* 3-pane body */}
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[190px_1fr_180px]">
          {/* left nav */}
          <aside className="hidden lg:block">
            <nav className="sticky top-[176px] flex flex-col gap-0.5">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSection(n.id)}
                  className="flex items-center justify-between rounded-lg px-3 py-1.5 text-left font-body text-[13.5px] transition-colors"
                  style={{
                    background: section === n.id ? 'rgba(139,94,60,.1)' : 'transparent',
                    color: section === n.id ? INK : BODY,
                    fontWeight: section === n.id ? 600 : 400,
                  }}
                >
                  {n.label}
                  {counts[n.id] !== undefined && (
                    <span
                      className="rounded-full px-1.5 font-mono text-[10px]"
                      style={{ color: ACCENT, background: 'rgba(139,94,60,.12)' }}
                    >
                      {counts[n.id]}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* content */}
          <div className="min-w-0">
            {section === 'overview' && <Overview {...sectionProps} />}
            {section === 'features' && <Features {...sectionProps} />}
            {section === 'pages' && <Pages {...sectionProps} />}
            {section === 'apis' && <Apis {...sectionProps} />}
            {section === 'database' && <Database {...sectionProps} />}
            {section === 'authentication' && <Authentication {...sectionProps} />}
            {section === 'external' && <ExternalServices {...sectionProps} />}
            {section === 'dataflow' && <DataFlow {...sectionProps} />}
            {section === 'architecture' && <Architecture {...sectionProps} />}
            {section === 'settings' && (
              <Settings
                baseUrl={baseUrl}
                onBaseUrl={setBaseUrl}
                openAll={openAll}
                onToggleAll={toggleAll}
              />
            )}
          </div>

          {/* right TOC */}
          <aside className="hidden lg:block">
            {toc.length > 0 && (
              <div className="sticky top-[176px]">
                <p
                  className="font-sc mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[2px]"
                  style={{ color: '#a09588' }}
                >
                  <List size={12} /> On this page
                </p>
                <nav className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto pr-1">
                  {toc.map((t) => (
                    <a
                      key={t.id}
                      href={`#${t.id}`}
                      className="truncate font-body text-[12.5px] leading-snug hover:underline"
                      style={{ color: BODY }}
                    >
                      {t.label}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function FilterChips<T extends string>({
  label,
  value,
  onChange,
  options,
  render,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: T[];
  render: (o: T) => string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="font-sc text-[10px] font-semibold uppercase tracking-[1.5px]"
        style={{ color: ACCENT }}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className="rounded px-2 py-[3px] font-mono text-[11px] transition-colors"
            style={{
              color: value === o ? '#f7f2ea' : BODY,
              background: value === o ? ACCENT : 'rgba(44,31,20,.05)',
              border: `1px solid ${LINE}`,
            }}
          >
            {render(o)}
          </button>
        ))}
      </div>
    </div>
  );
}
