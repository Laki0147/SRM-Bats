'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

import { FolderTree, Plus, Tag } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { brandsApi, categoriesApi } from '@/lib/api';
import { useToast } from '@/components/admin/ToastProvider';
import { fieldCls, fieldStyle, T } from '@/components/admin/theme';
import {
  AdminButton,
  Card,
  EmptyState,
  ErrorNote,
  Field,
  LoadingBlock,
  PageHeader,
} from '@/components/admin/ui';

interface Item {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  _count?: { products?: number };
}

export default function AdminCatalogPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Categories & Brands"
        subtitle="Organize products into categories and brands."
      />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <CatalogColumn
          kind="category"
          title="Categories"
          icon={<FolderTree className="h-4 w-4" />}
          emptyIcon={<FolderTree className="h-10 w-10" />}
          api={categoriesApi}
        />
        <CatalogColumn
          kind="brand"
          title="Brands"
          icon={<Tag className="h-4 w-4" />}
          emptyIcon={<Tag className="h-10 w-10" />}
          api={brandsApi}
        />
      </div>
    </div>
  );
}

function CatalogColumn({
  kind,
  title,
  icon,
  emptyIcon,
  api,
}: {
  kind: 'category' | 'brand';
  title: string;
  icon: ReactNode;
  emptyIcon: ReactNode;
  api: { list: () => Promise<Item[]>; create: (data: unknown) => Promise<Item> };
}) {
  const toast = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : `Failed to load ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setNameError('');
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }
    const payload: Record<string, unknown> = { name: name.trim() };
    if (description.trim()) payload.description = description.trim();

    setSaving(true);
    try {
      await api.create(payload);
      toast.success(`${kind === 'category' ? 'Category' : 'Brand'} created`);
      setName('');
      setDescription('');
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card pad={false}>
      <div className="flex items-center gap-2 border-b px-5 py-4" style={{ borderColor: T.line }}>
        <span style={{ color: T.accent }}>{icon}</span>
        <h2 className="font-display text-[18px] font-bold" style={{ color: T.ink }}>
          {title}
        </h2>
        {!loading && !error && (
          <span className="ml-auto font-mono text-[12px]" style={{ color: T.muted }}>
            {items.length}
          </span>
        )}
      </div>

      {/* Create form */}
      <form
        onSubmit={(e) => void submit(e)}
        className="space-y-3 border-b px-5 py-4"
        style={{ borderColor: T.line }}
      >
        <Field label="Name" required error={nameError}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldCls}
            style={fieldStyle}
            placeholder={kind === 'category' ? 'e.g. English Willow' : 'e.g. SRM'}
          />
        </Field>
        <Field label="Description" hint="Optional">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={fieldCls}
            style={fieldStyle}
            placeholder="Short description"
          />
        </Field>
        {formError && <ErrorNote>{formError}</ErrorNote>}
        <AdminButton type="submit" loading={saving} size="sm">
          <Plus className="h-3.5 w-3.5" /> Add {kind}
        </AdminButton>
      </form>

      {/* List */}
      <div className="px-5 py-4">
        {loading ? (
          <LoadingBlock label={`Loading ${title.toLowerCase()}…`} />
        ) : error ? (
          <ErrorNote>{error}</ErrorNote>
        ) : items.length === 0 ? (
          <EmptyState
            icon={emptyIcon}
            title={`No ${title.toLowerCase()} yet`}
            hint="Add one using the form above."
          />
        ) : (
          <ul className="space-y-2">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex items-center justify-between rounded-[10px] border px-3.5 py-2.5"
                style={{ borderColor: T.lineSoft, background: T.surfaceAlt }}
              >
                <div className="min-w-0">
                  <p
                    className="truncate font-body text-[13px] font-semibold"
                    style={{ color: T.ink }}
                  >
                    {it.name}
                  </p>
                  {it.description && (
                    <p className="truncate font-body text-[11.5px]" style={{ color: T.muted }}>
                      {it.description}
                    </p>
                  )}
                </div>
                {typeof it._count?.products === 'number' && (
                  <span
                    className="ml-3 shrink-0 rounded-full px-2 py-0.5 font-mono text-[11px]"
                    style={{ background: 'rgba(139,94,60,.1)', color: T.accent }}
                  >
                    {it._count.products} product{it._count.products === 1 ? '' : 's'}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
