'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';

export default function CartPage() {
  const router = useRouter();
  const { items, localItems, summary, isLoading, fetchCart, updateItem, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

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
        return { subtotal, shipping, tax, total: subtotal + shipping + tax, itemCount: localItems.reduce((s, i) => s + i.quantity, 0) };
      })();

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen" style={{ background: '#faf6f0' }}>
      <SiteNavbar activePath="/cart" />
      <main className="pt-[68px]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-12">
          <div className="mb-8">
            <span className="font-sc text-[11px] tracking-[4px] uppercase font-semibold" style={{ color: '#8b5e3c' }}>Shopping</span>
            <h1 className="font-display text-[36px] font-bold mt-1" style={{ color: '#2c1f14', letterSpacing: '-1px' }}>Your Cart</h1>
          </div>

          {displayItems.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag className="w-16 h-16 mx-auto mb-5 opacity-20" style={{ color: '#8b5e3c' }} />
              <p className="font-display text-[24px] font-bold mb-3" style={{ color: '#2c1f14' }}>Your cart is empty</p>
              <p className="font-body text-[14px] mb-8" style={{ color: '#6b6358' }}>Browse our collection and find the perfect bat.</p>
              <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-body text-[13px] font-semibold transition-all"
                style={{ background: '#2c1f14', color: '#faf6f0' }}>
                Browse Bats <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-3">
                <AnimatePresence>
                  {displayItems.map((item) => (
                    <motion.div key={item.id}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-4 p-4 rounded-[16px] border"
                      style={{ background: '#f7f2ea', borderColor: 'rgba(196,149,106,.15)' }}>
                      {/* Image / placeholder */}
                      <div className="w-[72px] h-[72px] rounded-[12px] flex items-center justify-center shrink-0"
                        style={{ background: '#2c1f14' }}>
                        {item.product.image ? (
                          <img src={item.product.image.url} alt={item.product.image.alt || item.product.name} className="w-full h-full object-cover rounded-[12px]" />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-[#c4956a]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.product.slug}`}
                          className="font-display text-[16px] font-bold hover:underline block truncate" style={{ color: '#2c1f14' }}>
                          {item.product.name}
                        </Link>
                        <p className="font-mono text-[14px] font-semibold mt-1" style={{ color: '#5c3d2e' }}>
                          {fmt(item.product.price)}
                        </p>
                      </div>

                      {/* Qty controls */}
                      {isAuthenticated && (
                        <div className="flex items-center rounded-[8px] border overflow-hidden shrink-0"
                          style={{ borderColor: 'rgba(139,94,60,.2)' }}>
                          <button onClick={() => updateItem(item.id, item.quantity - 1)}
                            disabled={isLoading}
                            className="w-8 h-8 flex items-center justify-center hover:bg-[rgba(139,94,60,.08)] transition-colors disabled:opacity-40">
                            <Minus className="w-3 h-3" style={{ color: '#5c3d2e' }} />
                          </button>
                          <span className="w-8 text-center font-mono text-[13px] font-semibold" style={{ color: '#2c1f14' }}>
                            {item.quantity}
                          </span>
                          <button onClick={() => updateItem(item.id, item.quantity + 1)}
                            disabled={isLoading || item.quantity >= item.product.stock}
                            className="w-8 h-8 flex items-center justify-center hover:bg-[rgba(139,94,60,.08)] transition-colors disabled:opacity-40">
                            <Plus className="w-3 h-3" style={{ color: '#5c3d2e' }} />
                          </button>
                        </div>
                      )}

                      <div className="text-right shrink-0">
                        <p className="font-mono text-[14px] font-bold" style={{ color: '#2c1f14' }}>
                          {fmt(item.product.price * item.quantity)}
                        </p>
                        {isAuthenticated && (
                          <button onClick={() => removeItem(item.id)} disabled={isLoading}
                            className="mt-1 flex items-center gap-1 text-[10px] font-medium transition-colors hover:opacity-70 disabled:opacity-40"
                            style={{ color: '#9b2335' }}>
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-[20px] border p-6" style={{ background: '#f7f2ea', borderColor: 'rgba(196,149,106,.15)' }}>
                  <h2 className="font-display text-[20px] font-bold mb-5" style={{ color: '#2c1f14' }}>Order Summary</h2>
                  <div className="space-y-3 mb-5">
                    {[
                      { label: 'Subtotal', value: localSummary.subtotal },
                      { label: 'Shipping', value: localSummary.shipping },
                      { label: 'Tax (18% GST)', value: localSummary.tax },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between font-body text-[13px]">
                        <span style={{ color: '#6b6358' }}>{label}</span>
                        <span style={{ color: '#2c1f14' }}>{value === 0 ? 'FREE' : fmt(value)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-3" style={{ borderColor: 'rgba(139,94,60,.15)' }}>
                      <div className="flex justify-between font-body text-[15px] font-bold">
                        <span style={{ color: '#2c1f14' }}>Total</span>
                        <span style={{ color: '#2c1f14' }}>{fmt(localSummary.total)}</span>
                      </div>
                    </div>
                  </div>

                  {!isAuthenticated ? (
                    <div className="text-center">
                      <p className="font-body text-[12px] mb-3" style={{ color: '#6b6358' }}>
                        Please sign in to checkout
                      </p>
                      <Link href="#" className="block w-full text-center py-3 rounded-[10px] font-body text-[13px] font-semibold transition-all"
                        style={{ background: '#2c1f14', color: '#faf6f0' }}>
                        Sign In to Checkout
                      </Link>
                    </div>
                  ) : (
                    <button onClick={() => router.push('/checkout')}
                      className="w-full py-3 rounded-[10px] font-body text-[13px] font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                      style={{ background: '#2c1f14', color: '#faf6f0' }}>
                      Proceed to Checkout <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <Link href="/products" className="block text-center mt-3 font-body text-[12px] hover:underline" style={{ color: '#8b5e3c' }}>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
