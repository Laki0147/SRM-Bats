'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'All Collections', href: '/collections' },
    { label: 'English Willow', href: '/collections/english-willow' },
    { label: 'Kashmir Willow', href: '/collections/kashmir-willow' },
    { label: 'Custom Bats', href: '/custom' },
    { label: 'Accessories', href: '/accessories' },
  ],
  services: [
    { label: 'Custom Fitting', href: '/fitting' },
    { label: 'Bat Repair', href: '/repair' },
    { label: 'Coaching', href: '/coaching' },
    { label: 'Maintenance Guide', href: '/maintenance' },
    { label: 'Willow Grading', href: '/grading' },
  ],
  company: [
    { label: 'Our Story', href: '/about' },
    { label: 'Craftsmanship', href: '/craftsmanship' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

export function PremiumFooter() {
  return (
    <footer className="bg-[#2A2825] text-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B7355] rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-8 lg:px-20">
        {/* Newsletter Section */}
        <div className="py-16 lg:py-20 border-b border-white/10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="font-crimson text-[32px] lg:text-[36px] font-semibold mb-4">
                Join Our Community
              </h3>
              <p className="text-[16px] text-[#E8E3DB] leading-[1.7]">
                Subscribe to receive updates on new collections, exclusive
                offers, and insights from our master craftsmen.
              </p>
            </div>

            <div>
              <form className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B8781]" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-[#8B8781] focus:outline-none focus:border-[#8B7355] transition-colors"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-8 py-4 bg-[#8B7355] text-white text-[15px] font-medium rounded-lg hover:bg-[#9d7f5f] transition-colors whitespace-nowrap"
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link href="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#8B7355] rounded-full flex items-center justify-center">
                  <span className="text-white font-crimson font-bold text-2xl">
                    S
                  </span>
                </div>
                <div>
                  <h2 className="font-crimson text-[22px] font-semibold leading-none">
                    SRM Bats
                  </h2>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-[#8B8781]">
                    Since 1897
                  </p>
                </div>
              </Link>

              <p className="text-[15px] text-[#E8E3DB] leading-[1.7] mb-6 max-w-sm">
                Handcrafting premium cricket bats from the finest English willow
                for over 125 years.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#8B7355] hover:border-[#8B7355] transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-[13px] uppercase tracking-[0.1em] text-[#B8956A] font-medium mb-6">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-[#E8E3DB] hover:text-white transition-colors inline-block hover:translate-x-1 transition-transform"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[14px] text-[#8B8781]">
              © {new Date().getFullYear()} SRM Bats. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="text-[14px] text-[#8B8781] hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="text-[14px] text-[#8B8781] hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookies"
                className="text-[14px] text-[#8B8781] hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Craftsman Quote */}
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="font-crimson text-[16px] italic text-[#E8E3DB]">
              “Every bat tells a story. We're honored to be part of yours.”
            </p>
            <p className="text-[13px] text-[#B8956A] mt-2">
              — The SRM Bats Family
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
