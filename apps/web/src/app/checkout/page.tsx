'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Package, ChevronRight, Plus } from 'lucide-react';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { addressesApi, paymentApi, ordersApi } from '@/lib/api';

interface Address {
  id?: string;
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
  isDefault?: boolean;
}

const EMPTY_ADDRESS: Omit<Address, 'id'> = {
  type: 'SHIPPING',
  firstName: '', lastName: '', phone: '',
  line1: '', line2: '', city: '', state: '', postalCode: '',
  country: 'India',
};

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh',
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Inlined at build time by Next.js for NEXT_PUBLIC_ vars
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, summary, fetchCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [address, setAddress] = useState<Omit<Address, 'id'>>({ ...EMPTY_ADDRESS });
  const [sameBilling, setSameBilling] = useState(true);
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Wait for Zustand persist rehydration before checking auth
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) { router.push('/'); return; }
    fetchCart();
    loadAddresses();
  }, [mounted, isAuthenticated]);

  const loadAddresses = async () => {
    try {
      const addrs = await addressesApi.list();
      setSavedAddresses(addrs);
      const def = addrs.find((a: Address) => a.isDefault);
      if (def) { setSelectedAddressId(def.id); setShowNewAddress(false); }
      else if (addrs.length === 0) setShowNewAddress(true);
    } catch {}
  };

  const activeAddress: Address | null = selectedAddressId
    ? savedAddresses.find((a) => a.id === selectedAddressId) || null
    : showNewAddress ? (address as Address)
    : null;

  const handleSaveAndContinue = async () => {
    if (!activeAddress) { setError('Please provide a delivery address.'); return; }
    setError('');

    if (showNewAddress && !selectedAddressId) {
      try {
        const saved = await addressesApi.create({ ...address, isDefault: savedAddresses.length === 0 });
        setSavedAddresses([...savedAddresses, saved]);
        setSelectedAddressId(saved.id);
        setShowNewAddress(false);
      } catch (err: any) {
        setError(err.message || 'Failed to save address');
        return;
      }
    }
    setStep('payment');
  };

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePlaceOrder = async () => {
    if (!activeAddress) return;
    setIsProcessing(true);
    setError('');

    try {
      if (!RAZORPAY_KEY) throw new Error('Razorpay key not configured. Check NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.local');
      const rzpLoaded = await loadRazorpay();
      if (!rzpLoaded) throw new Error('Payment gateway failed to load. Check your internet connection.');

      // 1. Create Razorpay order
      const rzpOrder = await paymentApi.createOrder(summary.total);

      // 2. Open Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: RAZORPAY_KEY,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: 'SRM Bats',
          description: `Order for ${items.length} item(s)`,
          order_id: rzpOrder.id,
          prefill: {
            name: `${activeAddress.firstName} ${activeAddress.lastName}`,
            email: user?.email,
            contact: activeAddress.phone,
          },
          theme: { color: '#2c1f14' },
          handler: async (response: any) => {
            try {
              // 3. Verify payment
              await paymentApi.verify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              // 4. Create order in DB
              const shippingAddr = { ...activeAddress, type: 'SHIPPING' };
              const billingAddr = sameBilling ? { ...activeAddress, type: 'BILLING' } : { ...activeAddress, type: 'BILLING' };

              const order = await ordersApi.create({
                items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
                shippingAddress: shippingAddr,
                billingAddress: billingAddr,
                paymentMethod: 'razorpay',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              resolve();
              router.push(`/order-confirmation/${order.id}`);
            } catch (err: any) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
        });
        rzp.open();
      });
    } catch (err: any) {
      if (err.message !== 'Payment cancelled') {
        setError(err.message || 'Payment failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const fieldCls = 'w-full px-3 py-2.5 rounded-[10px] border text-[13px] font-body outline-none transition-all focus:border-[#8b5e3c] focus:ring-1 focus:ring-[rgba(139,94,60,.15)]';
  const fieldStyle = { borderColor: 'rgba(139,94,60,.2)', background: '#f7f2ea', color: '#2c1f14' };

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen" style={{ background: '#faf6f0' }}>
      <SiteNavbar activePath="/checkout" />
      <main className="pt-[68px]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-12">
          <div className="mb-8">
            <span className="font-sc text-[11px] tracking-[4px] uppercase font-semibold" style={{ color: '#8b5e3c' }}>Checkout</span>
            <h1 className="font-display text-[36px] font-bold mt-1" style={{ color: '#2c1f14', letterSpacing: '-1px' }}>
              {step === 'address' ? 'Delivery Address' : 'Payment'}
            </h1>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-3 mb-10">
            {[
              { id: 'address', icon: MapPin, label: 'Address' },
              { id: 'payment', icon: CreditCard, label: 'Payment' },
            ].map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{
                      background: step === s.id ? '#2c1f14' : s.id === 'payment' && step === 'address' ? 'rgba(44,31,20,.1)' : '#c4956a',
                      color: step === s.id ? '#faf6f0' : '#2c1f14',
                    }}>
                    {i + 1}
                  </div>
                  <span className="font-body text-[12px] font-semibold" style={{ color: step === s.id ? '#2c1f14' : '#a09588' }}>
                    {s.label}
                  </span>
                </div>
                {i < 1 && <ChevronRight className="w-4 h-4 opacity-30" style={{ color: '#2c1f14' }} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-[10px] text-[13px] font-medium"
              style={{ background: 'rgba(155,35,53,.08)', color: '#9b2335', border: '1px solid rgba(155,35,53,.15)' }}>
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: form */}
            <div className="lg:col-span-2">
              {step === 'address' && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Saved addresses */}
                  {savedAddresses.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-body text-[13px] font-semibold mb-3" style={{ color: '#6b6358' }}>Saved Addresses</h3>
                      <div className="space-y-2">
                        {savedAddresses.map((addr) => (
                          <label key={addr.id} className="flex items-start gap-3 p-4 rounded-[14px] border cursor-pointer transition-all"
                            style={{
                              borderColor: selectedAddressId === addr.id ? '#8b5e3c' : 'rgba(196,149,106,.2)',
                              background: selectedAddressId === addr.id ? 'rgba(139,94,60,.05)' : '#f7f2ea',
                            }}>
                            <input type="radio" name="addr" value={addr.id} checked={selectedAddressId === addr.id}
                              onChange={() => { setSelectedAddressId(addr.id!); setShowNewAddress(false); }}
                              className="mt-0.5" />
                            <div>
                              <p className="font-body text-[13px] font-semibold" style={{ color: '#2c1f14' }}>
                                {addr.firstName} {addr.lastName}
                              </p>
                              <p className="font-body text-[12px]" style={{ color: '#6b6358' }}>
                                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} {addr.postalCode}
                              </p>
                              <p className="font-body text-[12px]" style={{ color: '#a09588' }}>{addr.phone}</p>
                            </div>
                          </label>
                        ))}
                        <button onClick={() => { setShowNewAddress(true); setSelectedAddressId(null); }}
                          className="flex items-center gap-2 font-body text-[12px] font-medium px-4 py-2.5 rounded-[10px] border border-dashed transition-all hover:bg-[rgba(139,94,60,.05)]"
                          style={{ borderColor: 'rgba(139,94,60,.3)', color: '#8b5e3c' }}>
                          <Plus className="w-4 h-4" /> Add New Address
                        </button>
                      </div>
                    </div>
                  )}

                  {/* New address form */}
                  {showNewAddress && (
                    <div className="rounded-[20px] border p-6" style={{ borderColor: 'rgba(196,149,106,.15)', background: '#f7f2ea' }}>
                      <h3 className="font-body text-[14px] font-semibold mb-5" style={{ color: '#2c1f14' }}>New Delivery Address</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'First Name', key: 'firstName', type: 'text', full: false },
                          { label: 'Last Name', key: 'lastName', type: 'text', full: false },
                          { label: 'Phone', key: 'phone', type: 'tel', full: false },
                          { label: 'Address Line 1', key: 'line1', type: 'text', full: true },
                          { label: 'Address Line 2 (optional)', key: 'line2', type: 'text', full: true },
                          { label: 'City', key: 'city', type: 'text', full: false },
                          { label: 'PIN Code', key: 'postalCode', type: 'text', full: false },
                        ].map(({ label, key, type, full }) => (
                          <div key={key} className={full ? 'col-span-2' : ''}>
                            <label className="block text-[11px] font-semibold uppercase tracking-[1px] mb-1.5" style={{ color: '#6b6358' }}>
                              {label}
                            </label>
                            <input type={type} value={(address as any)[key] || ''} required={label !== 'Address Line 2 (optional)'}
                              onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                              className={fieldCls} style={fieldStyle} />
                          </div>
                        ))}
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-[1px] mb-1.5" style={{ color: '#6b6358' }}>State</label>
                          <select value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}
                            className={fieldCls} style={fieldStyle}>
                            <option value="">Select state</option>
                            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <input type="checkbox" id="sameBilling" checked={sameBilling} onChange={(e) => setSameBilling(e.target.checked)} />
                    <label htmlFor="sameBilling" className="font-body text-[13px]" style={{ color: '#5c3d2e' }}>
                      Use same address for billing
                    </label>
                  </div>

                  <button onClick={handleSaveAndContinue}
                    className="mt-6 w-full h-11 rounded-[10px] font-body text-[13px] font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{ background: '#2c1f14', color: '#faf6f0' }}>
                    Continue to Payment <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Address summary */}
                  {activeAddress && (
                    <div className="rounded-[16px] border p-4 mb-6 flex items-start gap-3"
                      style={{ background: '#f7f2ea', borderColor: 'rgba(196,149,106,.15)' }}>
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#8b5e3c' }} />
                      <div className="flex-1">
                        <p className="font-body text-[12px] font-semibold mb-0.5" style={{ color: '#2c1f14' }}>
                          {activeAddress.firstName} {activeAddress.lastName}
                        </p>
                        <p className="font-body text-[12px]" style={{ color: '#6b6358' }}>
                          {activeAddress.line1}{activeAddress.line2 ? `, ${activeAddress.line2}` : ''}, {activeAddress.city}, {activeAddress.state} — {activeAddress.postalCode}
                        </p>
                      </div>
                      <button onClick={() => setStep('address')} className="font-body text-[11px] font-medium" style={{ color: '#8b5e3c' }}>
                        Change
                      </button>
                    </div>
                  )}

                  {/* Payment method - Razorpay */}
                  <div className="rounded-[20px] border p-6" style={{ borderColor: 'rgba(196,149,106,.15)', background: '#f7f2ea' }}>
                    <h3 className="font-body text-[14px] font-semibold mb-4" style={{ color: '#2c1f14' }}>Payment Method</h3>
                    <div className="flex items-center gap-3 p-4 rounded-[12px] border"
                      style={{ borderColor: '#8b5e3c', background: 'rgba(139,94,60,.05)' }}>
                      <CreditCard className="w-5 h-5" style={{ color: '#8b5e3c' }} />
                      <div>
                        <p className="font-body text-[13px] font-semibold" style={{ color: '#2c1f14' }}>Razorpay</p>
                        <p className="font-body text-[11px]" style={{ color: '#6b6358' }}>Cards, UPI, Net Banking, Wallets</p>
                      </div>
                    </div>

                    <p className="mt-4 font-body text-[11px]" style={{ color: '#a09588' }}>
                      You'll be redirected to Razorpay's secure checkout to complete payment.
                    </p>
                  </div>

                  <button onClick={handlePlaceOrder} disabled={isProcessing}
                    className="mt-6 w-full h-12 rounded-[10px] font-body text-[14px] font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                    style={{ background: '#2c1f14', color: '#faf6f0' }}>
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Processing…
                      </span>
                    ) : (
                      <>
                        <Package className="w-4 h-4" /> Pay {fmt(summary.total)} & Place Order
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-[20px] border p-6" style={{ background: '#f7f2ea', borderColor: 'rgba(196,149,106,.15)' }}>
                <h2 className="font-display text-[18px] font-bold mb-4" style={{ color: '#2c1f14' }}>Order Summary</h2>
                <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0" style={{ background: '#2c1f14' }}>
                        <Package className="w-4 h-4 text-[#c4956a]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[12px] font-semibold truncate" style={{ color: '#2c1f14' }}>{item.product.name}</p>
                        <p className="font-body text-[11px]" style={{ color: '#a09588' }}>Qty: {item.quantity}</p>
                      </div>
                      <span className="font-mono text-[12px] font-semibold shrink-0" style={{ color: '#2c1f14' }}>
                        {fmt(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 space-y-2" style={{ borderColor: 'rgba(139,94,60,.15)' }}>
                  {[
                    { label: 'Subtotal', value: summary.subtotal },
                    { label: 'Shipping', value: summary.shipping },
                    { label: 'Tax (18%)', value: summary.tax },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between font-body text-[12px]">
                      <span style={{ color: '#6b6358' }}>{label}</span>
                      <span style={{ color: '#2c1f14' }}>{value === 0 ? 'FREE' : fmt(value)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2" style={{ borderColor: 'rgba(139,94,60,.15)' }}>
                    <div className="flex justify-between font-body text-[14px] font-bold">
                      <span style={{ color: '#2c1f14' }}>Total</span>
                      <span style={{ color: '#2c1f14' }}>{fmt(summary.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
