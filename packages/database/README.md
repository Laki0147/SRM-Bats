# SRM Bats Database Package

This package contains the Prisma schema, migrations, and seed data for the SRM Bats e-commerce platform.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)
- pnpm 8+

## Setup

### Option 1: Using Docker (Recommended)

1. Start PostgreSQL using Docker Compose from the project root:
```bash
docker-compose up -d postgres
```

2. The database will be available at:
   - Host: localhost
   - Port: 5432
   - Database: srm_bats
   - User: user
   - Password: password

### Option 2: Local PostgreSQL Installation

1. Install PostgreSQL on your system
2. Create a database named `srm_bats`
3. Update the `DATABASE_URL` in `.env` file

## Environment Variables

Create a `.env` file in `packages/database` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/srm_bats?schema=public"
```

## Database Commands

### Generate Prisma Client
```bash
pnpm db:generate
```

### Create and Run Migration
```bash
pnpm db:migrate
```

This will:
- Create a new migration based on the schema
- Apply the migration to the database
- Generate the Prisma Client

### Seed the Database
```bash
pnpm db:seed
```

This will populate the database with:
- 2 users (1 admin, 1 customer)
- 3 brands (SRM, MRF, SS)
- 4 categories (English Willow, Kashmir Willow, Tennis Ball Bats, Junior Bats)
- 10 products with images and specifications
- 2 addresses
- Sample cart items
- 3 product reviews

### Open Prisma Studio
```bash
pnpm db:studio
```

This opens a visual database browser at http://localhost:5555

### Push Schema Without Migration
```bash
pnpm db:push
```

Use this for quick prototyping (not recommended for production).

## Login Credentials

After seeding, you can use these credentials:

### Admin Account
- Email: admin@srmbats.com
- Password: admin123

### Customer Account
- Email: customer@test.com
- Password: customer123

## Database Schema Overview

### Core Models

- **User**: Customer and admin accounts with authentication
- **Product**: Cricket bats with pricing, stock, and metadata
- **Category**: Product categorization with hierarchical support
- **Brand**: Cricket bat manufacturers
- **Cart**: Shopping cart functionality
- **Order**: Order management with status tracking
- **Address**: User shipping and billing addresses
- **Review**: Product reviews and ratings

### Product Features

- Multiple images per product
- Custom specifications (key-value pairs)
- Product variants (size, weight variations)
- Stock management
- Featured products
- Compare at pricing

### Order Features

- Order status tracking (PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED)
- Payment status tracking
- Shipping and billing address storage
- Order items with pricing snapshot

## Migrations

Migrations are stored in `prisma/migrations/` directory. Each migration includes:
- SQL migration file
- Migration metadata

To create a new migration after schema changes:
```bash
pnpm db:migrate
```

## Troubleshooting

### Connection Issues

1. Verify PostgreSQL is running:
```bash
# If using Docker
docker ps | grep postgres

# Check logs
docker logs srm-bats-postgres
```

2. Test connection:
```bash
psql -h localhost -U user -d srm_bats
```

### Reset Database

To completely reset the database:
```bash
# Drop all tables
pnpm prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Run all migrations
# 4. Run seed script
```

### Common Errors

**Error: P1001 - Can't reach database server**
- Ensure PostgreSQL is running
- Check DATABASE_URL is correct
- Verify firewall settings

**Error: P3009 - Failed to create database**
- Database may already exist
- Check user permissions

## Production Considerations

1. **Environment Variables**: Use secure passwords and store DATABASE_URL in environment variables
2. **Migrations**: Always backup database before running migrations in production
3. **Connection Pooling**: Consider using PgBouncer for connection pooling
4. **Backups**: Set up automated database backups
5. **Monitoring**: Monitor database performance and slow queries

## Schema Updates

1. Modify `schema.prisma`
2. Run `pnpm db:migrate` to create a migration
3. Review the generated SQL in `prisma/migrations/`
4. Test the migration in development
5. Apply to production with proper backup

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
