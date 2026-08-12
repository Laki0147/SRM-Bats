import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATEGORY_SLUG = 'cricket-bats';
const BRAND_SLUG = 'srm-bats';

// Admin credentials are read from env so nothing sensitive is hardcoded.
// The defaults below are for local development only — override in real setups.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@srmbats.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe!Admin123';

async function main() {
  console.log('🌱 Seeding SRM Bats database...');

  // Upsert an admin user so the CMS at /admin is usable out of the box.
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: 'ADMIN' },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      firstName: 'Store',
      lastName: 'Admin',
      role: 'ADMIN',
    },
  });
  console.log(`  👤 Admin ready → ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

  // Upsert brand
  const brand = await prisma.brand.upsert({
    where: { slug: BRAND_SLUG },
    update: {},
    create: {
      name: 'SRM Bats',
      slug: BRAND_SLUG,
      description: 'Premium handcrafted cricket bats made in India.',
    },
  });

  // Upsert category
  const category = await prisma.category.upsert({
    where: { slug: CATEGORY_SLUG },
    update: {},
    create: {
      name: 'Cricket Bats',
      slug: CATEGORY_SLUG,
      description: 'Handcrafted premium cricket bats for every level of player.',
    },
  });

  const products = [
    {
      name: 'The Sovereign',
      slug: 'the-sovereign',
      description:
        'Our flagship bat — Grade 1 English Willow with a full bow profile and thick edges. Engineered for the modern power player who demands exceptional pickup and explosive stroke play.',
      price: 28500,
      compareAtPrice: 32000,
      sku: 'SRM-SOV-001',
      stock: 12,
      isFeatured: true,
      specs: [
        { key: 'Willow', value: 'Grade 1 English Willow' },
        { key: 'Profile', value: 'Full Bow' },
        { key: 'Edge', value: '42mm' },
        { key: 'Spine Height', value: '68mm' },
        { key: 'Handle', value: 'Oval — Premium Sarawak Cane' },
        { key: 'Weight', value: '1.12–1.18 kg' },
        { key: 'Knock-in', value: 'Pre-knocked & oil-treated' },
      ],
    },
    {
      name: 'The Artisan',
      slug: 'the-artisan',
      description:
        'Built for the elegant stroke-maker. Grade 2 English Willow with a mid-profile bow, balanced weight, and refined finish. Perfect for the technically correct batsman.',
      price: 19500,
      compareAtPrice: 22000,
      sku: 'SRM-ART-001',
      stock: 18,
      isFeatured: true,
      specs: [
        { key: 'Willow', value: 'Grade 2 English Willow' },
        { key: 'Profile', value: 'Mid Bow' },
        { key: 'Edge', value: '38mm' },
        { key: 'Spine Height', value: '64mm' },
        { key: 'Handle', value: 'Round — Premium Sarawak Cane' },
        { key: 'Weight', value: '1.08–1.14 kg' },
        { key: 'Knock-in', value: 'Pre-knocked & oil-treated' },
      ],
    },
    {
      name: 'The Heritage',
      slug: 'the-heritage',
      description:
        'A classic traditional bat celebrating old-school craftsmanship. Grade 1 English Willow with a high spine and low mid-profile — superb for back-foot play and cut shots.',
      price: 24000,
      compareAtPrice: 27500,
      sku: 'SRM-HER-001',
      stock: 8,
      isFeatured: true,
      specs: [
        { key: 'Willow', value: 'Grade 1 English Willow' },
        { key: 'Profile', value: 'Low Mid Bow' },
        { key: 'Edge', value: '40mm' },
        { key: 'Spine Height', value: '72mm' },
        { key: 'Handle', value: 'Oval — Split Cane' },
        { key: 'Weight', value: '1.10–1.16 kg' },
        { key: 'Knock-in', value: 'Pre-knocked & oil-treated' },
      ],
    },
    {
      name: 'The Pioneer',
      slug: 'the-pioneer',
      description:
        'Designed for the aggressive T20 specialist. Grade 1 English Willow with maximum edge thickness and a high mid-profile. Monstrous sweet spot for boundary-hitting.',
      price: 31000,
      compareAtPrice: 35000,
      sku: 'SRM-PIO-001',
      stock: 6,
      isFeatured: true,
      specs: [
        { key: 'Willow', value: 'Grade 1 English Willow' },
        { key: 'Profile', value: 'High Mid Bow' },
        { key: 'Edge', value: '46mm' },
        { key: 'Spine Height', value: '74mm' },
        { key: 'Handle', value: 'Round — Dual Rubber Insert' },
        { key: 'Weight', value: '1.14–1.20 kg' },
        { key: 'Knock-in', value: 'Pre-knocked & oil-treated' },
      ],
    },
    {
      name: 'The Reserve',
      slug: 'the-reserve',
      description:
        'Entry into the SRM range — Grade 2 English Willow with a traditional profile. An outstanding bat for club and academy players seeking professional quality at an accessible price.',
      price: 13500,
      compareAtPrice: 16000,
      sku: 'SRM-RES-001',
      stock: 25,
      isFeatured: false,
      specs: [
        { key: 'Willow', value: 'Grade 2 English Willow' },
        { key: 'Profile', value: 'Traditional Bow' },
        { key: 'Edge', value: '36mm' },
        { key: 'Spine Height', value: '60mm' },
        { key: 'Handle', value: 'Round — Standard Cane' },
        { key: 'Weight', value: '1.06–1.12 kg' },
        { key: 'Knock-in', value: 'Partially knocked' },
      ],
    },
    {
      name: 'The Bespoke',
      slug: 'the-bespoke',
      description:
        'Fully customised to your specifications. Choose willow grade, weight, profile, handle type, toe guard, and personal engraving. Every detail tailored — uniquely yours.',
      price: 42000,
      compareAtPrice: null,
      sku: 'SRM-BSP-001',
      stock: 5,
      isFeatured: true,
      specs: [
        { key: 'Willow', value: 'Grade 1 English Willow (Grade 2 optional)' },
        { key: 'Profile', value: 'Your choice' },
        { key: 'Edge', value: 'Customisable (38–48mm)' },
        { key: 'Spine Height', value: 'Customisable' },
        { key: 'Handle', value: 'Your choice — Oval or Round' },
        { key: 'Weight', value: 'Customisable (1.05–1.22 kg)' },
        { key: 'Extras', value: 'Personal engraving, custom sticker' },
      ],
    },
    {
      name: 'The Centurion',
      slug: 'the-centurion',
      description:
        'A tribute to the century-makers. Premium Grade 1 English Willow with a balanced mid bow, fine finish, and exceptional grain count. For the player who makes runs count.',
      price: 26500,
      compareAtPrice: 30000,
      sku: 'SRM-CEN-001',
      stock: 10,
      isFeatured: false,
      specs: [
        { key: 'Willow', value: 'Grade 1 English Willow' },
        { key: 'Profile', value: 'Mid Bow' },
        { key: 'Edge', value: '40mm' },
        { key: 'Spine Height', value: '66mm' },
        { key: 'Handle', value: 'Oval — Sarawak Cane' },
        { key: 'Weight', value: '1.10–1.16 kg' },
        { key: 'Knock-in', value: 'Pre-knocked & oil-treated' },
      ],
    },
    {
      name: 'The Maestro',
      slug: 'the-maestro',
      description:
        "Reserved for the most discerning players. Exceptional Grade 1 English Willow, hand-selected for grain straightness and density. A collector's item as much as a playing weapon.",
      price: 38000,
      compareAtPrice: 44000,
      sku: 'SRM-MAE-001',
      stock: 4,
      isFeatured: true,
      specs: [
        { key: 'Willow', value: 'Grade 1 English Willow — Hand Selected' },
        { key: 'Profile', value: 'Full Bow' },
        { key: 'Edge', value: '44mm' },
        { key: 'Spine Height', value: '70mm' },
        { key: 'Handle', value: 'Oval — Master Grade Cane' },
        { key: 'Weight', value: '1.12–1.18 kg' },
        { key: 'Knock-in', value: 'Fully knocked & field-ready' },
      ],
    },
  ];

  for (const product of products) {
    const { specs, ...productData } = product;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...productData,
        categoryId: category.id,
        brandId: brand.id,
      },
      create: {
        ...productData,
        categoryId: category.id,
        brandId: brand.id,
        specifications: {
          create: specs,
        },
      },
    });

    console.log(`  ✅ ${product.name}`);
  }

  console.log(`\n✨ Seeded ${products.length} products successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
