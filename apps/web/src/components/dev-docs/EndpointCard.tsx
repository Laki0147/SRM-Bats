'use client';
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */
import { useState } from 'react';
import { ArrowRight, FileCode } from 'lucide-react';
import type { ApiDoc } from '@/lib/dev-docs';
import { toCurl, toFetch, toAxios, toPostmanItem } from '@/lib/dev-docs';
import { Collapsible, MethodChip, AuthBadge, CopyButton, CodeBlock, FieldTable, Pill } from './ui';

const INK = '#2c1f14';
const BODY = '#6b6358';
const ACCENT = '#8b5e3c';
const LINE = 'rgba(44,31,20,0.10)';

const SNIPPETS = [
  { key: 'curl', label: 'cURL', lang: 'bash', fn: toCurl },
  { key: 'fetch', label: 'fetch', lang: 'javascript', fn: toFetch },
  { key: 'axios', label: 'Axios', lang: 'javascript', fn: toAxios },
] as const;

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h4
      className="font-sc mb-2 mt-5 text-[11px] font-semibold uppercase tracking-[2px]"
      style={{ color: ACCENT }}
    >
      {children}
    </h4>
  );
}

export function EndpointCard({ api, defaultOpen = false }: { api: ApiDoc; defaultOpen?: boolean }) {
  const [tab, setTab] = useState<string>('curl');
  const active = SNIPPETS.find((s) => s.key === tab) ?? SNIPPETS[0];
  const snippet = active.fn(api);
  const postman = JSON.stringify(toPostmanItem(api), null, 2);

  return (
    <Collapsible
      id={api.id}
      defaultOpen={defaultOpen}
      title={
        <>
          <MethodChip method={api.method} />
          <code className="font-mono text-[13px] font-semibold" style={{ color: INK }}>
            {api.path}
          </code>
          <span className="hidden font-body text-[13px] sm:inline" style={{ color: '#a09588' }}>
            · {api.name}
          </span>
        </>
      }
      subtitle={api.purpose}
      right={<AuthBadge type={api.authType} />}
    >
      {/* meta row */}
      <p className="mb-3 mt-3 font-body text-[13.5px] leading-[1.7]" style={{ color: BODY }}>
        {api.purpose}
      </p>
      <div className="mb-1 flex flex-wrap gap-2">
        <Pill tone="accent">
          {api.baseUrl}
          {api.path}
        </Pill>
        <Pill>auth: {api.authorization}</Pill>
        <Pill>cache: {api.cache}</Pill>
        <Pill>retry: {api.retry}</Pill>
        <Pill>timeout: {api.timeout}</Pill>
        <CopyButton text={`${api.baseUrl}${api.path}`} label="Copy endpoint" />
      </div>

      {/* used in */}
      {api.usedIn.length > 0 && (
        <>
          <Label>Used in</Label>
          <ul className="flex flex-col gap-1">
            {api.usedIn.map((u, i) => (
              <li
                key={`${u.label}-${i}`}
                className="flex items-center gap-2 font-body text-[13px]"
                style={{ color: BODY }}
              >
                <span
                  className="font-sc rounded px-1.5 py-[1px] text-[10px] uppercase tracking-[1px]"
                  style={{ color: ACCENT, background: 'rgba(139,94,60,.08)' }}
                >
                  {u.kind}
                </span>
                <span style={{ color: INK }}>{u.label}</span>
                {u.file && (
                  <code className="font-mono text-[11px]" style={{ color: '#a09588' }}>
                    {u.file}
                  </code>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {api.usedIn.length === 0 && (
        <p className="mt-3 font-body text-[12.5px] italic" style={{ color: '#a09588' }}>
          Backend / admin-only — not called from the current frontend.
        </p>
      )}

      {/* params */}
      {(api.pathParams.length > 0 || api.queryParams.length > 0) && (
        <>
          <Label>Parameters</Label>
          <FieldTable
            kind="request"
            rows={[...api.pathParams, ...api.queryParams].map((p) => ({
              field: p.name,
              type: p.type,
              required: p.required,
              validation: api.pathParams.includes(p) ? 'path' : 'query',
              description: p.description,
            }))}
          />
        </>
      )}

      {/* request */}
      {api.requestBody !== undefined && (
        <>
          <Label>Request body</Label>
          <CodeBlock json={api.requestBody} title="application/json" />
        </>
      )}
      {api.requestFields.length > 0 && (
        <>
          <Label>Request fields</Label>
          <FieldTable kind="request" rows={api.requestFields} />
        </>
      )}

      {/* response */}
      <Label>Response · {api.successStatus}</Label>
      <CodeBlock json={api.successResponse} title={`${api.successStatus} OK`} />
      {api.responseFields.length > 0 && (
        <>
          <Label>Response fields</Label>
          <FieldTable kind="response" rows={api.responseFields} />
        </>
      )}

      {/* errors */}
      {api.errorResponses.length > 0 && (
        <>
          <Label>Errors</Label>
          <div className="flex flex-col gap-1">
            {api.errorResponses.map((e, i) => (
              <div
                key={`${e.status}-${i}`}
                className="flex items-baseline gap-2.5 font-body text-[13px]"
              >
                <code className="font-mono font-bold" style={{ color: '#9b2335' }}>
                  {e.status}
                </code>
                <span style={{ color: BODY }}>{e.meaning}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* code snippets */}
      <Label>Code</Label>
      <div className="mb-2 flex items-center gap-1">
        {SNIPPETS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setTab(s.key)}
            className="font-sc rounded px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] transition-colors"
            style={{
              color: tab === s.key ? '#f7f2ea' : ACCENT,
              background: tab === s.key ? ACCENT : 'rgba(139,94,60,.08)',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <CodeBlock code={snippet} language={active.lang} />
      <div className="mt-2">
        <Collapsible
          title={
            <span
              className="font-sc text-[11px] font-semibold uppercase tracking-[1.5px]"
              style={{ color: ACCENT }}
            >
              Postman item JSON
            </span>
          }
        >
          <CodeBlock code={postman} language="json" title="Postman v2.1 item" />
        </Collapsible>
      </div>

      {/* data flow */}
      {api.dataFlow.length > 0 && (
        <>
          <Label>Data flow</Label>
          <div className="flex flex-wrap items-center gap-1.5">
            {api.dataFlow.map((step, i) => (
              <span key={`${step}-${i}`} className="flex items-center gap-1.5">
                <span
                  className="rounded px-2 py-1 font-mono text-[11.5px]"
                  style={{
                    color: INK,
                    background: 'rgba(139,94,60,.07)',
                    border: `1px solid ${LINE}`,
                  }}
                >
                  {step}
                </span>
                {i < api.dataFlow.length - 1 && (
                  <ArrowRight size={13} style={{ color: '#c4956a' }} />
                )}
              </span>
            ))}
          </div>
        </>
      )}

      {/* source refs */}
      {api.sourceRefs.length > 0 && (
        <>
          <Label>Source</Label>
          <ul className="flex flex-col gap-1">
            {api.sourceRefs.map((s) => (
              <li
                key={s.file}
                className="flex items-center gap-2 font-mono text-[12px]"
                style={{ color: BODY }}
              >
                <FileCode size={13} style={{ color: '#a09588' }} />
                <span style={{ color: INK }}>{s.label}</span>
                <span style={{ color: '#a09588' }}>{s.file}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Collapsible>
  );
}
