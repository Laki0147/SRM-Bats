'use client';
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-misused-promises, @typescript-eslint/no-floating-promises */

// ── ATELIER variant ────────────────────────────────────────────────────────
// A deliberate departure from the warm cinematic heritage look: a light,
// editorial "specimen" world. Paper + ink, one cricket-leather oxblood accent,
// heavy Inter display, DM Mono spec-sheet data, hairline grid. Each bat is
// presented like a catalogued specimen. Reuses the real product facts, copy,
// assets, and the auth/cart stores — no business logic changes.
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, User, LogOut, Package, Menu, X, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useCartStore } from '@/lib/cart-store';
import { LoginModal } from '@/components/layout/login-modal';

// palette
const PAPER = '#ece8df';
const PAPER_2 = '#e4dfd4';
const INK = '#17140f';
const INK_SOFT = '#4c463c';
const MUTED = '#8b8478';
const OX = '#9e3324'; // cricket-leather oxblood — the single accent
const HAIR = 'rgba(23,20,15,0.14)';

const SPEC = [
  ['Willow', 'Grade 1 English'],
  ['Seasoning', 'Air-dried 18 months'],
  ['Knock-in', 'Hand, 6+ hours'],
  ['Weight', '2lb 8oz'],
];

const PROCESS = [
  [
    '01',
    'Selection',
    'Every cleft hand-picked for straight grain and broad grains across the face.',
  ],
  ['02', 'Pressing', 'Pressed to a precise density — hard enough to last, soft enough to ping.'],
  ['03', 'Shaping', 'Profile, spine and edges drawn by hand to the player’s weight and pickup.'],
  ['04', 'Knocking-in', 'Six hours at the mallet, compressing the fibres into one true middle.'],
];

interface Specimen {
  slug: string;
  name: string;
  grade: string;
  size: string;
  profile: string;
  price: number;
}
const SPECIMENS: Specimen[] = [
  {
    slug: 'the-sovereign',
    name: 'The Sovereign',
    grade: 'Grade 1',
    size: 'Short Handle',
    profile: 'Full Bow',
    price: 28500,
  },
  {
    slug: 'the-maestro',
    name: 'The Maestro',
    grade: 'Grade 1',
    size: 'Short Handle',
    profile: 'Full Bow',
    price: 38000,
  },
  {
    slug: 'the-pioneer',
    name: 'The Pioneer',
    grade: 'Grade 1',
    size: 'Short Handle',
    profile: 'High Mid Bow',
    price: 31000,
  },
  {
    slug: 'the-heritage',
    name: 'The Heritage',
    grade: 'Grade 1',
    size: 'Short Handle',
    profile: 'Low Mid Bow',
    price: 24000,
  },
];
const HERO_SHOT = '/bats/main.png';
const inr = (n: number) => n.toLocaleString('en-IN');

const easeOut = [0.22, 1, 0.36, 1] as const;

