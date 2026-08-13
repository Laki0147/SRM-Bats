# SRM Bats — Detailed Oracle Linux Setup Guide

A **step-by-step, explain-everything** walkthrough for running SRM Bats on an Oracle Linux
server. It takes you from a blank server to a working site — the **backend** (`:3001`), the
**frontend** (`:3000`) and the **PostgreSQL database** — all inside Docker, with **the same data
you have on your local machine**.

Every step below has two notes:

- **Why we do this** — the reason the step exists.
- **What it does** — what actually happens when you run it.

> New to Docker/Linux? Read Part 0 first — it explains the moving parts in plain language.
> Just want the short version? See the concise [`deploy/README.md`](./README.md).

---

## Contents

- [Part 0 — The big picture](#part-0--the-big-picture)
- [Part 1 — Prerequisites](#part-1--prerequisites-what-you-need-first)
- [Part 2 — The files you need (and where they go)](#part-2--the-files-you-need-and-where-they-go)
- [Part 3 — Step A: Capture your local data (on Windows)](#part-3--step-a-capture-your-local-data-on-your-windows-pc)
- [Part 4 — Step B: Get the project onto the server](#part-4--step-b-get-the-project-onto-the-server)
- [Part 5 — Step C: Run the setup script](#part-5--step-c-run-the-setup-script)
- [Part 6 — Step D: Verify everything works](#part-6--step-d-verify-everything-works)
- [Part 7 — Logging in / using the app](#part-7--logging-in--using-the-app)
- [Part 8 — Reset / clear test data](#part-8--reset--clear-test-data)
- [Part 9 — (Later) Open external access](#part-9--later-open-external-access)
- [Part 10 — Troubleshooting](#part-10--troubleshooting)
- [Appendix — Handy day-to-day commands](#appendix--handy-day-to-day-commands)

---

## Part 0 — The big picture

**What is Docker?** Docker packages an app together with everything it needs (Node.js, the right
libraries, etc.) into a **container** — a small, isolated box that runs the same way on any
machine. You don't install Node or PostgreSQL on the server by hand; Docker does it inside
containers for you.

**What is Docker Compose?** A tool that starts **several containers together** from one file. Our
file is `docker-compose.prod.yml`. When you "bring up" the project, Compose starts these containers:

```
Project "srm-bats"
├─ postgres   PostgreSQL 16 database        (data saved in volume: postgres_data)
├─ migrate    one-shot: create tables + seed (runs, finishes, exits — not a server)
├─ api        NestJS backend   → port 3001  (uploaded images saved in volume: uploads_data)
└─ web        Next.js frontend → port 3000
```

**What is a "volume"?** A storage area Docker keeps **outside** the containers so your data
survives even if a container is rebuilt or restarted. `postgres_data` holds the database;
`uploads_data` holds product images. These live under `/var/lib/docker`, **not** in your project
folder — which is why the `/mnt` location and SELinux don't get in the way.

**The one command:** `sudo ./setup.sh` does the entire installation, configuration, build, data
load, and health-check for you. The parts below explain what it's doing so nothing is a mystery.

---

## Part 1 — Prerequisites (what you need first)

You need an Oracle Linux server you can log into, with an account that can use `sudo`, plus
internet access so it can download Docker and the base images.

**Why we do this:** the script installs software and pulls Docker images from the internet; it
needs admin rights and a network connection to do so.

**Check them** (run these on the server after you SSH in):

```bash
cat /etc/oracle-release          # confirms this is Oracle Linux (e.g. "Oracle Linux Server 9.x")
sudo -v                          # confirms your user can use sudo (asks for your password)
ping -c 2 download.docker.com    # confirms the server can reach the internet
df -h /                          # confirms you have free disk (aim for at least ~5 GB free)
```

**What it does:** these are read-only checks — they change nothing. If `cat /etc/oracle-release`
errors, you're not on Oracle Linux (the script still tries, but install steps may differ). If
`ping` fails, fix networking/DNS before continuing.

---

## Part 2 — The files you need (and where they go)

Put the **entire project folder** on the server under a `/mnt/...` path. Throughout this guide we
use `/mnt/srm-bats` as the example — substitute your real path.

**Why we do this:** the setup script builds the app **from the project source**, so the whole
repository must be present. `/mnt` is just where you chose to keep it; any readable path works.

The files that matter for deployment:

| File / folder                                                | What it is                                         | Needed?                            |
| ------------------------------------------------------------ | -------------------------------------------------- | ---------------------------------- |
| `setup.sh`                                                   | The one-command installer + runner + verifier      | **Yes**                            |
| `reset.sh`                                                   | Wipes the DB + images and reseeds a clean baseline | For resets                         |
| `docker-compose.prod.yml`                                    | Defines the 4 containers above                     | **Yes**                            |
| `Dockerfile.api`, `Dockerfile.web`                           | Recipes to build the backend/frontend images       | **Yes** (used by build)            |
| `.env.example`                                               | Template the script copies to create `.env`        | **Yes**                            |
| `apps/`, `packages/`, `package.json`, `pnpm-lock.yaml`, etc. | The actual application source                      | **Yes** (all of it)                |
| `deploy/seed-data/db.sql`                                    | A dump of **your local database**                  | Only if you want your local data   |
| `deploy/seed-data/uploads/`                                  | A copy of **your local product images**            | Only if you want your local images |

> **Important about `deploy/seed-data/`:** it holds real data (and possibly personal info), so it
> is **gitignored** — it is deliberately **not** part of the git repository. If you get the project
> onto the server with `git clone`, this folder will **not** come with it and you must copy it
> across separately (covered in Part 4). If you don't provide it at all, the script falls back to
> seeding a fresh demo catalog instead.

---

## Part 3 — Step A: Capture your local data (on your Windows PC)

Do this **on your Windows machine**, from the project root — **skip it** if you're happy with the
built-in demo/seed data instead of your real local data.

```powershell
powershell -ExecutionPolicy Bypass -File deploy\export-local-data.ps1
```

If your local database uses non-default credentials, pass them:

```powershell
powershell -ExecutionPolicy Bypass -File deploy\export-local-data.ps1 -DbUser postgres -DbPassword postgres -DbName srm_bats
```

**Why we do this:** the built-in seed can only recreate a generic demo catalog. It **cannot**
reproduce products you added through the admin panel or images you uploaded. To get _the same site
you see locally_, we take a snapshot of your local data first.

**What it does:** it runs `pg_dump` (inside a temporary Postgres container, so you don't need any
database tools installed) to write `deploy/seed-data/db.sql`, and copies `apps/api/uploads` into
`deploy/seed-data/uploads/`. Those two are the "clone bundle" the server will restore.

---

## Part 4 — Step B: Get the project onto the server

Getting the project onto the server is **two things**: (B1) the **code**, and (B2) your **local
data**. Do them in order — the data step is separate on purpose, because git never carries the data.

### The repository

- **Git URL:** `https://github.com/Laki0147/SRM-Bats.git`
- **Branch with all the current work:** `feature/impeccable-redesign-2026-07-26`

**Why this matters:** the full app (storefront + cart/checkout/payments + admin CMS), the redesign,
and these deploy scripts all live on the **`feature/impeccable-redesign-2026-07-26`** branch — not on
`master`. Always check out that branch, or you'll get older code.

---

### Step B1 — Get the code onto the server

Pick **one** option.

**Option A — Clone from GitHub (recommended; gives you clean, updatable code):**

```bash
# On the server:
cd /mnt
git clone https://github.com/Laki0147/SRM-Bats.git srm-bats
cd srm-bats
git checkout feature/impeccable-redesign-2026-07-26
```

**Why we do this:** `git clone` downloads the project; `git checkout` switches to the branch that
actually contains all your work.
**What it does:** creates `/mnt/srm-bats` with the full source on the correct branch.

**Already cloned it before and just want the latest changes?** Pull instead of cloning again:

```bash
cd /mnt/srm-bats
git checkout feature/impeccable-redesign-2026-07-26
git pull origin feature/impeccable-redesign-2026-07-26
```

**Why we do this:** `git pull` fetches and applies any new commits I've pushed since your last copy.
**What it does:** updates the code in place — your `.env` and `deploy/seed-data/` are untouched
(they're gitignored, so pull never overwrites them).

**Option B — Copy the whole folder from Windows (carries your data in one move):**

Use WinSCP (a graphical file-copy app) or `scp` from PowerShell to copy the entire project —
**including `deploy/seed-data/`** — to the server.

```powershell
# From your Windows PC. Replace user@server and the paths as needed.
scp -r C:\new-project user@your-server:/mnt/srm-bats
```

**Why we do this:** copying the folder directly also carries the gitignored `deploy/seed-data/`, so
the code **and** your data arrive together — you can skip Step B2 below.
**What it does:** transfers the project files over SSH into `/mnt/srm-bats` on the server.

---

### Step B2 — Bring your local data across (git does NOT include it)

**This step is required only if you cloned in Option A** (Option B already brought the data along).

Your real data is **not in the git repository** — it is deliberately gitignored, so it is never
uploaded to GitHub and never comes down with a `git clone`/`git pull`. You must **request/transfer it
by hand**. This is:

- `deploy/seed-data/db.sql` + `deploy/seed-data/uploads/` — the database dump + product images you
  created in [Part 3](#part-3--step-a-capture-your-local-data-on-your-windows-pc)
- (secrets like `.env` are generated fresh on the server by `setup.sh`, so you don't copy those)

From your **Windows PC**, copy only the data bundle onto the server:

```powershell
scp -r C:\new-project\deploy\seed-data user@your-server:/mnt/srm-bats/deploy/
```

**Why we do this:** `setup.sh` looks for `deploy/seed-data/db.sql`; if it's there, it restores your
exact local database + images instead of generating a generic demo catalog.
**What it does:** places your data bundle at `/mnt/srm-bats/deploy/seed-data/` so the next step can
restore it.

> **Don't want your local data?** Skip Step B2 entirely. With no `deploy/seed-data/db.sql` present,
> `setup.sh` automatically seeds a fresh demo catalog instead.

---

## Part 5 — Step C: Run the setup script

```bash
cd /mnt/srm-bats
chmod +x setup.sh reset.sh
sudo ./setup.sh
```

**Why we do this:** this is the actual install-and-run. `chmod +x` makes the scripts executable;
`sudo` is required because installing Docker and talking to the Docker service need admin rights.

**What it does:** `setup.sh` runs six phases in order. You don't type anything else — but here is
exactly what each phase is doing so you can follow along in the output:

1. **Install Docker (if missing).**
   - _Why:_ the whole app runs in Docker; without it, nothing else can happen.
   - _What:_ checks for `docker`; if absent, installs Docker CE + the Compose plugin (via the
     official `get.docker.com` installer, which knows Oracle Linux), enables the Docker service so
     it starts on boot, and adds your user to the `docker` group.
   - _Note:_ the group change only takes effect after you **log out and back in** — but this run
     already uses `sudo`, so it continues fine right now.

2. **Create `.env` (secrets + server address).**
   - _Why:_ the app needs passwords/secrets and needs to know its own web address. We generate
     these automatically so nothing insecure is hard-coded.
   - _What:_ if there's no `.env` yet, it copies `.env.example` and fills in a strong random
     database password, `JWT`/`NextAuth` secrets, and a random admin password, then detects the
     server's IP and sets `FRONTEND_URL`, `NEXTAUTH_URL`, and `NEXT_PUBLIC_API_URL` to it. The file
     is locked to owner-only (`chmod 600`). An existing `.env` is **left untouched**.

3. **Build the images.**
   - _Why:_ your source code has to be compiled into runnable container images before it can start.
   - _What:_ runs `docker compose -f docker-compose.prod.yml build`, which follows `Dockerfile.api`
     and `Dockerfile.web` to produce the backend and frontend images. **First build takes several
     minutes** (it downloads Node, installs dependencies, and compiles). This is normal.

4. **Start the database, then load data.**
   - _Why:_ the app is useless without its database and content.
   - _What:_ starts PostgreSQL and waits until it's ready. Then:
     - **If `deploy/seed-data/db.sql` exists →** it restores your local database and copies your
       uploaded images into the app — and **skips** the seed so your data isn't overwritten.
     - **If it doesn't exist →** it runs migrations and seeds a fresh demo catalog instead.
     - It also **won't clobber** an already-populated database on a re-run (use `reset.sh` for that).

5. **Start the servers.**
   - _Why:_ this is what actually serves the site.
   - _What:_ starts the `api` container on port **3001** and the `web` container on port **3000**.

6. **Verify.**
   - _Why:_ to prove it actually works instead of just assuming it did.
   - _What:_ repeatedly checks `http://127.0.0.1:3001/health` (expects `{"status":"ok"}`) and
     `http://127.0.0.1:3000/` (expects HTTP `200`), then prints the container status, the URLs, and
     your admin login. If a check fails, it points you at the relevant logs.

When it finishes successfully you'll see a green "All services are up and verified."

---

## Part 6 — Step D: Verify everything works

The script already checks this, but here's how to confirm it yourself at any time:

```bash
cd /mnt/srm-bats

# 1. See the containers. postgres should be "healthy"; api and web "Up".
docker compose -f docker-compose.prod.yml ps

# 2. Ask the backend if it's healthy. Expect: {"status":"ok",...}
curl -s http://127.0.0.1:3001/health

# 3. Ask the frontend for its home page. Expect: 200
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/

# 4. (If you cloned your data) confirm your products are present.
curl -s http://127.0.0.1:3001/products | head -c 300
```

**Why we do this:** each check targets a different layer — containers running, backend alive,
frontend serving, data present — so if something's wrong you know _which_ part.

**What it does:** these are read-only requests to the running services; they change nothing.

> "Reachable on this server" means from the server itself (`127.0.0.1`). Reaching it from your own
> laptop's browser needs the firewall opened — that's Part 9, intentionally left for later.

---

## Part 7 — Logging in / using the app

- **If you cloned your local data:** log in with the **same admin credentials you use locally** —
  the accounts came across in the database dump.
- **If you used fresh seed data:** the admin email and the auto-generated admin password are printed
  at the end of `setup.sh`. You can also read them from `.env`:

```bash
grep -E '^ADMIN_(EMAIL|PASSWORD)=' /mnt/srm-bats/.env
```

**Why we do this:** you need credentials to reach the admin CMS. **What it does:** prints the admin
email/password stored in `.env` (keep this file private — it also holds your secrets).

---

## Part 8 — Reset / clear test data

If you've been testing and want a clean slate again:

```bash
cd /mnt/srm-bats
sudo ./reset.sh          # asks you to type "yes" first
# or
sudo ./reset.sh --yes    # no prompt (for scripts)
```

**Why we do this:** to throw away test products/orders/images and return to a known-clean, freshly
seeded baseline.

**What it does:** stops the containers, **deletes** the `postgres_data` and `uploads_data` volumes
(this is permanent), then brings the stack back up — which reruns migrations and reseeds the demo
catalog. Your `.env` is **kept**, so afterward you log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD`
from `.env`.

> ⚠️ This erases the database and all uploaded images. Don't run it on data you want to keep.

---

## Part 9 — (Later) Open external access

By default the site is only reachable **on the server itself**. When you're ready to reach it from
other machines by IP, open the two ports:

```bash
sudo firewall-cmd --add-port=3000/tcp --add-port=3001/tcp --permanent
sudo firewall-cmd --reload
```

**Why we do this:** Linux's firewall (`firewalld`) blocks outside connections by default; these
commands allow traffic to the web (3000) and api (3001) ports.

**What it does:** permanently allows those ports through the OS firewall and reloads the rules.

**On Oracle Cloud (OCI), there's a second firewall:** you must **also** add ingress rules for TCP
**3000** and **3001** in your instance's **VCN Security List** (or an NSG) in the OCI web console.
The OS firewall and the cloud firewall are separate layers — both must allow the port. After that,
browse to `http://<SERVER_IP>:3000`.

> Real HTTPS + a domain name is deliberately out of scope for now. When you want it, the usual
> approach is to put a reverse proxy (Caddy or nginx) in front and expose only 80/443.

---

## Part 10 — Troubleshooting

**`bad interpreter: /usr/bin/env bash^M` or `\r` errors when running a script.**
The `.sh` file has Windows (CRLF) line endings. Fix in place:

```bash
sed -i 's/\r$//' setup.sh reset.sh
```

_Why:_ Linux shells don't accept the hidden `\r` characters Windows adds. _What it does:_ strips
them, leaving Linux (LF) line endings. (The repo's `.gitattributes` normally prevents this.)

**`permission denied` running `./setup.sh`.**

```bash
chmod +x setup.sh reset.sh
```

_Why/what:_ marks the files as executable so you can run them with `./`.

**`docker: permission denied` / `Cannot connect to the Docker daemon` as a normal user.**
You were added to the `docker` group during install, but that only applies after a fresh login.
Either **log out and back in**, or just keep using `sudo` for now. _Why:_ group membership is read
at login time.

**Port already in use (`address already in use` for 3000/3001).**
Something else is using the port. Find it and stop it:

```bash
sudo ss -ltnp | grep -E ':3000|:3001'
```

_What it does:_ lists what's listening on those ports so you can stop the conflicting process.

**The build runs out of memory or gets killed.**
Low-RAM servers can struggle to build the frontend. Give the machine swap or more RAM, then re-run
`sudo ./setup.sh` (it's safe to run again).

**Database restore failed / schema mismatch.**
Your local dump may be older than the app's current migrations. Easiest fix: start clean with
`sudo ./reset.sh` (fresh seed), or re-export locally after updating your local DB, then retry.

**I changed the server IP (or want a domain) and images/links are wrong.**
The frontend bakes its address in at **build** time. After editing `.env`, rebuild the web image:

```bash
docker compose -f docker-compose.prod.yml up -d --build web
```

**Checkout doesn't work.**
`.env` starts with placeholder Razorpay test keys. Set real `RAZORPAY_KEY_ID`,
`RAZORPAY_KEY_SECRET`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID` in `.env`, then rebuild web (command
above). _Why:_ payment keys must be your real ones for live checkout.

---

## Appendix — Handy day-to-day commands

Run these from `/mnt/srm-bats`. Tip: set a short alias for the session so you type less:

```bash
alias dc='docker compose -f docker-compose.prod.yml'
```

| Task                               | Command                                        |
| ---------------------------------- | ---------------------------------------------- |
| See container status               | `dc ps`                                        |
| Follow the backend logs            | `dc logs -f api`                               |
| Follow the frontend logs           | `dc logs -f web`                               |
| Follow the database logs           | `dc logs -f postgres`                          |
| Restart one service                | `dc restart api`                               |
| Stop everything (keep data)        | `dc down`                                      |
| Start everything again             | `dc up -d`                                     |
| Rebuild after a code update        | `git pull && dc up -d --build`                 |
| Open a shell in the api container  | `dc exec api sh`                               |
| Open a psql prompt in the database | `dc exec postgres psql -U srmbats -d srm_bats` |

**Why these matter:** `logs` is your first stop when something misbehaves; `down`/`up` stop and
start without losing data (the volumes persist); `up -d --build` is how you deploy code changes.

> Reminder: `dc down` keeps your data (volumes survive). Only `reset.sh` deletes it.
