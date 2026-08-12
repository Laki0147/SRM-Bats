/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */
// Pure derivations over the registry: code snippets + exportable artifacts.
// No dependencies; everything is string/JSON building so it runs in the browser.
import type { ApiDoc, DbModel } from './types';

const example = (api: ApiDoc) => api.baseUrl + api.path.replace(/:(\w+)/g, '<$1>');
const bodyStr = (api: ApiDoc) =>
  api.requestBody === undefined ? '' : JSON.stringify(api.requestBody, null, 2);

export function toCurl(api: ApiDoc): string {
  const lines = [`curl -X ${api.method} '${example(api)}'`];
  for (const [k, v] of Object.entries(api.headers)) lines.push(`  -H '${k}: ${v}'`);
  if (api.requestBody !== undefined) lines.push(`  -d '${JSON.stringify(api.requestBody)}'`);
  return lines.join(' \\\n');
}

export function toFetch(api: ApiDoc): string {
  const opts: string[] = [`method: '${api.method}'`];
  if (Object.keys(api.headers).length)
    opts.push(`headers: ${JSON.stringify(api.headers, null, 2)}`);
  if (api.requestBody !== undefined) opts.push(`body: JSON.stringify(${bodyStr(api)})`);
  return `await fetch('${example(api)}', {\n  ${opts.join(',\n  ')},\n}).then((r) => r.json());`;
}

export function toAxios(api: ApiDoc): string {
  const cfg: string[] = [];
  if (Object.keys(api.headers).length) cfg.push(`headers: ${JSON.stringify(api.headers, null, 2)}`);
  const m = api.method.toLowerCase();
  const hasBody = api.requestBody !== undefined;
  const cfgStr = cfg.length ? `, {\n  ${cfg.join(',\n  ')},\n}` : '';
  if (['post', 'put', 'patch'].includes(m)) {
    return `await axios.${m}('${example(api)}', ${hasBody ? bodyStr(api) : 'undefined'}${cfgStr});`;
  }
  return `await axios.${m}('${example(api)}'${cfgStr});`;
}

export function toPostmanItem(api: ApiDoc) {
  const url = example(api);
  return {
    name: `${api.method} ${api.path}`,
    request: {
      method: api.method,
      header: Object.entries(api.headers).map(([key, value]) => ({ key, value })),
      ...(api.requestBody !== undefined
        ? {
            body: {
              mode: 'raw',
              raw: JSON.stringify(api.requestBody, null, 2),
              options: { raw: { language: 'json' } },
            },
          }
        : {}),
      url: { raw: url, host: [api.baseUrl], path: api.path.split('/').filter(Boolean) },
      description: api.purpose,
    },
  };
}

export function toPostmanCollection(apis: ApiDoc[]) {
  const byModule = new Map<string, ApiDoc[]>();
  for (const a of apis) byModule.set(a.module, [...(byModule.get(a.module) || []), a]);
  return {
    info: {
      name: 'SRM Bats API',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      description: 'Auto-derived from /dev-docs registry. Base URL: ' + (apis[0]?.baseUrl ?? ''),
    },
    variable: [{ key: 'accessToken', value: '<paste JWT here>' }],
    item: [...byModule.entries()].map(([module, list]) => ({
      name: module,
      item: list.map(toPostmanItem),
    })),
  };
}

export function toOpenApi(apis: ApiDoc[]) {
  const paths: Record<string, Record<string, unknown>> = {};
  for (const a of apis) {
    const oaPath = a.path.replace(/:(\w+)/g, '{$1}');
    paths[oaPath] = paths[oaPath] || {};
    paths[oaPath][a.method.toLowerCase()] = {
      summary: a.name,
      description: a.purpose,
      tags: [a.module],
      security: a.authType === 'Public' ? [] : [{ bearerAuth: [] }],
      parameters: [
        ...a.pathParams.map((p) => ({
          name: p.name,
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: p.description,
        })),
        ...a.queryParams.map((p) => ({
          name: p.name,
          in: 'query',
          required: p.required,
          schema: { type: 'string' },
          description: p.description,
        })),
      ],
      ...(a.requestBody !== undefined
        ? { requestBody: { content: { 'application/json': { example: a.requestBody } } } }
        : {}),
      responses: {
        [String(a.successStatus)]: {
          description: 'Success',
          content: { 'application/json': { example: a.successResponse } },
        },
        ...Object.fromEntries(
          a.errorResponses.map((e) => [String(e.status), { description: e.meaning }])
        ),
      },
    };
  }
  return {
    openapi: '3.0.3',
    info: {
      title: 'SRM Bats API',
      version: '1.0.0',
      description: 'Auto-derived from the /dev-docs registry (no @nestjs/swagger).',
    },
    servers: [{ url: apis[0]?.baseUrl ?? 'http://localhost:3001' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
    paths,
  };
}

export function sampleSql(model: DbModel): string {
  const table = `"${model.name}"`;
  const cols = model.columns.map((c) => `"${c.name}"`).join(', ');
  const insertable = model.columns.filter((c) => !c.isId && !c.updatedAt && c.default === null);
  return [
    `-- Read`,
    `SELECT ${cols}\nFROM ${table}\nLIMIT 20;`,
    ``,
    `-- Insert`,
    `INSERT INTO ${table} (${insertable.map((c) => `"${c.name}"`).join(', ')})`,
    `VALUES (${insertable.map(() => '?').join(', ')});`,
  ].join('\n');
}

export function toMarkdown(data: { apis: ApiDoc[]; models: DbModel[] }): string {
  const out: string[] = ['# SRM Bats — Developer Documentation', ''];
  out.push('## APIs', '');
  for (const a of data.apis) {
    out.push(`### ${a.method} ${a.path} — ${a.name}`);
    out.push(`- **Module:** ${a.module}  |  **Auth:** ${a.authType}  |  **Base:** ${a.baseUrl}`);
    out.push(`- **Purpose:** ${a.purpose}`);
    if (a.usedIn.length) out.push(`- **Used in:** ${a.usedIn.map((u) => u.label).join(', ')}`);
    if (a.requestBody !== undefined)
      out.push('', '```json', JSON.stringify(a.requestBody, null, 2), '```');
    out.push('', '```json', JSON.stringify(a.successResponse, null, 2), '```', '');
  }
  out.push('## Database', '');
  for (const m of data.models) {
    out.push(`### ${m.name}`);
    for (const c of m.columns) {
      out.push(
        `- \`${c.name}\` ${c.type}${c.nullable ? '?' : ''}${c.isId ? ' [PK]' : ''}${c.isUnique ? ' [unique]' : ''}${c.isForeignKey ? ' [FK]' : ''}`
      );
    }
    out.push('');
  }
  return out.join('\n');
}

/** Trigger a client-side file download. */
export function download(filename: string, content: string, type = 'application/json'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
