'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/auth-store';
import { useCartStore } from '@/lib/cart-store';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const { login, register, isLoading } = useAuthStore();
  const { fetchCart } = useCartStore();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const resetForms = () => {
    setLoginEmail(''); setLoginPassword('');
    setSignupName(''); setSignupEmail(''); setSignupPassword('');
    setError(''); setSuccess('');
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginEmail, loginPassword);
      await fetchCart();
      handleClose();
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await register(signupName, signupEmail, signupPassword);
      await fetchCart();
      handleClose();
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-[10px] border text-[13px] font-body outline-none transition-all focus:border-[#8b5e3c] focus:ring-1 focus:ring-[rgba(139,94,60,.15)]';
  const inputStyle = { borderColor: 'rgba(139,94,60,.2)', background: '#f7f2ea', color: '#2c1f14' };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[420px] rounded-[24px] overflow-hidden shadow-2xl"
              style={{ background: '#faf6f0' }}
            >
              {/* Header */}
              <div className="px-7 pt-7 pb-5 border-b" style={{ borderColor: 'rgba(139,94,60,.1)', background: '#2c1f14' }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="font-sc text-[10px] tracking-[4px] uppercase font-semibold mb-1" style={{ color: '#c4956a' }}>
                      SRM Bats
                    </p>
                    <h2 className="font-display text-[24px] font-bold" style={{ color: '#f2ebe0', letterSpacing: '-0.5px' }}>
                      {activeTab === 'login' ? 'Welcome back' : 'Join SRM Bats'}
                    </h2>
                  </div>
                  <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10">
                    <X className="w-4 h-4 text-[#a09588]" />
                  </button>
                </div>
                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-[10px]" style={{ background: 'rgba(255,255,255,.06)' }}>
                  {(['login', 'signup'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setActiveTab(tab); setError(''); setSuccess(''); }}
                      className="flex-1 py-2 text-[12px] font-medium rounded-[7px] transition-all duration-200"
                      style={{
                        background: activeTab === tab ? '#c4956a' : 'transparent',
                        color: activeTab === tab ? '#2c1f14' : '#a09588',
                        fontWeight: activeTab === tab ? 700 : 500,
                      }}
                    >
                      {tab === 'login' ? 'Login' : 'Sign Up'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="px-7 py-6">
                {/* Error / success banners */}
                {error && (
                  <div className="mb-4 px-4 py-2.5 rounded-[10px] text-[12px] font-medium" style={{ background: 'rgba(155,35,53,.08)', color: '#9b2335', border: '1px solid rgba(155,35,53,.15)' }}>
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 px-4 py-2.5 rounded-[10px] text-[12px] font-medium" style={{ background: 'rgba(45,106,79,.08)', color: '#2d6a4f', border: '1px solid rgba(45,106,79,.15)' }}>
                    {success}
                  </div>
                )}

                {activeTab === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[1px] mb-1.5" style={{ color: '#6b6358' }}>Email</label>
                      <input type="email" required disabled={isLoading} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                        className={inputCls} style={inputStyle} placeholder="you@example.com" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[1px] mb-1.5" style={{ color: '#6b6358' }}>Password</label>
                      <input type="password" required disabled={isLoading} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                        className={inputCls} style={inputStyle} placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={isLoading}
                      className="w-full h-11 rounded-[10px] font-body text-[13px] font-semibold transition-all disabled:opacity-50"
                      style={{ background: '#2c1f14', color: '#faf6f0' }}>
                      {isLoading ? 'Signing in…' : 'Sign In'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="rounded-[10px] px-4 py-3 text-[12px] font-medium" style={{ background: 'rgba(196,149,106,.1)', color: '#5c3d2e', border: '1px solid rgba(196,149,106,.2)' }}>
                      🎉 Sign up and get <strong>10% off</strong> your first order!
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[1px] mb-1.5" style={{ color: '#6b6358' }}>Full Name</label>
                      <input type="text" required disabled={isLoading} value={signupName} onChange={(e) => setSignupName(e.target.value)}
                        className={inputCls} style={inputStyle} placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[1px] mb-1.5" style={{ color: '#6b6358' }}>Email</label>
                      <input type="email" required disabled={isLoading} value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}
                        className={inputCls} style={inputStyle} placeholder="you@example.com" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[1px] mb-1.5" style={{ color: '#6b6358' }}>Password</label>
                      <input type="password" required disabled={isLoading} minLength={8} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)}
                        className={inputCls} style={inputStyle} placeholder="At least 8 characters" />
                    </div>
                    <button type="submit" disabled={isLoading}
                      className="w-full h-11 rounded-[10px] font-body text-[13px] font-semibold transition-all disabled:opacity-50"
                      style={{ background: '#2c1f14', color: '#faf6f0' }}>
                      {isLoading ? 'Creating account…' : 'Create Account & Get 10% Off'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
