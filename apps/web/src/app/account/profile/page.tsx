'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, MapPin, Package, Edit2, Trash2, Plus, Check, X } from 'lucide-react';
import Link from 'next/link';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { useAuthStore } from '@/lib/auth-store';
import { addressesApi } from '@/lib/api';

interface Address {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh',
];

const EMPTY_ADDR = {
  type: 'SHIPPING', firstName: '', lastName: '', phone: '',
  line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India',
};

const fieldCls = 'w-full px-3 py-2.5 rounded-[10px] border text-[13px] font-body outline-none transition-all focus:border-[#8b5e3c] focus:ring-1 focus:ring-[rgba(139,94,60,.15)]';
const fieldStyle = { borderColor: 'rgba(139,94,60,.2)', background: '#f7f2ea', color: '#2c1f14' };

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Address form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_ADDR });
  const [formError, setFormError] = useState('');
  const [formSaving, setFormSaving] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) { router.push('/'); return; }
    loadAddresses();
  }, [mounted, isAuthenticated]);

  const loadAddresses = async () => {
    try {
      const data = await addressesApi.list();
      setAddresses(data);
    } catch {}
    finally { setIsLoading(false); }
  };

  const openNewForm = () => {
    setForm({ ...EMPTY_ADDR });
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (addr: Address) => {
    setForm({
      type: addr.type, firstName: addr.firstName, lastName: addr.lastName,
      phone: addr.phone, line1: addr.line1, line2: addr.line2 || '',
      city: addr.city, state: addr.state, postalCode: addr.postalCode, country: addr.country,
    });
    setEditingId(addr.id);
    setFormError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.line1 || !form.city || !form.state || !form.postalCode) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setFormSaving(true);
    setFormError('');
    try {
      if (editingId) {
        const updated = await addressesApi.update(editingId, form);
        setAddresses((prev) => prev.map((a) => a.id === editingId ? updated : a));
      } else {
        const created = await addressesApi.create({ ...form, isDefault: addresses.length === 0 });
        setAddresses((prev) => [...prev, created]);
      }
      setShowForm(false);
      setEditingId(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save address');
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await addressesApi.delete(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {}
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressesApi.setDefault(id);
      loadAddresses();
    } catch {}
  };

  const f = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="min-h-screen" style={{ background: '#faf6f0' }}>
      <SiteNavbar />
      <main className="pt-[68px]">
        <div className="max-w-[860px] mx-auto px-6 py-12">

          {/* Header */}
          <div className="mb-10">
            <span className="font-sc text-[11px] tracking-[4px] uppercase font-semibold" style={{ color: '#8b5e3c' }}>Account</span>
            <h1 className="font-display text-[36px] font-bold mt-1" style={{ color: '#2c1f14', letterSpacing: '-1px' }}>My Profile</h1>
            {user && (
              <p className="font-body text-[13px] mt-1" style={{ color: '#6b6358' }}>
                {user.firstName} {user.lastName} · {user.email}
              </p>
            )}
          </div>

          {/* Tab nav */}
          <div className="flex gap-1 mb-8 p-1 rounded-[12px] w-fit" style={{ background: 'rgba(139,94,60,.08)' }}>
            {[
              { label: 'Profile', icon: User, href: '/account/profile' },
              { label: 'Orders', icon: Package, href: '/account/orders' },
            ].map(({ label, icon: Icon, href }) => (
              <Link key={label} href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-[10px] font-body text-[12px] font-semibold transition-all"
                style={{
                  background: href === '/account/profile' ? '#2c1f14' : 'transparent',
                  color: href === '/account/profile' ? '#faf6f0' : '#6b6358',
                }}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
          </div>

          {/* Profile card */}
          <div className="rounded-[20px] border p-6 mb-8" style={{ background: '#f7f2ea', borderColor: 'rgba(196,149,106,.15)' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center font-display text-[22px] font-bold"
                style={{ background: '#2c1f14', color: '#c4956a' }}>
                {user?.firstName?.[0] ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div>
                <p className="font-display text-[20px] font-bold" style={{ color: '#2c1f14' }}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="font-body text-[13px]" style={{ color: '#6b6358' }}>{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Name', value: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || '—' },
                { label: 'Email', value: user?.email ?? '—' },
                { label: 'Role', value: user?.role ?? '—' },
                { label: 'Member since', value: 'July 2026' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-body text-[11px] font-semibold uppercase tracking-[1px] mb-1" style={{ color: '#a09588' }}>{label}</p>
                  <p className="font-body text-[13px]" style={{ color: '#2c1f14' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Addresses */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-[22px] font-bold" style={{ color: '#2c1f14' }}>Saved Addresses</h2>
              <button onClick={openNewForm}
                className="flex items-center gap-2 px-4 py-2 rounded-[10px] font-body text-[12px] font-semibold transition-all"
                style={{ background: '#2c1f14', color: '#faf6f0' }}>
                <Plus className="w-3.5 h-3.5" /> Add Address
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-7 h-7 border-2 border-[#8b5e3c] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : addresses.length === 0 && !showForm ? (
              <div className="text-center py-12 rounded-[20px] border border-dashed" style={{ borderColor: 'rgba(139,94,60,.2)' }}>
                <MapPin className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: '#8b5e3c' }} />
                <p className="font-body text-[13px]" style={{ color: '#6b6358' }}>No saved addresses yet.</p>
                <button onClick={openNewForm} className="mt-3 font-body text-[12px] font-semibold underline" style={{ color: '#8b5e3c' }}>
                  Add your first address
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <motion.div key={addr.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-[16px] border p-4 flex items-start gap-3"
                    style={{ background: '#f7f2ea', borderColor: addr.isDefault ? '#8b5e3c' : 'rgba(196,149,106,.15)' }}>
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#8b5e3c' }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-body text-[13px] font-semibold" style={{ color: '#2c1f14' }}>
                          {addr.firstName} {addr.lastName}
                        </p>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-full font-body text-[10px] font-semibold"
                            style={{ background: 'rgba(139,94,60,.1)', color: '#8b5e3c' }}>Default</span>
                        )}
                        <span className="px-2 py-0.5 rounded-full font-body text-[10px] font-semibold"
                          style={{ background: 'rgba(44,31,20,.06)', color: '#6b6358' }}>{addr.type}</span>
                      </div>
                      <p className="font-body text-[12px]" style={{ color: '#5c3d2e' }}>
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} — {addr.postalCode}
                      </p>
                      <p className="font-body text-[12px] mt-0.5" style={{ color: '#a09588' }}>{addr.phone}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!addr.isDefault && (
                        <button onClick={() => handleSetDefault(addr.id)}
                          className="font-body text-[11px] font-medium transition-colors hover:underline" style={{ color: '#8b5e3c' }}>
                          Set default
                        </button>
                      )}
                      <button onClick={() => openEditForm(addr)}
                        className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-all hover:bg-[rgba(139,94,60,.08)]">
                        <Edit2 className="w-3.5 h-3.5" style={{ color: '#8b5e3c' }} />
                      </button>
                      <button onClick={() => handleDelete(addr.id)}
                        className="w-7 h-7 rounded-[6px] flex items-center justify-center transition-all hover:bg-[rgba(155,35,53,.08)]">
                        <Trash2 className="w-3.5 h-3.5" style={{ color: '#9b2335' }} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Add/Edit form */}
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-[20px] border p-6" style={{ background: '#f7f2ea', borderColor: 'rgba(196,149,106,.15)' }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-body text-[14px] font-semibold" style={{ color: '#2c1f14' }}>
                    {editingId ? 'Edit Address' : 'New Address'}
                  </h3>
                  <button onClick={() => { setShowForm(false); setEditingId(null); }}>
                    <X className="w-4 h-4" style={{ color: '#6b6358' }} />
                  </button>
                </div>

                {formError && (
                  <div className="mb-4 px-4 py-2.5 rounded-[10px] text-[12px]"
                    style={{ background: 'rgba(155,35,53,.08)', color: '#9b2335', border: '1px solid rgba(155,35,53,.15)' }}>
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'First Name *', key: 'firstName', full: false },
                    { label: 'Last Name *', key: 'lastName', full: false },
                    { label: 'Phone *', key: 'phone', full: false, type: 'tel' },
                    { label: 'Address Line 1 *', key: 'line1', full: true },
                    { label: 'Address Line 2 (optional)', key: 'line2', full: true },
                    { label: 'City *', key: 'city', full: false },
                    { label: 'PIN Code *', key: 'postalCode', full: false },
                  ].map(({ label, key, full, type }) => (
                    <div key={key} className={full ? 'col-span-2' : ''}>
                      <label className="block text-[11px] font-semibold uppercase tracking-[1px] mb-1.5" style={{ color: '#6b6358' }}>{label}</label>
                      <input
                        type={type || 'text'}
                        value={(form as any)[key] || ''}
                        onChange={(e) => f(key, e.target.value)}
                        className={fieldCls}
                        style={fieldStyle}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[1px] mb-1.5" style={{ color: '#6b6358' }}>State *</label>
                    <select value={form.state} onChange={(e) => f('state', e.target.value)} className={fieldCls} style={fieldStyle}>
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[1px] mb-1.5" style={{ color: '#6b6358' }}>Type</label>
                    <select value={form.type} onChange={(e) => f('type', e.target.value)} className={fieldCls} style={fieldStyle}>
                      <option value="SHIPPING">Shipping</option>
                      <option value="BILLING">Billing</option>
                      <option value="BOTH">Both</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={handleSave} disabled={formSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] font-body text-[13px] font-semibold transition-all disabled:opacity-60"
                    style={{ background: '#2c1f14', color: '#faf6f0' }}>
                    {formSaving ? (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    ) : <Check className="w-4 h-4" />}
                    {editingId ? 'Update Address' : 'Save Address'}
                  </button>
                  <button onClick={() => { setShowForm(false); setEditingId(null); }}
                    className="px-5 py-2.5 rounded-[10px] font-body text-[13px] font-semibold border transition-all"
                    style={{ borderColor: 'rgba(139,94,60,.25)', color: '#5c3d2e' }}>
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
