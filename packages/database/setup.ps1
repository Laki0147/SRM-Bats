# Database Setup Script for SRM Bats (PowerShell)
# This script sets up the database, runs migrations, and seeds data

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting SRM Bats Database Setup..." -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from example..." -ForegroundColor Yellow
    'DATABASE_URL="postgresql://user:password@localhost:5432/srm_bats?schema=public"' | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ Created .env file" -ForegroundColor Green
}

# Generate Prisma Client
Write-Host "📦 Generating Prisma Client..." -ForegroundColor Cyan
pnpm prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Create and run migration
Write-Host "🔄 Creating and running database migration..." -ForegroundColor Cyan
pnpm prisma migrate dev --name init
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migration completed" -ForegroundColor Green
} else {
    Write-Host "❌ Migration failed" -ForegroundColor Red
    Write-Host "💡 Make sure PostgreSQL is running and DATABASE_URL is correct" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Seed the database
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Cyan
pnpm tsx prisma/seed.ts
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database seeded successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Seeding failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "🎉 Database setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 You can now:" -ForegroundColor Cyan
Write-Host "   - Open Prisma Studio: pnpm db:studio"
Write-Host "   - View the database at: http://localhost:5555"
Write-Host ""
Write-Host "🔑 Login credentials:" -ForegroundColor Cyan
Write-Host "   Admin: admin@srmbats.com / admin123"
Write-Host "   Customer: customer@test.com / customer123"
