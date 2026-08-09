#!/usr/bin/env bash
# Issue the initial Let's Encrypt certificate for the nginx + certbot deploy.
#
#   ./nginx/init-letsencrypt.sh            # real certificate
#   STAGING=1 ./nginx/init-letsencrypt.sh  # LE staging (no rate limits, for testing)
#
# Run ONCE from the repo root, on the server, BEFORE the first `up`:
#   - DNS: shop.<DOMAIN> and api.<DOMAIN> must already resolve to this host.
#   - Ports: 80 must be reachable from the internet AND free on the host
#     (the proxy stack must not be running yet — certbot binds :80 standalone).
# Afterwards the certbot service renews automatically via the webroot; you do
# not run this again unless you add domains or lose the certbot/conf volume.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "ERROR: .env not found in $(pwd). Copy .env.example to .env first." >&2
  exit 1
fi
# Load DOMAIN + ACME_EMAIL (and the rest) from .env.
set -a; . ./.env; set +a

: "${DOMAIN:?Set DOMAIN in .env (e.g. example.com)}"
: "${ACME_EMAIL:?Set ACME_EMAIL in .env (e.g. you@example.com)}"

SHOP="shop.${DOMAIN}"
API="api.${DOMAIN}"
staging_arg=""
[ "${STAGING:-0}" = "1" ] && staging_arg="--staging"

mkdir -p certbot/conf certbot/www nginx/conf.d

# Render the nginx server config from the template (${DOMAIN} only).
echo "==> Rendering nginx/conf.d/app.conf for ${DOMAIN}"
if command -v envsubst >/dev/null 2>&1; then
  DOMAIN="${DOMAIN}" envsubst '${DOMAIN}' <nginx/app.conf.template >nginx/conf.d/app.conf
else
  sed 's#${DOMAIN}#'"${DOMAIN}"'#g' nginx/app.conf.template >nginx/conf.d/app.conf
fi

if [ -f "certbot/conf/live/${SHOP}/fullchain.pem" ]; then
  echo "==> Certificate for ${SHOP} already exists — skipping issuance."
  echo "    (delete certbot/conf/live/${SHOP} to force re-issuance.)"
else
  echo "==> Requesting a certificate for ${SHOP} and ${API} (standalone, :80)"
  echo "    DNS must resolve to this host and :80 must be free + internet-reachable."
  docker run --rm \
    -p 80:80 \
    -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
    -v "$(pwd)/certbot/www:/var/www/certbot" \
    certbot/certbot certonly --standalone \
    --preferred-challenges http-01 \
    -d "${SHOP}" -d "${API}" \
    --email "${ACME_EMAIL}" --agree-tos --no-eff-email -n ${staging_arg}
fi

echo
echo "==> Certificate ready. Bring the stack up with:"
echo "    docker compose -f docker-compose.prod.yml -f docker-compose.nginx.yml up -d --build"
