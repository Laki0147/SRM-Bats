// Curated source of truth for /dev-docs — APIs, features, external services,
// and per-model overlays. Authored from a full read of apps/api controllers,
// DTOs and services + the apps/web api client. To add an API, append an entry
// to API_DOCS; the drift report (index.ts) flags any endpoint that exists in
// the backend but is missing here (or vice-versa).
//
// Facts of record: backend NestJS at http://localhost:3001, NO global prefix,
// NO /api version segment (version label "v1" is informational). The ONLY auth
// guard implemented is JwtAuthGuard — there is no role/admin gating anywhere,
// so product-CRUD endpoints are protected by login alone.

import type { ApiDoc, ExternalServiceDoc, FeatureDoc, ModelDoc } from './types';

const BASE = 'http://localhost:3001';
const VER = 'v1';

const JWT_HEADERS = {
  Authorization: 'Bearer <accessToken>',
  'Content-Type': 'application/json',
};
const JWT_NOBODY = { Authorization: 'Bearer <accessToken>' };
const PUBLIC_JSON = { 'Content-Type': 'application/json' };

const RETRY_AUTH =
  'Automatic: on a 401 the client calls POST /auth/refresh once, then retries the original request (apiFetch).';
const RETRY_NONE = 'None.';
const TIMEOUT = 'None set (browser default).';

/** Fill shared defaults so entries stay terse. */
function api(
  d: Partial<ApiDoc> & Pick<ApiDoc, 'id' | 'name' | 'module' | 'method' | 'path'>
): ApiDoc {
  return {
    baseUrl: BASE,
    version: VER,
    authType: 'JWT',
    authorization: 'Any authenticated user.',
    timeout: TIMEOUT,
    retry: RETRY_AUTH,
    cache: 'None.',
    purpose: '',
    usedIn: [],
    headers: JWT_NOBODY,
    queryParams: [],
    pathParams: [],
    requestFields: [],
    successStatus: 200,
    successResponse: {},
    responseFields: [],
    errorResponses: [],
    sourceRefs: [],
    dataFlow: [],
    ...d,
  };
}

const ERR_AUTH = {
  status: 401,
  meaning: 'Missing/expired/invalid access token (JwtAuthGuard rejects).',
};
const ERR_VALIDATION = {
  status: 400,
  meaning:
    'Body failed validation, or contained a non-whitelisted field (ValidationPipe forbidNonWhitelisted).',
};
const ERR_SERVER = { status: 500, meaning: 'Unhandled server error.' };

