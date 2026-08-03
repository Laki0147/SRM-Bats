'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminProductsApi, brandsApi, categoriesApi } from '@/lib/api';
import { useToast } from './ToastProvider';
import { DropImage, ImageDropzone } from './ImageDropzone';
import { fieldCls, fieldStyle, T } from './theme';
import { AdminButton, Card, ErrorNote, Field, Toggle } from './ui';

interface SpecRow {
  key: string;
  value: string;
}

export interface ProductInitial {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string;
  sku: string;
  stock: string;
  categoryId: string;
  brandId: string;
  isActive: boolean;
  isFeatured: boolean;
  images: DropImage[];
  specifications: SpecRow[];
}

interface Option {
  id: string;
  name: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const emptyProduct: ProductInitial = {
  name: '',
  slug: '',
  description: '',
  price: '',
  compareAtPrice: '',
  sku: '',
  stock: '0',
  categoryId: '',
  brandId: '',
  isActive: true,
  isFeatured: false,
  images: [],
  specifications: [],
};

export function ProductForm({
  mode,
  initial,
  originalSlug,
}: {
  mode: 'create' | 'edit';
  initial: ProductInitial;
  originalSlug?: string;
}) {
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState<ProductInitial>(initial);
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    void (async () => {
      try {
        const [cats, brs] = await Promise.all([categoriesApi.list(), brandsApi.list()]);
        setCategories(cats ?? []);
        setBrands(brs ?? []);
      } catch {
        // Selectors just stay empty; the field errors will guide the admin.
      }
    })();
  }, []);

  const set = <K extends keyof ProductInitial>(key: K, value: ProductInitial[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onName = (name: string) => {
    setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
  };

  // Specs repeater helpers.
  const addSpec = () => set('specifications', [...form.specifications, { key: '', value: '' }]);
  const updateSpec = (i: number, patch: Partial<SpecRow>) =>
    set(
      'specifications',
      form.specifications.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    );
  const removeSpec = (i: number) =>
    set(
      'specifications',
      form.specifications.filter((_, idx) => idx !== i)
    );

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.slug.trim()) next.slug = 'Slug is required';
    if (!form.sku.trim()) next.sku = 'SKU is required';
    if (!form.categoryId) next.categoryId = 'Select a category';
    const price = Number(form.price);
    if (form.price === '' || Number.isNaN(price) || price < 0) next.price = 'Enter a valid price';
    if (form.compareAtPrice !== '') {
      const cmp = Number(form.compareAtPrice);
      if (Number.isNaN(cmp) || cmp < 0) next.compareAtPrice = 'Enter a valid amount';
    }
    const stock = Number(form.stock);
    if (form.stock === '' || Number.isNaN(stock) || stock < 0)
      next.stock = 'Enter a valid quantity';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || undefined,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice !== '' ? Number(form.compareAtPrice) : undefined,
      sku: form.sku.trim(),
      stock: Number(form.stock),
      categoryId: form.categoryId,
      brandId: form.brandId || undefined,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      images: form.images.map((img, i) => ({ url: img.url, alt: img.alt || undefined, order: i })),
      specifications: form.specifications
        .filter((s) => s.key.trim() && s.value.trim())
        .map((s) => ({ key: s.key.trim(), value: s.value.trim() })),
    };

    setSaving(true);
    try {
      if (mode === 'create') {
        await adminProductsApi.create(payload);
        toast.success('Product created');
      } else {
        await adminProductsApi.update(originalSlug ?? form.slug, payload);
        toast.success('Product updated');
      }
      router.push('/admin/products');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* Main column */}
      <div className="space-y-5 lg:col-span-2">
        <Card>
          <h2 className="font-display mb-4 text-[18px] font-bold" style={{ color: T.ink }}>
            Details
          </h2>
          <div className="space-y-4">
            <Field label="Name" required error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => onName(e.target.value)}
                className={fieldCls}
                style={fieldStyle}
                placeholder="e.g. Grade 1 English Willow Pro"
              />
            </Field>
            <Field label="Slug" required error={errors.slug} hint="Used in the product URL.">
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set('slug', slugify(e.target.value));
                }}
                className={fieldCls}
                style={fieldStyle}
                placeholder="grade-1-english-willow-pro"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={5}
                className={fieldCls}
                style={fieldStyle}
                placeholder="Describe the bat — willow grade, weight, profile, ideal player…"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="font-display mb-4 text-[18px] font-bold" style={{ color: T.ink }}>
            Pricing &amp; Inventory
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Price (₹)" required error={errors.price}>
              <input
                type="number"
                min="0"
                step="1"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                className={fieldCls}
                style={fieldStyle}
                placeholder="0"
              />
            </Field>
            <Field
              label="Compare-at price (₹)"
              error={errors.compareAtPrice}
              hint="Optional — shows as a strike-through."
            >
              <input
                type="number"
                min="0"
                step="1"
                value={form.compareAtPrice}
                onChange={(e) => set('compareAtPrice', e.target.value)}
                className={fieldCls}
                style={fieldStyle}
                placeholder="0"
              />
            </Field>
            <Field label="SKU" required error={errors.sku}>
              <input
                value={form.sku}
                onChange={(e) => set('sku', e.target.value)}
                className={fieldCls}
                style={fieldStyle}
                placeholder="SRM-BAT-001"
              />
            </Field>
            <Field label="Stock" required error={errors.stock}>
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
                className={fieldCls}
                style={fieldStyle}
                placeholder="0"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="font-display mb-1 text-[18px] font-bold" style={{ color: T.ink }}>
            Images
          </h2>
          <p className="mb-4 font-body text-[12px]" style={{ color: T.muted }}>
            The first image is the primary thumbnail. Drag to reorder or use the controls.
          </p>
          <ImageDropzone
            images={form.images}
            onChange={(next) => set('images', next)}
            onError={(msg) => toast.error(msg)}
          />
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[18px] font-bold" style={{ color: T.ink }}>
              Specifications
            </h2>
            <AdminButton variant="ghost" size="sm" onClick={addSpec}>
              <Plus className="h-3.5 w-3.5" /> Add row
            </AdminButton>
          </div>
          {form.specifications.length === 0 ? (
            <p className="font-body text-[12.5px]" style={{ color: T.muted }}>
              No specifications yet. Add rows like “Weight → 1180g” or “Willow → Grade 1”.
            </p>
          ) : (
            <div className="space-y-2">
              {form.specifications.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={s.key}
                    onChange={(e) => updateSpec(i, { key: e.target.value })}
                    className={fieldCls}
                    style={fieldStyle}
                    placeholder="Label (e.g. Weight)"
                  />
                  <input
                    value={s.value}
                    onChange={(e) => updateSpec(i, { value: e.target.value })}
                    className={fieldCls}
                    style={fieldStyle}
                    placeholder="Value (e.g. 1180g)"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    aria-label="Remove specification"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(155,35,53,.1)]"
                    style={{ color: T.danger }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        <Card>
          <h2 className="font-display mb-4 text-[18px] font-bold" style={{ color: T.ink }}>
            Organization
          </h2>
          <div className="space-y-4">
            <Field label="Category" required error={errors.categoryId}>
              <select
                value={form.categoryId}
                onChange={(e) => set('categoryId', e.target.value)}
                className={fieldCls}
                style={fieldStyle}
              >
                <option value="">Select a category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Brand" hint="Optional.">
              <select
                value={form.brandId}
                onChange={(e) => set('brandId', e.target.value)}
                className={fieldCls}
                style={fieldStyle}
              >
                <option value="">No brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </Field>
            {categories.length === 0 && (
              <p className="font-body text-[11px]" style={{ color: T.danger }}>
                No categories found. Create one under Catalog first.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-display mb-4 text-[18px] font-bold" style={{ color: T.ink }}>
            Visibility
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-[13px] font-semibold" style={{ color: T.ink }}>
                  Active
                </p>
                <p className="font-body text-[11px]" style={{ color: T.muted }}>
                  Visible in the store
                </p>
              </div>
              <Toggle checked={form.isActive} onChange={(v) => set('isActive', v)} label="Active" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-[13px] font-semibold" style={{ color: T.ink }}>
                  Featured
                </p>
                <p className="font-body text-[11px]" style={{ color: T.muted }}>
                  Highlighted on the homepage
                </p>
              </div>
              <Toggle
                checked={form.isFeatured}
                onChange={(v) => set('isFeatured', v)}
                label="Featured"
              />
            </div>
          </div>
        </Card>

        {formError && <ErrorNote>{formError}</ErrorNote>}

        <div className="flex flex-col gap-2">
          <AdminButton type="submit" loading={saving}>
            {mode === 'create' ? 'Create product' : 'Save changes'}
          </AdminButton>
          <AdminButton
            variant="ghost"
            onClick={() => router.push('/admin/products')}
            disabled={saving}
          >
            Cancel
          </AdminButton>
        </div>
      </div>
    </form>
  );
}
