# Developer Documentation (`/dev-docs`)

An internal, in-app reference for the SRM Bats integration layer and database.
Reachable at **`http://localhost:3000/dev-docs`** — deliberately **not** in the
site navbar and marked `robots: noindex`.

## How it stays in sync (hybrid model)

| Data                                                    | Source                                               | Sync                                      |
| ------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------- |
| **Database schema** (`db-schema.generated.ts`)          | Parsed from `packages/database/prisma/schema.prisma` | **Auto-generated**                        |
| **Controller inventory** (`endpoints.generated.ts`)     | Scanned from `apps/api/src/**/*.controller.ts`       | **Auto-generated** (drift detection only) |
| **APIs / features / external services** (`registry.ts`) | Hand-curated from the codebase                       | **Manual** — the one place to edit        |

The generator runs automatically on `predev` and `prebuild` (see
`apps/web/package.json`), or on demand:

```bash
pnpm gen:docs          # from repo root
node scripts/gen-dev-docs.mjs
```

## Drift detection

`index.ts → computeDrift()` compares the curated `API_DOCS` against the
generated controller list (matching on `METHOD + path`, param-name agnostic).
The **Overview** and **APIs** sections surface any endpoint that is:

- **Undocumented** — in the controllers but missing from `registry.ts`, or
- **Phantom** — in `registry.ts` but not found in the controllers.

Keep the banner green: when you add or change a backend endpoint, add/update
its entry in `registry.ts`.

## File map

```
apps/web/src/lib/dev-docs/
├─ types.ts                  shared TypeScript types
├─ registry.ts               curated APIs, features, external services, model docs  ← EDIT HERE
├─ derive.ts                 pure exporters: cURL / fetch / Axios / Postman / OpenAPI / Markdown / SQL
├─ index.ts                  barrel + drift report + lookups
├─ db-schema.generated.ts    AUTO-GENERATED — do not edit
└─ endpoints.generated.ts    AUTO-GENERATED — do not edit

apps/web/src/components/dev-docs/
├─ ui.tsx                    primitives (CopyButton, CodeBlock, Collapsible, FieldTable, chips)
├─ EndpointCard.tsx          one API endpoint (specs, snippets, data flow)
├─ DbModelCard.tsx           one DB model (columns, relations, CRUD, sample, SQL)
├─ diagrams.tsx              architecture / data-flow / relationship / feature-map
├─ sections.tsx              the ten documentation sections
└─ DevDocsLayout.tsx         orchestrator: sidebar, search, filters, TOC, breadcrumbs

apps/web/src/app/dev-docs/page.tsx   route + noindex metadata
scripts/gen-dev-docs.mjs             the generator
```

## Exports

The **Settings** section builds and downloads, all from the registry (no
`@nestjs/swagger`): a Postman v2.1 collection, an OpenAPI 3.0 spec, a Markdown
doc, and a full JSON snapshot.
