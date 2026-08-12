# SRM Bats — Backend Overview

_A functional map of the backend: how it's wired, what runs where, which API calls power login / registration / profile / cart / orders, and how data is stored._

---

## 1. Runtime status (verified 2026-07-26)

| Component                            | Where                              | Status                     | Notes                                      |
| ------------------------------------ | ---------------------------------- | -------------------------- | ------------------------------------------ |
| **Frontend** (Next.js, `apps/web`)   | `http://localhost:3000`            | ✅ **Running**             | Dev server (`next dev`) is up and serving. |
| **PostgreSQL** (database server)     | `localhost:5432`                   | ✅ **Running / reachable** | Server responds to the Postgres protocol.  |
| **Backend API** (NestJS, `apps/api`) | `http://localhost:3001` (expected) | ❌ **Not running**         | No API process; port 3001 is free.         |

**How this was checked**

- `netstat` shows listeners on `:3000` (frontend) and `:5432` (Postgres); nothing on `:3001`.
- Process list shows only frontend node processes (`npm run dev`, `next dev`) — **no NestJS process**.
- A read-only `prisma migrate status` against `postgresql://user:password@localhost:5432/srm_bats` **reached** the server but returned **`P1000: Authentication failed`** for user `user`. So the DB server is alive, but the credentials in `.env.example`/`docker-compose.yml` (`user` / `password`) are **not** the ones the running Postgres actually uses.

### ⚠️ Why the backend is currently down

