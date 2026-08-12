# Database Quick Reference

## Login Credentials (After Seeding)

```
Admin:
  Email: admin@srmbats.com
  Password: admin123

Customer:
  Email: customer@test.com
  Password: customer123
```

## Essential Commands

```bash
# Generate Prisma Client
pnpm prisma generate

# Create & run migration
pnpm prisma migrate dev --name <name>

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio

# Reset database (drops all data)
pnpm prisma migrate reset

# Push schema without migration (dev only)
pnpm db:push
```

## Connection String Format

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

**Example:**
```
postgresql://user:password@localhost:5432/srm_bats?schema=public
```

## Docker PostgreSQL

```bash
# Start
docker-compose up -d postgres

# Stop
docker-compose down

# View logs
docker logs srm-bats-postgres

# Connect to database
docker exec -it srm-bats-postgres psql -U user -d srm_bats
```

## Seeded Data Summary

| Entity | Count | Details |
|--------|-------|----------|
| Users | 2 | 1 admin, 1 customer |
| Brands | 3 | SRM, MRF, SS |
| Categories | 4 | English Willow, Kashmir Willow, Tennis Ball, Junior |
| Products | 10 | Complete with images & specs |
| Addresses | 2 | Shipping addresses |
| Cart Items | 2 | In customer's cart |
| Reviews | 3 | Product reviews |

## Product Price Ranges

- **English Willow**: ₹16,999 - ₹24,999
- **Kashmir Willow**: ₹2,999 - ₹4,299
- **Tennis Ball Bats**: ₹1,299 - ₹1,499
- **Junior Bats**: ₹1,899 - ₹2,199

## Schema Enums

### UserRole
- `CUSTOMER`
- `ADMIN`
- `SUPER_ADMIN`

### OrderStatus
- `PENDING`
- `CONFIRMED`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`
- `REFUNDED`

### PaymentStatus
- `PENDING`
- `PAID`
- `FAILED`
- `REFUNDED`

### AddressType
- `SHIPPING`
- `BILLING`
- `BOTH`

## Common Queries

### Get all products with category and brand
```typescript
const products = await prisma.product.findMany({
  include: {
    category: true,
    brand: true,
    images: true,
  },
});
```

### Get user with orders
```typescript
const user = await prisma.user.findUnique({
  where: { email: 'customer@test.com' },
  include: {
    orders: {
      include: { items: true },
    },
  },
});
```

### Get cart with items and products
```typescript
const cart = await prisma.cart.findUnique({
  where: { userId: 'user-id' },
  include: {
    items: {
      include: { product: true },
    },
  },
});
```

## Troubleshooting

### Connection Error
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Test connection
psql -h localhost -U user -d srm_bats
```

### Migration Issues
```bash
# View migration status
pnpm prisma migrate status

# Reset and start fresh
pnpm prisma migrate reset
```

### Prisma Client Out of Sync
```bash
# Regenerate client
pnpm prisma generate
```

## File Locations

```
packages/database/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Seed script
│   └── migrations/        # Migration files
├── .env                   # Database URL (gitignored)
├── package.json
└── README.md
```

## URLs

- **Prisma Studio**: http://localhost:5555
- **PostgreSQL**: localhost:5432
- **Database Name**: srm_bats

## Environment Variables

```env
# Required in packages/database/.env
DATABASE_URL="postgresql://user:password@localhost:5432/srm_bats?schema=public"
```

## Production Checklist

- [ ] Use `migrate deploy` not `migrate dev`
- [ ] Set connection pooling limits
- [ ] Enable SSL in DATABASE_URL
- [ ] Backup database before migrations
- [ ] Use environment variables for credentials
- [ ] Monitor query performance
- [ ] Set up automated backups

## Support Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Schema Reference**: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference
