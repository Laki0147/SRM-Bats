'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoginModal } from './login-modal'

export function Header() {
  const {  session } = useSession()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary-600">SRM</span>
                <span className="text-2xl font-bold text-secondary-600">Bats</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/products"
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Shop Bats
              </Link>
              <Link
                href="/brands"
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Brands
              </Link>
              <Link
                href="/custom"
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Custom Bats
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary-500 text-xs text-white flex items-center justify-center">
                    0
                  </span>
                </Button>
              </Link>

              {/* User Menu */}
              {session ? (
                <div className="flex items-center space-x-2">
                  <Link href="/profile">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="hidden md:inline-flex"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  Login
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/products"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop Bats
                </Link>
                <Link
                  href="/brands"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Brands
                </Link>
                <Link
                  href="/custom"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Custom Bats
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                {session && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}
