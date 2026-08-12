// Shared types for the /dev-docs registry (hand-curated) and the generated
// data. Kept dependency-free so it can be imported from anywhere.

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type AuthType = 'JWT' | 'Bearer' | 'Public';

export interface UsedIn {
  /** page | route | component | hook | store | service */
  kind: 'page' | 'route' | 'component' | 'hook' | 'store' | 'service';
  label: string;
  /** repo-relative source path, e.g. apps/web/src/app/checkout/page.tsx */
  file?: string;
}

export interface ParamSpec {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface FieldSpec {
  field: string;
  type: string;
  /** request: whether required. */
  required?: boolean;
  /** response: whether nullable. */
  nullable?: boolean;
  /** validation decorators / rules, e.g. "@IsEmail, @IsNotEmpty". */
  validation?: string;
  description: string;
}

export interface ErrorResponse {
  status: number;
  meaning: string;
}

export interface SourceRef {
  label: string;
  file: string;
}

export interface ApiDoc {
  id: string; // stable slug, e.g. "orders-create"
  name: string;
  purpose: string;
  module: string; // Auth, Products, Cart, Orders, Addresses, Payment, System
  method: HttpMethod;
  path: string; // e.g. /orders/:id
  baseUrl: string; // http://localhost:3001
  version: string; // v1
  authType: AuthType;
  authorization: string; // human note, e.g. "Owner only" / "Any logged-in user"
  timeout: string;
  retry: string;
  cache: string;
  usedIn: UsedIn[];
  headers: Record<string, string>;
  queryParams: ParamSpec[];
  pathParams: ParamSpec[];
  requestBody?: unknown; // JSON example (object) or null
  requestFields: FieldSpec[];
  successStatus: number;
  successResponse: unknown; // JSON example
  responseFields: FieldSpec[];
  errorResponses: ErrorResponse[];
  sourceRefs: SourceRef[];
  dataFlow: string[]; // ordered steps UI -> ... -> DB
}

export interface FeatureDoc {
  id: string;
  name: string;
  summary: string;
  pages: string[];
  components: string[];
  apiIds: string[]; // references ApiDoc.id
  tables: string[]; // Prisma model names
  externalServiceIds: string[];
}

export interface ExternalServiceDoc {
  id: string;
  name: string;
  kind: string; // Payment gateway, Database, Email
  usedFor: string;
  integration: string; // how it's called
  configKeys: string[]; // env vars
  endpointsOrDsn?: string;
  usedByApiIds: string[];
  notes?: string;
}

// ---- generated data shapes (mirror scripts/gen-dev-docs.mjs output) ----
export interface DbColumn {
  name: string;
  type: string;
  enum: string | null;
  nullable: boolean;
  isId: boolean;
  isUnique: boolean;
  isForeignKey: boolean;
  default: string | null;
  updatedAt: boolean;
}
export interface DbRelation {
  field: string;
  target: string;
  list: boolean;
  optional: boolean;
  fields: string[] | null;
  references: string[] | null;
  onDelete: string | null;
}
export interface DbModel {
  name: string;
  columns: DbColumn[];
  relations: DbRelation[];
  blockAttrs: {
    unique: string[][];
    index: string[][];
    map: string | null;
    id: string[];
  };
}
export interface DbEnum {
  name: string;
  values: string[];
}
export interface ControllerEndpoint {
  method: string;
  path: string;
  guard: string;
  roles: string | null;
  httpCode: string | null;
  handler: string;
  file: string;
}

/** Per-model documentation overlay (purpose + which APIs CRUD it). */
export interface ModelDoc {
  purpose: string;
  usedBy: string[]; // pages/features
  crud: { create: string[]; read: string[]; update: string[]; delete: string[] }; // ApiDoc ids
  sample: Record<string, unknown>;
}
