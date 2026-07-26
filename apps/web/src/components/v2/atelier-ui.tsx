'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */

// ── Shared Atelier chrome ────────────────────────────────────────────────────
// The nav, footer, palette and helpers shared by every Atelier surface (home,
// products, product detail) so the editorial "specimen" world is defined once.
// Reuses the real auth/cart stores and login modal — no business logic changes.
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, LogOut, Package, Menu, X, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useCartStore } from '@/lib/cart-store';
import { LoginModal } from '@/components/layout/login-modal';

// palette
export const PAPER = '#ece8df';
export const PAPER_2 = '#e4dfd4';
export const INK = '#17140f';
export const INK_SOFT = '#4c463c';
export const MUTED = '#8b8478';
export const OX = '#9e3324'; // cricket-leather oxblood — the single accent
export const HAIR = 'rgba(23,20,15,0.14)';

export const easeOut = [0.22, 1, 0.36, 1] as const;
export const inr = (n: number) => n.toLocaleString('en-IN');

const NAV_LINKS: [string, string][] = [
  ['Home', '/'],
  ['The Bats', '/products'],
  ['The Craft', '/#craft'],
];

// ── Navigation (light) ──────────────────────────────────────────────────────
export function AtelierNav({ activePath }: { activePath?: string } = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout, loadProfile } = useAuthStore();
  const { getItemCount, fetchCart } = useCartStore();
  const itemCount = mounted ? getItemCount() : 0;
  const authed = mounted && isAuthenticated;

  useEffect(() => {
    setMounted(true);
    void loadProfile();
  }, []);
  useEffect(() => {
    if (isAuthenticated) void fetchCart();
  }, [isAuthenticated]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!userOpen) return;
    const onDown = (e: MouseEvent) =>
      userRef.current && !userRef.current.contains(e.target as Node) && setUserOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setUserOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [userOpen]);

  const iconBtn =
    'flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-[rgba(23,20,15,0.06)]';

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(236,232,223,0.92)' : 'rgba(236,232,223,0.72)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${scrolled ? HAIR : 'transparent'}`,
        }}
      >
        <div className="mx-auto flex h-[66px] max-w-[1320px] items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-baseline gap-2.5" aria-label="SRM Bats home">
            <span
              className="font-body text-[19px] font-extrabold tracking-[-0.02em]"
              style={{ color: INK }}
            >
              SRM
            </span>
            <span
              className="font-mono text-[9.5px] font-medium uppercase tracking-[4px]"
              style={{ color: OX }}
            >
              Bats
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map(([label, href]) => {
              const isActive = activePath && href === activePath;
              return (
                <Link
                  key={label}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className="font-mono text-[11px] uppercase tracking-[2px] transition-colors"
                  style={{ color: isActive ? OX : INK_SOFT }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = OX)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? OX : INK_SOFT)}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            {authed && user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserOpen((v) => !v)}
                  className={iconBtn}
                  aria-label="Account menu"
                  aria-haspopup="menu"
                  aria-expanded={userOpen}
                >
                  <span
                    className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[9px] font-bold"
                    style={{ background: OX, color: '#fff' }}
                  >
                    {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                  </span>
                </button>
                {userOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[44px] w-[196px] rounded-xl border py-2"
                    style={{ background: PAPER, borderColor: HAIR }}
                  >
                    <div className="mb-1 border-b px-4 py-2" style={{ borderColor: HAIR }}>
                      <p className="truncate text-[12px] font-semibold" style={{ color: INK }}>
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="truncate text-[10px]" style={{ color: MUTED }}>
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/account/profile"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-[12px] transition-colors hover:bg-[rgba(23,20,15,0.05)]"
                      style={{ color: INK_SOFT }}
                    >
                      <User className="h-3.5 w-3.5" /> My Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-[12px] transition-colors hover:bg-[rgba(23,20,15,0.05)]"
                      style={{ color: INK_SOFT }}
                    >
                      <Package className="h-3.5 w-3.5" /> My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-[12px] transition-colors hover:bg-[rgba(23,20,15,0.05)]"
                      style={{ color: INK_SOFT }}
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setLoginOpen(true)} className={iconBtn} aria-label="Sign in">
                <User className="h-[18px] w-[18px]" strokeWidth={1.6} style={{ color: INK_SOFT }} />
              </button>
            )}

            <Link href="/cart" className={`relative ${iconBtn}`} aria-label="Cart">
              <ShoppingBag
                className="h-[18px] w-[18px]"
                strokeWidth={1.6}
                style={{ color: INK_SOFT }}
              />
              {itemCount > 0 && (
                <span
                  className="absolute right-0.5 top-0.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full px-1 text-[8px] font-bold text-white"
                  style={{ background: OX }}
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            <button
              className={`ml-1 md:hidden ${iconBtn}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="h-5 w-5" style={{ color: INK }} />
              ) : (
                <Menu className="h-5 w-5" style={{ color: INK_SOFT }} />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            className="border-t px-6 py-3 md:hidden"
            style={{ borderColor: HAIR, background: PAPER }}
          >
            {NAV_LINKS.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 font-mono text-[12px] uppercase tracking-[2px]"
                style={{ color: activePath && href === activePath ? OX : INK_SOFT }}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

// ── Footer (dark ink band) ────────────────────────────────────────────────────
export function AtelierFooter() {
  return (
    <footer className="px-6 py-10 lg:px-10" style={{ background: INK }}>
      <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-baseline gap-2.5">
          <span
            className="font-body text-[16px] font-extrabold tracking-[-0.02em]"
            style={{ color: PAPER }}
          >
            SRM
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[4px]" style={{ color: OX }}>
            Bats
          </span>
        </div>
        <p
          className="font-mono text-[10px] uppercase tracking-[2px]"
          style={{ color: 'rgba(236,232,223,0.5)' }}
        >
          Hand-made willow · Shipped across India
        </p>
      </div>
    </footer>
  );
}

// Re-exported so callers get the arrow glyph without a second lucide import.
export { ArrowUpRight };
