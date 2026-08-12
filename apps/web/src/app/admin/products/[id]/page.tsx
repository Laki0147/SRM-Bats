'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-redundant-type-constituents */

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { adminProductsApi } from '@/lib/api';
import { ProductForm, ProductInitial } from '@/components/admin/ProductForm';
import { T } from '@/components/admin/theme';
import { ErrorNote, LoadingBlock, PageHeader } from '@/components/admin/ui';

export default function EditProductPage() {
  const params = useParams();
  const slug = Array.isArray(params.id) ? params.id[0] : params.id;

  const [initial, setInitial] = useState<ProductInitial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    void (async () => {
      setLoading(true);
      setError('');
      try {
        const p = await adminProductsApi.get(slug);
        setInitial({
          id: p.id,
          name: p.name ?? '',
          slug: p.slug ?? '',
          description: p.description ?? '',
          price: p.price != null ? String(p.price) : '',
          compareAtPrice: p.compareAtPrice != null ? String(p.compareAtPrice) : '',
          sku: p.sku ?? '',
          stock: p.stock != null ? String(p.stock) : '0',
          categoryId: p.categoryId ?? p.category?.id ?? '',
          brandId: p.brandId ?? p.brand?.id ?? '',
          isActive: p.isActive ?? true,
          isFeatured: p.isFeatured ?? false,
          images: (p.images ?? []).map((img: { url: string; alt?: string }) => ({
            url: img.url,
            alt: img.alt ?? '',
          })),
          specifications: (p.specifications ?? []).map((s: { key: string; value: string }) => ({
            key: s.key,
            value: s.value,
          })),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1.5 font-body text-[12.5px] font-medium transition-colors hover:opacity-70"
        style={{ color: T.accent }}
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to products
      </Link>
      <PageHeader
        eyebrow="Catalog"
        title="Edit Product"
        subtitle={initial ? initial.name : undefined}
      />
      {loading ? (
        <LoadingBlock label="Loading product…" />
      ) : error ? (
        <ErrorNote>{error}</ErrorNote>
      ) : initial ? (
        <ProductForm mode="edit" initial={initial} originalSlug={slug} />
      ) : null}
    </div>
  );
}
