'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

import { Package, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { adminProductsApi, resolveImageUrl } from '@/lib/api';
import { useConfirm } from '@/components/admin/ConfirmProvider';
import { useToast } from '@/components/admin/ToastProvider';
import { formatCurrency } from '@/components/admin/format';
import { fieldCls, fieldStyle, T } from '@/components/admin/theme';
import {
  AdminButton,
  EmptyState,
  ErrorNote,
  LoadingBlock,
  PageHeader,
  Pagination,
  StatusPill,
  TableShell,
} from '@/components/admin/ui';

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  images?: { url: string; alt?: string }[];
  category?: { name: string };
}

const PAGE_SIZE = 12;

export default function AdminProductsPage() {
  const toast = useToast();
  const confirm = useConfirm();

  const [rows, setRows] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Debounce the search box.
  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(id);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminProductsApi.list({
        search: debounced || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setRows(res.data ?? []);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [debounced, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const onDelete = async (p: ProductRow) => {
    const ok = await confirm({
      title: `Delete "${p.name}"?`,
      message:
        'This deactivates the product so it no longer appears in the store. You can re-activate it later by editing.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    setDeletingId(p.id);
    try {
      await adminProductsApi.remove(p.slug);
      toast.success(`"${p.name}" deleted`);
      // Refetch; step back a page if we removed the last row on it.
      if (rows.length === 1 && page > 1) setPage((n) => n - 1);
      else void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        subtitle="Add, edit, and manage everything in your store."
        actions={
          <Link href="/admin/products/new">
            <AdminButton>
              <Plus className="h-4 w-4" /> Add product
            </AdminButton>
          </Link>
        }
      />

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: T.muted }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className={`${fieldCls} pl-9`}
          style={fieldStyle}
        />
      </div>

      {loading ? (
        <LoadingBlock label="Loading products…" />
      ) : error ? (
        <ErrorNote>{error}</ErrorNote>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<Package className="h-10 w-10" />}
          title={debounced ? 'No products match your search' : 'No products yet'}
          hint={debounced ? 'Try a different term.' : 'Add your first bat to get started.'}
          action={
            !debounced && (
              <Link href="/admin/products/new">
                <AdminButton>
                  <Plus className="h-4 w-4" /> Add product
                </AdminButton>
              </Link>
            )
          }
        />
      ) : (
        <>
          <TableShell headers={['Product', 'Category', 'Price', 'Stock', 'Status', '']}>
            {rows.map((p) => (
              <tr
                key={p.id}
                className="border-t transition-colors hover:bg-[rgba(139,94,60,.04)]"
                style={{ borderColor: T.lineSoft }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-11 w-11 shrink-0 overflow-hidden rounded-[8px] border"
                      style={{ borderColor: T.line, background: T.surfaceAlt }}
                    >
                      {p.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveImageUrl(p.images[0].url)}
                          alt={p.images[0].alt || p.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-4 w-4" style={{ color: T.muted }} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p
                        className="truncate font-body text-[13px] font-semibold"
                        style={{ color: T.ink }}
                      >
                        {p.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {p.isFeatured && <StatusPill status="Featured" />}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-body text-[12.5px]" style={{ color: T.body }}>
                  {p.category?.name ?? '—'}
                </td>
                <td
                  className="px-4 py-3 font-mono text-[12.5px] font-semibold"
                  style={{ color: T.ink }}
                >
                  {formatCurrency(p.price)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="font-mono text-[12.5px] font-semibold"
                    style={{ color: p.stock <= 5 ? T.danger : T.ink }}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={p.isActive ? 'ACTIVE' : 'INACTIVE'} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/products/${p.slug}`}
                      aria-label={`Edit ${p.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(139,94,60,.1)]"
                      style={{ color: T.accent }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => void onDelete(p)}
                      disabled={deletingId === p.id}
                      aria-label={`Delete ${p.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(155,35,53,.1)] disabled:opacity-40"
                      style={{ color: T.danger }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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
