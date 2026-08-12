'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

import { IndianRupee, PackageX, ShoppingCart, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminOrdersApi, adminProductsApi } from '@/lib/api';
import { formatCurrency, formatDateTime, fullName } from '@/components/admin/format';
import { T } from '@/components/admin/theme';
import {
  Card,
  EmptyState,
  ErrorNote,
  LoadingBlock,
  PageHeader,
  StatusPill,
  TableShell,
} from '@/components/admin/ui';

interface OrderRow {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  user?: { firstName?: string | null; lastName?: string | null; email?: string };
}

interface Kpis {
  revenue: number;
  ordersToday: number;
  totalOrders: number;
  lowStock: number;
}

const LOW_STOCK_THRESHOLD = 5;

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kpis, setKpis] = useState<Kpis>({
    revenue: 0,
    ordersToday: 0,
    totalOrders: 0,
    lowStock: 0,
  });
  const [recent, setRecent] = useState<OrderRow[]>([]);

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setError('');
      try {
        // Pull a wide slice of orders to compute headline stats client-side,
        // plus the product list to count low stock. (No dedicated stats route.)
        const [ordersRes, productsRes] = await Promise.all([
          adminOrdersApi.list({ limit: 500 }),
          adminProductsApi.list({ limit: 500 }),
        ]);
        if (!active) return;

        const orders: OrderRow[] = ordersRes.data ?? [];
        const products: { stock?: number; isActive?: boolean }[] = productsRes.data ?? [];

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const revenue = orders
          .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REFUNDED')
          .reduce((sum, o) => sum + Number(o.total ?? 0), 0);
        const ordersToday = orders.filter((o) => new Date(o.createdAt) >= startOfDay).length;
        const lowStock = products.filter(
          (p) => p.isActive !== false && (p.stock ?? 0) <= LOW_STOCK_THRESHOLD
        ).length;

        setKpis({
          revenue,
          ordersToday,
          totalOrders: ordersRes.meta?.total ?? orders.length,
          lowStock,
        });
        setRecent(orders.slice(0, 8));
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        subtitle="A snapshot of your store's performance."
      />

      {loading ? (
        <LoadingBlock label="Loading dashboard…" />
      ) : error ? (
        <ErrorNote>{error}</ErrorNote>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiTile
              label="Total Revenue"
              value={formatCurrency(kpis.revenue)}
              Icon={IndianRupee}
            />
            <KpiTile label="Orders Today" value={String(kpis.ordersToday)} Icon={TrendingUp} />
            <KpiTile label="Total Orders" value={String(kpis.totalOrders)} Icon={ShoppingCart} />
            <KpiTile
              label="Low Stock"
              value={String(kpis.lowStock)}
              Icon={PackageX}
              accent={kpis.lowStock > 0 ? T.danger : undefined}
              hint={`≤ ${LOW_STOCK_THRESHOLD} in stock`}
            />
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-[20px] font-bold" style={{ color: T.ink }}>
                Recent Orders
              </h2>
              <Link
                href="/admin/orders"
                className="font-body text-[12.5px] font-medium hover:underline"
                style={{ color: T.accent }}
              >
                View all →
              </Link>
            </div>

            {recent.length === 0 ? (
              <EmptyState
                title="No orders yet"
                hint="Orders will appear here as customers check out."
              />
            ) : (
              <TableShell headers={['Order', 'Customer', 'Date', 'Status', 'Total']}>
                {recent.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t transition-colors hover:bg-[rgba(139,94,60,.04)]"
                    style={{ borderColor: T.lineSoft }}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-mono text-[12px] font-semibold hover:underline"
                        style={{ color: T.accent }}
                      >
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-body text-[12.5px]" style={{ color: T.ink }}>
                      {fullName(o.user)}
                    </td>
                    <td className="px-4 py-3 font-body text-[12px]" style={{ color: T.body }}>
                      {formatDateTime(o.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={o.status} />
                    </td>
                    <td
                      className="px-4 py-3 font-mono text-[12.5px] font-semibold"
                      style={{ color: T.ink }}
                    >
                      {formatCurrency(o.total)}
                    </td>
                  </tr>
                ))}
              </TableShell>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function KpiTile({
  label,
  value,
  Icon,
  accent,
  hint,
}: {
  label: string;
  value: string;
  Icon: typeof IndianRupee;
  accent?: string;
  hint?: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p
            className="font-sc text-[10.5px] font-semibold uppercase tracking-[1.5px]"
            style={{ color: T.muted }}
          >
            {label}
          </p>
          <p
            className="font-display mt-2 text-[28px] font-bold leading-none"
            style={{ color: accent ?? T.ink }}
          >
            {value}
          </p>
          {hint && (
            <p className="mt-1.5 font-body text-[11px]" style={{ color: T.muted }}>
              {hint}
            </p>
          )}
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[12px]"
          style={{ background: 'rgba(139,94,60,.1)' }}
        >
          <Icon className="h-[18px] w-[18px]" style={{ color: T.accent }} />
        </div>
      </div>
    </Card>
  );
}
