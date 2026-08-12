#!/usr/bin/env bash
# =============================================================================
# SRM Bats — one-command setup + run + verify on an Oracle Linux server.
#
#   sudo ./setup.sh
#
# It will:
#   1. Install Docker CE + the compose plugin if they are missing (Oracle Linux)
#   2. Create ./.env with strong auto-generated secrets + the server's IP
#   3. Build the images (api, web, migrate) from docker-compose.prod.yml
#   4. Start PostgreSQL, then load data:
#        - if deploy/seed-data/db.sql exists  -> restore your local DB + uploads
#        - otherwise                          -> run migrations + seed (baseline)
#   5. Start the api (:3001) and web (:3000) servers
#   6. Verify /health and the web root respond, then print status + login
#
# Re-runnable: an existing .env is kept; an already-populated DB is not clobbered
# (use ./reset.sh for a clean slate).
# =============================================================================
set -euo pipefail

COMPOSE_FILE="docker-compose.prod.yml"

# ---- pretty logging ---------------------------------------------------------
c_blue='\033[1;34m'; c_green='\033[1;32m'; c_yellow='\033[1;33m'; c_red='\033[1;31m'; c_off='\033[0m'
say()  { printf "${c_blue}==>${c_off} %s\n" "$*"; }
ok()   { printf "${c_green}  ✓${c_off} %s\n" "$*"; }
warn() { printf "${c_yellow}  ! %s${c_off}\n" "$*"; }
die()  { printf "${c_red}  ✗ %s${c_off}\n" "$*" >&2; exit 1; }

# ---- always run from the project root (works from any /mnt/... path) --------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ---- need root for docker install + daemon socket; self-elevate ------------
if [ "$(id -u)" -ne 0 ]; then
  if command -v sudo >/dev/null 2>&1; then
    say "Re-running with sudo (root is required to install/run Docker)…"
    exec sudo -E bash "$0" "$@"
  fi
  die "Please run this script as root:  sudo ./setup.sh"
fi

[ -f "$COMPOSE_FILE" ]  || die "$COMPOSE_FILE not found — run this from the project root."
[ -f ".env.example" ]   || die ".env.example not found — run this from the project root."

# =============================================================================
# 1. Docker
# =============================================================================
say "Checking Docker…"
if ! command -v dnf >/dev/null 2>&1; then
  warn "This script targets Oracle Linux / RHEL (dnf). Continuing, but install steps may differ."
fi

if ! command -v docker >/dev/null 2>&1; then
  say "Docker not found — installing (get.docker.com, Oracle-Linux aware)…"
  curl -fsSL https://get.docker.com | sh \
    || die "Docker install failed. Manual install:
      sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
      sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
      (if it complains about 'runc', run: sudo dnf remove -y runc  then retry)"
  ok "Docker installed."
else
  ok "Docker present: $(docker --version)"
fi

# compose plugin (v2)
if ! docker compose version >/dev/null 2>&1; then
  say "Installing docker compose plugin…"
  dnf install -y docker-compose-plugin >/dev/null 2>&1 \
    || die "Could not install the 'docker compose' plugin — install it and re-run."
fi
ok "Compose present: $(docker compose version | head -n1)"

say "Enabling + starting the Docker service…"
systemctl enable --now docker >/dev/null 2>&1 || warn "Could not enable docker via systemctl (is systemd present?)."
# Let the invoking (non-root) user run docker later without sudo.
if [ -n "${SUDO_USER:-}" ] && [ "$SUDO_USER" != "root" ]; then
  if usermod -aG docker "$SUDO_USER" 2>/dev/null; then
    warn "Added '$SUDO_USER' to the 'docker' group — log out/in for it to take effect."
  fi
fi

DC="docker compose -f $COMPOSE_FILE"

# =============================================================================
# 2. .env
# =============================================================================
set_env() { sed -i "s|^$1=.*|$1=$2|" .env; }        # values here are hex/IP/URL → no '|' inside
get_env() { grep -E "^$1=" .env | head -n1 | cut -d= -f2- || true; }