export const API_DOCS: ApiDoc[] = [
  // ------------------------------------------------------------------ System
  api({
    id: 'system-root',
    name: 'API root',
    module: 'System',
    method: 'GET',
    path: '/',
    authType: 'Public',
    authorization: 'Public.',
    retry: RETRY_NONE,
    purpose: 'Liveness string — confirms the API process is up.',
    headers: {},
    successResponse: 'SRM Bats API is running!',
    responseFields: [
      { field: '(body)', type: 'string', nullable: false, description: 'Plain-text banner.' },
    ],
    errorResponses: [ERR_SERVER],
    sourceRefs: [{ label: 'app.controller.ts', file: 'apps/api/src/app.controller.ts' }],
    dataFlow: ['GET / → AppController.getHello() → static string'],
  }),
  api({
    id: 'system-health',
    name: 'Health check',
    module: 'System',
    method: 'GET',
    path: '/health',
    authType: 'Public',
    authorization: 'Public.',
    retry: RETRY_NONE,
    purpose: 'Uptime probe for monitoring / load balancers.',
    headers: {},
    successResponse: { status: 'ok', timestamp: '2026-07-26T10:00:00.000Z' },
    responseFields: [
      { field: 'status', type: 'string', nullable: false, description: "Always 'ok'." },
      {
        field: 'timestamp',
        type: 'string (ISO)',
        nullable: false,
        description: 'Server time at response.',
      },
    ],
    errorResponses: [ERR_SERVER],
    sourceRefs: [{ label: 'app.controller.ts', file: 'apps/api/src/app.controller.ts' }],
    dataFlow: ['GET /health → AppController.health() → { status, timestamp }'],
  }),

  // -------------------------------------------------------------------- Auth
  api({
    id: 'auth-register',
    name: 'Register',
    module: 'Auth',
    method: 'POST',
    path: '/auth/register',
    authType: 'Public',
    authorization: 'Public.',
    retry: RETRY_NONE,
    purpose: 'Create a customer account and return JWTs so the user is logged in immediately.',
    usedIn: [
      {
        kind: 'component',
        label: 'LoginModal (Sign Up tab)',
        file: 'apps/web/src/components/layout/login-modal.tsx',
      },
      { kind: 'store', label: 'auth-store.register()', file: 'apps/web/src/lib/auth-store.ts' },
    ],
    headers: PUBLIC_JSON,
    requestBody: { email: 'you@example.com', password: 'atleast8chars', name: 'Demo User' },
    requestFields: [
      {
        field: 'email',
        type: 'string',
        required: true,
        validation: '@IsEmail, @IsNotEmpty',
        description: 'Unique account email.',
      },
      {
        field: 'password',
        type: 'string',
        required: true,
        validation: '@IsString, @MinLength(8)',
        description: 'Plain password (bcrypt-hashed server-side).',
      },
      {
        field: 'name',
        type: 'string',
        required: true,
        validation: '@IsString, @IsNotEmpty',
        description: 'Full name; split into firstName / lastName.',
      },
    ],
    successStatus: 201,
    successResponse: {
      user: {
        id: 'cuid',
        email: 'you@example.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'CUSTOMER',
        createdAt: '2026-07-26T10:00:00.000Z',
        name: 'Demo User',
      },
      accessToken: '<jwt 15m>',
      refreshToken: '<jwt 7d>',
    },
    responseFields: [
      {
        field: 'user',
        type: 'object',
        nullable: false,
        description: 'Created user (no passwordHash). Includes computed `name`.',
      },
      {
        field: 'accessToken',
        type: 'string (JWT)',
        nullable: false,
        description: 'Signed with JWT_SECRET, 15m, payload { sub, email }.',
      },
      {
        field: 'refreshToken',
        type: 'string (JWT)',
        nullable: false,
        description: 'Signed with JWT_REFRESH_SECRET, 7d.',
      },
    ],
    errorResponses: [
      ERR_VALIDATION,
      { status: 409, meaning: 'Email already registered (ConflictException).' },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'auth.controller.ts', file: 'apps/api/src/auth/auth.controller.ts' },
      { label: 'auth.service.ts', file: 'apps/api/src/auth/auth.service.ts' },
      { label: 'register.dto.ts', file: 'apps/api/src/auth/dto/register.dto.ts' },
      { label: 'authApi.register', file: 'apps/web/src/lib/api.ts' },
    ],
    dataFlow: [
      'LoginModal → auth-store.register() → authApi.register() → POST /auth/register → AuthService.register() → INSERT User → { user, tokens }',
    ],
  }),
  api({
    id: 'auth-login',
    name: 'Login',
    module: 'Auth',
    method: 'POST',
    path: '/auth/login',
    authType: 'Public',
    authorization: 'Public.',
    retry: RETRY_NONE,
    purpose: 'Authenticate with email/password and return JWTs + user.',
    usedIn: [
      {
        kind: 'component',
        label: 'LoginModal (Login tab)',
        file: 'apps/web/src/components/layout/login-modal.tsx',
      },
      { kind: 'store', label: 'auth-store.login()', file: 'apps/web/src/lib/auth-store.ts' },
    ],
    headers: PUBLIC_JSON,
    requestBody: { email: 'demo@srmbats.com', password: 'demo12345' },
    requestFields: [
      {
        field: 'email',
        type: 'string',
        required: true,
        validation: '@IsEmail, @IsNotEmpty',
        description: 'Account email.',
      },
      {
        field: 'password',
        type: 'string',
        required: true,
        validation: '@IsString, @IsNotEmpty',
        description: 'Account password.',
      },
    ],
    successStatus: 200,
    successResponse: {
      user: {
        id: 'cuid',
        email: 'demo@srmbats.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'CUSTOMER',
        createdAt: '2026-07-26T10:00:00.000Z',
      },
      accessToken: '<jwt 15m>',
      refreshToken: '<jwt 7d>',
    },
    responseFields: [
      {
        field: 'user',
        type: 'object',
        nullable: false,
        description:
          'Authenticated user. NOTE: unlike register/profile, does NOT include computed `name`.',
      },
      {
        field: 'accessToken',
        type: 'string (JWT)',
        nullable: false,
        description: 'Access token (15m).',
      },
      {
        field: 'refreshToken',
        type: 'string (JWT)',
        nullable: false,
        description: 'Refresh token (7d).',
      },
    ],
    errorResponses: [
      ERR_VALIDATION,
      { status: 401, meaning: 'Invalid credentials (UnauthorizedException).' },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'auth.controller.ts', file: 'apps/api/src/auth/auth.controller.ts' },
      { label: 'auth.service.ts', file: 'apps/api/src/auth/auth.service.ts' },
      { label: 'login.dto.ts', file: 'apps/api/src/auth/dto/login.dto.ts' },
      { label: 'authApi.login', file: 'apps/web/src/lib/api.ts' },
    ],
    dataFlow: [
      'LoginModal → auth-store.login() → authApi.login() → POST /auth/login → AuthService.login()/validateUser() → { user, tokens } → tokenStorage.set()',
    ],
  }),
  api({
    id: 'auth-refresh',
    name: 'Refresh tokens',
    module: 'Auth',
    method: 'POST',
    path: '/auth/refresh',
    authType: 'Public',
    authorization: 'Public (requires a valid refresh token in the body).',
    retry: RETRY_NONE,
    purpose:
      'Exchange a valid refresh token for a fresh access+refresh pair. Called automatically by apiFetch on a 401.',
    usedIn: [{ kind: 'service', label: 'apiFetch() 401 handler', file: 'apps/web/src/lib/api.ts' }],
    headers: PUBLIC_JSON,
    requestBody: { refreshToken: '<jwt 7d>' },
    requestFields: [
      {
        field: 'refreshToken',
        type: 'string (JWT)',
        required: true,
        validation: "@Body('refreshToken') — read directly, no DTO",
        description: 'The 7-day refresh token.',
      },
    ],
    successStatus: 200,
    successResponse: { accessToken: '<jwt 15m>', refreshToken: '<jwt 7d>' },
    responseFields: [
      {
        field: 'accessToken',
        type: 'string (JWT)',
        nullable: false,
        description: 'New access token.',
      },
      {
        field: 'refreshToken',
        type: 'string (JWT)',
        nullable: false,
        description: 'New refresh token.',
      },
    ],
    errorResponses: [
      { status: 400, meaning: 'refreshToken missing (BadRequestException).' },
      { status: 401, meaning: 'Invalid/expired refresh token (UnauthorizedException).' },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'auth.controller.ts', file: 'apps/api/src/auth/auth.controller.ts' },
      { label: 'auth.service.ts', file: 'apps/api/src/auth/auth.service.ts' },
    ],
    dataFlow: [
      'apiFetch() gets 401 → authApi via POST /auth/refresh → AuthService.refreshToken() (jwt.verify) → new tokens → retry original request',
    ],
  }),
  api({
    id: 'auth-profile',
    name: 'Get profile',
    module: 'Auth',
    method: 'GET',
    path: '/auth/profile',
    purpose:
      'Return the current user derived from the access token (hydrates the auth store on load).',
    authorization: 'Owner (the token subject).',
    usedIn: [
      {
        kind: 'component',
        label: 'SiteNavbar (loadProfile)',
        file: 'apps/web/src/components/landing/SiteNavbar.tsx',
      },
      { kind: 'store', label: 'auth-store.loadProfile()', file: 'apps/web/src/lib/auth-store.ts' },
    ],
    successResponse: {
      id: 'cuid',
      email: 'demo@srmbats.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'CUSTOMER',
      createdAt: '2026-07-26T10:00:00.000Z',
      name: 'Demo User',
    },
    responseFields: [
      { field: 'id', type: 'string', nullable: false, description: 'User id.' },
      { field: 'email', type: 'string', nullable: false, description: 'Email.' },
      { field: 'firstName', type: 'string', nullable: true, description: 'First name.' },
      { field: 'lastName', type: 'string', nullable: true, description: 'Last name.' },
      {
        field: 'role',
        type: 'UserRole',
        nullable: false,
        description: 'CUSTOMER | ADMIN | SUPER_ADMIN (never enforced by any guard).',
      },
      { field: 'name', type: 'string', nullable: false, description: 'Computed full name.' },
    ],
    errorResponses: [ERR_AUTH, ERR_SERVER],
    sourceRefs: [
      { label: 'auth.controller.ts', file: 'apps/api/src/auth/auth.controller.ts' },
      { label: 'jwt.strategy.ts', file: 'apps/api/src/auth/strategies/jwt.strategy.ts' },
      { label: 'authApi.getProfile', file: 'apps/web/src/lib/api.ts' },
    ],
    dataFlow: [
      'SiteNavbar → auth-store.loadProfile() → authApi.getProfile() → GET /auth/profile → JwtAuthGuard → JwtStrategy.validate() → validateUserById() → req.user',
    ],
  }),

  // ---------------------------------------------------------------- Products
  api({
    id: 'products-list',
    name: 'List products',
    module: 'Products',
    method: 'GET',
    path: '/products',
    authType: 'Public',
    authorization: 'Public.',
    retry: RETRY_NONE,
    cache: 'Next.js ISR — fetched with { next: { revalidate: 60 } } (60s).',
    purpose: 'Paginated, filterable catalogue of active products for the shop grid.',
    usedIn: [
      {
        kind: 'component',
        label: 'ProductsGrid',
        file: 'apps/web/src/components/product/ProductsGrid.tsx',
      },
      { kind: 'route', label: '/products', file: 'apps/web/src/app/products/page.tsx' },
      { kind: 'service', label: 'productsApi.fetchAll', file: 'apps/web/src/lib/api.ts' },
    ],
    headers: {},
    queryParams: [
      {
        name: 'search',
        type: 'string',
        required: false,
        description: 'Case-insensitive name/description contains.',
      },
      { name: 'category', type: 'string', required: false, description: 'Category slug filter.' },
      {
        name: 'featured',
        type: 'boolean',
        required: false,
        description: "'true' → featured only.",
      },
      { name: 'minPrice', type: 'number', required: false, description: 'Lower price bound (≥0).' },
      { name: 'maxPrice', type: 'number', required: false, description: 'Upper price bound (≥0).' },
      { name: 'page', type: 'number', required: false, description: 'Page (default 1).' },
      { name: 'limit', type: 'number', required: false, description: 'Page size (default 12).' },
      {
        name: 'sortBy',
        type: 'string',
        required: false,
        description: 'createdAt | price | name | stock (default createdAt).',
      },
      {
        name: 'sortOrder',
        type: 'string',
        required: false,
        description: 'asc | desc (default desc).',
      },
    ],
    successResponse: {
      data: [
        {
          id: 'cuid',
          name: 'The Maestro',
          slug: 'the-maestro',
          price: 38000,
          stock: 4,
          category: { id: 'c', name: 'English Willow', slug: 'english-willow' },
          brand: { id: 'b', name: 'SRM', slug: 'srm' },
          images: [{ url: '/main.png', order: 0 }],
          specifications: [],
          _count: { reviews: 12 },
        },
      ],
      meta: { total: 24, page: 1, limit: 12, totalPages: 2 },
    },
    responseFields: [
      {
        field: 'data',
        type: 'Product[]',
        nullable: false,
        description: 'Products with category, brand, first image, specs, review count.',
      },
      { field: 'meta.total', type: 'number', nullable: false, description: 'Total matching rows.' },
      {
        field: 'meta.page / limit / totalPages',
        type: 'number',
        nullable: false,
        description: 'Pagination metadata.',
      },
    ],
    errorResponses: [ERR_VALIDATION, ERR_SERVER],
    sourceRefs: [
      { label: 'products.controller.ts', file: 'apps/api/src/products/products.controller.ts' },
      { label: 'products.service.ts', file: 'apps/api/src/products/products.service.ts' },
      { label: 'query-product.dto.ts', file: 'apps/api/src/products/dto/query-product.dto.ts' },
    ],
    dataFlow: [
      'ProductsGrid → productsApi.fetchAll() → GET /products?… → ProductsService.findAll() → SELECT Product WHERE isActive → { data, meta }',
    ],
  }),
  api({
    id: 'products-featured',
    name: 'Featured products',
    module: 'Products',
    method: 'GET',
    path: '/products/featured',
    authType: 'Public',
    authorization: 'Public.',
    retry: RETRY_NONE,
    cache: 'Next.js ISR — revalidate 60s.',
    purpose: 'Up to 8 featured active products for home/related sections.',
    usedIn: [
      {
        kind: 'component',
        label: 'ProductDetail (related)',
        file: 'apps/web/src/components/product/ProductDetail.tsx',
      },
      { kind: 'service', label: 'productsApi.fetchFeatured', file: 'apps/web/src/lib/api.ts' },
    ],
    headers: {},
    successResponse: [
      {
        id: 'cuid',
        name: 'The Maestro',
        slug: 'the-maestro',
        price: 38000,
        category: { id: 'c', name: 'English Willow', slug: 'english-willow' },
        images: [{ url: '/main.png' }],
        _count: { reviews: 12 },
      },
    ],
    responseFields: [
      {
        field: '(array)',
        type: 'Product[]',
        nullable: false,
        description: 'Featured products (category, first image, review count).',
      },
    ],
    errorResponses: [ERR_SERVER],
    sourceRefs: [
      { label: 'products.controller.ts', file: 'apps/api/src/products/products.controller.ts' },
      { label: 'products.service.ts', file: 'apps/api/src/products/products.service.ts' },
    ],
    dataFlow: [
      'productsApi.fetchFeatured() → GET /products/featured → ProductsService.findFeatured() → SELECT Product WHERE isActive AND isFeatured LIMIT 8',
    ],
  }),
  api({
    id: 'products-detail',
    name: 'Product detail',
    module: 'Products',
    method: 'GET',
    path: '/products/:slug',
    authType: 'Public',
    authorization: 'Public.',
    retry: RETRY_NONE,
    cache: 'Next.js ISR — revalidate 60s.',
    purpose: 'Full product record (images, specs, variants, recent reviews) for the product page.',
    usedIn: [
      {
        kind: 'route',
        label: '/products/[slug]',
        file: 'apps/web/src/app/products/[slug]/page.tsx',
      },
      {
        kind: 'component',
        label: 'ProductDetail',
        file: 'apps/web/src/components/product/ProductDetail.tsx',
      },
      { kind: 'service', label: 'productsApi.fetchOne', file: 'apps/web/src/lib/api.ts' },
    ],
    headers: {},
    pathParams: [{ name: 'slug', type: 'string', required: true, description: 'Product slug.' }],
    successResponse: {
      id: 'cuid',
      name: 'The Maestro',
      slug: 'the-maestro',
      description: '…',
      price: 38000,
      stock: 4,
      category: { id: 'c', name: 'English Willow', slug: 'english-willow' },
      brand: { id: 'b', name: 'SRM', slug: 'srm' },
      images: [{ url: '/main.png', order: 0 }],
      specifications: [{ key: 'Weight', value: '1180g' }],
      variants: [],
      reviews: [{ rating: 5, title: 'Superb', user: { firstName: 'Arjun', lastName: 'M' } }],
      _count: { reviews: 12 },
    },
    responseFields: [
      {
        field: 'images / specifications / variants',
        type: 'array',
        nullable: false,
        description: 'Full related lists.',
      },
      {
        field: 'reviews',
        type: 'array',
        nullable: false,
        description: 'Up to 10 recent reviews with reviewer first/last name.',
      },
      {
        field: '_count.reviews',
        type: 'number',
        nullable: false,
        description: 'Total review count.',
      },
    ],
    errorResponses: [
      { status: 404, meaning: "Product '<slug>' not found or inactive (NotFoundException)." },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'products.controller.ts', file: 'apps/api/src/products/products.controller.ts' },
      { label: 'products.service.ts', file: 'apps/api/src/products/products.service.ts' },
    ],
    dataFlow: [
      '/products/[slug] → productsApi.fetchOne(slug) → GET /products/:slug → ProductsService.findOne() → SELECT Product + relations',
    ],
  }),
  api({
    id: 'products-create',
    name: 'Create product',
    module: 'Products',
    method: 'POST',
    path: '/products',
    authorization:
      '⚠ Any authenticated user (JWT only — no role check despite being admin-style CRUD).',
    purpose:
      'Create a product with nested images/specs/variants. Backend/admin operation — not called from the storefront UI.',
    headers: JWT_HEADERS,
    requestBody: {
      name: 'The Maestro',
      slug: 'the-maestro',
      price: 38000,
      sku: 'SRM-MAE-01',
      categoryId: 'cuid',
      stock: 10,
      images: [{ url: '/main.png', order: 0 }],
      specifications: [{ key: 'Weight', value: '1180g' }],
      variants: [],
    },
    requestFields: [
      {
        field: 'name',
        type: 'string',
        required: true,
        validation: '@IsString',
        description: 'Display name.',
      },
      {
        field: 'slug',
        type: 'string',
        required: true,
        validation: '@IsString',
        description: 'Unique slug.',
      },
      {
        field: 'description',
        type: 'string',
        required: false,
        validation: '@IsString @IsOptional',
        description: 'Long description.',
      },
      {
        field: 'price',
        type: 'number',
        required: true,
        validation: '@IsNumber @Min(0)',
        description: 'Price (₹).',
      },
      {
        field: 'compareAtPrice',
        type: 'number',
        required: false,
        validation: '@IsNumber @Min(0) @IsOptional',
        description: 'Strikethrough price.',
      },
      {
        field: 'sku',
        type: 'string',
        required: true,
        validation: '@IsString',
        description: 'Unique SKU.',
      },
      {
        field: 'stock',
        type: 'number',
        required: false,
        validation: '@IsInt @Min(0) @IsOptional',
        description: 'Units in stock.',
      },
      {
        field: 'categoryId',
        type: 'string',
        required: true,
        validation: '@IsString',
        description: 'FK → Category.',
      },
      {
        field: 'brandId',
        type: 'string',
        required: false,
        validation: '@IsString @IsOptional',
        description: 'FK → Brand.',
      },
      {
        field: 'isActive / isFeatured',
        type: 'boolean',
        required: false,
        validation: '@IsBoolean @IsOptional',
        description: 'Flags.',
      },
      {
        field: 'images[]',
        type: 'ProductImageDto[]',
        required: false,
        validation: '@ValidateNested @Type',
        description: '{ url, alt?, order? }.',
      },
      {
        field: 'specifications[]',
        type: 'ProductSpecDto[]',
        required: false,
        validation: '@ValidateNested @Type',
        description: '{ key, value }.',
      },
      {
        field: 'variants[]',
        type: 'ProductVariantDto[]',
        required: false,
        validation: '@ValidateNested @Type',
        description: '{ name, sku, price, stock }.',
      },
    ],
    successStatus: 201,
    successResponse: {
      id: 'cuid',
      name: 'The Maestro',
      slug: 'the-maestro',
      images: [],
      specifications: [],
      variants: [],
      category: { id: 'c', name: 'English Willow', slug: 'english-willow' },
    },
    responseFields: [
      {
        field: '(product)',
        type: 'Product',
        nullable: false,
        description: 'Created product with nested relations + category.',
      },
    ],
    errorResponses: [ERR_AUTH, ERR_VALIDATION, ERR_SERVER],
    sourceRefs: [
      { label: 'products.controller.ts', file: 'apps/api/src/products/products.controller.ts' },
      { label: 'create-product.dto.ts', file: 'apps/api/src/products/dto/create-product.dto.ts' },
    ],
    dataFlow: [
      'POST /products → JwtAuthGuard → ProductsService.create() → INSERT Product (+ images/specs/variants)',
    ],
  }),
  api({
    id: 'products-update',
    name: 'Update product',
    module: 'Products',
    method: 'PUT',
    path: '/products/:slug',
    authorization: '⚠ Any authenticated user (JWT only).',
    purpose: 'Update a product by slug. Backend/admin operation.',
    headers: JWT_HEADERS,
    pathParams: [{ name: 'slug', type: 'string', required: true, description: 'Product slug.' }],
    requestBody: { price: 39000, stock: 6, isFeatured: true },
    requestFields: [
      {
        field: '(all CreateProductDto fields)',
        type: 'partial',
        required: false,
        validation: 'PartialType(CreateProductDto)',
        description:
          'Any subset of create fields. NOTE: nested images/specs/variants are IGNORED on update — scalars only.',
      },
    ],
    successResponse: {
      id: 'cuid',
      slug: 'the-maestro',
      price: 39000,
      images: [],
      specifications: [],
      variants: [],
      category: {},
    },
    responseFields: [
      { field: '(product)', type: 'Product', nullable: false, description: 'Updated product.' },
    ],
    errorResponses: [
      ERR_AUTH,
      ERR_VALIDATION,
      { status: 404, meaning: 'Product not found.' },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'products.controller.ts', file: 'apps/api/src/products/products.controller.ts' },
      { label: 'update-product.dto.ts', file: 'apps/api/src/products/dto/update-product.dto.ts' },
    ],
    dataFlow: ['PUT /products/:slug → ProductsService.update() → UPDATE Product (scalars only)'],
  }),
  api({
    id: 'products-delete',
    name: 'Delete product',
    module: 'Products',
    method: 'DELETE',
    path: '/products/:slug',
    authorization: '⚠ Any authenticated user (JWT only).',
    purpose: 'Soft-delete a product (sets isActive=false). Backend/admin operation.',
    pathParams: [{ name: 'slug', type: 'string', required: true, description: 'Product slug.' }],
    successResponse: { message: 'Product deactivated successfully' },
    responseFields: [
      { field: 'message', type: 'string', nullable: false, description: 'Confirmation.' },
    ],
    errorResponses: [ERR_AUTH, { status: 404, meaning: 'Product not found.' }, ERR_SERVER],
    sourceRefs: [
      { label: 'products.controller.ts', file: 'apps/api/src/products/products.controller.ts' },
    ],
    dataFlow: [
      'DELETE /products/:slug → ProductsService.remove() → UPDATE Product SET isActive=false (soft delete)',
    ],
  }),

  // -------------------------------------------------------------------- Cart
  api({
    id: 'cart-get',
    name: 'Get cart',
    module: 'Cart',
    method: 'GET',
    path: '/cart',
    authorization: 'Owner (cart is derived from req.user.id).',
    purpose:
      'Return the current user cart with priced summary; creates an empty cart on first access.',
    usedIn: [
      { kind: 'store', label: 'cart-store.fetchCart()', file: 'apps/web/src/lib/cart-store.ts' },
      {
        kind: 'component',
        label: 'SiteNavbar / cart badge',
        file: 'apps/web/src/components/landing/SiteNavbar.tsx',
      },
      { kind: 'route', label: '/cart, /checkout', file: 'apps/web/src/app/cart/page.tsx' },
    ],
    successResponse: {
      id: 'cuid',
      userId: 'cuid',
      items: [
        {
          id: 'ci',
          productId: 'p',
          quantity: 2,
          product: {
            id: 'p',
            name: 'The Maestro',
            slug: 'the-maestro',
            price: 38000,
            stock: 4,
            image: '/main.png',
          },
        },
      ],
      summary: { subtotal: 76000, shipping: 0, tax: 13680, total: 89680, itemCount: 2 },
    },
    responseFields: [
      {
        field: 'items[]',
        type: 'CartItem[]',
        nullable: false,
        description: 'Line items with embedded product summary + first image.',
      },
      {
        field: 'summary',
        type: 'object',
        nullable: false,
        description: 'subtotal, shipping (free ≥₹1000 else ₹150), tax (18%), total, itemCount.',
      },
    ],
    errorResponses: [ERR_AUTH, ERR_SERVER],
    sourceRefs: [
      { label: 'cart.controller.ts', file: 'apps/api/src/cart/cart.controller.ts' },
      { label: 'cart.service.ts', file: 'apps/api/src/cart/cart.service.ts' },
    ],
    dataFlow: [
      'cart-store.fetchCart() → cartApi.getCart() → GET /cart → CartService.getCart() → SELECT/INSERT Cart + items → formatted cart',
    ],
  }),
  api({
    id: 'cart-add',
    name: 'Add to cart',
    module: 'Cart',
    method: 'POST',
    path: '/cart/items',
    authorization: 'Owner.',
    purpose: 'Add a product (or increment its quantity) in the user cart, validating stock.',
    successStatus: 200,
    usedIn: [
      {
        kind: 'component',
        label: 'ProductDetail / ProductsGrid (Add to cart)',
        file: 'apps/web/src/components/product/ProductDetail.tsx',
      },
      { kind: 'store', label: 'cart-store.addItem()', file: 'apps/web/src/lib/cart-store.ts' },
    ],
    headers: JWT_HEADERS,
    requestBody: { productId: 'cuid', quantity: 1 },
    requestFields: [
      {
        field: 'productId',
        type: 'string',
        required: true,
        validation: '@IsString',
        description: 'Product to add.',
      },
      {
        field: 'quantity',
        type: 'number',
        required: true,
        validation: '@IsInt @Min(1) @Type(Number)',
        description: 'Units to add.',
      },
    ],
    successResponse: { id: 'cuid', items: [], summary: {} },
    responseFields: [
      {
        field: '(cart)',
        type: 'object',
        nullable: false,
        description: 'Full formatted cart (same shape as GET /cart).',
      },
    ],
    errorResponses: [
      ERR_AUTH,
      ERR_VALIDATION,
      { status: 404, meaning: 'Product not found/inactive.' },
      { status: 400, meaning: 'Insufficient stock ("Only <n> items available").' },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'cart.controller.ts', file: 'apps/api/src/cart/cart.controller.ts' },
      { label: 'cart.dto.ts', file: 'apps/api/src/cart/dto/cart.dto.ts' },
    ],
    dataFlow: [
      'Add to cart → cart-store.addItem() → cartApi.addItem() → POST /cart/items → CartService.addItem() → UPSERT CartItem → formatted cart',
    ],
  }),
  api({
    id: 'cart-update',
    name: 'Update cart item',
    module: 'Cart',
    method: 'PATCH',
    path: '/cart/items/:itemId',
    authorization: 'Owner.',
    purpose: 'Set a line-item quantity; quantity 0 removes the item.',
    usedIn: [
      { kind: 'route', label: '/cart', file: 'apps/web/src/app/cart/page.tsx' },
      { kind: 'store', label: 'cart-store.updateItem()', file: 'apps/web/src/lib/cart-store.ts' },
    ],
    headers: JWT_HEADERS,
    pathParams: [{ name: 'itemId', type: 'string', required: true, description: 'CartItem id.' }],
    requestBody: { quantity: 3 },
    requestFields: [
      {
        field: 'quantity',
        type: 'number',
        required: true,
        validation: '@IsInt @Min(0) @Type(Number)',
        description: 'New quantity (0 = delete line).',
      },
    ],
    successResponse: { id: 'cuid', items: [], summary: {} },
    responseFields: [
      { field: '(cart)', type: 'object', nullable: false, description: 'Full formatted cart.' },
    ],
    errorResponses: [
      ERR_AUTH,
      ERR_VALIDATION,
      { status: 404, meaning: 'Cart item not found.' },
      { status: 400, meaning: 'Insufficient stock.' },
      ERR_SERVER,
    ],
    sourceRefs: [{ label: 'cart.controller.ts', file: 'apps/api/src/cart/cart.controller.ts' }],
    dataFlow: [
      '/cart qty change → cart-store.updateItem() → PATCH /cart/items/:id → CartService.updateItem() → UPDATE/DELETE CartItem',
    ],
  }),
  api({
    id: 'cart-remove',
    name: 'Remove cart item',
    module: 'Cart',
    method: 'DELETE',
    path: '/cart/items/:itemId',
    authorization: 'Owner.',
    purpose: 'Remove a single line item from the cart.',
    usedIn: [
      { kind: 'route', label: '/cart', file: 'apps/web/src/app/cart/page.tsx' },
      { kind: 'store', label: 'cart-store.removeItem()', file: 'apps/web/src/lib/cart-store.ts' },
    ],
    pathParams: [{ name: 'itemId', type: 'string', required: true, description: 'CartItem id.' }],
    successResponse: { id: 'cuid', items: [], summary: {} },
    responseFields: [
      { field: '(cart)', type: 'object', nullable: false, description: 'Full formatted cart.' },
    ],
    errorResponses: [ERR_AUTH, { status: 404, meaning: 'Cart item not found.' }, ERR_SERVER],
    sourceRefs: [{ label: 'cart.controller.ts', file: 'apps/api/src/cart/cart.controller.ts' }],
    dataFlow: [
      '/cart remove → cart-store.removeItem() → DELETE /cart/items/:id → CartService.removeItem() → DELETE CartItem',
    ],
  }),
  api({
    id: 'cart-clear',
    name: 'Clear cart',
    module: 'Cart',
    method: 'DELETE',
    path: '/cart',
    authorization: 'Owner.',
    purpose: 'Empty the cart (also happens automatically after an order is placed).',
    usedIn: [
      { kind: 'store', label: 'cart-store.clearCart()', file: 'apps/web/src/lib/cart-store.ts' },
    ],
    successResponse: { id: 'cuid', items: [], summary: { itemCount: 0 } },
    responseFields: [
      { field: '(cart)', type: 'object', nullable: false, description: 'Now-empty cart.' },
    ],
    errorResponses: [ERR_AUTH, ERR_SERVER],
    sourceRefs: [{ label: 'cart.controller.ts', file: 'apps/api/src/cart/cart.controller.ts' }],
    dataFlow: [
      'cart-store.clearCart() → DELETE /cart → CartService.clearCart() → DELETE CartItem WHERE cartId',
    ],
  }),

  // ------------------------------------------------------------------ Orders
  api({
    id: 'orders-create',
    name: 'Create order',
    module: 'Orders',
    method: 'POST',
    path: '/orders',
    authorization: 'Owner.',
    purpose:
      'Place an order: validate stock, compute totals, decrement stock, snapshot addresses, and clear the cart — all in one transaction.',
    successStatus: 201,
    usedIn: [
      { kind: 'route', label: '/checkout', file: 'apps/web/src/app/checkout/page.tsx' },
      { kind: 'service', label: 'ordersApi.create', file: 'apps/web/src/lib/api.ts' },
    ],
    headers: JWT_HEADERS,
    requestBody: {
      items: [{ productId: 'cuid', quantity: 1 }],
      shippingAddress: {
        type: 'SHIPPING',
        firstName: 'Demo',
        lastName: 'User',
        phone: '9876543210',
        line1: '12 Willow Lane',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600001',
        country: 'India',
      },
      billingAddress: {
        type: 'BILLING',
        firstName: 'Demo',
        lastName: 'User',
        phone: '9876543210',
        line1: '12 Willow Lane',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600001',
        country: 'India',
      },
      paymentMethod: 'razorpay',
      razorpayOrderId: 'order_XXX',
      razorpayPaymentId: 'pay_XXX',
      razorpaySignature: '<hmac>',
    },
    requestFields: [
      {
        field: 'items[]',
        type: 'OrderItemDto[]',
        required: true,
        validation: '@ValidateNested @Type',
        description: '{ productId, quantity ≥1 }.',
      },
      {
        field: 'shippingAddress',
        type: 'AddressDto',
        required: true,
        validation: '@ValidateNested @Type',
        description:
          'Only whitelisted address fields — sending id/userId/timestamps is rejected (forbidNonWhitelisted).',
      },
      {
        field: 'billingAddress',
        type: 'AddressDto',
        required: true,
        validation: '@ValidateNested @Type',
        description: 'Same shape as shippingAddress.',
      },
      {
        field: 'paymentMethod',
        type: 'string',
        required: true,
        validation: '@IsString',
        description: "e.g. 'razorpay'.",
      },
      {
        field: 'notes',
        type: 'string',
        required: false,
        validation: '@IsOptional @IsString',
        description: 'Order notes.',
      },
      {
        field: 'razorpayOrderId / PaymentId / Signature',
        type: 'string',
        required: false,
        validation: '@IsOptional @IsString',
        description: 'Payment refs; presence of paymentId sets paymentStatus=PAID.',
      },
    ],
    successResponse: {
      id: 'cuid',
      orderNumber: 'SRM-XXXX-YYYY',
      status: 'PENDING',
      paymentStatus: 'PAID',
      subtotal: 114000,
      shipping: 0,
      tax: 20520,
      total: 134520,
      items: [
        {
          productId: 'p',
          quantity: 3,
          price: 38000,
          product: { name: 'The Maestro', slug: 'the-maestro' },
        },
      ],
    },
    responseFields: [
      { field: 'orderNumber', type: 'string', nullable: false, description: 'SRM-<ts36>-<rand>.' },
      { field: 'status', type: 'OrderStatus', nullable: false, description: "Starts 'PENDING'." },
      {
        field: 'paymentStatus',
        type: 'PaymentStatus',
        nullable: false,
        description: "'PAID' if razorpayPaymentId present, else 'PENDING'.",
      },
      {
        field: 'subtotal/shipping/tax/total',
        type: 'number',
        nullable: false,
        description: 'Computed server-side.',
      },
      {
        field: 'items[]',
        type: 'OrderItem[]',
        nullable: false,
        description: 'Line items with price snapshot + product summary.',
      },
    ],
    errorResponses: [
      ERR_AUTH,
      ERR_VALIDATION,
      { status: 400, meaning: 'Product not found/inactive, or insufficient stock.' },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'orders.controller.ts', file: 'apps/api/src/orders/orders.controller.ts' },
      { label: 'orders.service.ts', file: 'apps/api/src/orders/orders.service.ts' },
      { label: 'order.dto.ts', file: 'apps/api/src/orders/dto/order.dto.ts' },
      { label: 'checkout/page.tsx', file: 'apps/web/src/app/checkout/page.tsx' },
    ],
    dataFlow: [
      '/checkout (after payment verify) → ordersApi.create() → POST /orders → OrdersService.createOrder() [tx: decrement Product.stock, INSERT Order+OrderItem, clear Cart] → redirect /order-confirmation/:id',
    ],
  }),
  api({
    id: 'orders-list',
    name: 'List my orders',
    module: 'Orders',
    method: 'GET',
    path: '/orders',
    authorization: 'Owner (own orders only).',
    purpose: 'Order history for the signed-in user, newest first.',
    usedIn: [
      { kind: 'route', label: '/account/orders', file: 'apps/web/src/app/account/orders/page.tsx' },
      { kind: 'service', label: 'ordersApi.list', file: 'apps/web/src/lib/api.ts' },
    ],
    successResponse: [
      {
        id: 'cuid',
        orderNumber: 'SRM-XXXX-YYYY',
        status: 'PENDING',
        total: 134520,
        createdAt: '2026-07-26T10:00:00.000Z',
        items: [{ quantity: 3, product: { name: 'The Maestro', images: [{ url: '/main.png' }] } }],
      },
    ],
    responseFields: [
      {
        field: '(array)',
        type: 'Order[]',
        nullable: false,
        description: 'Orders with items + product summary (first image).',
      },
    ],
    errorResponses: [ERR_AUTH, ERR_SERVER],
    sourceRefs: [
      { label: 'orders.controller.ts', file: 'apps/api/src/orders/orders.controller.ts' },
      { label: 'orders.service.ts', file: 'apps/api/src/orders/orders.service.ts' },
    ],
    dataFlow: [
      '/account/orders → ordersApi.list() → GET /orders → OrdersService.getUserOrders() → SELECT Order WHERE userId ORDER BY createdAt DESC',
    ],
  }),
  api({
    id: 'orders-get',
    name: 'Get order by id',
    module: 'Orders',
    method: 'GET',
    path: '/orders/:id',
    authorization: 'Owner (403 if not yours).',
    purpose: 'Full order detail for the order-confirmation page.',
    usedIn: [
      {
        kind: 'route',
        label: '/order-confirmation/[id]',
        file: 'apps/web/src/app/order-confirmation/[id]/page.tsx',
      },
      { kind: 'service', label: 'ordersApi.get', file: 'apps/web/src/lib/api.ts' },
    ],
    pathParams: [{ name: 'id', type: 'string', required: true, description: 'Order id.' }],
    successResponse: {
      id: 'cuid',
      orderNumber: 'SRM-XXXX-YYYY',
      status: 'PENDING',
      paymentStatus: 'PAID',
      subtotal: 114000,
      shipping: 0,
      tax: 20520,
      total: 134520,
      shippingAddress: {},
      items: [],
    },
    responseFields: [
      {
        field: '(order)',
        type: 'Order',
        nullable: false,
        description: 'Order with items + product (image, specs).',
      },
    ],
    errorResponses: [
      ERR_AUTH,
      { status: 403, meaning: 'Order belongs to another user (ForbiddenException).' },
      { status: 404, meaning: 'Order not found.' },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'orders.controller.ts', file: 'apps/api/src/orders/orders.controller.ts' },
    ],
    dataFlow: [
      '/order-confirmation/[id] → ordersApi.get(id) → GET /orders/:id → OrdersService.getOrder() (ownership check) → Order + items',
    ],
  }),
  api({
    id: 'orders-get-by-number',
    name: 'Get order by number',
    module: 'Orders',
    method: 'GET',
    path: '/orders/number/:orderNumber',
    authorization: 'Owner (ownership failure masked as 404).',
    purpose: 'Look up an order by its human order number.',
    usedIn: [
      {
        kind: 'service',
        label: 'ordersApi.getByNumber (available, no page caller yet)',
        file: 'apps/web/src/lib/api.ts',
      },
    ],
    pathParams: [
      { name: 'orderNumber', type: 'string', required: true, description: 'e.g. SRM-XXXX-YYYY.' },
    ],
    successResponse: { id: 'cuid', orderNumber: 'SRM-XXXX-YYYY', items: [] },
    responseFields: [
      {
        field: '(order)',
        type: 'Order',
        nullable: false,
        description: 'Order with items + product summary.',
      },
    ],
    errorResponses: [
      ERR_AUTH,
      { status: 404, meaning: 'Not found OR not owned by you (both masked as 404).' },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'orders.controller.ts', file: 'apps/api/src/orders/orders.controller.ts' },
    ],
    dataFlow: [
      'ordersApi.getByNumber() → GET /orders/number/:orderNumber → OrdersService.getOrderByNumber()',
    ],
  }),
  api({
    id: 'orders-update-status',
    name: 'Update order status',
    module: 'Orders',
    method: 'PATCH',
    path: '/orders/:id/status',
    authorization:
      '⚠ Owner only, but NOT role-gated — a user can move their own order through any status.',
    purpose:
      'Change an order status. Intended for admin/ops; no admin guard exists, so it is effectively owner-controlled. No storefront caller.',
    pathParams: [{ name: 'id', type: 'string', required: true, description: 'Order id.' }],
    headers: JWT_HEADERS,
    requestBody: { status: 'SHIPPED' },
    requestFields: [
      {
        field: 'status',
        type: 'UpdateOrderStatusEnum',
        required: true,
        validation: '@IsEnum',
        description:
          'CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED (PENDING not accepted).',
      },
    ],
    successResponse: { id: 'cuid', status: 'SHIPPED' },
    responseFields: [
      {
        field: '(order)',
        type: 'Order',
        nullable: false,
        description: 'Updated order (scalars only, no includes).',
      },
    ],
    errorResponses: [
      ERR_AUTH,
      ERR_VALIDATION,
      { status: 403, meaning: 'Not your order.' },
      { status: 404, meaning: 'Order not found.' },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'orders.controller.ts', file: 'apps/api/src/orders/orders.controller.ts' },
      { label: 'order.dto.ts', file: 'apps/api/src/orders/dto/order.dto.ts' },
    ],
    dataFlow: [
      'PATCH /orders/:id/status → OrdersService.updateOrderStatus() (ownership check) → UPDATE Order.status',
    ],
  }),

  // --------------------------------------------------------------- Addresses
  api({
    id: 'addresses-list',
    name: 'List addresses',
    module: 'Addresses',
    method: 'GET',
    path: '/addresses',
    authorization: 'Owner.',
    purpose: 'Saved addresses for the user (default first).',
    usedIn: [
      {
        kind: 'route',
        label: '/checkout, /account/profile',
        file: 'apps/web/src/app/checkout/page.tsx',
      },
      { kind: 'service', label: 'addressesApi.list', file: 'apps/web/src/lib/api.ts' },
    ],
    successResponse: [
      {
        id: 'cuid',
        type: 'SHIPPING',
        firstName: 'Demo',
        lastName: 'User',
        phone: '9876543210',
        line1: '12 Willow Lane',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600001',
        country: 'India',
        isDefault: true,
      },
    ],
    responseFields: [
      {
        field: '(array)',
        type: 'Address[]',
        nullable: false,
        description: 'Full address records, default first then newest.',
      },
    ],
    errorResponses: [ERR_AUTH, ERR_SERVER],
    sourceRefs: [
      { label: 'addresses.controller.ts', file: 'apps/api/src/addresses/addresses.controller.ts' },
      { label: 'addresses.service.ts', file: 'apps/api/src/addresses/addresses.service.ts' },
    ],
    dataFlow: [
      '/checkout & /account/profile → addressesApi.list() → GET /addresses → AddressesService.getAddresses()',
    ],
  }),
  api({
    id: 'addresses-create',
    name: 'Create address',
    module: 'Addresses',
    method: 'POST',
    path: '/addresses',
    authorization: 'Owner.',
    purpose: 'Save a new address (optionally default).',
    successStatus: 201,
    usedIn: [
      {
        kind: 'route',
        label: '/checkout, /account/profile',
        file: 'apps/web/src/app/account/profile/page.tsx',
      },
      { kind: 'service', label: 'addressesApi.create', file: 'apps/web/src/lib/api.ts' },
    ],
    headers: JWT_HEADERS,
    requestBody: {
      type: 'SHIPPING',
      firstName: 'Demo',
      lastName: 'User',
      phone: '9876543210',
      line1: '12 Willow Lane',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600001',
      country: 'India',
      isDefault: true,
    },
    requestFields: [
      {
        field: 'type',
        type: 'AddressType',
        required: true,
        validation: '@IsEnum',
        description: 'SHIPPING | BILLING | BOTH.',
      },
      {
        field: 'firstName/lastName/phone/line1/city/state/postalCode',
        type: 'string',
        required: true,
        validation: '@IsString',
        description: 'Required address fields.',
      },
      {
        field: 'line2',
        type: 'string',
        required: false,
        validation: '@IsOptional @IsString',
        description: 'Optional second line.',
      },
      {
        field: 'country',
        type: 'string',
        required: false,
        validation: '@IsOptional @IsString',
        description: "Defaults 'India'.",
      },
      {
        field: 'isDefault',
        type: 'boolean',
        required: false,
        validation: '@IsOptional @IsBoolean',
        description: 'Make this the default (unsets others).',
      },
    ],
    successResponse: { id: 'cuid', type: 'SHIPPING', isDefault: true },
    responseFields: [
      {
        field: '(address)',
        type: 'Address',
        nullable: false,
        description: 'Created address record.',
      },
    ],
    errorResponses: [ERR_AUTH, ERR_VALIDATION, ERR_SERVER],
    sourceRefs: [
      { label: 'addresses.controller.ts', file: 'apps/api/src/addresses/addresses.controller.ts' },
      { label: 'address.dto.ts', file: 'apps/api/src/addresses/dto/address.dto.ts' },
    ],
    dataFlow: [
      '/checkout or /account/profile → addressesApi.create() → POST /addresses → AddressesService.createAddress()',
    ],
  }),
  api({
    id: 'addresses-update',
    name: 'Update address',
    module: 'Addresses',
    method: 'PUT',
    path: '/addresses/:id',
    authorization: 'Owner (403 if not yours).',
    purpose: 'Replace an address (all fields required — UpdateAddressDto extends, not partial).',
    usedIn: [
      {
        kind: 'route',
        label: '/account/profile',
        file: 'apps/web/src/app/account/profile/page.tsx',
      },
      { kind: 'service', label: 'addressesApi.update', file: 'apps/web/src/lib/api.ts' },
    ],
    headers: JWT_HEADERS,
    pathParams: [{ name: 'id', type: 'string', required: true, description: 'Address id.' }],
    requestBody: {
      type: 'SHIPPING',
      firstName: 'Demo',
      lastName: 'User',
      phone: '9876543210',
      line1: '9 MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
    },
    requestFields: [
      {
        field: '(all CreateAddressDto fields)',
        type: 'object',
        required: true,
        validation: 'extends CreateAddressDto (NOT partial)',
        description: 'All create fields required again.',
      },
    ],
    successResponse: { id: 'cuid', line1: '9 MG Road' },
    responseFields: [
      { field: '(address)', type: 'Address', nullable: false, description: 'Updated address.' },
    ],
    errorResponses: [
      ERR_AUTH,
      ERR_VALIDATION,
      { status: 403, meaning: 'Not your address.' },
      { status: 404, meaning: 'Address not found.' },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'addresses.controller.ts', file: 'apps/api/src/addresses/addresses.controller.ts' },
    ],
    dataFlow: [
      '/account/profile → addressesApi.update() → PUT /addresses/:id → AddressesService.updateAddress()',
    ],
  }),
  api({
    id: 'addresses-delete',
    name: 'Delete address',
    module: 'Addresses',
    method: 'DELETE',
    path: '/addresses/:id',
    authorization: 'Owner.',
    purpose: 'Permanently remove a saved address.',
    usedIn: [
      {
        kind: 'route',
        label: '/account/profile',
        file: 'apps/web/src/app/account/profile/page.tsx',
      },
      { kind: 'service', label: 'addressesApi.delete', file: 'apps/web/src/lib/api.ts' },
    ],
    pathParams: [{ name: 'id', type: 'string', required: true, description: 'Address id.' }],
    successResponse: { message: 'Address deleted' },
    responseFields: [
      { field: 'message', type: 'string', nullable: false, description: 'Confirmation.' },
    ],
    errorResponses: [
      ERR_AUTH,
      { status: 403, meaning: 'Not your address.' },
      { status: 404, meaning: 'Address not found.' },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'addresses.controller.ts', file: 'apps/api/src/addresses/addresses.controller.ts' },
    ],
    dataFlow: [
      '/account/profile → addressesApi.delete() → DELETE /addresses/:id → AddressesService.deleteAddress() → hard delete',
    ],
  }),
  api({
    id: 'addresses-set-default',
    name: 'Set default address',
    module: 'Addresses',
    method: 'PATCH',
    path: '/addresses/:id/default',
    authorization: 'Owner.',
    purpose: 'Mark one address as default (unsets the others).',
    usedIn: [
      {
        kind: 'route',
        label: '/account/profile',
        file: 'apps/web/src/app/account/profile/page.tsx',
      },
      { kind: 'service', label: 'addressesApi.setDefault', file: 'apps/web/src/lib/api.ts' },
    ],
    pathParams: [{ name: 'id', type: 'string', required: true, description: 'Address id.' }],
    successResponse: { id: 'cuid', isDefault: true },
    responseFields: [
      {
        field: '(address)',
        type: 'Address',
        nullable: false,
        description: 'Updated address (isDefault true).',
      },
    ],
    errorResponses: [
      ERR_AUTH,
      { status: 403, meaning: 'Not your address.' },
      { status: 404, meaning: 'Address not found.' },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'addresses.controller.ts', file: 'apps/api/src/addresses/addresses.controller.ts' },
    ],
    dataFlow: [
      '/account/profile → addressesApi.setDefault() → PATCH /addresses/:id/default → AddressesService.setDefault()',
    ],
  }),

  // ----------------------------------------------------------------- Payment
  api({
    id: 'payment-create-order',
    name: 'Create Razorpay order',
    module: 'Payment',
    method: 'POST',
    path: '/payment/create-order',
    authorization: 'Any authenticated user.',
    purpose:
      'Create a Razorpay order (amount in paise) so the checkout modal can open. Calls Razorpay REST directly; not persisted in our DB.',
    successStatus: 201,
    usedIn: [
      { kind: 'route', label: '/checkout', file: 'apps/web/src/app/checkout/page.tsx' },
      { kind: 'service', label: 'paymentApi.createOrder', file: 'apps/web/src/lib/api.ts' },
    ],
    headers: JWT_HEADERS,
    requestBody: { amount: 89680, currency: 'INR', receipt: 'rcpt_123' },
    requestFields: [
      {
        field: 'amount',
        type: 'number',
        required: true,
        validation: '@IsNumber @Min(1) @Type(Number)',
        description: 'Amount in RUPEES (converted to paise ×100; min 100 paise).',
      },
      {
        field: 'currency',
        type: 'string',
        required: false,
        validation: '@IsOptional @IsString',
        description: "Defaults 'INR'.",
      },
      {
        field: 'receipt',
        type: 'string',
        required: false,
        validation: '@IsOptional @IsString',
        description: 'Defaults rcpt_<ts>.',
      },
    ],
    successResponse: {
      id: 'order_XXXXXXXX',
      entity: 'order',
      amount: 8968000,
      currency: 'INR',
      receipt: 'rcpt_123',
      status: 'created',
    },
    responseFields: [
      {
        field: 'id',
        type: 'string',
        nullable: false,
        description: 'Razorpay order id (passed to checkout.js).',
      },
      { field: 'amount', type: 'number', nullable: false, description: 'Amount in paise.' },
      {
        field: 'currency / receipt / status',
        type: 'string',
        nullable: false,
        description: 'Razorpay order fields (passthrough).',
      },
    ],
    errorResponses: [
      ERR_AUTH,
      { status: 400, meaning: 'amount < ₹1 / < 100 paise (BadRequestException).' },
      {
        status: 401,
        meaning: 'Razorpay rejected the key/secret (mapped to UnauthorizedException).',
      },
      { status: 500, meaning: 'Razorpay creds missing, or Razorpay returned an error.' },
    ],
    sourceRefs: [
      { label: 'payment.controller.ts', file: 'apps/api/src/payment/payment.controller.ts' },
      { label: 'payment.service.ts', file: 'apps/api/src/payment/payment.service.ts' },
    ],
    dataFlow: [
      '/checkout Pay → paymentApi.createOrder(total) → POST /payment/create-order → PaymentService.createRazorpayOrder() → Razorpay POST /v1/orders → order → open checkout.js',
    ],
  }),
  api({
    id: 'payment-verify',
    name: 'Verify payment signature',
    module: 'Payment',
    method: 'POST',
    path: '/payment/verify',
    authorization: 'Any authenticated user.',
    purpose:
      'Verify the Razorpay HMAC signature after the modal succeeds, before creating the order. Returns 400 on mismatch.',
    successStatus: 200,
    usedIn: [
      { kind: 'route', label: '/checkout', file: 'apps/web/src/app/checkout/page.tsx' },
      { kind: 'service', label: 'paymentApi.verify', file: 'apps/web/src/lib/api.ts' },
    ],
    headers: JWT_HEADERS,
    requestBody: {
      razorpayOrderId: 'order_XXX',
      razorpayPaymentId: 'pay_XXX',
      razorpaySignature: '<hmac>',
    },
    requestFields: [
      {
        field: 'razorpayOrderId',
        type: 'string',
        required: true,
        validation: '@IsString',
        description: 'Razorpay order id.',
      },
      {
        field: 'razorpayPaymentId',
        type: 'string',
        required: true,
        validation: '@IsString',
        description: 'Razorpay payment id.',
      },
      {
        field: 'razorpaySignature',
        type: 'string',
        required: true,
        validation: '@IsString',
        description: 'Signature from checkout.js.',
      },
    ],
    successResponse: { verified: true, paymentId: 'pay_XXX' },
    responseFields: [
      {
        field: 'verified',
        type: 'boolean',
        nullable: false,
        description: 'Always true on success (mismatch → 400).',
      },
      {
        field: 'paymentId',
        type: 'string',
        nullable: false,
        description: 'Echoed razorpayPaymentId.',
      },
    ],
    errorResponses: [
      ERR_AUTH,
      ERR_VALIDATION,
      { status: 400, meaning: 'Signature mismatch — "Payment verification failed".' },
      ERR_SERVER,
    ],
    sourceRefs: [
      { label: 'payment.controller.ts', file: 'apps/api/src/payment/payment.controller.ts' },
      { label: 'payment.service.ts', file: 'apps/api/src/payment/payment.service.ts' },
    ],
    dataFlow: [
      'checkout.js success → paymentApi.verify() → POST /payment/verify → PaymentService.verifyPaymentSignature() (HMAC-SHA256 orderId|paymentId) → { verified } → create order',
    ],
  }),
];

