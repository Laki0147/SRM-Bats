#!/bin/bash

# Database Setup Script for SRM Bats
# This script sets up the database, runs migrations, and seeds data

set -e

echo "🚀 Starting SRM Bats Database Setup..."
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from example..."
    echo 'DATABASE_URL="postgresql://user:password@localhost:5432/srm_bats?schema=public"' > .env
    echo "✅ Created .env file"
fi

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate
echo "✅ Prisma Client generated"
echo ""

# Create and run migration
echo "🔄 Creating and running database migration..."
npx prisma migrate dev --name init
echo "✅ Migration completed"
echo ""

# Seed the database
echo "🌱 Seeding database with sample data..."
npx tsx prisma/seed.ts
echo "✅ Database seeded successfully"
echo ""

echo "🎉 Database setup completed!"
echo ""
echo "📊 You can now:"
echo "   - Open Prisma Studio: pnpm db:studio"
echo "   - View the database at: http://localhost:5555"
echo ""
echo "🔑 Login credentials:"
echo "   Admin: admin@srmbats.com / admin123"
echo "   Customer: customer@test.com / customer123"
