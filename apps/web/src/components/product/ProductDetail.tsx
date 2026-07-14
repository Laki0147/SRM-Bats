'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, ChevronDown, Star, Shield, Package, Truck, RefreshCw, CheckCircle } from 'lucide-react';
import type { Product } from '@/lib/products';

// ─── SVG bat illustration (matches site style) ────────────────────────────
function ProductBatSVG({ fill = '#d2ae72', sideFill = '#aa8848' }: { fill?: string; sideFill?: string }) {
  return (
    <svg viewBox="0 0 320 520" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-w-[260px] mx-auto drop-shadow-2xl">
      <rect x="80" y="20" width="160" height="360" rx="18" fill={fill} />
      <rect x="80" y="20" width="20" height="360" rx="8" fill={sideFill} />
      <rect x="220" y="20" width="20" height="360" rx="8" fill={sideFill} />
      {[105, 125, 145, 165, 185, 205].map(x => (
        <line key={x} x1={x} y1="30" x2={x} y2="372" stroke="#a88030" strokeWidth=".6" strokeDasharray="4 8" opacity=".45" />
      ))}
      <rect x="96" y="136" width="128" height="128" rx="10" fill="#140e08" opacity=".92" />
      <text x="160" y="196" textAnchor="middle" fontSize="26" fontWeight="900" fill="#c4956a" fontFamily="Georgia,serif" letterSpacing="4">SRM</text>
      <text x="160" y="222" textAnchor="middle" fontSize="10" fill="#6a4828" fontFamily="sans-serif" letterSpacing="5">BATS</text>
      <rect x="130" y="380" width="60" height="22" rx="5" fill="#9a7838" />
      <rect x="142" y="400" width="36" height="96" rx="5" fill="#2c1f14" />
      <ellipse cx="160" cy="498" rx="20" ry="8" fill="#1e140c" opacity=".6" />
    </svg>
  );
}

// ─── Colour palette per product position ────────────────────────────────
const PALETTE = [
  { fill: '#d2ae72', sideFill: '#aa8848' },
  { fill: '#c8a060', sideFill: '#a08040' },
  { fill: '#dfc07a', sideFill: '#b09050' },
  { fill: '#e0c880', sideFill: '#c0a050' },
  { fill: '#d4b870', sideFill: '#b09040' },
];

// ─── Trust badges ─────────────────────────────────────────────────────────
const TRUST = [
  { icon: Shield,    text: 'Authentic Handcrafted' },
  { icon: Package,   text: 'Fully Knock-in Ready'  },
  { icon: Truck,     text: 'Free Shipping ₹1,000+' },
  { icon: RefreshCw, text: '14-Day Returns'         },
];

interface Props {
  product: Product;
  paletteIndex?: number;
}

export function ProductDetail({ product, paletteIndex = 0 }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const pal = PALETTE[paletteIndex % PALETTE.length];
  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 4.8;
  const reviewCount = product._count?.reviews ?? product.reviews?.length ?? 0;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  const inStock = product.stock > 0;

  const handleAddToCart = async () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: '#faf6f0' }}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── Left: Visual ─────────────────────────────────────── */}
          <div className="sticky top-24">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[32px] overflow-hidden flex items-center justify-center"
              style={{ background: '#2c1f14', aspectRatio: '0.85', minHeight: 420 }}
            >
              {/* Warm light */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(196,149,106,.12) 0%, transparent 70%)',
              }} />

              <motion.div
                className="relative z-10 w-[65%] h-[80%]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
              >
                <ProductBatSVG fill={pal.fill} sideFill={pal.sideFill} />
              </motion.div>

              {/* Badges */}
              {product.isFeatured && (
                <div className="absolute top-5 left-5 font-sc text-[10px] font-semibold tracking-[2px] uppercase px-3 py-1 rounded-full"
                  style={{ background: '#8b5e3c', color: '#faf6f0' }}>
                  Featured
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-5 right-5 font-body text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{ background: '#c4956a', color: '#2c1f14' }}>
                  Save {discount}%
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Right: Details ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Breadcrumb */}
            <div className="font-body text-[11px] mb-4 flex items-center gap-2" style={{ color: '#a09588' }}>
              <a href="/" className="hover:underline">Home</a>
              <span>/</span>
              <a href="/products" className="hover:underline">Products</a>
              <span>/</span>
              <span style={{ color: '#5c3d2e' }}>{product.name}</span>
            </div>

            {/* Category */}
            <span className="font-sc text-[11px] font-semibold tracking-[4px] uppercase inline-block mb-3"
              style={{ color: '#8b5e3c', fontVariant: 'small-caps' }}>
              {product.category?.name ?? 'Cricket Bat'}
            </span>

            {/* Name */}
            <h1 className="font-display text-[38px] lg:text-[48px] font-bold leading-[1.1] mb-3"
              style={{ color: '#2c1f14', letterSpacing: '-1px' }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-[3px]">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'fill-[#8b5e3c] text-[#8b5e3c]' : 'text-[#c4956a] opacity-30'}`} />
                ))}
              </div>
              <span className="font-body text-[13px]" style={{ color: '#6b6358' }}>
                {avgRating.toFixed(1)} · {reviewCount} review{reviewCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-mono text-[36px] font-bold" style={{ color: '#2c1f14', letterSpacing: '-1px' }}>
                <span className="font-body text-[20px] font-medium" style={{ color: '#5c3d2e' }}>₹</span>
                {product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && (
                <span className="font-mono text-[20px] line-through" style={{ color: '#a09588' }}>
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="font-body text-[14px] leading-[1.75] mb-8" style={{ color: '#5c3d2e' }}>
                {product.description}
              </p>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-600' : 'bg-red-400'}`} />
              <span className="font-body text-[13px] font-medium" style={{ color: inStock ? '#2d6a4f' : '#9b2335' }}>
                {inStock ? `In stock — ${product.stock} available` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity + CTA */}
            <div className="flex items-center gap-3 mb-5">
              {/* Qty stepper */}
              <div className="flex items-center rounded-[10px] border overflow-hidden"
                style={{ borderColor: 'rgba(139,94,60,.2)', background: '#f2ebe0' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-11 font-mono text-xl flex items-center justify-center transition-colors hover:bg-[rgba(139,94,60,.08)]"
                  style={{ color: '#5c3d2e' }}
                >
                  −
                </button>
                <span className="w-10 text-center font-mono text-[15px] font-semibold" style={{ color: '#2c1f14' }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                  className="w-10 h-11 font-mono text-xl flex items-center justify-center transition-colors hover:bg-[rgba(139,94,60,.08)]"
                  style={{ color: '#5c3d2e' }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <motion.button
                onClick={handleAddToCart}
                disabled={!inStock}
                whileTap={{ scale: 0.97 }}
                className="flex-1 h-11 rounded-[10px] font-body text-[14px] font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
                style={{ background: added ? '#2d6a4f' : '#2c1f14', color: '#faf6f0' }}
                aria-label="Add to cart"
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="done" className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <CheckCircle className="w-4 h-4" /> Added to Cart
                    </motion.span>
                  ) : (
                    <motion.span key="add" className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="w-11 h-11 rounded-[10px] border flex items-center justify-center transition-all"
                style={{ borderColor: 'rgba(139,94,60,.25)', background: wishlisted ? 'rgba(139,94,60,.1)' : 'transparent' }}
              >
                <Heart className={`w-4.5 h-4.5 transition-colors ${wishlisted ? 'fill-[#8b5e3c] text-[#8b5e3c]' : 'text-[#8b5e3c]'}`} />
              </button>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-2 gap-2 mb-8">
              {TRUST.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 rounded-[10px] px-3 py-2.5"
                  style={{ background: 'rgba(196,149,106,.08)' }}>
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#8b5e3c' }} />
                  <span className="font-body text-[11px] font-medium" style={{ color: '#5c3d2e' }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Specifications accordion */}
            {product.specifications?.length > 0 && (
              <div className="rounded-[14px] border overflow-hidden mb-3" style={{ borderColor: 'rgba(139,94,60,.15)' }}>
                <button
                  onClick={() => setSpecsOpen(!specsOpen)}
                  className="w-full flex items-center justify-between px-5 py-4 font-body text-[13px] font-semibold"
                  style={{ background: 'rgba(196,149,106,.06)', color: '#2c1f14' }}
                >
                  Specifications
                  <motion.div animate={{ rotate: specsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4" style={{ color: '#8b5e3c' }} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {specsOpen && (
                    <motion.div
                      key="specs"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-5 py-4 space-y-2.5">
                        {product.specifications.map(spec => (
                          <div key={spec.id} className="flex justify-between items-start">
                            <span className="font-body text-[12px] font-medium" style={{ color: '#6b6358' }}>{spec.key}</span>
                            <span className="font-body text-[12px] font-semibold text-right max-w-[55%]" style={{ color: '#2c1f14' }}>{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Reviews accordion */}
            {reviewCount > 0 && (
              <div className="rounded-[14px] border overflow-hidden" style={{ borderColor: 'rgba(139,94,60,.15)' }}>
                <button
                  onClick={() => setReviewsOpen(!reviewsOpen)}
                  className="w-full flex items-center justify-between px-5 py-4 font-body text-[13px] font-semibold"
                  style={{ background: 'rgba(196,149,106,.06)', color: '#2c1f14' }}
                >
                  Customer Reviews ({reviewCount})
                  <motion.div animate={{ rotate: reviewsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4" style={{ color: '#8b5e3c' }} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {reviewsOpen && product.reviews && (
                    <motion.div
                      key="reviews"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="divide-y" style={{ borderColor: 'rgba(139,94,60,.1)' }}>
                        {product.reviews.slice(0, 5).map(r => (
                          <div key={r.id} className="px-5 py-4">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-[#8b5e3c] text-[#8b5e3c]' : 'text-[#c4956a] opacity-25'}`} />
                                ))}
                              </div>
                              <span className="font-body text-[11px] font-semibold" style={{ color: '#5c3d2e' }}>
                                {r.user.firstName ?? 'Customer'}
                              </span>
                              {r.isVerified && (
                                <span className="font-body text-[9px] font-medium px-2 py-0.5 rounded-full"
                                  style={{ background: 'rgba(45,106,79,.1)', color: '#2d6a4f' }}>
                                  Verified
                                </span>
                              )}
                            </div>
                            {r.title && <p className="font-body text-[12px] font-semibold mb-1" style={{ color: '#2c1f14' }}>{r.title}</p>}
                            {r.comment && <p className="font-body text-[12px] leading-relaxed" style={{ color: '#6b6358' }}>{r.comment}</p>}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