- There is **no `apps/api/.env`** — only `apps/api/.env.example`. Without it, `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, and the Razorpay keys are unset, so the API can't connect to the DB or sign tokens.
- No `.env` anywhere in the repo defines `DATABASE_URL`.
- Because the API is down, the storefront currently runs on its **frontend fallbacks**: static product data (`STATIC_PRODUCTS` in the product pages) and a **guest cart in `localStorage`**. Login, server cart, orders, addresses, and payments all require the API to be up.

### How to bring the backend up (end-to-end)

1. **Create `apps/api/.env`** from the example and fill real values:
   ```
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/srm_bats   # must match the running Postgres
   JWT_SECRET=<strong-random>
   JWT_REFRESH_SECRET=<different-strong-random>
   RAZORPAY_KEY_ID=rzp_test_xxx
   RAZORPAY_KEY_SECRET=xxx
   ```
   The database package also needs `DATABASE_URL` (put it in `packages/database/.env` or export it) for Prisma commands.
2. **Ensure the `srm_bats` database exists** on the running Postgres and apply the schema:
   ```
   cd packages/database
   pnpm db:generate     # prisma generate  (build the client)
   pnpm db:migrate      # prisma migrate dev (apply prisma/migrations)
   pnpm db:seed         # optional: tsx prisma/seed.ts (sample products, etc.)
   ```
   (The repo ships a `docker-compose.yml` that runs `postgres:16-alpine` with `user/password/srm_bats`, but Docker is not installed in this environment — the Postgres currently on :5432 is a separate/native instance with its own credentials.)
3. **Start the API**: `cd apps/api && pnpm dev` (`nest start --watch`) → serves on `:3001`.
4. The frontend talks to it via `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001`).

---

## 2. Architecture at a glance

```
new-project/ (pnpm + turbo monorepo)
├─ apps/
│  ├─ web/        Next.js 14 storefront (App Router)  → :3000
│  └─ api/        NestJS REST API                      → :3001
├─ packages/
│  ├─ database/   Prisma schema + client (@srm-bats/database)  ← the DB layer
│  ├─ types/      shared TS types
│  ├─ ui/         shared UI
│  └─ config/     shared config
└─ docker-compose.yml   Postgres 16 (dev)
```

- **API framework:** NestJS (modules → controllers → services), global `ValidationPipe` (whitelist + transform, rejects unknown fields), CORS locked to `FRONTEND_URL`.
- **ORM / DB:** Prisma → PostgreSQL. The Prisma client is a shared package `@srm-bats/database`; `PrismaService` (in `apps/api/src/prisma`) extends `PrismaClient` and connects on module init.
- **Auth:** Passport JWT (access + refresh tokens). Tokens are **stateless** (not stored server-side).
- **Payments:** Razorpay via raw REST (no SDK).
- **Frontend state:** Zustand stores (`auth-store`, `cart-store`) persisted to `localStorage`; a central `apps/web/src/lib/api.ts` client wraps all calls and auto-refreshes tokens on 401.

No global route prefix is set, so each controller's base path **is** the URL prefix (`/auth`, `/cart`, …).

---

## 3. The flows you asked about

All request bodies are JSON. Authenticated calls send `Authorization: Bearer <access token>`. The frontend client (`apps/web/src/lib/api.ts`) attaches the token and, on a `401`, calls `/auth/refresh` once and retries.

### 3a. Registration

|                   |                                                                                                                                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend call** | `authApi.register(name, email, password)` → `POST /auth/register`                                                                                                                               |
| **Body**          | `{ name, email, password }` (password min 8 chars)                                                                                                                                              |
| **Backend**       | `AuthController.register` → `AuthService.register` (`apps/api/src/auth/auth.service.ts`)                                                                                                        |
| **Logic**         | Rejects duplicate email (`ConflictException`). Hashes password with **bcryptjs (10 rounds)**. Splits `name` → `firstName` / `lastName`. Creates the `User` row. Issues access + refresh tokens. |
| **Returns**       | `{ user, accessToken, refreshToken }`                                                                                                                                                           |
| **Stored where**  | `User` table (server). Tokens saved to `localStorage` (`srm_access_token`, `srm_refresh_token`); `user` cached in the `srm-auth` Zustand store.                                                 |

### 3b. Login

|                   |                                                                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend call** | `authApi.login(email, password)` → `POST /auth/login`                                                                                                          |
| **Body**          | `{ email, password }`                                                                                                                                          |
| **Backend**       | `AuthController.login` → `AuthService.login` → `validateUser`                                                                                                  |
| **Logic**         | Looks up user by email, compares password with `bcrypt.compare`. On mismatch → `UnauthorizedException('Invalid credentials')`. On success issues fresh tokens. |
| **Returns**       | `{ user, accessToken, refreshToken }`                                                                                                                          |
| **Stored where**  | Tokens → `localStorage`; user → `srm-auth` store (`isAuthenticated = true`).                                                                                   |

### 3c. Fetching the profile

|                   |                                                                                                                                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend call** | `authApi.getProfile()` → `GET /auth/profile` (Bearer token)                                                                                                                                                          |
| **Backend**       | `AuthController.profile`, guarded by **`JwtAuthGuard`**                                                                                                                                                              |
| **Logic**         | The `JwtStrategy` extracts the bearer token, verifies it with `JWT_SECRET`, and calls `AuthService.validateUserById(payload.sub)` to load the user from the DB. That user object becomes `req.user` and is returned. |
| **Returns**       | `{ id, email, firstName, lastName, role, createdAt, name }`                                                                                                                                                          |
| **Called from**   | `authStore.loadProfile()` on app mount (only if an access token exists).                                                                                                                                             |

### 3d. Cart

The cart is **per-user, one row** (`Cart.userId` is unique) with child `CartItem`s. All cart routes require a JWT (`@UseGuards(JwtAuthGuard)` on the controller).

| Action      | Frontend call                     | Endpoint                     | Backend behaviour                                                                                                            |
| ----------- | --------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Get cart    | `cartApi.getCart()`               | `GET /cart`                  | `getOrCreateCart(userId)` — creates an empty cart if none, returns items + computed summary.                                 |
| Add item    | `cartApi.addItem(productId, qty)` | `POST /cart/items`           | Validates product is active + in stock; increments existing `CartItem` (composite unique `cartId+productId`) or creates one. |
| Update qty  | `cartApi.updateItem(itemId, qty)` | `PATCH /cart/items/:itemId`  | `qty === 0` → deletes the item; else re-checks stock and updates.                                                            |
| Remove item | `cartApi.removeItem(itemId)`      | `DELETE /cart/items/:itemId` | Deletes the `CartItem`.                                                                                                      |
| Clear       | `cartApi.clearCart()`             | `DELETE /cart`               | Deletes all items for the cart.                                                                                              |

**Guest cart:** if there's no access token, `cartStore.addItem` keeps items **client-side only** in the `srm-cart` `localStorage` store (`localItems`); nothing hits the API until the user logs in.

**Cart summary math** (`CartService.formatCart`): `subtotal = Σ price×qty`, `shipping = 0 if subtotal ≥ ₹1000 else ₹150`, `tax = 18% of subtotal`, `total = subtotal + shipping + tax`.

---

## 4. How orders are stored

**Create order** — `ordersApi.create(data)` → `POST /orders` (JWT-guarded) → `OrdersService.createOrder`.

Request (`CreateOrderDto`): `items[] {productId, quantity}`, `shippingAddress`, `billingAddress`, `paymentMethod`, optional `notes` + `razorpayOrderId/PaymentId/Signature`.

Steps:

1. **Validate** every product exists and is active; **check stock** for each line → `BadRequestException` if short.
2. **Compute totals** the same way as the cart (subtotal / shipping ≥₹1000 free / 18% tax / total).
3. Run everything in a **`prisma.$transaction`**:
   - **Decrement stock** on each product (`stock: { decrement: qty }`).
   - **Create the `Order`** with a generated `orderNumber` (`SRM-<base36 timestamp>-<random>`), `status = PENDING`, the money fields, `shippingAddress`/`billingAddress` stored as **JSON snapshots**, `paymentMethod`, and `paymentStatus = PAID` if a `razorpayPaymentId` was supplied else `PENDING`.
   - **Create the `OrderItem`s** nested under the order — each stores a **price snapshot** (`price` at time of order) so later price changes don't alter historical orders.
   - **Clear the user's cart** (delete its `CartItem`s).
4. Returns the created order (with items → product summary).

**Reading orders:**

| Frontend                   | Endpoint                          | Notes                                                                       |
| -------------------------- | --------------------------------- | --------------------------------------------------------------------------- |
| `ordersApi.list()`         | `GET /orders`                     | Current user's orders, newest first.                                        |
| `ordersApi.get(id)`        | `GET /orders/:id`                 | Ownership-checked (`ForbiddenException` if not yours).                      |
| `ordersApi.getByNumber(n)` | `GET /orders/number/:orderNumber` | Ownership-checked.                                                          |
| —                          | `PATCH /orders/:id/status`        | Updates status (CONFIRMED/PROCESSING/SHIPPED/DELIVERED/CANCELLED/REFUNDED). |

**Payments** (Razorpay, no DB writes in the payment module):

- `POST /payment/create-order { amount }` → creates a Razorpay order (rupees→paise, Basic auth to `api.razorpay.com`).
- `POST /payment/verify { razorpayOrderId, razorpayPaymentId, razorpaySignature }` → recomputes an **HMAC-SHA256** signature over `orderId|paymentId` and compares. The verified result is then passed into the order (`paymentStatus = PAID`).

---

## 5. Full endpoint reference

Base URL: `http://localhost:3001`. 🔒 = requires `Authorization: Bearer <token>`.