// ------------------------------------------------------------------ Features
export const FEATURES: FeatureDoc[] = [
  {
    id: 'auth',
    name: 'Authentication & Account',
    summary:
      'Register/login via a modal, JWT access+refresh tokens stored in localStorage, auto-refresh on 401, profile hydration.',
    pages: ['/ (LoginModal)', '/account/profile'],
    components: ['login-modal.tsx', 'SiteNavbar.tsx'],
    apiIds: ['auth-register', 'auth-login', 'auth-refresh', 'auth-profile'],
    tables: ['User'],
    externalServiceIds: ['postgres'],
  },
  {
    id: 'catalog',
    name: 'Catalogue / Products',
    summary: 'Browse, filter and view cricket bats. Public, ISR-cached reads.',
    pages: ['/products', '/products/[slug]'],
    components: ['ProductsGrid.tsx', 'ProductDetail.tsx'],
    apiIds: [
      'products-list',
      'products-featured',
      'products-detail',
      'products-create',
      'products-update',
      'products-delete',
    ],
    tables: [
      'Product',
      'Category',
      'Brand',
      'ProductImage',
      'ProductSpec',
      'ProductVariant',
      'Review',
    ],
    externalServiceIds: ['postgres'],
  },
  {
    id: 'cart',
    name: 'Cart',
    summary:
      'Server-side cart keyed to the user, with priced summary (shipping, 18% tax). Consumed via a Zustand store.',
    pages: ['/cart', '/checkout', '/products/[slug]'],
    components: ['cart-store.ts', 'SiteNavbar.tsx'],
    apiIds: ['cart-get', 'cart-add', 'cart-update', 'cart-remove', 'cart-clear'],
    tables: ['Cart', 'CartItem', 'Product'],
    externalServiceIds: ['postgres'],
  },
  {
    id: 'checkout',
    name: 'Checkout, Payment & Orders',
    summary:
      'Address selection → Razorpay order → hosted modal → signature verify → order persisted (stock decremented, cart cleared) → confirmation.',
    pages: ['/checkout', '/order-confirmation/[id]', '/account/orders'],
    components: ['checkout/page.tsx', 'order-confirmation/[id]/page.tsx'],
    apiIds: [
      'payment-create-order',
      'payment-verify',
      'orders-create',
      'orders-list',
      'orders-get',
      'orders-get-by-number',
      'orders-update-status',
    ],
    tables: ['Order', 'OrderItem', 'Product', 'Cart', 'CartItem'],
    externalServiceIds: ['razorpay', 'postgres'],
  },
  {
    id: 'addresses',
    name: 'Addresses',
    summary: 'CRUD for saved shipping/billing addresses, with a single default.',
    pages: ['/checkout', '/account/profile'],
    components: ['account/profile/page.tsx'],
    apiIds: [
      'addresses-list',
      'addresses-create',
      'addresses-update',
      'addresses-delete',
      'addresses-set-default',
    ],
    tables: ['Address'],
    externalServiceIds: ['postgres'],
  },
  {
    id: 'system',
    name: 'System / Health',
    summary: 'Liveness and health endpoints for monitoring.',
    pages: [],
    components: [],
    apiIds: ['system-root', 'system-health'],
    tables: [],
    externalServiceIds: [],
  },
];

