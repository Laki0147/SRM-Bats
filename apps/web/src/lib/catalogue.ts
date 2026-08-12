'use client';

/*
 * Shared product catalogue — single source of truth for the browsing surfaces.
 * The heritage `ProductsGrid` and the Atelier `AtelierProducts` both read from
 * here, so the static fallback list and the API-mapping logic live in exactly
 * one place. (The pre-commit hook runs ESLint from the repo root where the
 * `@/*` alias is unresolved, collapsing the API client to `any` and tripping
 * the type-aware `no-unsafe-*` rules with false positives; disabled here to
 * match the other data modules — they pass cleanly from apps/web.)
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-floating-promises */

import { useEffect, useState } from 'react';
import { productsApi } from '@/lib/api';

export interface CatalogueItem {
  id: string;
  slug: string;
  name: string;
  grade: string;
  profile: string;
  price: number;
  compareAtPrice: number | null;
  rating: number;
  stock: number;
  fill: string;
  sideFill: string;
  label: string;
  specifications: { key: string; value: string }[];
}

// Static fallback catalogue — shown instantly and used when the API is
// unreachable, so the browsing pages never render empty.
export const CATALOGUE: CatalogueItem[] = [
  {
    id: '1',
    slug: 'the-sovereign',
    name: 'The Sovereign',
    grade: 'Grade 1 English Willow',
    profile: 'Full Bow',
    price: 28500,
    compareAtPrice: 32000,
    rating: 5,
    stock: 12,
    fill: '#d2ae72',
    sideFill: '#aa8848',
    label: 'SOV',
    specifications: [
      { key: 'Willow', value: 'Grade 1 English Willow' },
      { key: 'Profile', value: 'Full Bow' },
    ],
  },
  {
    id: '2',
    slug: 'the-artisan',
    name: 'The Artisan',
    grade: 'Grade 2 English Willow',
    profile: 'Mid Bow',
    price: 19500,
    compareAtPrice: 22000,
    rating: 4,
    stock: 18,
    fill: '#c8a060',
    sideFill: '#a08040',
    label: 'ART',
    specifications: [
      { key: 'Willow', value: 'Grade 2 English Willow' },
      { key: 'Profile', value: 'Mid Bow' },
    ],
  },
  {
    id: '3',
    slug: 'the-heritage',
    name: 'The Heritage',
    grade: 'Grade 1 English Willow',
    profile: 'Low Mid Bow',
    price: 24000,
    compareAtPrice: 27500,
    rating: 5,
    stock: 8,
    fill: '#dfc07a',
    sideFill: '#b09050',
    label: 'HER',
    specifications: [
      { key: 'Willow', value: 'Grade 1 English Willow' },
      { key: 'Profile', value: 'Low Mid Bow' },
    ],
  },
  {
    id: '4',
    slug: 'the-pioneer',
    name: 'The Pioneer',
    grade: 'Grade 1 English Willow',
    profile: 'High Mid Bow',
    price: 31000,
    compareAtPrice: 35000,
    rating: 5,
    stock: 6,
    fill: '#e0c880',
    sideFill: '#c0a050',
    label: 'PIO',
    specifications: [
      { key: 'Willow', value: 'Grade 1 English Willow' },
      { key: 'Profile', value: 'High Mid Bow' },
    ],
  },
  {
    id: '5',
    slug: 'the-reserve',
    name: 'The Reserve',
    grade: 'Grade 2 English Willow',
    profile: 'Traditional',
    price: 13500,
    compareAtPrice: 16000,
    rating: 4,
    stock: 25,
    fill: '#d4b870',
    sideFill: '#b09040',
    label: 'RES',
    specifications: [
      { key: 'Willow', value: 'Grade 2 English Willow' },
      { key: 'Profile', value: 'Traditional' },
    ],
  },
  {
    id: '6',
    slug: 'the-bespoke',
    name: 'The Bespoke',
    grade: 'Grade 1 English Willow',
    profile: 'Custom',
    price: 42000,
    compareAtPrice: null,
    rating: 5,
    stock: 5,
    fill: '#c8a060',
    sideFill: '#a08040',
    label: 'BSP',
    specifications: [
      { key: 'Willow', value: 'Grade 1 English Willow' },
      { key: 'Profile', value: 'Custom' },
    ],
  },
  {
    id: '7',
    slug: 'the-centurion',
    name: 'The Centurion',
    grade: 'Grade 1 English Willow',
    profile: 'Mid Bow',
    price: 26500,
    compareAtPrice: 30000,
    rating: 4,
    stock: 10,
    fill: '#dfc07a',
    sideFill: '#b09050',
    label: 'CEN',
    specifications: [
      { key: 'Willow', value: 'Grade 1 English Willow' },
      { key: 'Profile', value: 'Mid Bow' },
    ],
  },
  {
    id: '8',
    slug: 'the-maestro',
    name: 'The Maestro',
    grade: 'Grade 1 English Willow',
    profile: 'Full Bow',
    price: 38000,
    compareAtPrice: 44000,
    rating: 5,
    stock: 4,
    fill: '#d2ae72',
    sideFill: '#aa8848',
    label: 'MAE',
    specifications: [
      { key: 'Willow', value: 'Grade 1 English Willow' },
      { key: 'Profile', value: 'Full Bow' },
    ],
  },
];

// Minimal shape of a product as returned by the API (used for mapping).
interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  specifications?: { key: string; value: string }[];
}

/**
 * Returns the live catalogue: the static list first (instant paint), replaced
 * by API data once it resolves. Falls back to static on any error. Identical
 * data-fetching behaviour for both the heritage and Atelier browsing surfaces.
 */
export function useCatalogue(): CatalogueItem[] {
  const [products, setProducts] = useState<CatalogueItem[]>(CATALOGUE);

  useEffect(() => {
    const load = async () => {
      try {
        const data = (await productsApi.fetchAll({ limit: 24 })) as { data?: ApiProduct[] };
        if (data.data && data.data.length > 0) {
          const mapped: CatalogueItem[] = data.data.map((p, i) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            grade: p.specifications?.find((s) => s.key === 'Willow')?.value || 'English Willow',
            profile: p.specifications?.find((s) => s.key === 'Profile')?.value || '',
            price: p.price,
            compareAtPrice: p.compareAtPrice ?? null,
            rating: 5,
            stock: p.stock,
            fill: CATALOGUE[i % CATALOGUE.length].fill,
            sideFill: CATALOGUE[i % CATALOGUE.length].sideFill,
            label: p.name.split(' ').pop()?.substring(0, 3).toUpperCase() || 'BAT',
            specifications: p.specifications ?? [],
          }));
          setProducts(mapped);
        }
      } catch {
        // Stay with static fallback
      }
    };
    void load();
  }, []);

  return products;
}
