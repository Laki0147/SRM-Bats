'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { ordersApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PENDING:    { bg: 'rgba(196,149,106,.12)', text: '#8b5e3c',  label: 'Pending'    },
  CONFIRMED:  { bg: 'rgba(45,106,79,.1)',    text: '#2d6a4f',  label: 'Confirmed'  },
  PROCESSING: { bg: 'rgba(59,130,212,.1)',   text: '#3b82d4',  label: 'Processing' },
  SHIPPED:    { bg: 'rgba(59,130,212,.15)',  text: '#2563eb',  label: 'Shipped'    },
  DELIVERED:  { bg: 'rgba(45,106,79,.15)',   text: '#166534',  label: 'Delivered'  },
  CANCELLED:  { bg: 'rgba(155,35,53,.1)',    text: '#9b2335',  label: 'Cancelled'  },
  REFUNDED:   { bg: 'rgba(155,35,53,.08)',   text: '#7f1d1d',  label: 'Refunded'   },
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) { router.push('/'); return; }
    loadOrders();
  }, [mounted, isAuthenticated]);

  const loadOrders = async () => {
    try {
      const data = await ordersApi.list();
      setOrders(data);
    } catch {}
    finally { setIsLoading(false); }
  };

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen" style={{ background: '#faf6f0' }}>
      <SiteNavbar />
      <main className="pt-[68px]">
        <div className="max-w-[900px] mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <span className="font-sc text-[11px] tracking-[4px] uppercase font-semibold" style={{ color: '#8b5e3c' }}>Account</span>
            <h1 className="font-display text-[36px] font-bold mt-1" style={{ color: '#2c1f14', letterSpacing: '-1px' }}>Order History</h1>
            {user && (
              <p className="font-body text-[13px] mt-1" style={{ color: '#6b6358' }}>
                {user.firstName} {user.lastName} · {user.email}
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[#8b5e3c] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag className="w-16 h-16 mx-auto mb-5 opacity-20" style={{ color: '#8b5e3c' }} />
              <p className="font-display text-[22px] font-bold mb-3" style={{ color: '#2c1f14' }}>No orders yet</p>
              <p className="font-body text-[14px] mb-8" style={{ color: '#6b6358' }}>Browse our collection and place your first order.</p>
              <Link href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] font-body text-[13px] font-semibold"
                style={{ background: '#2c1f14', color: '#faf6f0' }}>
                Shop Now <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => {
                const ss = STATUS_STYLES[order.status] || STATUS_STYLES.PENDING;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link href={`/order-confirmation/${order.id}`}
                      className="block rounded-[20px] border p-5 transition-all hover:shadow-md group"
                      style={{ background: '#f7f2ea', borderColor: 'rgba(196,149,106,.15)' }}>
                      <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                        <div>
                          <p className="font-body text-[11px] font-semibold uppercase tracking-[1px] mb-1" style={{ color: '#a09588' }}>
                            {fmtDate(order.createdAt)}
                          </p>
                          <p className="font-mono text-[15px] font-bold" style={{ color: '#2c1f14' }}>
                            {order.orderNumber}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full font-body text-[10px] font-semibold uppercase tracking-[1px]"
                            style={{ background: ss.bg, color: ss.text }}>
                            {ss.label}
                          </span>
                          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: '#a09588' }} />
                        </div>
                      </div>

                      {/* Products preview */}
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        {order.items?.slice(0, 3).map((item: any) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0" style={{ background: '#2c1f14' }}>
                              <Package className="w-3.5 h-3.5 text-[#c4956a]" />
                            </div>
                            <span className="font-body text-[12px]" style={{ color: '#5c3d2e' }}>
                              {item.product?.name} ×{item.quantity}
                            </span>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <span className="font-body text-[11px]" style={{ color: '#a09588' }}>
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(139,94,60,.12)' }}>
                        <div className="flex items-center gap-3">
                          <span className="font-body text-[11px]" style={{ color: '#a09588' }}>
                            {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-[#c4956a] opacity-50">·</span>
                          <span className="font-body text-[11px] capitalize" style={{ color: '#a09588' }}>
                            {order.paymentMethod}
                          </span>
                        </div>
                        <span className="font-mono text-[15px] font-bold" style={{ color: '#2c1f14' }}>
                          {fmt(order.total)}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
