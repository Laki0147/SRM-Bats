'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { emptyProduct, ProductForm } from '@/components/admin/ProductForm';
import { T } from '@/components/admin/theme';
import { PageHeader } from '@/components/admin/ui';

export default function NewProductPage() {
  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1.5 font-body text-[12.5px] font-medium transition-colors hover:opacity-70"
        style={{ color: T.accent }}
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to products
      </Link>
      <PageHeader eyebrow="Catalog" title="Add Product" subtitle="Create a new bat listing." />
      <ProductForm mode="create" initial={emptyProduct} />
    </div>
  );
}