// ── Navigation (light) ──────────────────────────────────────────────────────
function AtelierNav() {
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
            {[
              ['Home', '/'],
              ['The Bats', '/products'],
              ['The Craft', '#craft'],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="font-mono text-[11px] uppercase tracking-[2px] transition-colors"
                style={{ color: INK_SOFT }}
                onMouseEnter={(e) => (e.currentTarget.style.color = OX)}
                onMouseLeave={(e) => (e.currentTarget.style.color = INK_SOFT)}
              >
                {label}
              </Link>
            ))}
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
            {[
              ['Home', '/'],
              ['The Bats', '/products'],
              ['The Craft', '#craft'],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 font-mono text-[12px] uppercase tracking-[2px]"
                style={{ color: INK_SOFT }}
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

// ── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden pt-[66px]" style={{ background: PAPER }}>
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-6 pb-16 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-10 lg:pb-24 lg:pt-24">
        {/* left: type */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[3px]"
            style={{ color: OX }}
          >
            <span className="inline-block h-px w-8" style={{ background: OX }} /> SRM Bats — Willow
            Specimens
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: easeOut, delay: 0.05 }}
            className="font-body font-extrabold"
            style={{
              color: INK,
              fontSize: 'clamp(44px,6.4vw,86px)',
              lineHeight: 0.98,
              letterSpacing: '-0.035em',
            }}
          >
            Six hours of knocking.
            <span className="block" style={{ color: OX }}>
              One perfect middle.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.16 }}
            className="mt-7 max-w-[44ch] font-body text-[16px] leading-[1.75]"
            style={{ color: INK_SOFT }}
          >
            Grade 1 English willow, hand-selected and air-dried eighteen months, then shaped and
            knocked-in by hand until it is match-ready for your centuries.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.24 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-md px-7 py-3.5 font-mono text-[12px] font-medium uppercase tracking-[2px] text-white transition-transform hover:-translate-y-0.5"
              style={{ background: OX }}
            >
              Find your bat{' '}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#craft"
              className="font-mono text-[12px] uppercase tracking-[2px] underline-offset-4 hover:underline"
              style={{ color: INK }}
            >
              See how they’re made
            </a>
          </motion.div>
        </div>

        {/* right: framed specimen with reused hero video */}
        <motion.figure
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.15 }}
          className="relative"
        >
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-xl"
            style={{ background: INK, border: `1px solid ${HAIR}` }}
          >
            <video
              src="/hero-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'linear-gradient(180deg,transparent 55%,rgba(23,20,15,0.55) 100%)',
              }}
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-[2px] text-white/85">
              <span>Specimen № 01</span>
              <span>Full Bow · 2lb 8oz</span>
            </figcaption>
          </div>
          {/* spec table */}
          <dl
            className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg"
            style={{ background: HAIR, border: `1px solid ${HAIR}` }}
          >
            {SPEC.map(([k, v]) => (
              <div key={k} className="px-4 py-3" style={{ background: PAPER }}>
                <dt
                  className="font-mono text-[9px] uppercase tracking-[2px]"
                  style={{ color: MUTED }}
                >
                  {k}
                </dt>
                <dd className="mt-1 font-body text-[13px] font-semibold" style={{ color: INK }}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </motion.figure>
      </div>
      <div className="h-px w-full" style={{ background: HAIR }} />
    </section>
  );
}

// ── Specimens (featured products) ────────────────────────────────────────────
function Specimens() {
  return (
    <section className="px-6 py-20 lg:px-10 lg:py-28" style={{ background: PAPER }}>
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[3px]"
              style={{ color: OX }}
            >
              The Collection
            </p>
            <h2
              className="max-w-[16ch] font-body text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.02]"
              style={{ color: INK, letterSpacing: '-0.03em' }}
            >
              Four blades, each catalogued by hand.
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden shrink-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-[2px] sm:flex"
            style={{ color: INK }}
          >
            All specimens <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SPECIMENS.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: easeOut, delay: i * 0.06 }}
            >
              <Link href={`/products/${s.slug}`} className="group block">
                <div
                  className="relative aspect-[3/4] overflow-hidden rounded-lg"
                  style={{ background: PAPER_2, border: `1px solid ${HAIR}` }}
                >
                  <span
                    className="absolute left-3 top-3 z-10 font-mono text-[9px] uppercase tracking-[2px]"
                    style={{ color: MUTED }}
                  >
                    Lot {String(i + 1).padStart(2, '0')}
                  </span>
                  <Image
                    src={HERO_SHOT}
                    alt={s.name}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 300px"
                    className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-3.5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-body text-[16px] font-bold" style={{ color: INK }}>
                      {s.name}
                    </h3>
                    <p
                      className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[1px]"
                      style={{ color: MUTED }}
                    >
                      {s.grade} · {s.size} · {s.profile}
                    </p>
                  </div>
                </div>
                <div
                  className="mt-2.5 flex items-center justify-between border-t pt-2.5"
                  style={{ borderColor: HAIR }}
                >
                  <span className="font-mono text-[14px] font-medium" style={{ color: INK }}>
                    ₹{inr(s.price)}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[1.5px] transition-colors"
                    style={{ color: OX }}
                  >
                    View <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Craft (dark ink band) ─────────────────────────────────────────────────────
function Craft() {
  return (
    <section id="craft" className="px-6 py-24 lg:px-10 lg:py-32" style={{ background: INK }}>
      <div className="mx-auto max-w-[1320px]">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[3px]" style={{ color: OX }}>
          Four hands, one blade
        </p>
        <h2
          className="max-w-[20ch] font-body text-[clamp(28px,3.6vw,44px)] font-extrabold leading-[1.05]"
          style={{ color: PAPER, letterSpacing: '-0.03em' }}
        >
          A bat is not manufactured. It is made.
        </h2>
        <div
          className="mt-14 grid gap-px overflow-hidden rounded-xl sm:grid-cols-2 lg:grid-cols-4"
          style={{ background: 'rgba(236,232,223,0.12)' }}
        >
          {PROCESS.map(([n, title, body]) => (
            <div key={n} className="p-6 lg:p-7" style={{ background: INK }}>
              <span className="font-mono text-[13px] font-medium" style={{ color: OX }}>
                {n}
              </span>
              <h3 className="mt-4 font-body text-[18px] font-bold" style={{ color: PAPER }}>
                {title}
              </h3>
              <p
                className="mt-2 font-body text-[13.5px] leading-[1.65]"
                style={{ color: 'rgba(236,232,223,0.62)' }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA + footer ──────────────────────────────────────────────────────────────
function Closing() {
  return (
    <>
      <section className="px-6 py-24 lg:px-10 lg:py-28" style={{ background: PAPER }}>
        <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <h2
            className="max-w-[18ch] font-body text-[clamp(28px,3.6vw,44px)] font-extrabold leading-[1.03]"
            style={{ color: INK, letterSpacing: '-0.03em' }}
          >
            Find the blade that fits your hands.
          </h2>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 rounded-md px-8 py-4 font-mono text-[12px] font-medium uppercase tracking-[2px] text-white transition-transform hover:-translate-y-0.5"
            style={{ background: OX }}
          >
            Browse every specimen <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
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
    </>
  );
}

export function AtelierHome() {
  return (
    <div style={{ background: PAPER }}>
      <AtelierNav />
      <main>
        <Hero />
        <Specimens />
        <Craft />
        <Closing />
      </main>
    </div>
  );
}
