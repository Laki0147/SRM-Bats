'use client';

/*
 * The pre-commit hook runs ESLint from the repo root, where this package's
 * `@/*` path alias is not resolvable, so the API client / Product type collapse
 * to `any` and trip the type-aware `no-unsafe-*` rules with false positives
 * (they pass from apps/web). Scoped-disabled to match the other data files.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-explicit-any, @typescript-eslint/no-floating-promises */

import { useEffect, useState } from 'react';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { ProductDetail } from '@/components/product/ProductDetail';
import { AtelierNav, AtelierFooter, PAPER, INK, OX } from '@/components/v2/atelier-ui';
import { AtelierProductDetail } from '@/components/v2/AtelierProductDetail';
import { useDesignVariant } from '@/lib/design-variant';
import { productsApi } from '@/lib/api';
import type { Product } from '@/lib/products';

// Static fallback data — used if API is unreachable
const STATIC_PRODUCTS: Record<string, Product> = {
  'the-sovereign': {
    id: 'static-1',
    slug: 'the-sovereign',
    name: 'The Sovereign',
    description:
      'Our flagship bat — Grade 1 English Willow with a full bow profile and thick edges. Engineered for the modern power player who demands exceptional pickup and explosive stroke play.',
    price: 28500,
    compareAtPrice: 32000,
    sku: 'SRM-SOV-001',
    stock: 12,
    isFeatured: true,
    isActive: true,
    category: { id: '1', name: 'Cricket Bats', slug: 'cricket-bats' },
    images: [],
    specifications: [
      { id: '1', key: 'Willow', value: 'Grade 1 English Willow' },
      { id: '2', key: 'Profile', value: 'Full Bow' },
      { id: '3', key: 'Edge', value: '42mm' },
      { id: '4', key: 'Spine Height', value: '68mm' },
      { id: '5', key: 'Handle', value: 'Oval — Premium Sarawak Cane' },
      { id: '6', key: 'Weight', value: '1.12–1.18 kg' },
      { id: '7', key: 'Knock-in', value: 'Pre-knocked & oil-treated' },
    ],
    _count: { reviews: 47 },
    createdAt: '2024-01-01',
  },
  'the-artisan': {
    id: 'static-2',
    slug: 'the-artisan',
    name: 'The Artisan',
    description:
      'Built for the elegant stroke-maker. Grade 2 English Willow with a mid-profile bow, balanced weight, and refined finish. Perfect for the technically correct batsman.',
    price: 19500,
    compareAtPrice: 22000,
    sku: 'SRM-ART-001',
    stock: 18,
    isFeatured: true,
    isActive: true,
    category: { id: '1', name: 'Cricket Bats', slug: 'cricket-bats' },
    images: [],
    specifications: [
      { id: '1', key: 'Willow', value: 'Grade 2 English Willow' },
      { id: '2', key: 'Profile', value: 'Mid Bow' },
      { id: '3', key: 'Edge', value: '38mm' },
      { id: '4', key: 'Spine Height', value: '64mm' },
      { id: '5', key: 'Handle', value: 'Round — Premium Sarawak Cane' },
      { id: '6', key: 'Weight', value: '1.08–1.14 kg' },
    ],
    _count: { reviews: 31 },
    createdAt: '2024-01-01',
  },
  'the-heritage': {
    id: 'static-3',
    slug: 'the-heritage',
    name: 'The Heritage',
    description:
      'A classic traditional bat celebrating old-school craftsmanship. Grade 1 English Willow with a high spine and low mid-profile — superb for back-foot play and cut shots.',
    price: 24000,
    compareAtPrice: 27500,
    sku: 'SRM-HER-001',
    stock: 8,
    isFeatured: true,
    isActive: true,
    category: { id: '1', name: 'Cricket Bats', slug: 'cricket-bats' },
    images: [],
    specifications: [
      { id: '1', key: 'Willow', value: 'Grade 1 English Willow' },
      { id: '2', key: 'Profile', value: 'Low Mid Bow' },
      { id: '3', key: 'Edge', value: '40mm' },
      { id: '4', key: 'Spine Height', value: '72mm' },
      { id: '5', key: 'Handle', value: 'Oval — Split Cane' },
      { id: '6', key: 'Weight', value: '1.10–1.16 kg' },
    ],
    _count: { reviews: 22 },
    createdAt: '2024-01-01',
  },
  'the-pioneer': {
    id: 'static-4',
    slug: 'the-pioneer',
    name: 'The Pioneer',
    description:
      'Designed for the aggressive T20 specialist. Grade 1 English Willow with maximum edge thickness and a high mid-profile. Monstrous sweet spot for boundary-hitting.',
    price: 31000,
    compareAtPrice: 35000,
    sku: 'SRM-PIO-001',
    stock: 6,
    isFeatured: true,
    isActive: true,
    category: { id: '1', name: 'Cricket Bats', slug: 'cricket-bats' },
    images: [],
    specifications: [
      { id: '1', key: 'Willow', value: 'Grade 1 English Willow' },
      { id: '2', key: 'Profile', value: 'High Mid Bow' },
      { id: '3', key: 'Edge', value: '46mm' },
      { id: '4', key: 'Spine Height', value: '74mm' },
      { id: '5', key: 'Handle', value: 'Round — Dual Rubber Insert' },
      { id: '6', key: 'Weight', value: '1.14–1.20 kg' },
    ],
    _count: { reviews: 18 },
    createdAt: '2024-01-01',
  },
  'the-reserve': {
    id: 'static-5',
    slug: 'the-reserve',
    name: 'The Reserve',
    description:
      'Entry into the SRM range — Grade 2 English Willow with a traditional profile. An outstanding bat for club and academy players seeking professional quality at an accessible price.',
    price: 13500,
    compareAtPrice: 16000,
    sku: 'SRM-RES-001',
    stock: 25,
    isFeatured: false,
    isActive: true,
    category: { id: '1', name: 'Cricket Bats', slug: 'cricket-bats' },
    images: [],
    specifications: [
      { id: '1', key: 'Willow', value: 'Grade 2 English Willow' },
      { id: '2', key: 'Profile', value: 'Traditional Bow' },
      { id: '3', key: 'Edge', value: '36mm' },
      { id: '4', key: 'Spine Height', value: '60mm' },
      { id: '5', key: 'Weight', value: '1.06–1.12 kg' },
    ],
    _count: { reviews: 54 },
    createdAt: '2024-01-01',
  },
  'the-bespoke': {
    id: 'static-6',
    slug: 'the-bespoke',
    name: 'The Bespoke',
    description:
      'Fully customised to your specifications. Choose willow grade, weight, profile, handle type, toe guard, and personal engraving. Every detail tailored — uniquely yours.',
    price: 42000,
    compareAtPrice: null,
    sku: 'SRM-BSP-001',
    stock: 5,
    isFeatured: true,
    isActive: true,
    category: { id: '1', name: 'Cricket Bats', slug: 'cricket-bats' },
    images: [],
    specifications: [
      { id: '1', key: 'Willow', value: 'Grade 1 or Grade 2 — your choice' },
      { id: '2', key: 'Profile', value: 'Fully customisable' },
      { id: '3', key: 'Edge', value: '38–48mm (your choice)' },
      { id: '4', key: 'Extras', value: 'Personal engraving, custom sticker' },
    ],
    _count: { reviews: 9 },
    createdAt: '2024-01-01',
  },
  'the-centurion': {
    id: 'static-7',
    slug: 'the-centurion',
    name: 'The Centurion',
    description:
      'A tribute to the century-makers. Premium Grade 1 English Willow with a balanced mid bow, fine finish, and exceptional grain count.',
    price: 26500,
    compareAtPrice: 30000,
    sku: 'SRM-CEN-001',
    stock: 10,
    isFeatured: false,
    isActive: true,
    category: { id: '1', name: 'Cricket Bats', slug: 'cricket-bats' },
    images: [],
    specifications: [
      { id: '1', key: 'Willow', value: 'Grade 1 English Willow' },
      { id: '2', key: 'Profile', value: 'Mid Bow' },
      { id: '3', key: 'Edge', value: '40mm' },
      { id: '4', key: 'Spine Height', value: '66mm' },
    ],
    _count: { reviews: 28 },
    createdAt: '2024-01-01',
  },
  'the-maestro': {
    id: 'static-8',
    slug: 'the-maestro',
    name: 'The Maestro',
    description:
      'Reserved for the most discerning players. Exceptional Grade 1 English Willow, hand-selected for grain straightness and density.',
    price: 38000,
    compareAtPrice: 44000,
    sku: 'SRM-MAE-001',
    stock: 4,
    isFeatured: true,
    isActive: true,
    category: { id: '1', name: 'Cricket Bats', slug: 'cricket-bats' },
    images: [],
    specifications: [
      { id: '1', key: 'Willow', value: 'Grade 1 English Willow — Hand Selected' },
      { id: '2', key: 'Profile', value: 'Full Bow' },
      { id: '3', key: 'Edge', value: '44mm' },
      { id: '4', key: 'Spine Height', value: '70mm' },
      { id: '5', key: 'Handle', value: 'Oval — Master Grade Cane' },
      { id: '6', key: 'Weight', value: '1.12–1.18 kg' },
    ],
    _count: { reviews: 12 },
    createdAt: '2024-01-01',
  },
};

