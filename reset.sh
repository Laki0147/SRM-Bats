#!/usr/bin/env bash
# =============================================================================
# SRM Bats — wipe the database + uploaded images and come back up on a CLEAN
# seeded baseline (admin + demo catalog). Use this to clear test data.
#
#   ./reset.sh            # asks for confirmation
#   ./reset.sh --yes      # no prompt (scripted)
#
# This DELETES the postgres_data and uploads_data volumes. It does NOT touch
# your .env. After it runs, log in with ADMIN_EMAIL / ADMIN_PASSWORD from .env.
# =============================================================================
set -euo pipefail

COMPOSE_FILE="docker-compose.prod.yml"
PROJECT="srm-bats"   # docker-compose.prod.yml -> name: srm-bats

c_blue='\033[1;34m'; c_green='\033[1;32m'; c_yellow='\033[1;33m'; c_red='\033[1;31m'; c_off='\033[0m'
say()  { printf "${c_blue}==>${c_off} %s\n" "$*"; }
ok()   { printf "${c_green}  ✓${c_off} %s\n" "$*"; }
warn() { printf "${c_yellow}  ! %s${c_off}\n" "$*"; }
die()  { printf "${c_red}  ✗ %s${c_off}\n" "$*" >&2; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# root needed for the docker socket; self-elevate (preserve args)
if [ "$(id -u)" -ne 0 ]; then
  if command -v sudo >/dev/null 2>&1; then exec sudo -E bash "$0" "$@"; fi
  die "Please run as root:  sudo ./reset.sh"
fi

[ -f "$COMPOSE_FILE" ] || die "$COMPOSE_FILE not found — run this from the project root."
DC="docker compose -f $COMPOSE_FILE"

YES=0
[ "${1:-}" = "--yes" ] && YES=1

if [ "$YES" -ne 1 ]; then
  warn "This will PERMANENTLY DELETE the database and all uploaded images,"
  warn "then reseed a clean baseline (admin + demo catalog)."
  read -rp "Type 'yes' to continue: " ans
  [ "$ans" = "yes" ] || die "Aborted — nothing was changed."
fi

say "Stopping containers…"
$DC down

say "Removing data volumes…"
docker volume rm "${PROJECT}_postgres_data" "${PROJECT}_uploads_data" >/dev/null 2>&1 || true
ok "Volumes removed."

say "Bringing the stack back up (migrate + seed run automatically)…"
# cascades: postgres -> migrate(deploy+seed) -> api -> web
$DC up -d web || warn "compose reported an error bringing up the stack — verification below will re-check."

say "Verifying…"
# The api container is intentionally not published, so probe it from inside.
api_ok=0
for _ in $(seq 1 40); do
  if $DC exec -T api node -e "fetch('http://127.0.0.1:3001/health').then(r=>r.json()).then(j=>process.exit(j.status==='ok'?0:1)).catch(()=>process.exit(1))" >/dev/null 2>&1; then api_ok=1; break; fi
  sleep 3
done
web_ok=0
for _ in $(seq 1 40); do
  code="$(curl -fsS -o /dev/null -w '%{http_code}' "http://127.0.0.1:3000/" 2>/dev/null || echo 000)"
  if [ "$code" = "200" ]; then web_ok=1; break; fi
  sleep 3
done
# The browser only reaches the API through the web origin — verify that path.
proxy_ok=0
for _ in $(seq 1 20); do
  if curl -fsS "http://127.0.0.1:3000/backend/health" 2>/dev/null | grep -q '"status":"ok"'; then proxy_ok=1; break; fi
  sleep 3
done

echo
$DC ps
echo
ADMIN_EMAIL="$(grep -E '^ADMIN_EMAIL=' .env 2>/dev/null | cut -d= -f2- || true)"
ADMIN_PASSWORD="$(grep -E '^ADMIN_PASSWORD=' .env 2>/dev/null | cut -d= -f2- || true)"
[ "$api_ok" = "1" ]   && ok "API healthy → in-container /health"                  || warn "API not healthy — $DC logs api"
[ "$web_ok" = "1" ]   && ok "Web serving → http://127.0.0.1:3000/"               || warn "Web not serving — $DC logs web"
[ "$proxy_ok" = "1" ] && ok "API proxy   → http://127.0.0.1:3000/backend/health" || warn "Same-origin API proxy failed — $DC logs web"
echo
say "Clean baseline ready. Admin login →  ${ADMIN_EMAIL:-admin@srmbats.com} / ${ADMIN_PASSWORD:-<see .env>}"

[ "$api_ok" = "1" ] && [ "$web_ok" = "1" ] && [ "$proxy_ok" = "1" ] || die "Reset finished but verification failed — check the logs above."
ok "Reset complete."
