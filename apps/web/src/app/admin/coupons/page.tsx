'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

import { BadgePercent, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { couponsApi } from '@/lib/api';
import { useConfirm } from '@/components/admin/ConfirmProvider';
import { Modal } from '@/components/admin/Modal';
import { useToast } from '@/components/admin/ToastProvider';
import { formatCurrency, formatDate, toDateInput } from '@/components/admin/format';
import { fieldCls, fieldStyle, T } from '@/components/admin/theme';
import {
  AdminButton,
  EmptyState,
  ErrorNote,
  Field,
  LoadingBlock,
  PageHeader,
  StatusPill,
  TableShell,
  Toggle,
} from '@/components/admin/ui';

interface Coupon {
  id: string;
  code: string;
  description?: string;
  type: 'PERCENT' | 'FLAT';
  value: number;
  minOrder?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  startsAt?: string | null;
  expiresAt?: string | null;
  isActive: boolean;
}

interface FormState {
  code: string;
  description: string;
  type: 'PERCENT' | 'FLAT';
  value: string;
  minOrder: string;
  usageLimit: string;
  startsAt: string;
  expiresAt: string;
  isActive: boolean;
}

const blank: FormState = {
  code: '',
  description: '',
  type: 'PERCENT',
  value: '',
  minOrder: '',
  usageLimit: '',
  startsAt: '',
  expiresAt: '',
  isActive: true,
};

export default function AdminCouponsPage() {
  const toast = useToast();
  const confirm = useConfirm();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setCoupons(await couponsApi.list());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(blank);
    setErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditingId(c.id);
    setForm({
      code: c.code,
      description: c.description ?? '',
      type: c.type,
      value: String(c.value),
      minOrder: c.minOrder != null ? String(c.minOrder) : '',
      usageLimit: c.usageLimit != null ? String(c.usageLimit) : '',
      startsAt: toDateInput(c.startsAt),
      expiresAt: toDateInput(c.expiresAt),
      isActive: c.isActive,
    });
    setErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (form.code.trim().length < 2) next.code = 'Code must be at least 2 characters';
    const value = Number(form.value);
    if (form.value === '' || Number.isNaN(value) || value <= 0)
      next.value = 'Enter a value above 0';
    else if (form.type === 'PERCENT' && value > 100) next.value = 'Percentage cannot exceed 100';
    if (form.minOrder !== '' && (Number.isNaN(Number(form.minOrder)) || Number(form.minOrder) < 0))
      next.minOrder = 'Enter a valid amount';
    if (
      form.usageLimit !== '' &&
      (!Number.isInteger(Number(form.usageLimit)) || Number(form.usageLimit) < 1)
    )
      next.usageLimit = 'Enter a whole number ≥ 1';
    if (form.startsAt && form.expiresAt && form.expiresAt < form.startsAt)
      next.expiresAt = 'Expiry must be after the start date';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      isActive: form.isActive,
    };
    if (form.description.trim()) payload.description = form.description.trim();
    if (form.minOrder !== '') payload.minOrder = Number(form.minOrder);
    if (form.usageLimit !== '') payload.usageLimit = Number(form.usageLimit);
    if (form.startsAt) payload.startsAt = form.startsAt;
    if (form.expiresAt) payload.expiresAt = form.expiresAt;

    setSaving(true);
    try {
      if (editingId) {
        await couponsApi.update(editingId, payload);
        toast.success('Coupon updated');
      } else {
        await couponsApi.create(payload);
        toast.success('Coupon created');
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (c: Coupon) => {
    const ok = await confirm({
      title: `Delete coupon "${c.code}"?`,
      message: 'This permanently removes the coupon.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    try {
      await couponsApi.remove(c.id);
      toast.success(`"${c.code}" deleted`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete coupon');
    }
  };

  const formatValue = (c: Coupon) =>
    c.type === 'PERCENT' ? `${c.value}%` : formatCurrency(c.value);

  return (
    <div>
      <PageHeader
        eyebrow="Promotions"
        title="Coupons"
        subtitle="Create and manage discount codes."
        actions={
          <AdminButton onClick={openNew}>
            <Plus className="h-4 w-4" /> Add coupon
          </AdminButton>
        }
      />

      {loading ? (
        <LoadingBlock label="Loading coupons…" />
      ) : error ? (
        <ErrorNote>{error}</ErrorNote>
      ) : coupons.length === 0 ? (
        <EmptyState
          icon={<BadgePercent className="h-10 w-10" />}
          title="No coupons yet"
          hint="Create a discount code to run a promotion."
          action={
            <AdminButton onClick={openNew}>
              <Plus className="h-4 w-4" /> Add coupon
            </AdminButton>
          }
        />
      ) : (
        <TableShell headers={['Code', 'Discount', 'Min order', 'Usage', 'Expiry', 'Status', '']}>
          {coupons.map((c) => (
            <tr key={c.id} className="border-t" style={{ borderColor: T.lineSoft }}>
              <td className="px-4 py-3">
                <span className="font-mono text-[12.5px] font-semibold" style={{ color: T.ink }}>
                  {c.code}
                </span>
                {c.description && (
                  <p className="font-body text-[11px]" style={{ color: T.muted }}>
                    {c.description}
                  </p>
                )}
              </td>
              <td
                className="px-4 py-3 font-mono text-[12.5px] font-semibold"
                style={{ color: T.accent }}
              >
                {formatValue(c)}
              </td>
              <td className="px-4 py-3 font-body text-[12.5px]" style={{ color: T.body }}>
                {c.minOrder ? formatCurrency(c.minOrder) : '—'}
              </td>
              <td className="px-4 py-3 font-mono text-[12px]" style={{ color: T.body }}>
                {c.usedCount}
                {c.usageLimit ? ` / ${c.usageLimit}` : ''}
              </td>
              <td className="px-4 py-3 font-body text-[12px]" style={{ color: T.body }}>
                {c.expiresAt ? formatDate(c.expiresAt) : '—'}
              </td>
              <td className="px-4 py-3">
                <StatusPill status={c.isActive ? 'ACTIVE' : 'INACTIVE'} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    aria-label={`Edit ${c.code}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(139,94,60,.1)]"
                    style={{ color: T.accent }}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => void onDelete(c)}
                    aria-label={`Delete ${c.code}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(155,35,53,.1)]"
                    style={{ color: T.danger }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </TableShell>
      )}

      <Modal
        open={modalOpen}
        title={editingId ? 'Edit coupon' : 'New coupon'}
        onClose={() => !saving && setModalOpen(false)}
      >
        <form onSubmit={(e) => void submit(e)} className="space-y-4">
          <Field label="Code" required error={errors.code}>
            <input
              value={form.code}
              onChange={(e) => set('code', e.target.value.toUpperCase())}
              className={`${fieldCls} font-mono uppercase`}
              style={fieldStyle}
              placeholder="SUMMER20"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type" required>
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value as 'PERCENT' | 'FLAT')}
                className={fieldCls}
                style={fieldStyle}
              >
                <option value="PERCENT">Percentage (%)</option>
                <option value="FLAT">Flat amount (₹)</option>
              </select>
            </Field>
            <Field
              label={form.type === 'PERCENT' ? 'Value (%)' : 'Value (₹)'}
              required
              error={errors.value}
            >
              <input
                type="number"
                min="0"
                step={form.type === 'PERCENT' ? '1' : '1'}
                value={form.value}
                onChange={(e) => set('value', e.target.value)}
                className={fieldCls}
                style={fieldStyle}
                placeholder={form.type === 'PERCENT' ? '20' : '500'}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Min order (₹)" error={errors.minOrder} hint="Optional">
              <input
                type="number"
                min="0"
                value={form.minOrder}
                onChange={(e) => set('minOrder', e.target.value)}
                className={fieldCls}
                style={fieldStyle}
                placeholder="No minimum"
              />
            </Field>
            <Field label="Usage limit" error={errors.usageLimit} hint="Optional">
              <input
                type="number"
                min="1"
                value={form.usageLimit}
                onChange={(e) => set('usageLimit', e.target.value)}
                className={fieldCls}
                style={fieldStyle}
                placeholder="Unlimited"
              />
            </Field>
          </div>
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
            <Field label="Expires" error={errors.expiresAt} hint="Optional">
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => set('expiresAt', e.target.value)}
                className={fieldCls}
                style={fieldStyle}
              />
            </Field>
          </div>
          <Field label="Description" hint="Optional — internal note">
            <input
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className={fieldCls}
              style={fieldStyle}
              placeholder="e.g. Festive season offer"
            />
          </Field>
          <div
            className="flex items-center justify-between border-t pt-3"
            style={{ borderColor: T.lineSoft }}
          >
            <span className="font-body text-[13px] font-semibold" style={{ color: T.ink }}>
              Active
            </span>
            <Toggle checked={form.isActive} onChange={(v) => set('isActive', v)} label="Active" />
          </div>

          {formError && <ErrorNote>{formError}</ErrorNote>}

          <div className="flex justify-end gap-2 pt-1">
            <AdminButton variant="ghost" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </AdminButton>
            <AdminButton type="submit" loading={saving}>
              {editingId ? 'Save changes' : 'Create coupon'}
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
}
