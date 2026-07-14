'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Collections' },
  { href: '/about', label: 'About Us' },
  { href: '/process', label: 'Our Process' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function SiteNavbar({ activePath = '/' }: { activePath?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-[52px] h-[68px] border-b transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(44,31,20,0.98)] border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
          : 'bg-[rgba(44,31,20,0.96)] border-white/6'
      }`}
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 shrink-0">
        <div
          className="w-[42px] h-[42px] rounded-[14px] flex items-center justify-center border border-[rgba(196,149,106,0.2)]"
          style={{ background: '#5c3d2e' }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="8" r="4" stroke="#c4956a" strokeWidth="1.6" />
            <path d="M4 20c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="#c4956a" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
        <div className="leading-tight">
          <strong className="block font-display text-[20px] font-bold text-[#f2ebe0] tracking-[2px]" style={{ fontVariant: 'small-caps' }}>SRM</strong>
          <small className="block text-[9px] font-semibold text-[#c4956a] tracking-[5px] uppercase">Bats</small>
        </div>
      </Link>

      {/* Desktop nav */}
      <ul className="hidden md:flex items-center gap-0.5 list-none">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`text-[12.5px] font-medium px-[14px] py-[7px] rounded-full transition-all duration-200 ${
                activePath === link.href
                  ? 'text-[#c4956a] bg-[rgba(196,149,106,0.12)]'
                  : 'text-[#a09588] hover:text-[#e8d9c4] hover:bg-[rgba(255,255,255,0.07)]'
              }`}
              style={{ letterSpacing: '0.3px' }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {[
          { Icon: Search, label: 'Search', href: '/search' },
          { Icon: User, label: 'Account', href: '/login' },
          { Icon: Heart, label: 'Wishlist', href: '/wishlist' },
        ].map(({ Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            aria-label={label}
            className="w-[38px] h-[38px] rounded-[8px] flex items-center justify-center transition-all duration-200 hover:bg-[rgba(255,255,255,0.08)]"
          >
            <Icon className="w-[18px] h-[18px] stroke-[#a09588] hover:stroke-[#e8d9c4] transition-colors" strokeWidth={1.6} />
          </Link>
        ))}
        <Link
          href="/cart"
          aria-label="Cart"
          className="relative w-[38px] h-[38px] rounded-[8px] flex items-center justify-center transition-all duration-200 hover:bg-[rgba(255,255,255,0.08)]"
        >
          <ShoppingBag className="w-[18px] h-[18px] text-[#a09588]" strokeWidth={1.6} />
          <span className="absolute top-1 right-1 w-[14px] h-[14px] bg-[#8b5e3c] rounded-full text-[8px] font-bold text-white flex items-center justify-center">2</span>
        </Link>
        {/* Mobile hamburger */}
        <button
          className="md:hidden w-[38px] h-[38px] rounded-[8px] flex items-center justify-center hover:bg-[rgba(255,255,255,0.08)] ml-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5 text-[#e8d9c4]" /> : <Menu className="w-5 h-5 text-[#a09588]" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[68px] left-0 right-0 bg-[rgba(44,31,20,0.98)] border-t border-white/6 py-4 px-6 flex flex-col gap-1" style={{ backdropFilter: 'blur(12px)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-[#a09588] hover:text-[#e8d9c4] py-3 px-3 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
