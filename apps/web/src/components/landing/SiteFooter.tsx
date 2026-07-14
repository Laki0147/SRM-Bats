'use client';

import Link from 'next/link';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const shopLinks  = ['English Willow','Kashmir Willow','Players Edition','Junior Bats','Women\'s Bats','Accessories'];
const aboutLinks = ['Our Story','Our Process','Why SRM Bats','Player Testimonials','Blog','Contact Us'];
const supportLinks = ['Track Order','Shipping Policy','Returns & Refunds','FAQs','Size Guide','Care Guide'];

const payMethods = ['VISA','MC','RuPay','Paytm','UPI'];

export function SiteFooter() {
  return (
    <footer style={{ background: '#2c1f14', borderTop: '1px solid rgba(255,255,255,.05)' }}>
      <div className="px-6 lg:px-[52px] pt-[60px]">
        <div className="grid grid-cols-2 lg:grid-cols-[230px_1fr_1fr_1fr_170px] gap-10 pb-12 border-b" style={{ borderColor: 'rgba(255,255,255,.06)' }}>

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-[14px]">
              <div className="w-[42px] h-[42px] rounded-[14px] flex items-center justify-center border" style={{ background: '#5c3d2e', borderColor: 'rgba(196,149,106,.2)' }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="8" r="4" stroke="#c4956a" strokeWidth="1.6" />
                  <path d="M4 20c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="#c4956a" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <strong className="font-display block text-[20px] font-bold tracking-[2px]" style={{ color: '#f2ebe0', fontVariant: 'small-caps' }}>SRM</strong>
                <small className="font-sc block text-[9px] font-semibold tracking-[5px] uppercase" style={{ color: '#c4956a' }}>Bats</small>
              </div>
            </Link>
            <p className="font-body text-[12px] leading-[1.8] mb-5 max-w-[190px]" style={{ color: '#a09588' }}>
              Handcrafted and customised cricket bats for players who settle for nothing less than excellence.
            </p>
            <div className="flex gap-2">
              {([['Facebook', Facebook], ['Instagram', Instagram], ['YouTube', Youtube], ['Twitter', Twitter]] as const).map(([label, Icon], i) => (
                <button key={i} aria-label={label} className="w-[33px] h-[33px] rounded-[8px] flex items-center justify-center transition-all duration-200" style={{ background: 'rgba(255,255,255,.05)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(196,149,106,.14)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.05)')}>
                  <Icon className="w-[13px] h-[13px]" style={{ color: '#a09588' }} strokeWidth={1.6} />
                </button>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-sc text-[11px] font-bold uppercase tracking-[2px] mb-[17px]" style={{ color: '#f2ebe0', fontVariant: 'small-caps' }}>Shop</h4>
            <ul className="space-y-[10px]">
              {shopLinks.map(l => (
                <li key={l}><Link href="/products" className="font-body text-[12px] transition-colors duration-200 hover:opacity-100" style={{ color: '#6b6358' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#c4956a')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#a09588')}>{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-sc text-[11px] font-bold uppercase tracking-[2px] mb-[17px]" style={{ color: '#f2ebe0', fontVariant: 'small-caps' }}>About</h4>
            <ul className="space-y-[10px]">
              {aboutLinks.map(l => (
                <li key={l}><a href="#" className="font-body text-[12px] transition-colors duration-200" style={{ color: '#6b6358' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#c4956a')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#a09588')}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-sc text-[11px] font-bold uppercase tracking-[2px] mb-[17px]" style={{ color: '#f2ebe0', fontVariant: 'small-caps' }}>Support</h4>
            <ul className="space-y-[10px]">
              {supportLinks.map(l => (
                <li key={l}><a href="#" className="font-body text-[12px] transition-colors duration-200" style={{ color: '#6b6358' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#c4956a')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#a09588')}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h4 className="font-sc text-[11px] font-bold uppercase tracking-[2px] mb-[13px]" style={{ color: '#f2ebe0', fontVariant: 'small-caps' }}>We Accept</h4>
            <div className="flex flex-wrap gap-[6px] mb-4">
              {payMethods.map(m => (
                <span key={m} className="font-mono text-[10px] font-semibold px-[11px] py-[5px] rounded-[8px] tracking-[.5px]" style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', color: '#a09588' }}>
                  {m}
                </span>
              ))}
            </div>
            <h4 className="font-sc text-[11px] font-bold uppercase tracking-[2px] mb-[10px]" style={{ color: '#f2ebe0', fontVariant: 'small-caps' }}>Secured By</h4>
            <div className="flex gap-[7px]">
              {['SSL\nSecured', 'PCI\nDSS'].map((t, i) => (
                <div key={i} className="rounded-[8px] px-[9px] py-[6px] text-center font-body font-bold text-[9px] leading-[1.5]" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', color: '#6b6358' }}>
                  {i === 0 ? <><span style={{ color: '#7aab72' }}>SSL</span><br />Secured</> : <>PCI<br />DSS</>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-5">
          <span className="font-body text-[11px]" style={{ color: '#6b6358' }}>
            © {new Date().getFullYear()} SRM Bats. All Rights Reserved.
          </span>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms & Conditions'].map(l => (
              <a key={l} href="#" className="font-body text-[11px] transition-colors" style={{ color: '#6b6358' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#c4956a')}
                onMouseLeave={e => (e.currentTarget.style.color = '#a09588')}>{l}</a>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center py-3 font-body text-[11px] border-t" style={{ color: '#a09588', borderColor: 'rgba(255,255,255,.04)' }}>
        Made with IBM Bob
      </div>
    </footer>
  );
}


