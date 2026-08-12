<#
  export-local-data.ps1  —  run this ONCE on your LOCAL Windows machine.

  It captures your current local data into deploy/seed-data/ so setup.sh on the
  Oracle Linux server can restore an exact clone:
    - deploy/seed-data/db.sql     a pg_dump of your local Postgres (schema + data)
    - deploy/seed-data/uploads/   a copy of apps/api/uploads (product images)

  Then copy the WHOLE project (including deploy/seed-data/) to the server under
  your /mnt/... path and run:  sudo ./setup.sh

  Usage (from anywhere):
    powershell -ExecutionPolicy Bypass -File deploy\export-local-data.ps1

  Uses Docker to run pg_dump so you do NOT need Postgres client tools installed.
  Defaults match docs/CREDENTIALS.local.md (postgres/postgres@localhost:5432/srm_bats);
  override with the parameters below if your local DB differs.
#>
param(
  [string]$DbName     = 'srm_bats',
  [string]$DbUser     = 'postgres',
  [string]$DbPassword = 'postgres',
  [string]$DbHost     = 'host.docker.internal',   # how a container reaches your host Postgres
  [int]   $DbPort     = 5432
)

$ErrorActionPreference = 'Stop'

# Resolve paths: this script lives in deploy/, so the repo root is its parent.
$deployDir = $PSScriptRoot
$repoRoot  = Split-Path -Parent $deployDir
$seedDir   = Join-Path $deployDir 'seed-data'
$dumpFile  = Join-Path $seedDir 'db.sql'
$uploadsSrc = Join-Path $repoRoot 'apps\api\uploads'
$uploadsDst = Join-Path $seedDir 'uploads'

New-Item -ItemType Directory -Force -Path $seedDir | Out-Null

Write-Host "==> Checking Docker..." -ForegroundColor Cyan
try { docker version | Out-Null } catch { throw "Docker is not available. Start Docker Desktop, or use the native pg_dump alternative at the bottom of this script." }

# --- 1. Dump the database ----------------------------------------------------
# pg_dump runs INSIDE a postgres:16 container and writes straight to the mounted
# seed-data folder, so there are no PowerShell text-encoding/BOM problems.
Write-Host "==> Dumping database '$DbName' from $DbHost:$DbPort (user: $DbUser)..." -ForegroundColor Cyan
docker run --rm `
  -e PGPASSWORD=$DbPassword `
  -v "${seedDir}:/out" `
  postgres:16 `
  pg_dump -h $DbHost -p $DbPort -U $DbUser -d $DbName --no-owner --no-acl -f /out/db.sql

if (-not (Test-Path $dumpFile) -or ((Get-Item $dumpFile).Length -eq 0)) {
  throw "pg_dump produced no output. Check your DB is running and the -Db* parameters are correct."
}
$sizeKb = [math]::Round((Get-Item $dumpFile).Length / 1KB, 1)
Write-Host "  OK  db.sql written ($sizeKb KB)" -ForegroundColor Green

# --- 2. Copy uploaded images -------------------------------------------------
if (Test-Path $uploadsSrc) {
  Write-Host "==> Copying uploaded images from apps/api/uploads..." -ForegroundColor Cyan
  New-Item -ItemType Directory -Force -Path $uploadsDst | Out-Null
  $items = Get-ChildItem -Path $uploadsSrc -Force -ErrorAction SilentlyContinue
  if ($items) {
    Copy-Item -Path (Join-Path $uploadsSrc '*') -Destination $uploadsDst -Recurse -Force
    Write-Host "  OK  $($items.Count) item(s) copied to deploy/seed-data/uploads" -ForegroundColor Green
  } else {
    Write-Host "  !   apps/api/uploads is empty — no images to copy." -ForegroundColor Yellow
  }
} else {
  Write-Host "  !   apps/api/uploads not found — skipping images." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done. The clone bundle is in deploy/seed-data/" -ForegroundColor Green
Write-Host "Next:" -ForegroundColor Cyan
Write-Host "  1. Copy the whole project (including deploy/seed-data/) to the server, e.g. /mnt/srm-bats"
Write-Host "  2. On the server:  cd /mnt/srm-bats && sudo ./setup.sh"
Write-Host ""
Write-Host "NOTE: deploy/seed-data/ contains real data — it is gitignored; never commit it." -ForegroundColor Yellow

# -----------------------------------------------------------------------------
# Native alternative (no Docker) — if you have PostgreSQL client tools installed:
#   $env:PGPASSWORD='postgres'
#   pg_dump -h localhost -p 5432 -U postgres -d srm_bats --no-owner --no-acl -f deploy\seed-data\db.sql
# (Use -h localhost here since pg_dump runs on the host, not in a container.)
# -----------------------------------------------------------------------------
