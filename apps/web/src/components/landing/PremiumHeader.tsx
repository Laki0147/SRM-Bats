'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function PremiumHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(248, 246, 241, 0)', 'rgba(248, 246, 241, 0.95)']
  );

  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ['0 0 0 rgba(58, 57, 53, 0)', '0 4px 24px rgba(58, 57, 53, 0.08)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Collections', href: '/collections' },
    { label: 'Craftsmanship', href: '/craftsmanship' },
    { label: 'Custom Fitting', href: '/fitting' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <motion.header
        style={{
          backgroundColor: headerBackground,
          boxShadow: headerShadow,
        }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all"
      >
        <div className="container mx-auto px-8 lg:px-20">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#8B7355] rounded-full flex items-center justify-center">
                  <span className="text-white font-crimson font-bold text-xl lg:text-2xl">
                    S
                  </span>
                </div>
              </motion.div>
              <div>
                <h1 className="font-crimson text-[20px] lg:text-[24px] font-semibold text-[#2A2825] leading-none">
                  SRM Bats
                </h1>
                <p className="text-[10px] lg:text-[11px] uppercase tracking-[0.1em] text-[#8B8781]">
                  Since 1897
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.div key={index} whileHover={{ y: -2 }}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-[#5A5753] hover:text-[#8B7355] transition-colors font-medium relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#8B7355] transition-all group-hover:w-full" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4 lg:gap-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-[#5A5753] hover:text-[#8B7355] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 lg:w-6 lg:h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-[#5A5753] hover:text-[#8B7355] transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5 lg:w-6 lg:h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative text-[#5A5753] hover:text-[#8B7355] transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B7355] rounded-full text-white text-[10px] flex items-center justify-center font-medium">
                  2
                </span>
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-[#5A5753] hover:text-[#8B7355] transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="lg:hidden overflow-hidden border-t border-[#E8E3DB]"
        >
          <nav className="container mx-auto px-8 py-6 space-y-4 bg-[#F8F6F1]">
            {navLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{
                  x: isMobileMenuOpen ? 0 : -20,
                  opacity: isMobileMenuOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  className="block text-[16px] text-[#2A2825] hover:text-[#8B7355] transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      </motion.header>

      {/* Spacer to prevent content jump */}
      <div className="h-20 lg:h-24" />
    </>
  );
}