// --------------------------------------------------------- External services
export const EXTERNAL_SERVICES: ExternalServiceDoc[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    kind: 'Payment gateway',
    usedFor: 'Standard Web Checkout — create order + verify HMAC signature.',
    integration:
      'Backend calls Razorpay REST (POST https://api.razorpay.com/v1/orders) with Basic auth; frontend opens checkout.js with the public key id. Signature verified server-side with HMAC-SHA256(orderId|paymentId, KEY_SECRET).',
    configKeys: [
      'RAZORPAY_KEY_ID (backend + NEXT_PUBLIC_RAZORPAY_KEY_ID frontend)',
      'RAZORPAY_KEY_SECRET (backend only)',
    ],
    endpointsOrDsn: 'https://api.razorpay.com/v1/orders',
    usedByApiIds: ['payment-create-order', 'payment-verify'],
    notes: 'KEY_SECRET must never reach the frontend. Test-mode keys in use.',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    kind: 'Database',
    usedFor: 'Primary datastore for all models, via Prisma.',
    integration:
      'Prisma Client from the shared @srm-bats/database package; DATABASE_URL points at postgres://…:5432/srm_bats.',
    configKeys: ['DATABASE_URL'],
    endpointsOrDsn: 'postgresql://<user>:<pass>@localhost:5432/srm_bats',
    usedByApiIds: ['auth-login', 'products-list', 'cart-get', 'orders-create', 'addresses-list'],
    notes:
      'Schema in packages/database/prisma/schema.prisma (see Database section, auto-generated).',
  },
  {
    id: 'smtp-email',
    name: 'SMTP email (notifications module)',
    kind: 'Email',
    usedFor:
      'Transactional email scaffolding (SMTP + log adapters) present in apps/api/src/notifications.',
    integration: 'A notification port with SMTP and log adapters exists in the codebase.',
    configKeys: ['SMTP_* (if wired)'],
    usedByApiIds: [],
    notes:
      '⚠ Not triggered by any documented HTTP endpoint — included for completeness; verify wiring before relying on it.',
  },
];