### Root

| Method | Path      | Purpose                                  |
| ------ | --------- | ---------------------------------------- |
| GET    | `/`       | Health string "SRM Bats API is running!" |
| GET    | `/health` | `{ status: 'ok', timestamp }`            |

### Auth — `/auth`

| Method | Path             | Guard | Body                        | Returns                               |
| ------ | ---------------- | ----- | --------------------------- | ------------------------------------- |
| POST   | `/auth/register` | —     | `{ name, email, password }` | `{ user, accessToken, refreshToken }` |
| POST   | `/auth/login`    | —     | `{ email, password }`       | `{ user, accessToken, refreshToken }` |
| POST   | `/auth/refresh`  | —     | `{ refreshToken }`          | `{ accessToken, refreshToken }`       |
| GET    | `/auth/profile`  | 🔒    | —                           | current user                          |

### Products — `/products` (reads public; writes 🔒)

| Method | Path                 | Guard | Notes                                                                                                                      |
| ------ | -------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/products`          | —     | filter/sort/paginate (`search, category, featured, minPrice, maxPrice, page, limit, sortBy, sortOrder`) → `{ data, meta }` |
| GET    | `/products/featured` | —     | up to 8 featured                                                                                                           |
| GET    | `/products/:slug`    | —     | full detail (images, specs, variants, up to 10 reviews)                                                                    |
| POST   | `/products`          | 🔒    | create                                                                                                                     |
| PUT    | `/products/:slug`    | 🔒    | update (⚠️ ignores nested images/specs/variants)                                                                           |
| DELETE | `/products/:slug`    | 🔒    | soft-delete (`isActive = false`)                                                                                           |

### Cart — `/cart` (all 🔒)

`GET /cart` · `POST /cart/items` · `PATCH /cart/items/:itemId` · `DELETE /cart/items/:itemId` · `DELETE /cart`

### Orders — `/orders` (all 🔒)

`GET /orders` · `POST /orders` · `GET /orders/:id` · `GET /orders/number/:orderNumber` · `PATCH /orders/:id/status`

### Addresses — `/addresses` (all 🔒)

`GET /addresses` · `POST /addresses` · `PUT /addresses/:id` · `DELETE /addresses/:id` · `PATCH /addresses/:id/default`
(Setting one address default unsets the others for that user; `country` defaults to `India`.)

### Payment — `/payment` (all 🔒)

`POST /payment/create-order` · `POST /payment/verify`

---

## 6. Data model (Prisma → PostgreSQL)

Source: `packages/database/prisma/schema.prisma`. IDs are `cuid()`.

| Model                                           | Key fields                                                                                                                                                 | Relationships                                           |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **User**                                        | `email` (unique), `passwordHash`, `firstName?`, `lastName?`, `phone?`, `role` (CUSTOMER/ADMIN/SUPER_ADMIN)                                                 | 1→1 `Cart`, 1→N `Order`, `Address`, `Review`            |
| **Cart**                                        | `userId` (unique → one cart per user)                                                                                                                      | N `CartItem`                                            |
| **CartItem**                                    | `quantity`, unique `(cartId, productId)`                                                                                                                   | → `Cart`, `Product`                                     |
| **Order**                                       | `orderNumber` (unique), `status`, `subtotal/tax/shipping/total`, `shippingAddress`/`billingAddress` (**JSON**), `paymentMethod`, `paymentStatus`, `notes?` | → `User`, N `OrderItem`                                 |
| **OrderItem**                                   | `quantity`, `price` (**snapshot**)                                                                                                                         | → `Order`, `Product`                                    |
| **Product**                                     | `slug`/`sku` (unique), `price`, `compareAtPrice?`, `stock`, `isActive`, `isFeatured`                                                                       | → `Category`, `Brand?`; N images/specs/variants/reviews |
| **Category / Brand**                            | `slug` (unique); Category self-nests via `parentId`                                                                                                        | → `Product`                                             |
| **ProductImage / ProductSpec / ProductVariant** | image `url/alt/order`; spec `key/value`; variant `name/sku/price/stock`                                                                                    | → `Product` (cascade delete)                            |
| **Address**                                     | `type` (SHIPPING/BILLING/BOTH), name/phone/`line1/line2?/city/state/postalCode/country`, `isDefault`                                                       | → `User`                                                |
| **Review**                                      | `rating`, `title?`, `comment?`, `isVerified`, unique `(userId, productId)`                                                                                 | → `User`, `Product`                                     |

Enums: `UserRole`, `OrderStatus` (PENDING→CONFIRMED→PROCESSING→SHIPPED→DELIVERED, + CANCELLED/REFUNDED), `PaymentStatus` (PENDING/PAID/FAILED/REFUNDED), `AddressType`.

---

## 7. Auth model in detail

- **Access token:** JWT signed with `JWT_SECRET`, payload `{ sub: userId, email }`, **15-minute** lifetime.
- **Refresh token:** JWT signed with `JWT_REFRESH_SECRET`, **7-day** lifetime.
- **Validation:** `JwtStrategy` pulls the bearer token, verifies signature/expiry, and re-loads the user from the DB (`validateUserById`) so `req.user` is always a fresh record.
- **Refresh flow:** `POST /auth/refresh` verifies the refresh token and mints a **new pair**. The frontend does this automatically on the first `401`, then retries the original request.
- **Client storage:** tokens live in `localStorage` (`srm_access_token`, `srm_refresh_token`); the user object is persisted in the `srm-auth` Zustand store.

---

## 8. Known gaps / things to be aware of

1. **Backend not configured to run** — no `apps/api/.env`; must be created (see §1) before anything server-side works.
2. **DB credentials mismatch** — the running Postgres rejects the documented `user/password`. Confirm the real credentials and put them in `DATABASE_URL`, or start the bundled `docker-compose` Postgres.
3. **No role-based authorization** — `User.role` exists but is never enforced. Every "admin" write route (create/update/delete product, update order status) only requires _any_ valid JWT. This should be gated before production.
4. **Refresh tokens are not persisted or revocable** — logout only clears the client; a stolen refresh token stays valid for 7 days.
5. **Weak fallback secrets** — the code falls back to literals like `'secret-key'`/`'refresh-secret-key'` if env vars are missing. Always set strong secrets.
6. **Product update ignores nested data** — `PUT /products/:slug` updates scalar fields only; images/specs/variants passed in the body are silently dropped.
7. **Duplicated money logic** — the ₹1000 free-shipping / 18% tax rules are implemented separately in the cart and order services; keep them in sync.

---

_Generated from a read of `apps/api/src/**`, `packages/database/prisma/schema.prisma`, and `apps/web/src/lib/{api,auth-store,cart-store}.ts`._
