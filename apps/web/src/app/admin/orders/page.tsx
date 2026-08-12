'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

import { Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { adminOrdersApi } from '@/lib/api';
import { formatCurrency, formatDateTime, fullName } from '@/components/admin/format';
import { fieldCls, fieldStyle, T } from '@/components/admin/theme';
import {
  EmptyState,
  ErrorNote,
  Field,
  LoadingBlock,
  PageHeader,
  Pagination,
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
  items?: { id: string }[];
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

const PAGE_SIZE = 20;

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(id);
  }, [search]);

  // Reset to page 1 when filters change.
  useEffect(() => {
    setPage(1);
  }, [status, startDate, endDate]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminOrdersApi.list({
        status: status || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: debouncedSearch || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setRows(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
      setTotal(res.meta?.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [status, startDate, endDate, debouncedSearch, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const clearFilters = () => {
    setStatus('');
    setStartDate('');
    setEndDate('');
    setSearch('');
  };

  const hasFilters = status || startDate || endDate || debouncedSearch;

  return (
    <div>
      <PageHeader
        eyebrow="Fulfilment"
        title="Orders"
        subtitle={loading ? undefined : `${total} order${total === 1 ? '' : 's'} total`}
      />

      {/* Filters */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Search">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: T.muted }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order # or email"
              className={`${fieldCls} pl-9`}
              style={fieldStyle}
            />
          </div>
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={fieldCls}
            style={fieldStyle}
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </Field>
        <Field label="From">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={fieldCls}
            style={fieldStyle}
          />
        </Field>
        <Field label="To">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={fieldCls}
            style={fieldStyle}
          />
        </Field>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="mb-4 font-body text-[12px] font-medium hover:underline"
          style={{ color: T.accent }}
        >
          Clear filters
        </button>
      )}

      {loading ? (
        <LoadingBlock label="Loading orders…" />
      ) : error ? (
        <ErrorNote>{error}</ErrorNote>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="h-10 w-10" />}
          title={hasFilters ? 'No orders match these filters' : 'No orders yet'}
          hint={
            hasFilters ? 'Try widening your search.' : 'Orders appear here as customers check out.'
          }
        />
      ) : (
        <>
          <TableShell
            headers={['Order', 'Customer', 'Date', 'Items', 'Status', 'Payment', 'Total']}
          >
            {rows.map((o) => (
              <tr
                key={o.id}
                className="cursor-pointer border-t transition-colors hover:bg-[rgba(139,94,60,.04)]"
                style={{ borderColor: T.lineSoft }}
                onClick={() => {
                  window.location.href = `/admin/orders/${o.id}`;
                }}
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="font-mono text-[12px] font-semibold hover:underline"
                    style={{ color: T.accent }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {o.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-body text-[12.5px] font-medium" style={{ color: T.ink }}>
                    {fullName(o.user)}
                  </p>
                  <p className="font-body text-[11px]" style={{ color: T.muted }}>
                    {o.user?.email}
                  </p>
                </td>
                <td className="px-4 py-3 font-body text-[12px]" style={{ color: T.body }}>
                  {formatDateTime(o.createdAt)}
                </td>
                <td className="px-4 py-3 font-mono text-[12.5px]" style={{ color: T.body }}>
                  {o.items?.length ?? 0}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={o.status} />
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={o.paymentStatus} />
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
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </>
      )}
    </div>
  );
}