// ----------------------------------------------------------- Per-model docs
export const MODEL_DOCS: Record<string, ModelDoc> = {
  User: {
    purpose: 'A registered customer (or admin by role, though roles are never enforced).',
    usedBy: ['Auth', '/account/profile'],
    crud: {
      create: ['auth-register'],
      read: ['auth-login', 'auth-profile'],
      update: [],
      delete: [],
    },
    sample: {
      id: 'clx…',
      email: 'demo@srmbats.com',
      firstName: 'Demo',
      lastName: 'User',
      role: 'CUSTOMER',
      createdAt: '2026-07-26T10:00:00.000Z',
    },
  },
  Address: {
    purpose: 'A saved shipping/billing address for a user.',
    usedBy: ['/checkout', '/account/profile'],
    crud: {
      create: ['addresses-create'],
      read: ['addresses-list'],
      update: ['addresses-update', 'addresses-set-default'],
      delete: ['addresses-delete'],
    },
    sample: {
      id: 'clx…',
      type: 'SHIPPING',
      firstName: 'Demo',
      lastName: 'User',
      phone: '9876543210',
      line1: '12 Willow Lane',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600001',
      country: 'India',
      isDefault: true,
    },
  },
  Product: {
    purpose: 'A cricket bat listing.',
    usedBy: ['/products', '/products/[slug]'],
    crud: {
      create: ['products-create'],
      read: ['products-list', 'products-featured', 'products-detail'],
      update: ['products-update'],
      delete: ['products-delete'],
    },
    sample: {
      id: 'clx…',
      name: 'The Maestro',
      slug: 'the-maestro',
      price: 38000,
      sku: 'SRM-MAE-01',
      stock: 4,
      categoryId: 'clx…',
      isActive: true,
      isFeatured: true,
    },
  },
  Category: {
    purpose: 'Product category (self-nesting tree).',
    usedBy: ['/products'],
    crud: { create: [], read: ['products-list', 'products-detail'], update: [], delete: [] },
    sample: { id: 'clx…', name: 'English Willow', slug: 'english-willow', parentId: null },
  },
  Brand: {
    purpose: 'Optional product brand.',
    usedBy: ['/products'],
    crud: { create: [], read: ['products-detail'], update: [], delete: [] },
    sample: { id: 'clx…', name: 'SRM', slug: 'srm' },
  },
  ProductImage: {
    purpose: 'Ordered product image.',
    usedBy: ['/products'],
    crud: { create: ['products-create'], read: ['products-detail'], update: [], delete: [] },
    sample: { id: 'clx…', productId: 'clx…', url: '/main.png', order: 0 },
  },
  ProductSpec: {
    purpose: 'Key/value product specification.',
    usedBy: ['/products/[slug]'],
    crud: { create: ['products-create'], read: ['products-detail'], update: [], delete: [] },
    sample: { id: 'clx…', productId: 'clx…', key: 'Weight', value: '1180g' },
  },
  ProductVariant: {
    purpose: 'Priced product variant.',
    usedBy: ['/products/[slug]'],
    crud: { create: ['products-create'], read: ['products-detail'], update: [], delete: [] },
    sample: {
      id: 'clx…',
      productId: 'clx…',
      name: 'Short Handle',
      sku: 'SRM-MAE-01-SH',
      price: 38000,
      stock: 2,
    },
  },
  Cart: {
    purpose: 'One cart per user (1:1).',
    usedBy: ['/cart', '/checkout'],
    crud: { create: ['cart-get'], read: ['cart-get'], update: [], delete: ['cart-clear'] },
    sample: { id: 'clx…', userId: 'clx…' },
  },
  CartItem: {
    purpose: 'A line item in a cart (unique per cart+product).',
    usedBy: ['/cart'],
    crud: {
      create: ['cart-add'],
      read: ['cart-get'],
      update: ['cart-update'],
      delete: ['cart-remove', 'cart-clear'],
    },
    sample: { id: 'clx…', cartId: 'clx…', productId: 'clx…', quantity: 2 },
  },
  Order: {
    purpose: 'A placed order with embedded address snapshots and money totals.',
    usedBy: ['/checkout', '/order-confirmation/[id]', '/account/orders'],
    crud: {
      create: ['orders-create'],
      read: ['orders-list', 'orders-get', 'orders-get-by-number'],
      update: ['orders-update-status'],
      delete: [],
    },
    sample: {
      id: 'clx…',
      orderNumber: 'SRM-XXXX-YYYY',
      status: 'PENDING',
      paymentStatus: 'PAID',
      subtotal: 114000,
      shipping: 0,
      tax: 20520,
      total: 134520,
      paymentMethod: 'razorpay',
    },
  },
  OrderItem: {
    purpose: 'A line item in an order with a price snapshot.',
    usedBy: ['/order-confirmation/[id]'],
    crud: {
      create: ['orders-create'],
      read: ['orders-get', 'orders-list'],
      update: [],
      delete: [],
    },
    sample: { id: 'clx…', orderId: 'clx…', productId: 'clx…', quantity: 3, price: 38000 },
  },
  Review: {
    purpose: 'A product review (unique per user+product).',
    usedBy: ['Read on /products/[slug]'],
    crud: { create: [], read: ['products-detail'], update: [], delete: [] },
    sample: {
      id: 'clx…',
      userId: 'clx…',
      productId: 'clx…',
      rating: 5,
      title: 'Superb pickup',
      isVerified: true,
    },
  },
};
