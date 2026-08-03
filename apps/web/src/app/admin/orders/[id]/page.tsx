'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminOrdersApi, resolveImageUrl } from '@/lib/api';
import { useToast } from '@/components/admin/ToastProvider';
import { formatCurrency, formatDateTime, fullName } from '@/components/admin/format';
import { fieldCls, fieldStyle, T } from '@/components/admin/theme';
import {
  AdminButton,
  Card,
  ErrorNote,
  LoadingBlock,
  PageHeader,
  StatusPill,
} from '@/components/admin/ui';

interface Address {
  firstName?: string;
  lastName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
  shippingAddress?: Address;
  billingAddress?: Address;
  user?: { firstName?: string | null; lastName?: string | null; email?: string; phone?: string };
  items?: {
    id: string;
    quantity: number;
    price: number;
    product?: { name: string; slug: string; images?: { url: string; alt?: string }[] };
  }[];
}

const STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const toast = useToast();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      setLoading(true);
      setError('');
      try {
        const o = await adminOrdersApi.get(id);
        setOrder(o);
        setStatus(o.status);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const saveStatus = async () => {
    if (!order || status === order.status) return;
    setSaving(true);
    try {
      await adminOrdersApi.updateStatus(order.id, status);
      setOrder({ ...order, status });
      toast.success(`Status updated to ${status.toLowerCase()}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update status');
      setStatus(order.status);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 font-body text-[12.5px] font-medium transition-colors hover:opacity-70"
        style={{ color: T.accent }}
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
      </Link>

      {loading ? (
        <LoadingBlock label="Loading order…" />
      ) : error ? (
        <ErrorNote>{error}</ErrorNote>
      ) : order ? (
        <>
          <PageHeader
            eyebrow="Order"
            title={order.orderNumber}
            subtitle={`Placed ${formatDateTime(order.createdAt)}`}
            actions={<StatusPill status={order.status} />}
          />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Main: items + totals */}
            <div className="space-y-5 lg:col-span-2">
              <Card pad={false}>
                <div className="border-b px-5 py-4" style={{ borderColor: T.line }}>
                  <h2 className="font-display text-[18px] font-bold" style={{ color: T.ink }}>
                    Items
                  </h2>
                </div>
                <div>
                  {(order.items ?? []).map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center gap-3 border-b px-5 py-3.5 last:border-b-0"
                      style={{ borderColor: T.lineSoft }}
                    >
                      <div
                        className="h-12 w-12 shrink-0 overflow-hidden rounded-[8px] border"
                        style={{ borderColor: T.line, background: T.surfaceAlt }}
                      >
                        {it.product?.images?.[0]?.url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={resolveImageUrl(it.product.images[0].url)}
                            alt={it.product?.name ?? ''}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate font-body text-[13px] font-semibold"
                          style={{ color: T.ink }}
                        >
                          {it.product?.name ?? 'Product'}
                        </p>
                        <p className="font-body text-[11.5px]" style={{ color: T.muted }}>
                          {formatCurrency(it.price)} × {it.quantity}
                        </p>
                      </div>
                      <p className="font-mono text-[13px] font-semibold" style={{ color: T.ink }}>
                        {formatCurrency(it.price * it.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5 border-t px-5 py-4" style={{ borderColor: T.line }}>
                  <TotalRow label="Subtotal" value={formatCurrency(order.subtotal)} />
                  <TotalRow
                    label="Shipping"
                    value={order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}
                  />
                  <TotalRow label="Tax (18% GST)" value={formatCurrency(order.tax)} />
                  <div className="mt-1 border-t pt-2" style={{ borderColor: T.line }}>
                    <TotalRow label="Total" value={formatCurrency(order.total)} strong />
                  </div>
                </div>
              </Card>

              {order.notes && (
                <Card>
                  <h2 className="font-display mb-2 text-[16px] font-bold" style={{ color: T.ink }}>
                    Notes
                  </h2>
                  <p className="font-body text-[13px] leading-relaxed" style={{ color: T.body }}>
                    {order.notes}
                  </p>
                </Card>
              )}
            </div>

            {/* Sidebar: status, customer, addresses */}
            <div className="space-y-5">
              <Card>
                <h2 className="font-display mb-3 text-[16px] font-bold" style={{ color: T.ink }}>
                  Update Status
                </h2>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={fieldCls}
                  style={fieldStyle}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0) + s.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                <div className="mt-3">
                  <AdminButton
                    onClick={() => void saveStatus()}
                    disabled={status === order.status}
                    loading={saving}
                    className="w-full"
                  >
                    Update status
                  </AdminButton>
                </div>
              </Card>

              <Card>
                <h2 className="font-display mb-3 text-[16px] font-bold" style={{ color: T.ink }}>
                  Customer
                </h2>
                <p className="font-body text-[13px] font-semibold" style={{ color: T.ink }}>
                  {fullName(order.user)}
                </p>
                {order.user?.email && (
                  <p className="mt-0.5 font-body text-[12px]" style={{ color: T.body }}>
                    {order.user.email}
                  </p>
                )}
                {order.user?.phone && (
                  <p className="font-body text-[12px]" style={{ color: T.body }}>
                    {order.user.phone}
                  </p>
                )}
                <div
                  className="mt-3 flex items-center gap-2 border-t pt-3"
                  style={{ borderColor: T.lineSoft }}
                >
                  <span className="font-body text-[12px]" style={{ color: T.muted }}>
                    Payment
                  </span>
                  <StatusPill status={order.paymentStatus} />
                  {order.paymentMethod && (
                    <span className="font-mono text-[11px] uppercase" style={{ color: T.body }}>
                      {order.paymentMethod}
                    </span>
                  )}
                </div>
              </Card>

              <AddressCard title="Shipping address" address={order.shippingAddress} />
              <AddressCard title="Billing address" address={order.billingAddress} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function TotalRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`font-body ${strong ? 'text-[14px] font-semibold' : 'text-[12.5px]'}`}
        style={{ color: strong ? T.ink : T.body }}
      >
        {label}
      </span>
      <span
        className={`font-mono ${strong ? 'text-[15px] font-bold' : 'text-[12.5px]'}`}
        style={{ color: T.ink }}
      >
        {value}
      </span>
    </div>
  );
}

function AddressCard({ title, address }: { title: string; address?: Address }) {
  if (!address) return null;
  const name = [address.firstName, address.lastName].filter(Boolean).join(' ');
  return (
    <Card>
      <h2 className="font-display mb-2 text-[16px] font-bold" style={{ color: T.ink }}>
        {title}
      </h2>
      <address
        className="font-body text-[12.5px] not-italic leading-relaxed"
        style={{ color: T.body }}
      >
        {name && <p style={{ color: T.ink, fontWeight: 600 }}>{name}</p>}
        {address.line1 && <p>{address.line1}</p>}
        {address.line2 && <p>{address.line2}</p>}
        <p>{[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}</p>
        {address.country && <p>{address.country}</p>}
        {address.phone && <p className="mt-1">☎ {address.phone}</p>}
      </address>
    </Card>
  );
}
