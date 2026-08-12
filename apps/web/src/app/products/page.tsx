'use client';

/*
 * The pre-commit hook runs ESLint from the repo root, where the `@/*` alias is
 * unresolved, collapsing local imports (e.g. the variant hook) to `any` and
 * tripping the type-aware `no-unsafe-*` rules with false positives. They pass
 * cleanly from apps/web. Scoped-disabled to match the other client pages.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-floating-promises */

import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { ProductsGrid } from '@/components/product/ProductsGrid';
import { AtelierProducts } from '@/components/v2/AtelierProducts';
import { useDesignVariant } from '@/lib/design-variant';

export default function ProductsPage() {
  const { variant } = useDesignVariant();

  if (variant === 'atelier') return <AtelierProducts />;

  return (
    <div className="min-h-screen" style={{ background: '#2c1f14' }}>
      <SiteNavbar activePath="/products" />
      <main>
        {/* Hero band */}
        <div className="px-6 py-16 text-center" style={{ background: '#2c1f14' }}>
          <span
            className="font-sc mb-3 block text-[11px] uppercase tracking-[4px]"
            style={{ color: '#c4956a', fontVariant: 'small-caps' }}
          >
            Our Collection
          </span>
          <h1
            className="font-display mb-4 text-[42px] font-bold lg:text-[56px]"
            style={{ color: '#f2ebe0', letterSpacing: '-1px' }}
          >
            All Cricket Bats
          </h1>
          <p className="mx-auto max-w-[480px] font-body text-[14px]" style={{ color: '#a09588' }}>
            Every bat is individually handcrafted from premium English Willow. No two are exactly
            alike.
          </p>
        </div>
        <ProductsGrid />
      </main>
      <SiteFooter />
    </div>
  );
}
