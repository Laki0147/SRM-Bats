# 🚀 Deployment — Docker (single Linux host)

This guide packages **SRM Bats** — the Next.js storefront (`apps/web`), the NestJS API
(`apps/api`), and PostgreSQL — into Docker images that run together on **one Linux
(x86-64) host** via `docker compose`. After the first setup, deploying is `git pull` →
`docker compose … up -d --build`, with data and uploads persisted across restarts.

> The existing root `docker-compose.yml` (postgres-only, for local `pnpm dev`) is left
> untouched. Production uses the separate **`docker-compose.prod.yml`**.

---

## 🧱 What runs

```
docker-compose.prod.yml   (compose project: "srm-bats", one bridge network)
├── postgres   postgres:16-alpine · volume postgres_data · healthcheck pg_isready
├── migrate    one-shot: applies migrations + seeds, then exits 0
│                 (Dockerfile.api "build" stage — has the Prisma CLI + tsx)
├── api        NestJS on :3001 · volume uploads_data · GET /health · published 3001
└── web        Next.js standalone server on :3000 · published 3000
```

**Startup order** (compose enforces it): `postgres` becomes healthy → `migrate` runs
`prisma migrate deploy` + seed and exits `0` → `api` starts → `web` starts. Services talk
to each other by service name (`postgres`, `api`) over the compose network.

Both images build from **`node:20-bookworm-slim`** (glibc — so Prisma's default engine
works without musl `binaryTargets` tweaks) and use **pnpm via corepack**, pinned by the
root `packageManager` field.

---

## 📦 Files in this change

| File                             | Purpose                                                                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Dockerfile.api`                 | Multi-stage build for the API. The `build` stage generates the Prisma client, builds `@srm-bats/database` + the API, and is reused by the `migrate` service; the `runtime` stage runs `node dist/main`. |
| `Dockerfile.web`                 | Multi-stage build for the storefront. Bakes `NEXT_PUBLIC_*` at build time and serves Next's **standalone** output.                                                                                      |
| `docker-compose.prod.yml`        | The production stack: postgres + one-shot migrate + api + web, with named volumes and healthchecks.                                                                                                     |
| `.dockerignore`                  | Keeps the build context small and free of host state/secrets (`node_modules`, `.next`, `dist`, `.env*`, `uploads`, etc.).                                                                               |
| `.env.example`                   | Documents **every** runtime and build variable. Copy to `.env` and fill in.                                                                                                                             |
| `apps/web/next.config.js`        | `output: 'standalone'` + `outputFileTracingRoot` for monorepo dep tracing; derives the `next/image` host from `NEXT_PUBLIC_API_URL` for `/uploads` images.                                              |
| `packages/database/package.json` | Adds `db:deploy` (`prisma migrate deploy`) used by the `migrate` service.                                                                                                                               |

---

## ✅ Prerequisites (on the server)

- Docker Engine + the Compose v2 plugin (`docker compose version`).
- The deploy user in the `docker` group (or run with `sudo`).
- The repository cloned on the host, and inbound ports **3000** and **3001** open in the
  firewall / security group.

---

## 🔐 Configure environment

All configuration lives in a single git-ignored **`.env`** at the repo root, loaded by
compose (`env_file` for runtime, `build.args` for the web image). Start from the template:

```bash
cp .env.example .env
```

Then edit `.env`: set strong secrets and replace every **`<SERVER_PUBLIC_HOST>`** with the
server's public IP or hostname.

| Variable                                              | Used by           | Notes                                                                                                                                       |
| ----------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | postgres          | Database credentials + name.                                                                                                                |
| `DATABASE_URL`                                        | api, migrate      | Host **must** be `postgres` (the service name); creds must match the `POSTGRES_*` above.                                                    |
| `PORT`                                                | api               | `3001`.                                                                                                                                     |
| `FRONTEND_URL`                                        | api               | Public origin of the web app, used for CORS. Must match how browsers reach the web (`http://<SERVER_PUBLIC_HOST>:3000`).                    |
| `JWT_SECRET` / `JWT_REFRESH_SECRET`                   | api               | **Server-side only.** Never expose to the browser.                                                                                          |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`             | api               | The **secret stays server-side only** — never a `NEXT_PUBLIC_*` var or a build arg.                                                         |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD`                      | migrate (seed)    | Seeded admin user, created idempotently.                                                                                                    |
| `NEXT_PUBLIC_API_URL`                                 | web **build arg** | Public URL the **browser** uses for the API (`http://<SERVER_PUBLIC_HOST>:3001`). **Baked at build — rebuild the web image if it changes.** |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`                         | web **build arg** | Public Razorpay key id (safe to expose). Baked at build.                                                                                    |
| `NEXTAUTH_SECRET`                                     | web runtime       | Required by NextAuth.                                                                                                                       |
| `NEXTAUTH_URL`                                        | web runtime       | `http://<SERVER_PUBLIC_HOST>:3000`.                                                                                                         |

