/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */
// Barrel for the /dev-docs data layer. Merges the curated registry with the
// auto-generated Prisma schema + controller inventory, and computes a drift
// report so the curated API list stays honest against the real backend.
import { API_DOCS, FEATURES, EXTERNAL_SERVICES, MODEL_DOCS } from './registry';
import { DB_SCHEMA } from './db-schema.generated';
import { CONTROLLER_ENDPOINTS } from './endpoints.generated';
import type {
  ApiDoc,
  DbModel,
  DbEnum,
  ControllerEndpoint,
  FeatureDoc,
  ExternalServiceDoc,
  ModelDoc,
} from './types';

export * from './types';
export * from './derive';
export { API_DOCS, FEATURES, EXTERNAL_SERVICES, MODEL_DOCS };

export const DB_MODELS = DB_SCHEMA.models as unknown as DbModel[];
export const DB_ENUMS = DB_SCHEMA.enums as unknown as DbEnum[];
export const ENDPOINTS = CONTROLLER_ENDPOINTS as unknown as ControllerEndpoint[];

/** method + path, normalised so `/orders/:id` matches regardless of param name. */
const sig = (method: string, path: string) =>
  `${method.toUpperCase()} ${path.replace(/:(\w+)/g, ':param').replace(/\/+$/, '') || '/'}`;

export interface DriftReport {
  /** In the backend controllers but not in the curated registry. */
  undocumented: ControllerEndpoint[];
  /** In the curated registry but not found in the backend controllers. */
  phantom: ApiDoc[];
  inSync: boolean;
  documentedCount: number;
  codeCount: number;
}

export function computeDrift(): DriftReport {
  const codeSigs = new Set(ENDPOINTS.map((e) => sig(e.method, e.path)));
  const docSigs = new Set(API_DOCS.map((a) => sig(a.method, a.path)));
  const undocumented = ENDPOINTS.filter((e) => !docSigs.has(sig(e.method, e.path)));
  const phantom = API_DOCS.filter((a) => !codeSigs.has(sig(a.method, a.path)));
  return {
    undocumented,
    phantom,
    inSync: undocumented.length === 0 && phantom.length === 0,
    documentedCount: API_DOCS.length,
    codeCount: ENDPOINTS.length,
  };
}

export const DRIFT: DriftReport = computeDrift();

/** Distinct module names in registry order, for sidebar/filters. */
export const MODULES: string[] = [...new Set(API_DOCS.map((a) => a.module))];
export const METHODS: string[] = [...new Set(API_DOCS.map((a) => a.method))];

/** Convenience lookups. */
export const apiById = (id: string): ApiDoc | undefined => API_DOCS.find((a) => a.id === id);
export const modelByName = (name: string): DbModel | undefined =>
  DB_MODELS.find((m) => m.name === name);
export const modelDoc = (name: string): ModelDoc | undefined => MODEL_DOCS[name];
export const apisForModule = (module: string): ApiDoc[] =>
  API_DOCS.filter((a) => a.module === module);
export const featureById = (id: string): FeatureDoc | undefined =>
  FEATURES.find((f) => f.id === id);
export const serviceById = (id: string): ExternalServiceDoc | undefined =>
  EXTERNAL_SERVICES.find((s) => s.id === id);

/** Full export payload for the "Export JSON" button. */
export function fullJson() {
  return {
    generatedNote: 'Static snapshot from /dev-docs. Regenerate DB portion with `pnpm gen:docs`.',
    apis: API_DOCS,
    features: FEATURES,
    externalServices: EXTERNAL_SERVICES,
    models: DB_MODELS,
    enums: DB_ENUMS,
    modelDocs: MODEL_DOCS,
    drift: DRIFT,
  };
}
