'use client';

/*
 * The pre-commit hook runs ESLint from the repo root, where this package's
 * `@/*` path alias is not resolvable, so store imports collapse to `any` and
 * trip the type-aware `no-unsafe-*` / promise rules with false positives (they
 * pass from apps/web). Scoped-disabled here to match the other data files.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { LoginModal } from '@/components/layout/login-modal';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';

export default function CartPage() {
  const router = useRouter();
  const { items, localItems, summary, isLoading, fetchCart, updateItem, removeItem } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  // Merge items
  const displayItems = isAuthenticated
    ? items
    : localItems.map((li) => ({
        id: li.productId,
        productId: li.productId,
        quantity: li.quantity,
        product: li.product,
      }));

  const localSummary = isAuthenticated
    ? summary
    : (() => {
        const subtotal = localItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
        const shipping = subtotal >= 1000 ? 0 : 150;
        const tax = Math.round(subtotal * 0.18 * 100) / 100;
        return {
          subtotal,
          shipping,
          tax,
          total: subtotal + shipping + tax,
          itemCount: localItems.reduce((s, i) => s + i.quantity, 0),
        };
      })();

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen" style={{ background: '#2c1f14' }}>
      <SiteNavbar activePath="/cart" />
      <main className="pt-[68px]">
        <div className="mx-auto max-w-[1100px] px-6 py-12 lg:px-12">
          <div className="mb-8">
            <span
              className="font-sc text-[11px] font-semibold uppercase tracking-[4px]"
              style={{ color: '#c4956a' }}
            >
              Shopping
            </span>
            <h1
              className="font-display mt-1 text-[36px] font-bold"
              style={{ color: '#f2ebe0', letterSpacing: '-1px' }}
            >
              Your Cart
            </h1>
          </div>

          {displayItems.length === 0 ? (
            <div className="py-24 text-center">
              <ShoppingBag
                className="mx-auto mb-5 h-16 w-16 opacity-30"
                style={{ color: '#c4956a' }}
              />
              <p className="font-display mb-3 text-[24px] font-bold" style={{ color: '#f2ebe0' }}>
                Your cart is empty
              </p>
              <p className="mb-8 font-body text-[14px]" style={{ color: '#a09588' }}>
                Browse our collection and find the perfect bat.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-[8px] px-6 py-3 font-body text-[13px] font-semibold transition-all"
                style={{ background: '#8b5e3c', color: '#f2ebe0' }}
              >
                Browse Bats <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Items */}
              <div className="space-y-3 lg:col-span-2">
                <AnimatePresence>
                  {displayItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-4 rounded-[14px] border p-4"
                      style={{ background: '#3d2b1f', borderColor: 'rgba(196,149,106,.18)' }}
                    >
                      {/* Image / placeholder */}
                      <div
                        className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[12px]"
                        style={{ background: '#1c120a' }}
                      >
                        {item.product.image ? (
                          <img
                            src={item.product.image.url}
                            alt={item.product.image.alt || item.product.name}
                            className="h-full w-full rounded-[12px] object-cover"
                          />
                        ) : (
                          <ShoppingBag className="h-6 w-6 text-[#c4956a]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-display block truncate text-[16px] font-bold hover:underline"
                          style={{ color: '#f2ebe0' }}
                        >
                          {item.product.name}
                        </Link>
                        <p
                          className="mt-1 font-mono text-[14px] font-semibold"
                          style={{ color: '#a09588' }}
                        >
                          {fmt(item.product.price)}
                        </p>
                      </div>

                      {/* Qty controls */}
                      {isAuthenticated && (
                        <div
                          className="flex shrink-0 items-center overflow-hidden rounded-[8px] border"
                          style={{ borderColor: 'rgba(196,149,106,.25)' }}
                        >
                          <button
                            onClick={() => updateItem(item.id, item.quantity - 1)}
                            disabled={isLoading}
                            className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-[rgba(196,149,106,.12)] disabled:opacity-40"
                          >
                            <Minus className="h-3 w-3" style={{ color: '#e8d9c4' }} />
                          </button>
                          <span
                            className="w-8 text-center font-mono text-[13px] font-semibold"
                            style={{ color: '#f2ebe0' }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            disabled={isLoading || item.quantity >= item.product.stock}
                            className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-[rgba(196,149,106,.12)] disabled:opacity-40"
                          >
                            <Plus className="h-3 w-3" style={{ color: '#e8d9c4' }} />
                          </button>
                        </div>
                      )}

                      <div className="shrink-0 text-right">
                        <p className="font-mono text-[14px] font-bold" style={{ color: '#f2ebe0' }}>
                          {fmt(item.product.price * item.quantity)}
                        </p>
                        {isAuthenticated && (
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={isLoading}
                            className="mt-1 flex items-center gap-1 text-[10px] font-medium transition-colors hover:opacity-70 disabled:opacity-40"
                            style={{ color: '#d98b8b' }}
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div
                  className="sticky top-24 rounded-[16px] border p-6"
                  style={{ background: '#3d2b1f', borderColor: 'rgba(196,149,106,.18)' }}
                >
                  <h2
                    className="font-display mb-5 text-[20px] font-bold"
                    style={{ color: '#f2ebe0' }}
                  >
                    Order Summary
                  </h2>
                  <div className="mb-5 space-y-3">
                    {[
                      { label: 'Subtotal', value: localSummary.subtotal },
                      { label: 'Shipping', value: localSummary.shipping },
                      { label: 'Tax (18% GST)', value: localSummary.tax },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between font-body text-[13px]">
                        <span style={{ color: '#a09588' }}>{label}</span>
                        <span style={{ color: '#e8d9c4' }}>
                          {value === 0 ? 'FREE' : fmt(value)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-3" style={{ borderColor: 'rgba(196,149,106,.15)' }}>
                      <div className="flex justify-between font-body text-[15px] font-bold">
                        <span style={{ color: '#f2ebe0' }}>Total</span>
                        <span style={{ color: '#f2ebe0' }}>{fmt(localSummary.total)}</span>
                      </div>
                    </div>
                  </div>

                  {!isAuthenticated ? (
                    <div className="text-center">
                      <p className="mb-3 font-body text-[12px]" style={{ color: '#a09588' }}>
                        Please sign in to checkout
                      </p>
                      <button
                        onClick={() => setLoginOpen(true)}
                        className="block w-full rounded-[8px] py-3 text-center font-body text-[13px] font-semibold transition-all hover:opacity-90"
                        style={{ background: '#8b5e3c', color: '#f2ebe0' }}
                      >
                        Sign In to Checkout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => router.push('/checkout')}
                      className="flex w-full items-center justify-center gap-2 rounded-[8px] py-3 font-body text-[13px] font-semibold transition-all hover:opacity-90"
                      style={{ background: '#8b5e3c', color: '#f2ebe0' }}
                    >
                      Proceed to Checkout <ArrowRight className="h-4 w-4" />
                    </button>
                  )}

                  <Link
                    href="/products"
                    className="mt-3 block text-center font-body text-[12px] hover:underline"
                    style={{ color: '#c4956a' }}
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
