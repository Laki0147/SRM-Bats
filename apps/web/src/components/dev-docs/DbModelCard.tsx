'use client';
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */
import { Key, Link2, Fingerprint } from 'lucide-react';
import type { DbModel } from '@/lib/dev-docs';
import { modelDoc, sampleSql, apiById } from '@/lib/dev-docs';
import { Collapsible, CodeBlock, Pill, CopyButton } from './ui';

const INK = '#2c1f14';
const BODY = '#6b6358';
const ACCENT = '#8b5e3c';
const LINE = 'rgba(44,31,20,0.10)';

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

const CRUD_KEYS = ['create', 'read', 'update', 'delete'] as const;

export function DbModelCard({
  model,
  defaultOpen = false,
}: {
  model: DbModel;
  defaultOpen?: boolean;
}) {
  const doc = modelDoc(model.name);
  const pk = model.columns.find((c) => c.isId)?.name;
  const uniques = model.blockAttrs.unique;

  return (
    <Collapsible
      id={`model-${model.name}`}
      defaultOpen={defaultOpen}
      title={
        <>
          <span className="font-display text-[17px] font-bold" style={{ color: INK }}>
            {model.name}
          </span>
          <span className="font-mono text-[11px]" style={{ color: '#a09588' }}>
            {model.columns.length} cols · {model.relations.length} rel
          </span>
        </>
      }
      subtitle={doc?.purpose}
    >
      {doc?.purpose && (
        <p className="mb-2 mt-3 font-body text-[13.5px] leading-[1.7]" style={{ color: BODY }}>
          {doc.purpose}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {pk && <Pill tone="accent">PK: {pk}</Pill>}
        {uniques.map((u) => (
          <Pill key={u.join()} tone="sage">
            unique({u.join(', ')})
          </Pill>
        ))}
        {model.blockAttrs.map && <Pill>@@map: {model.blockAttrs.map}</Pill>}
      </div>

      {/* columns */}
      <Label>Columns</Label>
      <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${LINE}` }}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr style={{ background: 'rgba(139,94,60,.06)' }}>
              {['Column', 'Type', 'Null', 'Attributes', 'Default'].map((h) => (
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
            {model.columns.map((c, i) => (
              <tr
                key={c.name}
                style={{
                  borderTop: `1px solid ${LINE}`,
                  background: i % 2 ? 'transparent' : 'rgba(255,255,255,.35)',
                }}
              >
                <td
                  className="px-3 py-2 align-top font-mono text-[12.5px] font-semibold"
                  style={{ color: INK }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {c.isId && <Key size={11} style={{ color: '#c4956a' }} />}
                    {c.isForeignKey && <Link2 size={11} style={{ color: '#3b6ea5' }} />}
                    {c.isUnique && !c.isId && (
                      <Fingerprint size={11} style={{ color: '#2d6a4f' }} />
                    )}
                    {c.name}
                  </span>
                </td>
                <td className="px-3 py-2 align-top font-mono text-[12.5px]" style={{ color: BODY }}>
                  {c.type}
                  {c.enum ? ` (${c.enum})` : ''}
                </td>
                <td
                  className="px-3 py-2 align-top font-body text-[12.5px]"
                  style={{ color: c.nullable ? '#9b2335' : '#a09588' }}
                >
                  {c.nullable ? 'yes' : 'no'}
                </td>
                <td
                  className="px-3 py-2 align-top font-mono text-[11.5px]"
                  style={{ color: '#a09588' }}
                >
                  {[
                    c.isId && 'PK',
                    c.isForeignKey && 'FK',
                    c.isUnique && !c.isId && 'unique',
                    c.updatedAt && 'updatedAt',
                  ]
                    .filter(Boolean)
                    .join(', ') || '—'}
                </td>
                <td
                  className="px-3 py-2 align-top font-mono text-[11.5px]"
                  style={{ color: '#a09588' }}
                >
                  {c.default ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* relations */}
      {model.relations.length > 0 && (
        <>
          <Label>Relationships</Label>
          <ul className="flex flex-col gap-1.5">
            {model.relations.map((r) => (
              <li
                key={r.field}
                className="flex flex-wrap items-center gap-2 font-body text-[13px]"
                style={{ color: BODY }}
              >
                <code className="font-mono text-[12.5px] font-semibold" style={{ color: INK }}>
                  {r.field}
                </code>
                <span style={{ color: '#a09588' }}>→</span>
                <code className="font-mono text-[12.5px]" style={{ color: ACCENT }}>
                  {r.target}
                  {r.list ? '[]' : r.optional ? '?' : ''}
                </code>
                {r.references && (
                  <Pill>
                    {r.fields?.join(', ')} → {r.references.join(', ')}
                  </Pill>
                )}
                {r.onDelete && <Pill tone="sage">onDelete: {r.onDelete}</Pill>}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* CRUD by API */}
      {doc && (
        <>
          <Label>CRUD by API</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {CRUD_KEYS.map((k) => {
              const ids = doc.crud[k];
              return (
                <div
                  key={k}
                  className="rounded-lg p-2.5"
                  style={{ background: 'rgba(255,255,255,.4)', border: `1px solid ${LINE}` }}
                >
                  <span
                    className="font-sc text-[10px] font-semibold uppercase tracking-[1.5px]"
                    style={{ color: ACCENT }}
                  >
                    {k}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {ids.length === 0 && (
                      <span className="font-body text-[12px] italic" style={{ color: '#a09588' }}>
                        none
                      </span>
                    )}
                    {ids.map((id) => {
                      const a = apiById(id);
                      return a ? (
                        <a
                          key={id}
                          href={`#${id}`}
                          className="rounded px-1.5 py-[2px] font-mono text-[11px] hover:underline"
                          style={{ color: INK, background: 'rgba(139,94,60,.08)' }}
                        >
                          {a.method} {a.path}
                        </a>
                      ) : null;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* sample + SQL */}
      {doc?.sample && (
        <>
          <Label>Sample record</Label>
          <CodeBlock json={doc.sample} title={`${model.name} (example)`} />
        </>
      )}
      <div className="mb-2 mt-5 flex items-center justify-between">
        <h4
          className="font-sc text-[11px] font-semibold uppercase tracking-[2px]"
          style={{ color: ACCENT }}
        >
          Sample SQL
        </h4>
        <CopyButton text={sampleSql(model)} label="Copy SQL" />
      </div>
      <CodeBlock code={sampleSql(model)} language="sql" />
    </Collapsible>
  );
}