const PALETTE_MAP: Record<string, number> = {
  'the-sovereign': 0,
  'the-artisan': 1,
  'the-heritage': 2,
  'the-pioneer': 3,
  'the-reserve': 4,
  'the-bespoke': 1,
  'the-centurion': 2,
  'the-maestro': 0,
};

interface Props {
  params: { slug: string };
}

export default function ProductPage({ params }: Props) {
  const { slug } = params;
  const { variant } = useDesignVariant();
  const atelier = variant === 'atelier';
  const [product, setProduct] = useState<Product | null>(STATIC_PRODUCTS[slug] ?? null);
  const [notFound, setNotFound] = useState(!STATIC_PRODUCTS[slug]);

  useEffect(() => {
    productsApi
      .fetchOne(slug)
      .then((data) => {
        // Normalise API response to match Product type
        const p: Product = {
          ...data,
          // specifications come back as array from API already
          specifications: Array.isArray(data.specifications) ? data.specifications : [],
          images: Array.isArray(data.images) ? data.images : [],
        };
        setProduct(p);
        setNotFound(false);
      })
      .catch(() => {
        // Keep static fallback if available; otherwise mark not found
        if (!STATIC_PRODUCTS[slug]) setNotFound(true);
      });
  }, [slug]);

  if (notFound) {
    if (atelier) {
      return (
        <div className="min-h-screen" style={{ background: PAPER }}>
          <AtelierNav activePath="/products" />
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <p className="mb-3 font-body text-[24px] font-extrabold" style={{ color: INK }}>
                Specimen not found
              </p>
              <a
                href="/products"
                className="font-mono text-[11px] uppercase tracking-[2px] underline underline-offset-4"
                style={{ color: OX }}
              >
                Browse the ledger
              </a>
            </div>
          </div>
          <AtelierFooter />
        </div>
      );
    }
    return (
      <div className="min-h-screen" style={{ background: '#2c1f14' }}>
        <SiteNavbar activePath="/products" />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="font-display mb-3 text-[24px] font-bold" style={{ color: '#f2ebe0' }}>
              Product not found
            </p>
            <a
              href="/products"
              className="font-body text-[13px] underline"
              style={{ color: '#c4956a' }}
            >
              Browse all bats
            </a>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: atelier ? PAPER : '#2c1f14' }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: atelier ? OX : '#c4956a', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  if (atelier) {
    return (
      <div className="min-h-screen" style={{ background: PAPER }}>
        <AtelierNav activePath="/products" />
        <main className="pt-[66px]">
          <AtelierProductDetail product={product} paletteIndex={PALETTE_MAP[slug] ?? 0} />
        </main>
        <AtelierFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#2c1f14' }}>
      <SiteNavbar activePath="/products" />
      <main className="pt-[68px]">
        <ProductDetail product={product} paletteIndex={PALETTE_MAP[slug] ?? 0} />
      </main>
      <SiteFooter />
    </div>
  );
}
