'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

import { FileText, Printer } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { adminOrdersApi } from '@/lib/api';
import { formatCurrency, formatDateTime, fullName } from '@/components/admin/format';
import { fieldCls, fieldStyle, T } from '@/components/admin/theme';
import {
  AdminButton,
  EmptyState,
  ErrorNote,
  Field,
  LoadingBlock,
  PageHeader,
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

interface Invoice {
  id: string;
  orderNumber: string;
  createdAt: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: string;
  paymentMethod?: string;
  shippingAddress?: Address;
  user?: { firstName?: string | null; lastName?: string | null; email?: string };
  items?: { id: string; quantity: number; price: number; product?: { name: string } }[];
}

function todayInput(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function AdminInvoicesPage() {
  const [date, setDate] = useState(todayInput());
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    setError('');
    try {
      const res = await adminOrdersApi.list({
        startDate: date,
        endDate: date,
        limit: 500,
      });
      setInvoices(res.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void load();
  }, [load]);

  const dayTotal = invoices.reduce((sum, i) => sum + Number(i.total ?? 0), 0);

  return (
    <div>
      <style>{`@media print { .invoice-sheet { break-after: page; page-break-after: always; box-shadow: none !important; border: none !important; } .invoice-sheet:last-child { break-after: auto; page-break-after: auto; } }`}</style>

      <div className="admin-no-print">
        <PageHeader
          eyebrow="Accounts"
          title="Invoices"
          subtitle="Pick a date to view and print that day's orders as invoices."
          actions={
            invoices.length > 0 ? (
              <AdminButton onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> Print all
              </AdminButton>
            ) : undefined
          }
        />

        <div className="mb-6 flex flex-wrap items-end gap-3">
          <Field label="Date" className="w-full max-w-[220px]">
            <input
              type="date"
              value={date}
              max={todayInput()}
              onChange={(e) => setDate(e.target.value)}
              className={fieldCls}
              style={fieldStyle}
            />
          </Field>
          {!loading && invoices.length > 0 && (
            <div className="mb-1">
              <p className="font-body text-[12px]" style={{ color: T.muted }}>
                {invoices.length} order{invoices.length === 1 ? '' : 's'} ·{' '}
                <span className="font-mono font-semibold" style={{ color: T.ink }}>
                  {formatCurrency(dayTotal)}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <LoadingBlock label="Loading invoices…" />
      ) : error ? (
        <ErrorNote>{error}</ErrorNote>
      ) : invoices.length === 0 ? (
        <div className="admin-no-print">
          <EmptyState
            icon={<FileText className="h-10 w-10" />}
            title="No orders on this date"
            hint="Choose another date to see its invoices."
          />
        </div>
      ) : (
        <div className="space-y-6">
          {invoices.map((inv) => (
            <InvoiceSheet key={inv.id} invoice={inv} />
          ))}
        </div>
      )}
    </div>
  );
}

function InvoiceSheet({ invoice }: { invoice: Invoice }) {
  const addr = invoice.shippingAddress;
  const name = addr
    ? [addr.firstName, addr.lastName].filter(Boolean).join(' ')
    : fullName(invoice.user);

  return (
    <div
      className="invoice-sheet rounded-[16px] border bg-white p-8"
      style={{ borderColor: T.line, color: T.ink }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between border-b pb-5"
        style={{ borderColor: T.line }}
      >
        <div>
          <p className="font-display text-[26px] font-bold leading-none" style={{ color: T.ink }}>
            SRM Bats
          </p>
          <p className="mt-1 font-body text-[11px]" style={{ color: T.muted }}>
            Premium English &amp; Kashmir Willow Cricket Bats
          </p>
        </div>
        <div className="text-right">
          <p
            className="font-sc text-[12px] font-semibold uppercase tracking-[2px]"
            style={{ color: T.accent }}
          >
            Invoice
          </p>
          <p className="mt-1 font-mono text-[13px] font-semibold" style={{ color: T.ink }}>
            {invoice.orderNumber}
          </p>
          <p className="font-body text-[11px]" style={{ color: T.muted }}>
            {formatDateTime(invoice.createdAt)}
          </p>
        </div>
      </div>

      {/* Bill to */}
      <div className="grid grid-cols-2 gap-6 py-5">
        <div>
          <p
            className="font-sc text-[10px] font-semibold uppercase tracking-[1.5px]"
            style={{ color: T.muted }}
          >
            Billed to
          </p>
          <p className="mt-1.5 font-body text-[13px] font-semibold" style={{ color: T.ink }}>
            {name}
          </p>
          {invoice.user?.email && (
            <p className="font-body text-[12px]" style={{ color: T.body }}>
              {invoice.user.email}
            </p>
          )}
          {addr && (
            <div className="mt-1 font-body text-[12px] leading-relaxed" style={{ color: T.body }}>
              {addr.line1 && <p>{addr.line1}</p>}
              {addr.line2 && <p>{addr.line2}</p>}
              <p>{[addr.city, addr.state, addr.postalCode].filter(Boolean).join(', ')}</p>
              {addr.country && <p>{addr.country}</p>}
              {addr.phone && <p>☎ {addr.phone}</p>}
            </div>
          )}
        </div>
        <div className="text-right">
          <p
            className="font-sc text-[10px] font-semibold uppercase tracking-[1.5px]"
            style={{ color: T.muted }}
          >
            Payment
          </p>
          <p className="mt-1.5 font-body text-[13px] font-semibold" style={{ color: T.ink }}>
            {invoice.paymentStatus}
          </p>
          {invoice.paymentMethod && (
            <p className="font-mono text-[11px] uppercase" style={{ color: T.body }}>
              {invoice.paymentMethod}
            </p>
          )}
        </div>
      </div>

      {/* Line items */}
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.line}` }}>
            <th
              className="font-sc py-2 text-left text-[10px] font-semibold uppercase tracking-[1px]"
              style={{ color: T.muted }}
            >
              Item
            </th>
            <th
              className="font-sc py-2 text-center text-[10px] font-semibold uppercase tracking-[1px]"
              style={{ color: T.muted }}
            >
              Qty
            </th>
            <th
              className="font-sc py-2 text-right text-[10px] font-semibold uppercase tracking-[1px]"
              style={{ color: T.muted }}
            >
              Price
            </th>
            <th
              className="font-sc py-2 text-right text-[10px] font-semibold uppercase tracking-[1px]"
              style={{ color: T.muted }}
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {(invoice.items ?? []).map((it) => (
            <tr key={it.id} style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
              <td className="py-2.5 font-body text-[12.5px]" style={{ color: T.ink }}>
                {it.product?.name ?? 'Product'}
              </td>
              <td className="py-2.5 text-center font-mono text-[12.5px]" style={{ color: T.body }}>
                {it.quantity}
              </td>
              <td className="py-2.5 text-right font-mono text-[12.5px]" style={{ color: T.body }}>
                {formatCurrency(it.price)}
              </td>
              <td
                className="py-2.5 text-right font-mono text-[12.5px] font-semibold"
                style={{ color: T.ink }}
              >
                {formatCurrency(it.price * it.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="ml-auto mt-4 w-full max-w-[260px] space-y-1.5">
        <InvTotal label="Subtotal" value={formatCurrency(invoice.subtotal)} />
        <InvTotal
          label="Shipping"
          value={invoice.shipping === 0 ? 'Free' : formatCurrency(invoice.shipping)}
        />
        <InvTotal label="Tax (18% GST)" value={formatCurrency(invoice.tax)} />
        <div className="mt-1 border-t pt-2" style={{ borderColor: T.line }}>
          <InvTotal label="Total" value={formatCurrency(invoice.total)} strong />
        </div>
      </div>

      <p
        className="mt-8 border-t pt-4 text-center font-body text-[11px]"
        style={{ borderColor: T.line, color: T.muted }}
      >
        Thank you for choosing SRM Bats.
      </p>
    </div>
  );
}

function InvTotal({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`font-body ${strong ? 'text-[13px] font-semibold' : 'text-[12px]'}`}
        style={{ color: strong ? T.ink : T.body }}
      >
        {label}
      </span>
      <span
        className={`font-mono ${strong ? 'text-[14px] font-bold' : 'text-[12px]'}`}
        style={{ color: T.ink }}
      >
        {value}
      </span>
    </div>
  );
}
