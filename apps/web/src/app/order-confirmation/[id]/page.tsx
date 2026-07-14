'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, CreditCard, ArrowRight, Printer } from 'lucide-react';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { ordersApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

interface OrderConfirmationProps {
  params: { id: string };
}

export default function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) { router.push('/'); return; }
    loadOrder();
  }, [mounted, params.id, isAuthenticated]);

  const loadOrder = async () => {
    try {
      const data = await ordersApi.get(params.id);
      setOrder(data);
    } catch (err: any) {
      setError('Order not found');
    } finally {
      setIsLoading(false);
    }
  };

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    PENDING:    { bg: 'rgba(196,149,106,.12)', text: '#8b5e3c' },
    CONFIRMED:  { bg: 'rgba(45,106,79,.1)',   text: '#2d6a4f' },
    PROCESSING: { bg: 'rgba(59,130,212,.1)',   text: '#3b82d4' },
    SHIPPED:    { bg: 'rgba(59,130,212,.15)',  text: '#2563eb' },
    DELIVERED:  { bg: 'rgba(45,106,79,.15)',   text: '#166534' },
    CANCELLED:  { bg: 'rgba(155,35,53,.1)',    text: '#9b2335' },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#faf6f0' }}>
        <SiteNavbar />
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#8b5e3c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-[13px]" style={{ color: '#6b6358' }}>Loading order…</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen" style={{ background: '#faf6f0' }}>
        <SiteNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="font-body text-[14px] mb-4" style={{ color: '#9b2335' }}>Order not found</p>
            <Link href="/account/orders" className="font-body text-[13px] underline" style={{ color: '#8b5e3c' }}>View all orders</Link>
          </div>
        </div>
      </div>
    );
  }

  const addr = typeof order.shippingAddress === 'string'
    ? JSON.parse(order.shippingAddress)
    : order.shippingAddress;

  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING;

  return (
    <div className="min-h-screen" style={{ background: '#faf6f0' }}>
      <SiteNavbar />
      <main className="pt-[68px]">
        <div className="max-w-[760px] mx-auto px-6 py-16">
          {/* Success hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(45,106,79,.1)' }}>
              <CheckCircle className="w-10 h-10" style={{ color: '#2d6a4f' }} />
            </div>
            <span className="font-sc text-[11px] tracking-[4px] uppercase font-semibold block mb-2" style={{ color: '#8b5e3c' }}>
              Order Confirmed
            </span>
            <h1 className="font-display text-[36px] font-bold mb-3" style={{ color: '#2c1f14', letterSpacing: '-1px' }}>
              Thank you!
            </h1>
            <p className="font-body text-[14px]" style={{ color: '#6b6358' }}>
              Your order <strong style={{ color: '#2c1f14' }}>{order.orderNumber}</strong> has been placed successfully.
              We'll email you when it ships.
            </p>
          </motion.div>

          {/* Order status card */}
          <div className="rounded-[20px] border p-6 mb-6" style={{ background: '#f7f2ea', borderColor: 'rgba(196,149,106,.15)' }}>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <p className="font-body text-[11px] font-semibold uppercase tracking-[1px] mb-1" style={{ color: '#a09588' }}>Order Number</p>
                <p className="font-mono text-[16px] font-bold" style={{ color: '#2c1f14' }}>{order.orderNumber}</p>
              </div>
              <span className="px-3 py-1.5 rounded-full font-body text-[11px] font-semibold uppercase tracking-[1px]"
                style={{ background: statusStyle.bg, color: statusStyle.text }}>
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-3 mb-5">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0" style={{ background: '#2c1f14' }}>
                    <Package className="w-4 h-4 text-[#c4956a]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[13px] font-semibold truncate" style={{ color: '#2c1f14' }}>{item.product?.name}</p>
                    <p className="font-body text-[11px]" style={{ color: '#a09588' }}>Qty: {item.quantity}</p>
                  </div>
                  <span className="font-mono text-[13px] font-semibold shrink-0" style={{ color: '#2c1f14' }}>
                    {fmt(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2" style={{ borderColor: 'rgba(139,94,60,.15)' }}>
              {[
                { label: 'Subtotal', value: fmt(order.subtotal) },
                { label: 'Shipping', value: order.shipping === 0 ? 'FREE' : fmt(order.shipping) },
                { label: 'Tax (18% GST)', value: fmt(order.tax) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between font-body text-[12px]">
                  <span style={{ color: '#6b6358' }}>{label}</span>
                  <span style={{ color: '#2c1f14' }}>{value}</span>
                </div>
              ))}
              <div className="border-t pt-2" style={{ borderColor: 'rgba(139,94,60,.15)' }}>
                <div className="flex justify-between font-body text-[15px] font-bold">
                  <span style={{ color: '#2c1f14' }}>Total Paid</span>
                  <span style={{ color: '#2c1f14' }}>{fmt(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery address */}
          <div className="rounded-[20px] border p-5 mb-6" style={{ background: '#f7f2ea', borderColor: 'rgba(196,149,106,.15)' }}>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4" style={{ color: '#8b5e3c' }} />
              <h3 className="font-body text-[13px] font-semibold" style={{ color: '#2c1f14' }}>Delivery Address</h3>
            </div>
            <p className="font-body text-[13px]" style={{ color: '#5c3d2e' }}>
              {addr.firstName} {addr.lastName}<br />
              {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
              {addr.city}, {addr.state} — {addr.postalCode}<br />
              {addr.phone}
            </p>
          </div>

          {/* Payment */}
          <div className="rounded-[20px] border p-5 mb-8" style={{ background: '#f7f2ea', borderColor: 'rgba(196,149,106,.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4" style={{ color: '#8b5e3c' }} />
              <h3 className="font-body text-[13px] font-semibold" style={{ color: '#2c1f14' }}>Payment</h3>
            </div>
            <p className="font-body text-[12px] capitalize" style={{ color: '#6b6358' }}>
              {order.paymentMethod} — <span className="font-semibold" style={{ color: order.paymentStatus === 'PAID' ? '#2d6a4f' : '#9b2335' }}>
                {order.paymentStatus}
              </span>
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/account/orders"
              className="flex-1 py-3 rounded-[10px] font-body text-[13px] font-semibold text-center flex items-center justify-center gap-2 transition-all"
              style={{ background: '#2c1f14', color: '#faf6f0' }}>
              <Package className="w-4 h-4" /> View All Orders
            </Link>
            <Link href="/products"
              className="flex-1 py-3 rounded-[10px] font-body text-[13px] font-semibold text-center flex items-center justify-center gap-2 transition-all border"
              style={{ borderColor: 'rgba(139,94,60,.3)', color: '#8b5e3c' }}>
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
