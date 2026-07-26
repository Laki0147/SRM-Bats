'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */

// ── ATELIER variant — product detail ─────────────────────────────────────────
// The specimen record: a framed plate on the left, a hand-set spec sheet on the
// right. Consumes the same `Product` shape and the same cart store as the
// heritage detail view, so add-to-cart, quantity and stock logic are identical.
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/products';
import { useCartStore } from '@/lib/cart-store';
import {
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

const LOCAL_GALLERY = ['/bats/main.png'];

interface Props {
  product: Product;
  paletteIndex?: number;
}

export function AtelierProductDetail({ product, paletteIndex = 0 }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const { addItem, openCart } = useCartStore();

  const apiImages = product.images?.map((im) => im.url) ?? [];
  const offset = paletteIndex % LOCAL_GALLERY.length;
  const rotated = [...LOCAL_GALLERY.slice(offset), ...LOCAL_GALLERY.slice(0, offset)];
  const gallery = apiImages.length > 0 ? apiImages : rotated;

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 4.8;
  const reviewCount = product._count?.reviews ?? product.reviews?.length ?? 0;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  const inStock = product.stock > 0;

  const handleAddToCart = async () => {
    setAddError('');
    try {
      await addItem(product.id, qty, {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        stock: product.stock,
        image: product.images?.[0] ?? null,
      });
      setAdded(true);
      openCart();
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  };

  return (
    <div style={{ background: PAPER }}>
      <div className="mx-auto max-w-[1240px] px-6 py-12 lg:px-10 lg:py-16">
        {/* breadcrumb */}
        <div
          className="mb-8 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[1.5px]"
          style={{ color: MUTED }}
        >
          <Link href="/" className="transition-colors hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:underline">
            The Ledger
          </Link>
          <span>/</span>
          <span style={{ color: INK }}>{product.name}</span>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* ── Left: plate ─────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24">
            <motion.figure
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut }}
              className="relative"
            >
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-xl"
                style={{ background: PAPER_2, border: `1px solid ${HAIR}` }}
              >
                <span
                  className="absolute left-4 top-4 z-10 font-mono text-[9.5px] uppercase tracking-[2px]"
                  style={{ color: MUTED }}
                >
                  Specimen · {product.sku ?? product.slug}
                </span>
                {discount > 0 && (
                  <span
                    className="absolute right-4 top-4 z-10 rounded-sm px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[1px] text-white"
                    style={{ background: OX }}
                  >
                    Save {discount}%
                  </span>
                )}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImg}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={gallery[activeImg] ?? gallery[0]}
                      alt={`${product.name} — view ${activeImg + 1}`}
                      fill
                      sizes="(max-width:1024px) 100vw, 560px"
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              {gallery.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {gallery.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => setActiveImg(i)}
                      aria-label={`View ${i + 1}`}
                      className="relative h-16 w-16 overflow-hidden rounded-md transition-all"
                      style={{
                        background: PAPER_2,
                        border: `1px solid ${i === activeImg ? OX : HAIR}`,
                      }}
                    >
                      <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.figure>
          </div>

          {/* ── Right: record ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.08 }}
          >
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[3px]"
              style={{ color: OX }}
            >
              {product.category?.name ?? 'Cricket Bat'}
            </p>
            <h1
              className="font-body text-[clamp(32px,4.4vw,52px)] font-extrabold leading-[1.02]"
              style={{ color: INK, letterSpacing: '-0.03em' }}
            >
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <span className="font-mono text-[13px]" style={{ color: INK_SOFT }}>
                ★ {avgRating.toFixed(1)}
              </span>
              <span className="h-3 w-px" style={{ background: HAIR }} />
              <span className="font-mono text-[12px]" style={{ color: MUTED }}>
                {reviewCount} review{reviewCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span
                className="font-body text-[34px] font-extrabold"
                style={{ color: INK, letterSpacing: '-0.02em' }}
              >
                ₹{inr(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="font-mono text-[17px] line-through" style={{ color: MUTED }}>
                  ₹{inr(product.compareAtPrice)}
                </span>
              )}
            </div>

            {product.description && (
              <p
                className="mt-6 max-w-[52ch] font-body text-[15px] leading-[1.75]"
                style={{ color: INK_SOFT }}
              >
                {product.description}
              </p>
            )}

            {/* stock */}
            <div className="mt-6 flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: inStock ? '#4c7a4c' : OX }}
              />
              <span
                className="font-mono text-[11px] uppercase tracking-[1.5px]"
                style={{ color: inStock ? INK_SOFT : OX }}
              >
                {inStock ? `In stock — ${product.stock} available` : 'Out of stock'}
              </span>
            </div>

            {addError && (
              <div
                role="alert"
                className="mt-4 rounded-md px-4 py-2.5 font-body text-[12px] font-medium"
                style={{ background: 'rgba(158,51,36,0.08)', color: OX, border: `1px solid ${OX}` }}
              >
                {addError}
              </div>
            )}

            {/* qty + cta */}
            <div className="mt-7 flex items-stretch gap-3">
              <div
                className="flex items-center overflow-hidden rounded-md"
                style={{ border: `1px solid ${HAIR}` }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-12 w-11 items-center justify-center font-mono text-lg transition-colors hover:bg-[rgba(23,20,15,0.05)]"
                  style={{ color: INK }}
                >
                  −
                </button>
                <span
                  className="w-10 text-center font-mono text-[15px] font-semibold"
                  style={{ color: INK }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                  className="flex h-12 w-11 items-center justify-center font-mono text-lg transition-colors hover:bg-[rgba(23,20,15,0.05)]"
                  style={{ color: INK }}
                >
                  +
                </button>
              </div>

              <motion.button
                onClick={() => void handleAddToCart()}
                disabled={!inStock}
                whileTap={{ scale: 0.98 }}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-md font-mono text-[12px] font-medium uppercase tracking-[2px] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-45"
                style={{ background: added ? '#4c7a4c' : OX }}
                aria-label="Add to cart"
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="done"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <Check className="h-4 w-4" /> Added
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <ShoppingBag className="h-4 w-4" /> Add to bag
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* spec sheet */}
            {product.specifications?.length > 0 && (
              <div className="mt-10">
                <p
                  className="mb-4 font-mono text-[10.5px] uppercase tracking-[2px]"
                  style={{ color: OX }}
                >
                  Specification
                </p>
                <dl className="overflow-hidden rounded-lg" style={{ border: `1px solid ${HAIR}` }}>
                  {product.specifications.map((spec, i) => (
                    <div
                      key={spec.id}
                      className="flex items-baseline justify-between gap-4 px-4 py-3"
                      style={{
                        background: i % 2 === 0 ? PAPER : PAPER_2,
                        borderTop: i === 0 ? 'none' : `1px solid ${HAIR}`,
                      }}
                    >
                      <dt
                        className="font-mono text-[10.5px] uppercase tracking-[1.5px]"
                        style={{ color: MUTED }}
                      >
                        {spec.key}
                      </dt>
                      <dd
                        className="text-right font-body text-[13px] font-semibold"
                        style={{ color: INK }}
                      >
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* reviews */}
            {reviewCount > 0 && product.reviews && product.reviews.length > 0 && (
              <div className="mt-10">
                <p
                  className="mb-4 font-mono text-[10.5px] uppercase tracking-[2px]"
                  style={{ color: OX }}
                >
                  From the pavilion ({reviewCount})
                </p>
                <div className="space-y-4">
                  {product.reviews.slice(0, 5).map((r) => (
                    <figure
                      key={r.id}
                      className="rounded-lg px-4 py-4"
                      style={{ background: PAPER_2, border: `1px solid ${HAIR}` }}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="font-mono text-[12px]" style={{ color: INK_SOFT }}>
                          {'★'.repeat(r.rating)}
                          <span style={{ color: MUTED }}>{'★'.repeat(5 - r.rating)}</span>
                        </span>
                        <figcaption
                          className="font-body text-[12px] font-semibold"
                          style={{ color: INK }}
                        >
                          {r.user.firstName ?? 'Customer'}
                        </figcaption>
                        {r.isVerified && (
                          <span
                            className="font-mono text-[9px] uppercase tracking-[1px]"
                            style={{ color: '#4c7a4c' }}
                          >
                            Verified
                          </span>
                        )}
                      </div>
                      {r.title && (
                        <p className="font-body text-[13px] font-semibold" style={{ color: INK }}>
                          {r.title}
                        </p>
                      )}
                      {r.comment && (
                        <p
                          className="mt-0.5 font-body text-[13px] leading-[1.6]"
                          style={{ color: INK_SOFT }}
                        >
                          {r.comment}
                        </p>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
