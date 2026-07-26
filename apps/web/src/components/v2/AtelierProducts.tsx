'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */

// ── ATELIER variant — catalogue ──────────────────────────────────────────────
// The full bat catalogue as a hand-numbered specimen ledger. Reads the same
// shared catalogue hook and the same cart store as the heritage grid, so
// filtering, sorting and add-to-cart behave identically — only the skin differs.
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useCatalogue, type CatalogueItem } from '@/lib/catalogue';
import {
  AtelierNav,
  AtelierFooter,
  PAPER,
  PAPER_2,
  INK,
  INK_SOFT,
  MUTED,
  OX,
  HAIR,
  easeOut,
  inr,
} from '@/components/v2/atelier-ui';

const HERO_SHOT = '/bats/main.png';

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price — low', value: 'price-asc' },
  { label: 'Price — high', value: 'price-desc' },
  { label: 'A–Z', value: 'name-asc' },
];

function SpecimenCard({ p, index }: { p: CatalogueItem; index: number }) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const discount = p.compareAtPrice
    ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
    : 0;

  const handleCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      await addItem(p.id, 1, {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        stock: p.stock,
        image: null,
      });
      setAdded(true);
      openCart();
      setTimeout(() => setAdded(false), 1800);
    } catch {
      // cart store surfaces its own errors
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: easeOut, delay: (index % 4) * 0.05 }}
    >
      <Link href={`/products/${p.slug}`} className="group block">
        {/* plate */}
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-lg"
          style={{ background: PAPER_2, border: `1px solid ${HAIR}` }}
        >
          <span
            className="absolute left-3 top-3 z-10 font-mono text-[9px] uppercase tracking-[2px]"
            style={{ color: MUTED }}
          >
            Lot {String(index + 1).padStart(2, '0')}
          </span>
          {discount > 0 && (
            <span
              className="absolute right-3 top-3 z-10 rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[1px] text-white"
              style={{ background: OX }}
            >
              −{discount}%
            </span>
          )}
          <Image
            src={HERO_SHOT}
            alt={p.name}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 300px"
            className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
          />
        </div>

        {/* record */}
        <div className="mt-3.5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-body text-[16px] font-bold" style={{ color: INK }}>
              {p.name}
            </h3>
            <span className="shrink-0 font-mono text-[14px] font-medium" style={{ color: INK }}>
              ₹{inr(p.price)}
            </span>
          </div>
          <div className="mt-0.5 flex items-baseline justify-between gap-3">
            <p
              className="font-mono text-[10.5px] uppercase tracking-[1px]"
              style={{ color: MUTED }}
            >
              {[p.grade, p.profile].filter(Boolean).join(' · ')}
            </p>
            {p.compareAtPrice && (
              <span
                className="shrink-0 font-mono text-[11px] line-through"
                style={{ color: MUTED }}
              >
                ₹{inr(p.compareAtPrice)}
              </span>
            )}
          </div>

          <button
            onClick={(e) => void handleCart(e)}
            aria-label={`Add ${p.name} to cart`}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border py-2.5 font-mono text-[10.5px] uppercase tracking-[2px] transition-colors"
            style={{
              borderColor: added ? OX : HAIR,
              color: added ? OX : INK,
              background: adding ? PAPER_2 : 'transparent',
            }}
            onMouseEnter={(e) => !added && (e.currentTarget.style.borderColor = OX)}
            onMouseLeave={(e) => !added && (e.currentTarget.style.borderColor = HAIR)}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" /> In your kit-bag
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" /> Add to bag
              </>
            )}
          </button>
        </div>
      </Link>
    </motion.div>
  );
}

export function AtelierProducts() {
  const [sort, setSort] = useState('featured');
  const products = useCatalogue();

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div style={{ background: PAPER }}>
      <AtelierNav activePath="/products" />
      <main className="pt-[66px]">
        {/* header band */}
        <section
          className="px-6 pb-10 pt-16 lg:px-10 lg:pb-14 lg:pt-20"
          style={{ background: PAPER }}
        >
          <div className="mx-auto max-w-[1320px]">
            <p
              className="mb-4 font-mono text-[11px] uppercase tracking-[3px]"
              style={{ color: OX }}
            >
              The Ledger — every specimen
            </p>
            <h1
              className="max-w-[18ch] font-body text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.0]"
              style={{ color: INK, letterSpacing: '-0.035em' }}
            >
              Each bat, catalogued and priced.
            </h1>
            <p
              className="mt-5 max-w-[52ch] font-body text-[15px] leading-[1.7]"
              style={{ color: INK_SOFT }}
            >
              Every blade is individually handcrafted from premium English willow. No two are
              exactly alike — pick the profile that suits your hands.
            </p>
          </div>
        </section>

        <div className="h-px w-full" style={{ background: HAIR }} />

        {/* toolbar */}
        <section className="px-6 py-8 lg:px-10">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <p
                className="font-mono text-[11px] uppercase tracking-[2px]"
                style={{ color: MUTED }}
              >
                {sorted.length} specimens
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {SORT_OPTIONS.map((opt) => {
                  const active = sort === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSort(opt.value)}
                      aria-pressed={active}
                      className="rounded-md px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[1.5px] transition-colors"
                      style={{
                        background: active ? INK : 'transparent',
                        color: active ? PAPER : INK_SOFT,
                        border: `1px solid ${active ? INK : HAIR}`,
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {sorted.map((p, i) => (
                <SpecimenCard key={p.id} p={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <AtelierFooter />
    </div>
  );
}
