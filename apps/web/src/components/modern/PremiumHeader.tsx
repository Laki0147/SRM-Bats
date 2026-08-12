'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react'
import Link from 'next/link'

const PremiumHeader = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/products', label: 'Shop Bats' },
    { href: '/collections', label: 'Collections' },
    { href: '/custom', label: 'Custom Bats' },
    { href: '/about', label: 'About' },
  ]

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#fdfcfa]/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-b border-[rgba(0,0,0,0.06)]'
          : 'bg-[#fdfcfa]'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#d4a574] to-[#c4ad8a] flex items-center justify-center shadow-[0_4px_12px_rgba(212,165,116,0.25)] transition-all duration-300 group-hover:shadow-[0_6px_20px_rgba(212,165,116,0.35)] group-hover:scale-105">
              <span className="text-[#fdfcfa] font-bold text-lg">S</span>
            </div>
            <div className="ml-3">
              <span className="text-lg font-bold text-[#292524] block leading-none">SRM</span>
              <span className="text-[10px] font-semibold text-[#d4a574] tracking-[0.2em] block leading-none mt-0.5">BATS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#78716c] hover:text-[#292524] transition-all duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#d4a574] to-[#c4ad8a] transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className="p-2.5 hover:bg-[#f3efe8] rounded-[10px] transition-all duration-300 hover:scale-105"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-[#78716c]" />
            </button>
            <button
              className="p-2.5 hover:bg-[#f3efe8] rounded-[10px] transition-all duration-300 hover:scale-105"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-[#78716c]" />
            </button>
            <button
              className="p-2.5 hover:bg-[#f3efe8] rounded-[10px] transition-all duration-300 hover:scale-105 relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 text-[#78716c]" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#d4a574] to-[#c4ad8a] text-[#fdfcfa] text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(212,165,116,0.3)]">
                2
              </span>
            </button>
            <button
              className="hidden md:block p-2.5 hover:bg-[#f3efe8] rounded-[10px] transition-all duration-300 hover:scale-105"
              aria-label="User account"
            >
              <User className="w-5 h-5 text-[#78716c]" />
            </button>
            <button
              className="md:hidden p-2.5 hover:bg-[#f3efe8] rounded-[10px] transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#292524]" />
              ) : (
                <Menu className="w-6 h-6 text-[#292524]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-[#fdfcfa]/98 backdrop-blur-xl border-t border-[rgba(0,0,0,0.06)]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <nav className="px-6 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-3 px-4 text-[#292524] font-medium hover:bg-[#f3efe8] rounded-[10px] transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/account"
                className="block py-3 px-4 text-[#292524] font-medium hover:bg-[#f3efe8] rounded-[10px] transition-all duration-300 border-t border-[rgba(0,0,0,0.06)] mt-3 pt-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Account
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default PremiumHeader
