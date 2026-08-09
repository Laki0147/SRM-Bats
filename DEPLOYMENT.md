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
| `docker-compose.proxy.yml`       | Optional overlay for **public HTTPS**: adds a Caddy reverse proxy (80/443, automatic TLS) and stops publishing the raw 3000/3001 ports. See _Public HTTPS deployment_ below.                            |
| `Caddyfile`                      | Caddy config for the proxy overlay — routes `shop.<domain>` → web and `api.<domain>` → api, with automatic Let's Encrypt certificates.                                                                  |
| `docker-compose.nginx.yml`       | Alternative public-HTTPS overlay using **nginx + certbot** instead of Caddy (same result; certbot issues/renews, nginx reloads every 6h). See _nginx + certbot variant_ below.                          |
| `nginx/app.conf.template`        | nginx server blocks (`shop`->web, `api`->api) with TLS; the init script renders it to `nginx/conf.d/app.conf`.                                                                                          |
| `nginx/init-letsencrypt.sh`      | One-time: renders the nginx config and obtains the first Let's Encrypt certificate (standalone).                                                                                                        |

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

These raw ports apply when you run **`docker-compose.prod.yml` alone** (no TLS): the browser
reaches `api` directly on `3001` for auth and `/uploads/*` images. To serve the site publicly
over HTTPS on a domain, add the Caddy overlay — the app ports are then closed and only 80/443
are exposed. See **Public HTTPS deployment on Oracle Cloud Always Free** below.

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

---

## 🌍 Public HTTPS deployment on Oracle Cloud Always Free

This puts the site on the public internet **for free**, with a real domain and automatic
HTTPS, using an always-on VM. It reuses the stack above and adds one overlay file
(`docker-compose.proxy.yml`) that fronts web + api with **Caddy** — a reverse proxy that
obtains and auto-renews Let's Encrypt certificates with no certbot/cron to babysit.

```
Internet ──► VM public IP (only 80 + 443 open)
                  │
           caddy  (publishes 80/443 · automatic TLS)
            ├── shop.<domain> ─► web:3000
            └── api.<domain>  ─► api:3001   (also /uploads/*)
                  │  (internal compose network — web/api ports NOT published)
           web ─ api ─ postgres ─ migrate     (docker-compose.prod.yml, unchanged)
                          │
                volumes: postgres_data · uploads_data · caddy_data · caddy_config
```

Two subdomains are used (not path prefixes) because the API mounts routes at the root
(`/auth`, `/products`, `/uploads`). The VM is **ARM (Ampere)** — every image here
(`node:20-bookworm-slim`, `postgres:16-alpine`, Prisma, Next standalone) is multi-arch, so
it builds and runs natively; **build on the VM**, not on an x86 laptop.

### 1. Create the VM

Oracle Cloud → **Compute → Instances → Create**:

- **Shape:** `VM.Standard.A1.Flex` (Ampere) — e.g. **2 OCPU / 12 GB** (Always Free allows up
  to 4 OCPU / 24 GB total; ≥2 OCPU / 12 GB makes the Next build comfortable).
- **Image:** Ubuntu 22.04 (aarch64). Save the SSH key. Note the **public IP**.
- _If you hit "Out of host capacity"_ (common for Always-Free ARM in busy regions): retry, or
  pick another Availability Domain / region. Don't fall back to the AMD micro — 1 GB RAM is
  too small for the web build.

### 2. Open the firewall — **two layers** (the classic Oracle gotcha)

1. **Cloud (VCN):** the subnet's **Security List** (or an NSG) → add **Ingress** rules for TCP
   **80** and **443** from `0.0.0.0/0`. SSH (22) is already open. Do **not** open 3000/3001.
2. **OS (iptables):** Oracle's Ubuntu image ships restrictive rules. Open 80/443 and persist:
   ```bash
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
   sudo netfilter-persistent save
   ```
   (Or, if you prefer ufw: `sudo ufw allow 22,80,443/tcp`.)

### 3. Install Docker + clone

```bash
curl -fsSL https://get.docker.com | sh          # Docker Engine + Compose plugin
sudo usermod -aG docker "$USER" && exit          # re-login so the group applies
# ...ssh back in...
git clone <your-repo-url> srm-bats && cd srm-bats
git checkout feature/docker-deployment
```

### 4. Configure `.env` for HTTPS

```bash
cp .env.example .env
```

Edit `.env`: set strong secrets (`POSTGRES_PASSWORD`, `JWT_SECRET`, `JWT_REFRESH_SECRET`,
`NEXTAUTH_SECRET`, `ADMIN_PASSWORD`), the `RAZORPAY_*`, then set the public-HTTPS values:

| Variable              | Value (use your real domain)                  |
| --------------------- | --------------------------------------------- |
| `DOMAIN`              | `yourdomain.com`                              |
| `ACME_EMAIL`          | your email (for Let's Encrypt)                |
| `FRONTEND_URL`        | `https://shop.yourdomain.com`                 |
| `NEXTAUTH_URL`        | `https://shop.yourdomain.com`                 |
| `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com` (baked at build) |

> Write **full literal URLs** for `FRONTEND_URL` / `NEXTAUTH_URL` / `NEXT_PUBLIC_API_URL` —
> values loaded via `env_file` are not variable-expanded, so `${DOMAIN}` would be passed
> through verbatim. Only `DOMAIN` and `ACME_EMAIL` are interpolated (into the caddy service
> and its network aliases in `docker-compose.proxy.yml`).
>
> `NEXT_PUBLIC_API_URL` is **baked into the web image at build time** — set it correctly
> before building, and rebuild web if it ever changes (see Operations).

### 5. DNS

At your DNS provider, add **A records** to the VM's public IP (add **AAAA** too if the VM has
an IPv6 address):

| Host            | Type | Value        |
| --------------- | ---- | ------------ |
| `shop.<domain>` | A    | VM public IP |
| `api.<domain>`  | A    | VM public IP |

Wait for propagation and confirm before requesting certificates: `dig +short shop.<domain>`.

### 6. Bring it up (TLS is automatic)

```bash
docker compose -f docker-compose.prod.yml -f docker-compose.proxy.yml up -d --build
```

Startup order: postgres → migrate (exits 0) → api → web → **caddy**, which then obtains
certificates for both subdomains on first request. **DNS must resolve and 80/443 must be
reachable first**, or issuance fails. Watch it:

```bash
docker compose -f docker-compose.prod.yml -f docker-compose.proxy.yml logs -f caddy
docker compose -f docker-compose.prod.yml -f docker-compose.proxy.yml ps
```

> The overlay uses the `!reset []` YAML tag to drop web/api's published ports (Compose
> _concatenates_ `ports` across files, so a plain empty list would not remove them). This
> needs Docker Compose ≥ v2.24.4 — any current install has it.

### 7. Verify (HTTPS, end to end)

1. `curl https://api.<domain>/health` → `{"status":"ok"}` with a **valid cert** (no `-k`).
2. `https://shop.<domain>` loads over HTTPS; log in as the seeded admin → server-side auth
   works (validates the Caddy network-alias path + `NEXTAUTH_*`).
3. In `/admin`, upload a product image → it serves from `https://api.<domain>/uploads/…` and
   renders via `next/image`.
4. `… down && … up -d` (volumes kept) → product + image survive.
5. No CORS or mixed-content warnings in the console.

### 8. Go-live checklist

- **Razorpay:** the template ships `rzp_test_*`. For real payments switch to **live** keys in
  `.env` (`RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` server-side; `NEXT_PUBLIC_RAZORPAY_KEY_ID`
  is a build arg → **rebuild web**). Point any Razorpay **webhook** at `https://api.<domain>/…`.
- **Admin password:** change `ADMIN_PASSWORD` off any placeholder.
- **Backups:** schedule the `pg_dump` + uploads copy from _Data & persistence_ above (cron).
- **Restart on reboot:** `restart: unless-stopped` handles containers; `sudo systemctl enable
docker` ensures Docker itself starts on boot.

### Redeploy (HTTPS stack)

```bash
git pull
docker compose -f docker-compose.prod.yml -f docker-compose.proxy.yml up -d --build
```

Certificates persist in the `caddy_data` volume across restarts. Rebuild web whenever a
`NEXT_PUBLIC_*` value (including the domain in `NEXT_PUBLIC_API_URL`) changes.

### nginx + certbot variant (instead of Caddy)

Prefer nginx? `docker-compose.nginx.yml` is a drop-in alternative to the Caddy overlay
above -- same two subdomains, same unpublished app ports -- using **nginx + certbot**.
Caddy issues and renews TLS itself; with nginx you obtain the first certificate once and a
certbot sidecar renews it (nginx reloads every 6h to pick up renewals).

It reuses the same `.env` (`DOMAIN`, `ACME_EMAIL`, and the `https://...` URLs). Steps 1-5
above (VM, firewall, Docker, `.env`, DNS) are identical; replace step 6 with:

```bash
# one-time: render nginx config + obtain the first certificate (DNS must resolve,
# :80 must be free + internet-reachable). Prefix STAGING=1 first to dodge LE rate limits.
./nginx/init-letsencrypt.sh

# then bring the whole stack up (prod + nginx overlay)
docker compose -f docker-compose.prod.yml -f docker-compose.nginx.yml up -d --build
```

Verify (step 7) and go-live (step 8) are the same. Redeploy: `git pull` then the same
`up -d --build`. Certificates persist in `certbot/conf`. Caddy stays the lighter-touch
default (fully automatic issuance + renewal); nginx is here if you prefer to run it.
