# Deploy SRM Bats on an Oracle Linux server (Docker)

Run the **same three services you have locally** — backend (`:3001`), frontend (`:3000`) and
PostgreSQL — in Docker on an Oracle Linux box, with **your current local data**, using one command.

The full container stack already lives in the repo (`docker-compose.prod.yml`, `Dockerfile.api`,
`Dockerfile.web`). These deploy helpers wrap it for Oracle Linux and clone your data.

```
setup.sh                     one command: install Docker → build → run → verify   (server)
reset.sh                     wipe DB + uploads, reseed a clean baseline            (server)
deploy/export-local-data.ps1 dump your local DB + copy uploads into seed-data/     (local Windows)
deploy/seed-data/            db.sql + uploads/  (gitignored — real data; copy by hand)
```

---

## Step 1 — capture your local data (on your Windows PC)

From the project root:

```powershell
powershell -ExecutionPolicy Bypass -File deploy\export-local-data.ps1
```

This writes `deploy/seed-data/db.sql` (a `pg_dump` of your local DB) and copies
`apps/api/uploads` → `deploy/seed-data/uploads`. It uses Docker for `pg_dump`, so no Postgres
client tools are required. If your local DB uses different credentials, pass them:

```powershell
powershell -ExecutionPolicy Bypass -File deploy\export-local-data.ps1 -DbUser postgres -DbPassword postgres -DbName srm_bats
```

> Skip this step if you only want the built-in **seed** data (admin + demo catalog, no images).
> With no `deploy/seed-data/db.sql` present, `setup.sh` seeds automatically.

## Step 2 — copy the project to the server

Download / copy the whole project (including `deploy/seed-data/`) to the Oracle Linux server under
your `/mnt/...` path, e.g. `/mnt/srm-bats`.

## Step 3 — run it (on the server)

```bash
cd /mnt/srm-bats
chmod +x setup.sh reset.sh      # first time only
sudo ./setup.sh
```

`setup.sh` will:

1. **Install Docker CE + the compose plugin** if missing (via `get.docker.com`, Oracle-Linux aware),
   enable the service, and add your user to the `docker` group.
2. **Create `.env`** with strong auto-generated secrets (`POSTGRES_PASSWORD`, `JWT_*`,
   `NEXTAUTH_SECRET`, a random `ADMIN_PASSWORD`) and set the server's IP into `FRONTEND_URL`,
   `NEXTAUTH_URL`, `NEXT_PUBLIC_API_URL`. An existing `.env` is left untouched.
3. **Build** the api / web / migrate images.
4. **Start Postgres**, then load data:
   - **`db.sql` present →** restore your local database, start the API, copy your uploaded images
     into the API's volume. (Migrations/seed are **skipped** so your data is preserved exactly.)
   - **no dump →** run migrations + `db:seed` (admin + demo catalog).
5. **Start** the API and web servers.
6. **Verify** — polls `http://127.0.0.1:3001/health` (expects `{"status":"ok"}`) and
   `http://127.0.0.1:3000/` (expects `200`), prints `docker compose ps`, the URLs, and the login.

It is **re-runnable**: a populated database is not clobbered (use `reset.sh` for a clean slate).

---

## Verify manually

```bash
docker compose -f docker-compose.prod.yml ps                 # postgres healthy; api + web Up
curl -s http://127.0.0.1:3001/health                         # {"status":"ok",...}
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/   # 200
curl -s http://127.0.0.1:3001/products | head -c 300         # your products present (clone)
```

## Open external access (later, when you want it)

By default nothing is exposed beyond the box. To reach it by IP from outside:

```bash
sudo firewall-cmd --add-port=3000/tcp --add-port=3001/tcp --permanent
sudo firewall-cmd --reload
```

On **Oracle Cloud (OCI)**, also add ingress rules for TCP **3000** and **3001** in the instance
subnet's **VCN Security List** (or an NSG) — the OS firewall and the cloud firewall are two
separate layers. Then browse `http://<SERVER_IP>:3000`.

> Real HTTPS + a domain is intentionally out of scope for now. When you want it, put a reverse
> proxy (e.g. Caddy or nginx) in front of `web:3000` / `api:3001` and only expose 80/443.

## Fresh start / clear test data

```bash
sudo ./reset.sh            # confirms first
sudo ./reset.sh --yes      # no prompt
```

Deletes the `postgres_data` + `uploads_data` volumes and reseeds a clean baseline. `.env` is kept;
log in afterwards with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.

---

## Notes & gotchas

- **`NEXT_PUBLIC_*` are baked into the web image at build time.** If the server IP changes (or you
  later add a domain), edit `.env` and rebuild web:
  `docker compose -f docker-compose.prod.yml up -d --build web`.
- **SELinux:** no action needed — the stack uses named Docker volumes (under `/var/lib/docker`), not
  bind mounts of your `/mnt` path, so no relabeling is required.
- **Auto-start on reboot:** services use `restart: unless-stopped`; `setup.sh` runs
  `systemctl enable docker` so they come back after a reboot.
- **`deploy/seed-data/` holds real data** (a DB dump can contain user/PII rows). It is gitignored —
  move it to the server by hand, never commit it.
- **Razorpay:** `.env` starts with placeholder test keys. Set real `RAZORPAY_KEY_ID`,
  `RAZORPAY_KEY_SECRET` and `NEXT_PUBLIC_RAZORPAY_KEY_ID` for working checkout, then rebuild web.
- **Line endings:** `setup.sh` / `reset.sh` are stored with LF (`.gitattributes`) so they run on
  Linux. If you edited them on Windows and see `bad interpreter`, run `sed -i 's/\r$//' setup.sh reset.sh`.