detect_ip() {
  local ip=""
  ip="$(ip -4 route get 1.1.1.1 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i=="src"){print $(i+1); exit}}')" || true
  [ -z "$ip" ] && ip="$(hostname -I 2>/dev/null | awk '{print $1}')" || true
  [ -z "$ip" ] && ip="127.0.0.1"
  echo "$ip"
}

if [ -f .env ]; then
  say ".env already exists — keeping it as-is."
else
  say "Generating .env (strong random secrets + auto-detected server IP)…"
  command -v openssl >/dev/null 2>&1 || die "openssl is required to generate secrets (dnf install -y openssl)."
  SERVER_IP="$(detect_ip)"
  cp .env.example .env

  DB_PASS="$(openssl rand -hex 24)"
  PGUSER="$(get_env POSTGRES_USER)"; PGUSER="${PGUSER:-srmbats}"
  PGDB="$(get_env POSTGRES_DB)";     PGDB="${PGDB:-srm_bats}"

  set_env POSTGRES_PASSWORD    "$DB_PASS"
  set_env DATABASE_URL         "postgresql://${PGUSER}:${DB_PASS}@postgres:5432/${PGDB}"
  set_env JWT_SECRET           "$(openssl rand -hex 32)"
  set_env JWT_REFRESH_SECRET   "$(openssl rand -hex 32)"
  set_env NEXTAUTH_SECRET      "$(openssl rand -hex 32)"
  set_env ADMIN_PASSWORD       "$(openssl rand -hex 12)"
  set_env FRONTEND_URL         "http://${SERVER_IP}:3000"
  set_env NEXTAUTH_URL         "http://${SERVER_IP}:3000"
  set_env NEXT_PUBLIC_API_URL  "http://${SERVER_IP}:3001"

  chmod 600 .env
  ok ".env created (server IP: ${SERVER_IP}). Secrets are random; see the file to view them."
fi

PGUSER="$(get_env POSTGRES_USER)"; PGUSER="${PGUSER:-srmbats}"
PGDB="$(get_env POSTGRES_DB)";     PGDB="${PGDB:-srm_bats}"

# Warn if Razorpay is still the placeholder (checkout won't work until real keys are set).
if get_env NEXT_PUBLIC_RAZORPAY_KEY_ID | grep -q 'XXXX'; then
  warn "Razorpay keys in .env are placeholders. For real checkout, set RAZORPAY_KEY_ID,"
  warn "RAZORPAY_KEY_SECRET and NEXT_PUBLIC_RAZORPAY_KEY_ID in .env, then rebuild web:"
  warn "  $DC up -d --build web"
fi

# =============================================================================
# 3. Build
# =============================================================================
say "Building images (this can take several minutes on first run)…"
$DC build

# =============================================================================
# 4. Start Postgres + load data
# =============================================================================
say "Starting PostgreSQL…"
$DC up -d postgres || warn "compose reported an error starting postgres — checking readiness anyway…"

say "Waiting for PostgreSQL to be ready…"
pg_ready=0
for _ in $(seq 1 30); do
  if $DC exec -T postgres pg_isready -U "$PGUSER" -d "$PGDB" >/dev/null 2>&1; then pg_ready=1; break; fi
  sleep 2
done
[ "$pg_ready" = "1" ] || die "PostgreSQL did not become ready. Logs: $DC logs postgres"
ok "PostgreSQL is ready."

DATA_MODE="seed"
[ -f deploy/seed-data/db.sql ] && DATA_MODE="clone"

if [ "$DATA_MODE" = "clone" ]; then
  # Only restore into an empty database; never clobber existing data.
  TABLE_COUNT="$($DC exec -T postgres psql -tAqc \
    "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" \
    -U "$PGUSER" -d "$PGDB" 2>/dev/null | tr -d '[:space:]' || echo 0)"
  TABLE_COUNT="${TABLE_COUNT:-0}"

  if [ "$TABLE_COUNT" -gt 0 ]; then
    warn "Database already has ${TABLE_COUNT} tables — skipping restore (use ./reset.sh for a clean slate)."
  else
    say "Restoring your local database dump (deploy/seed-data/db.sql)…"
    if $DC exec -T postgres psql -v ON_ERROR_STOP=1 -U "$PGUSER" -d "$PGDB" < deploy/seed-data/db.sql >/dev/null; then
      ok "Database restored from local dump."
    else
      die "Restore failed. The dump may target a different schema. Fix the dump, or run
     ./reset.sh to start from a clean seeded baseline instead."
    fi
  fi

  say "Starting the API server…"
  # --no-deps => do NOT run migrate/seed over cloned data (would overwrite edits)
  $DC up -d --no-deps api || warn "compose reported an error starting api — verification below will re-check."

  # wait for API health before copying uploads into its volume
  api_ok=0
  for _ in $(seq 1 40); do
    if curl -fsS "http://127.0.0.1:3001/health" >/dev/null 2>&1; then api_ok=1; break; fi
    sleep 3
  done
  [ "$api_ok" = "1" ] || warn "API not healthy yet — continuing; verification below will re-check."

  if [ -d deploy/seed-data/uploads ] && [ -n "$(ls -A deploy/seed-data/uploads 2>/dev/null || true)" ]; then
    say "Loading uploaded product images into the api volume…"
    $DC cp deploy/seed-data/uploads/. api:/app/apps/api/uploads/ && ok "Uploads loaded."
  else
    warn "No deploy/seed-data/uploads found — product images may be missing."
  fi

  say "Starting the web server…"
  $DC up -d --no-deps web || warn "compose reported an error starting web — verification below will re-check."
else
  say "No local dump found (deploy/seed-data/db.sql) — running migrations + seed."
  say "Starting migrate → api → web (compose orchestrates the order)…"
  # cascades: postgres -> migrate(deploy+seed) -> api -> web
  $DC up -d web || warn "compose reported an error bringing up the stack — verification below will re-check."
fi

# =============================================================================
# 5. Verify
# =============================================================================
say "Verifying services…"

api_ok=0
for _ in $(seq 1 40); do
  if curl -fsS "http://127.0.0.1:3001/health" 2>/dev/null | grep -q '"status":"ok"'; then api_ok=1; break; fi
  sleep 3
done

web_ok=0
for _ in $(seq 1 40); do
  code="$(curl -fsS -o /dev/null -w '%{http_code}' "http://127.0.0.1:3000/" 2>/dev/null || echo 000)"
  if [ "$code" = "200" ]; then web_ok=1; break; fi
  sleep 3
done

echo
$DC ps
echo
SERVER_IP="$(detect_ip)"

if [ "$api_ok" = "1" ]; then ok "API healthy  → http://127.0.0.1:3001/health"; else warn "API health check FAILED. Logs: $DC logs api"; fi
if [ "$web_ok" = "1" ]; then ok "Web serving  → http://127.0.0.1:3000/";      else warn "Web check FAILED. Logs: $DC logs web"; fi

echo
say "Reachable ON THIS SERVER:  http://127.0.0.1:3000  (web)   http://127.0.0.1:3001  (api)"
say "When you open the firewall later, also at:  http://${SERVER_IP}:3000  and  :3001"
echo
if [ "$DATA_MODE" = "clone" ]; then
  say "Data: cloned from your local machine. Log in with your EXISTING local admin credentials."
else
  ADMIN_EMAIL="$(get_env ADMIN_EMAIL)"; ADMIN_PASSWORD="$(get_env ADMIN_PASSWORD)"
  say "Data: fresh seed. Admin login →  ${ADMIN_EMAIL:-admin@srmbats.com} / ${ADMIN_PASSWORD:-<see .env>}"
fi
echo
cat <<'NOTE'
Open external access (only when you want the site reachable off-box):
  sudo firewall-cmd --add-port=3000/tcp --add-port=3001/tcp --permanent
  sudo firewall-cmd --reload
  # On Oracle Cloud (OCI) also add ingress for TCP 3000 & 3001 in the VCN Security List / NSG.

Fresh start (wipe DB + uploads, reseed clean):   ./reset.sh
NOTE

if [ "$api_ok" = "1" ] && [ "$web_ok" = "1" ]; then
  ok "All services are up and verified."
else
  die "One or more services failed verification — see the logs hints above."
fi