> **Secrets never reach the browser.** Only `NEXT_PUBLIC_*` values are inlined into the web
> bundle. `RAZORPAY_KEY_SECRET`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` are API-only and must
> never become `NEXT_PUBLIC_*` vars or web build args.

---

## ▶️ Deploy

From the repo root on the server:

```bash
# 1. Build the images and start everything in the background.
docker compose -f docker-compose.prod.yml up -d --build

# 2. Watch it come up (migrate runs once and exits 0, then api + web start).
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f migrate api web
```

`build` and `up` can be split (`… build` then `… up -d`) if you prefer. The `migrate`
service applies any pending migrations and re-seeds **idempotently** on every `up`, so it is
safe to leave in the startup path.

---

## 🔎 Verify

1. `docker compose -f docker-compose.prod.yml ps` — `postgres` healthy, `migrate` `Exited (0)`, `api` + `web` `Up`.
2. `curl http://<SERVER_PUBLIC_HOST>:3001/health` → `{"status":"ok"}`.
3. Open `http://<SERVER_PUBLIC_HOST>:3000` — storefront loads; log in as the seeded admin (`ADMIN_EMAIL`).
4. In `/admin`, create a product with an image upload → the image serves at `/uploads/...` and renders on the storefront.
5. **Persistence:** `docker compose -f docker-compose.prod.yml down && … up -d` (volumes retained) → the product and uploaded image survive. `docker volume ls` shows `srm-bats_postgres_data` and `srm-bats_uploads_data`.
6. No CORS errors in the browser console (validates `FRONTEND_URL`).

---

## 🔁 Operations

**Redeploy (new code):**

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

**Rebuild the web image when a public URL changes.** `NEXT_PUBLIC_*` values are baked into
the web bundle at build time, so after editing `NEXT_PUBLIC_API_URL` or
`NEXT_PUBLIC_RAZORPAY_KEY_ID` you must rebuild web specifically:

```bash
docker compose -f docker-compose.prod.yml up -d --build web
```

**Logs / restart / stop:**

```bash
docker compose -f docker-compose.prod.yml logs -f api        # follow one service
docker compose -f docker-compose.prod.yml restart api web    # restart without rebuild
docker compose -f docker-compose.prod.yml down               # stop; volumes are KEPT
docker compose -f docker-compose.prod.yml down -v            # stop AND delete data volumes ⚠️
```

---

## 💾 Data & persistence

Two named volumes hold all state; everything else is disposable and rebuilt from the images:

| Volume          | Mounted at                          | Holds                                                                    |
| --------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| `postgres_data` | `postgres:/var/lib/postgresql/data` | The database.                                                            |
| `uploads_data`  | `api:/app/apps/api/uploads`         | Product images and other uploads (the API serves these at `/uploads/*`). |

`docker compose … down` stops containers but **keeps** these volumes. `down -v` deletes
them — do not use it unless you intend to wipe all data.

**Backups (recommended):**

```bash
# Database dump
docker compose -f docker-compose.prod.yml exec postgres \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backup-$(date +%F).sql

# Uploaded files (copy the volume contents out of the api container)
docker compose -f docker-compose.prod.yml cp api:/app/apps/api/uploads ./uploads-backup
```

---

## 🌐 Ports

| Service | Container | Published on host |
| ------- | --------- | ----------------- |
| web     | 3000      | `3000`            |
| api     | 3001      | `3001`            |

The API's port is published because both the browser (for auth) and `next/image` (for
`/uploads/*` images) need `api` to be publicly reachable. No reverse proxy / TLS is included
in this round — put nginx/Caddy in front and terminate TLS when you add a domain.

---

## 🩹 Troubleshooting

- **`migrate` didn't exit 0 / API can't connect to the DB** — check `DATABASE_URL` uses host
  `postgres` and credentials that match `POSTGRES_*`. Inspect `logs migrate`.
- **Prisma client / engine errors at runtime** — the image generates the client explicitly
  (there is no `postinstall` hook); a stale image is the usual cause. Rebuild with
  `--build --no-cache` if needed.
- **Login fails in production** — ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set, and
  that `NEXT_PUBLIC_API_URL` points at a URL the browser (and the web container) can reach.
- **API URL / Razorpay key changed but the site still uses the old value** — those are
  `NEXT_PUBLIC_*`, baked at build; rebuild the web image (see Operations).
- **Uploaded images 404 after redeploy** — confirm the `uploads_data` volume is still
  attached (`docker volume ls`) and that you didn't run `down -v`.
- **CORS errors in the console** — `FRONTEND_URL` must equal the exact origin the browser
  uses for the storefront.
