'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @next/next/no-img-element */

import { ArrowLeft, Megaphone, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { bannersApi, resolveImageUrl } from '@/lib/api';
import { useConfirm } from '@/components/admin/ConfirmProvider';
import { ImageDropzone } from '@/components/admin/ImageDropzone';
import { useToast } from '@/components/admin/ToastProvider';
import { formatDate, toDateInput } from '@/components/admin/format';
import { fieldCls, fieldStyle, T } from '@/components/admin/theme';
import {
  AdminButton,
  Card,
  EmptyState,
  ErrorNote,
  Field,
  LoadingBlock,
  PageHeader,
  StatusPill,
  Toggle,
} from '@/components/admin/ui';

interface Banner {
  id: string;
  heading: string;
  subtext?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  sortOrder: number;
}

interface FormState {
  heading: string;
  subtext: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  sortOrder: string;
}

const blank: FormState = {
  heading: '',
  subtext: '',
  imageUrl: '',
  linkUrl: '',
  isActive: false,
  startsAt: '',
  endsAt: '',
  sortOrder: '0',
};

export default function AdminBannerPage() {
  const toast = useToast();
  const confirm = useConfirm();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setBanners(await bannersApi.list());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openNew = () => {
    setForm(blank);
    setErrors({});
    setFormError('');
    setEditing('new');
  };

  const openEdit = (b: Banner) => {
    setForm({
      heading: b.heading,
      subtext: b.subtext ?? '',
      imageUrl: b.imageUrl ?? '',
      linkUrl: b.linkUrl ?? '',
      isActive: b.isActive,
      startsAt: toDateInput(b.startsAt),
      endsAt: toDateInput(b.endsAt),
      sortOrder: String(b.sortOrder ?? 0),
    });
    setErrors({});
    setFormError('');
    setEditing(b.id);
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.heading.trim()) next.heading = 'Heading is required';
    if (form.startsAt && form.endsAt && form.endsAt < form.startsAt)
      next.endsAt = 'End date must be after the start date';
    if (form.sortOrder !== '' && !Number.isInteger(Number(form.sortOrder)))
      next.sortOrder = 'Enter a whole number';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      heading: form.heading.trim(),
      isActive: form.isActive,
      sortOrder: form.sortOrder === '' ? 0 : Number(form.sortOrder),
    };
    if (form.subtext.trim()) payload.subtext = form.subtext.trim();
    if (form.imageUrl) payload.imageUrl = form.imageUrl;
    if (form.linkUrl.trim()) payload.linkUrl = form.linkUrl.trim();
    if (form.startsAt) payload.startsAt = form.startsAt;
    if (form.endsAt) payload.endsAt = form.endsAt;

    setSaving(true);
    try {
      if (editing && editing !== 'new') {
        await bannersApi.update(editing, payload);
        toast.success('Banner updated');
      } else {
        await bannersApi.create(payload);
        toast.success('Banner created');
      }
      setEditing(null);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (b: Banner) => {
    const ok = await confirm({
      title: `Delete "${b.heading}"?`,
      message: 'This permanently removes the banner.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    try {
      await bannersApi.remove(b.id);
      toast.success('Banner deleted');
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete banner');
    }
  };

  // ── Editor view ────────────────────────────────────────────────────────────
  if (editing !== null) {
    return (
      <div>
        <button
          onClick={() => setEditing(null)}
          className="mb-4 inline-flex items-center gap-1.5 font-body text-[12.5px] font-medium transition-colors hover:opacity-70"
          style={{ color: T.accent }}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to banners
        </button>
        <PageHeader
          eyebrow="Promotions"
          title={editing === 'new' ? 'New Banner' : 'Edit Banner'}
          subtitle="Manage the promotional banner. (Storefront rendering is a follow-up.)"
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Form */}
          <form onSubmit={(e) => void submit(e)} className="space-y-5">
            <Card>
              <div className="space-y-4">
                <Field label="Heading" required error={errors.heading}>
                  <input
                    value={form.heading}
                    onChange={(e) => set('heading', e.target.value)}
                    className={fieldCls}
                    style={fieldStyle}
                    placeholder="Festive Season Sale"
                  />
                </Field>
                <Field label="Subtext" hint="Optional">
                  <textarea
                    value={form.subtext}
                    onChange={(e) => set('subtext', e.target.value)}
                    rows={2}
                    className={fieldCls}
                    style={fieldStyle}
                    placeholder="Up to 30% off select English willow bats."
                  />
                </Field>
                <Field label="Link URL" hint="Optional — where the banner CTA points">
                  <input
                    value={form.linkUrl}
                    onChange={(e) => set('linkUrl', e.target.value)}
                    className={fieldCls}
                    style={fieldStyle}
                    placeholder="/products"
                  />
                </Field>
              </div>
            </Card>

            <Card>
              <h2 className="font-display mb-1 text-[16px] font-bold" style={{ color: T.ink }}>
                Background image
              </h2>
              <p className="mb-3 font-body text-[12px]" style={{ color: T.muted }}>
                Optional. The first image is used.
              </p>
              <ImageDropzone
                images={form.imageUrl ? [{ url: form.imageUrl }] : []}
                onChange={(next) => set('imageUrl', next[0]?.url ?? '')}
                onError={(msg) => toast.error(msg)}
              />
            </Card>

            <Card>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Starts" hint="Optional">
                  <input
                    type="date"
                    value={form.startsAt}
                    onChange={(e) => set('startsAt', e.target.value)}
                    className={fieldCls}
                    style={fieldStyle}
                  />
                </Field>
                <Field label="Ends" error={errors.endsAt} hint="Optional">
                  <input
                    type="date"
                    value={form.endsAt}
                    onChange={(e) => set('endsAt', e.target.value)}
                    className={fieldCls}
                    style={fieldStyle}
                  />
                </Field>
                <Field label="Sort order" error={errors.sortOrder}>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => set('sortOrder', e.target.value)}
                    className={fieldCls}
                    style={fieldStyle}
                  />
                </Field>
                <div className="flex items-end justify-between pb-2">
                  <span className="font-body text-[13px] font-semibold" style={{ color: T.ink }}>
                    Active
                  </span>
                  <Toggle
                    checked={form.isActive}
                    onChange={(v) => set('isActive', v)}
                    label="Active"
                  />
                </div>
              </div>
            </Card>

            {formError && <ErrorNote>{formError}</ErrorNote>}

            <div className="flex gap-2">
              <AdminButton type="submit" loading={saving}>
                {editing === 'new' ? 'Create banner' : 'Save changes'}
              </AdminButton>
              <AdminButton variant="ghost" onClick={() => setEditing(null)} disabled={saving}>
                Cancel
              </AdminButton>
            </div>
          </form>

          {/* Live preview */}
          <div>
            <p
              className="font-sc mb-2 text-[11px] font-semibold uppercase tracking-[2px]"
              style={{ color: T.muted }}
            >
              Live preview
            </p>
            <BannerPreview form={form} />
          </div>
        </div>
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────
  return (
    <div>
      <PageHeader
        eyebrow="Promotions"
        title="Banner"
        subtitle="Manage promotional banners for the store."
        actions={
          <AdminButton onClick={openNew}>
            <Plus className="h-4 w-4" /> New banner
          </AdminButton>
        }
      />

      {loading ? (
        <LoadingBlock label="Loading banners…" />
      ) : error ? (
        <ErrorNote>{error}</ErrorNote>
      ) : banners.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="h-10 w-10" />}
          title="No banners yet"
          hint="Create a promotional banner to feature an offer."
          action={
            <AdminButton onClick={openNew}>
              <Plus className="h-4 w-4" /> New banner
            </AdminButton>
          }
        />
      ) : (
        <div className="space-y-3">
          {banners.map((b) => (
            <Card key={b.id} className="flex items-center gap-4">
              <div
                className="h-16 w-28 shrink-0 overflow-hidden rounded-[10px] border"
                style={{ borderColor: T.line, background: T.ink }}
              >
                {b.imageUrl ? (
                  <img
                    src={resolveImageUrl(b.imageUrl)}
                    alt={b.heading}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Megaphone className="h-5 w-5" style={{ color: T.accentLight }} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className="font-display truncate text-[16px] font-bold"
                    style={{ color: T.ink }}
                  >
                    {b.heading}
                  </p>
                  <StatusPill status={b.isActive ? 'ACTIVE' : 'INACTIVE'} />
                </div>
                {b.subtext && (
                  <p className="truncate font-body text-[12.5px]" style={{ color: T.body }}>
                    {b.subtext}
                  </p>
                )}
                <p className="mt-0.5 font-body text-[11px]" style={{ color: T.muted }}>
                  {b.startsAt || b.endsAt
                    ? `${b.startsAt ? formatDate(b.startsAt) : '—'} → ${b.endsAt ? formatDate(b.endsAt) : '—'}`
                    : 'No schedule'}
                  {' · '}Order {b.sortOrder}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => openEdit(b)}
                  aria-label={`Edit ${b.heading}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(139,94,60,.1)]"
                  style={{ color: T.accent }}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => void onDelete(b)}
                  aria-label={`Delete ${b.heading}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(155,35,53,.1)]"
                  style={{ color: T.danger }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function BannerPreview({ form }: { form: FormState }) {
  return (
    <div
      className="relative flex min-h-[280px] flex-col items-start justify-center overflow-hidden rounded-[16px] border p-8"
      style={{ borderColor: T.line, background: '#2c1f14' }}
    >
      {form.imageUrl && (
        <img
          src={resolveImageUrl(form.imageUrl)}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
      )}
      <div className="relative z-10 max-w-[80%]">
        <h3
          className="font-display text-[30px] font-bold leading-tight"
          style={{ color: '#faf6f0' }}
        >
          {form.heading || 'Your banner heading'}
        </h3>
        {form.subtext && (
          <p className="mt-2 font-body text-[14px]" style={{ color: '#e8d9c4' }}>
            {form.subtext}
          </p>
        )}
        <span
          className="mt-5 inline-flex items-center rounded-[10px] px-5 py-2.5 font-body text-[13px] font-semibold"
          style={{ background: '#c4956a', color: '#2c1f14' }}
        >
          Shop now →
        </span>
      </div>
      {!form.isActive && (
        <span
          className="absolute right-3 top-3 z-10 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase"
          style={{ background: 'rgba(250,246,240,.15)', color: '#faf6f0' }}
        >
          Inactive
        </span>
      )}
    </div>
  );
}
