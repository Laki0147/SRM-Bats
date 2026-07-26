'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const shopLinks = [
  'English Willow',
  'Kashmir Willow',
  "Players' Edition",
  'Junior Bats',
  "Women's Bats",
];

// Real, resolvable pages (auth-gated ones redirect to login when needed)
const accountLinks = [
  { label: 'My Orders', href: '/account/orders' },
  { label: 'My Profile', href: '/account/profile' },
  { label: 'Your Cart', href: '/cart' },
];

const payMethods = ['Visa', 'Mastercard', 'RuPay', 'UPI', 'Paytm'];

export function SiteFooter() {
  return (
    <footer style={{ background: '#2c1f14', borderTop: '1px solid rgba(196,149,106,.12)' }}>
      <div className="px-6 pt-[60px] lg:px-[52px]">
        <div
          className="grid grid-cols-2 gap-10 border-b pb-12 lg:grid-cols-[240px_1fr_1fr_180px]"
          style={{ borderColor: 'rgba(255,255,255,.06)' }}
        >
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="mb-[14px] flex items-center gap-3">
              <div
                className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] border"
                style={{ background: '#5c3d2e', borderColor: 'rgba(196,149,106,.2)' }}
              >
                {/* Bat-and-ball monogram */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path
                    d="M15.5 4.5 L7.5 12.5"
                    stroke="#c4956a"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17.2 2.8 L15.5 4.5"
                    stroke="#c4956a"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <circle cx="6" cy="15.5" r="2.6" fill="#c4956a" />
                  <path
                    d="M4 15.5c1.3-.9 2.7-.9 4 0"
                    stroke="#2c1f14"
                    strokeWidth=".8"
                    strokeLinecap="round"
                    opacity=".5"
                  />
                </svg>
              </div>
              <div>
                <strong
                  className="font-sc block text-[22px] font-semibold tracking-[3px]"
                  style={{ color: '#f2ebe0' }}
                >
                  SRM
                </strong>
                <small
                  className="font-sc block text-[9px] font-semibold uppercase tracking-[5px]"
                  style={{ color: '#c4956a' }}
                >
                  Bats
                </small>
              </div>
            </Link>
            <p
              className="mb-5 max-w-[190px] font-body text-[12px] leading-[1.8]"
              style={{ color: '#a09588' }}
            >
              Handcrafted and customised cricket bats for players who settle for nothing less than
              excellence.
            </p>
            <div className="flex gap-2">
              {(
                [
                  ['Facebook', Facebook],
                  ['Instagram', Instagram],
                  ['YouTube', Youtube],
                  ['Twitter', Twitter],
                ] as const
              ).map(([label, Icon], i) => (
                <button
                  key={i}
                  aria-label={label}
                  className="flex h-[33px] w-[33px] items-center justify-center rounded-[6px] transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,.05)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(196,149,106,.14)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.05)')}
                >
                  <Icon
                    className="h-[13px] w-[13px]"
                    style={{ color: '#a09588' }}
                    strokeWidth={1.6}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4
              className="font-sc mb-[17px] text-[11px] font-bold uppercase tracking-[2px]"
              style={{ color: '#f2ebe0', fontVariant: 'small-caps' }}
            >
              Shop
            </h4>
            <ul className="space-y-[10px]">
              {shopLinks.map((l) => (
                <li key={l}>
                  <Link
                    href="/products"
                    className="font-body text-[12px] transition-colors duration-200 hover:opacity-100"
                    style={{ color: '#6b6358' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#c4956a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#a09588')}
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4
              className="font-sc mb-[17px] text-[11px] font-bold uppercase tracking-[2px]"
              style={{ color: '#f2ebe0', fontVariant: 'small-caps' }}
            >
              Account
            </h4>
            <ul className="space-y-[10px]">
              {accountLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-body text-[12px] transition-colors duration-200"
                    style={{ color: '#6b6358' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#c4956a')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#a09588')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payments & security — one restrained trust block */}
          <div>
            <h4
              className="font-sc mb-[13px] text-[11px] font-bold uppercase tracking-[2px]"
              style={{ color: '#f2ebe0', fontVariant: 'small-caps' }}
            >
              Payments
            </h4>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {payMethods.map((m) => (
                <span
                  key={m}
                  className="font-sc rounded-[5px] px-[7px] py-[3px] text-[9px] font-semibold uppercase tracking-[1px]"
                  style={{
                    background: 'rgba(255,255,255,.05)',
                    color: '#a09588',
                    border: '1px solid rgba(255,255,255,.08)',
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
            <div
              className="flex items-center gap-2 font-body text-[11px]"
              style={{ color: '#8a7d6d' }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7aab72"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Secure SSL checkout
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-center py-5">
          <span className="font-body text-[11px]" style={{ color: '#6b6358' }}>
            © {new Date().getFullYear()} SRM Bats. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
