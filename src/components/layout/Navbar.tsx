'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { CartSidebar } from '@/components/shop/CartSidebar'

interface NavbarProps {
  isApproved?: boolean
}

const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF     = 'Cormorant Garamond, Georgia, serif'

export function Navbar({ isApproved = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [cartItems, setCartItems] = useState<any[]>([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchCartCount() {
    const res = await fetch('/api/cart')
    if (!res.ok) return
    const { data } = await res.json()
    if (data) {
      setCartItems(data)
      setCartCount(data.reduce((sum: number, i: any) => sum + i.quantity, 0))
    }
  }

  useEffect(() => {
    if (user) fetchCartCount()
    else setCartCount(0)
  }, [user])

  const navLinks = isApproved
    ? [
        { href: '/#about',    label: 'ABOUT' },
        { href: '/products',  label: 'PRODUCTS' },
        { href: '/#nctf',     label: 'NCTF 135HA' },
        { href: '/academy',   label: 'ACADEMY' },
        { href: '/#contact',  label: 'CONTACT' },
      ]
    : [
        { href: '/#contact', label: 'CONTACT' },
      ]

  const bgColor = scrolled ? 'rgba(26,29,34,0.98)' : 'rgba(26,29,34,0.92)'
  const borderColor = scrolled ? 'rgba(200,205,212,0.1)' : 'rgba(200,205,212,0.06)'

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          padding: scrolled ? '12px 0' : '18px 0',
          background: bgColor,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="no-underline flex-shrink-0">
            <span style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 400, letterSpacing: '0.14em', color: '#e8ebee' }}>
              ISKINZ
            </span>
            <span className="block mt-0.5" style={{ fontFamily: CONDENSED, fontSize: 8, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.35)' }}>
              Medical Aesthetic Supply
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8 list-none">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[11px] no-underline transition-opacity hover:opacity-100"
                  style={{ fontFamily: CONDENSED, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.6)' }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            {isApproved && (
              <button
                onMouseEnter={() => fetchCartCount()}
                onClick={() => { setCartOpen(true); fetchCartCount() }}
                className="relative p-2 transition-opacity hover:opacity-70"
                style={{ color: 'rgba(200,205,212,0.6)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 text-[9px] font-bold flex items-center justify-center"
                    style={{ background: '#4a6fa5', color: '#e8ebee', borderRadius: 0 }}>
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <Link href="/my" className="hidden md:block text-[11px] no-underline transition-opacity hover:opacity-70"
                style={{ fontFamily: CONDENSED, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.6)' }}>
                MY
              </Link>
            ) : (
              <Link href="/login" className="hidden md:block text-[11px] no-underline transition-opacity hover:opacity-70"
                style={{ fontFamily: CONDENSED, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.6)' }}>
                LOGIN
              </Link>
            )}

            <Link href="/#contact"
              className="hidden md:inline-flex items-center px-5 py-2.5 text-[11px] no-underline transition-all hover:-translate-y-0.5"
              style={{ fontFamily: CONDENSED, letterSpacing: '0.22em', textTransform: 'uppercase', background: '#e8ebee', color: '#1e2025', borderRadius: 0 }}>
              견적 문의
            </Link>

            <button className="lg:hidden p-2 transition-opacity hover:opacity-70"
              style={{ fontFamily: CONDENSED, color: 'rgba(200,205,212,0.7)' }}
              onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="lg:hidden border-t" style={{ background: 'rgba(26,29,34,0.99)', borderColor: 'rgba(200,205,212,0.08)' }}>
            <div className="container mx-auto px-6 py-5 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className="text-[11px] no-underline transition-opacity hover:opacity-60"
                  style={{ fontFamily: CONDENSED, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.65)' }}>
                  {link.label}
                </Link>
              ))}
              {user
                ? <Link href="/my" onClick={() => setMenuOpen(false)} className="text-[11px] no-underline" style={{ fontFamily: CONDENSED, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.65)' }}>MY PAGE</Link>
                : <Link href="/login" onClick={() => setMenuOpen(false)} className="text-[11px] no-underline" style={{ fontFamily: CONDENSED, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.65)' }}>LOGIN</Link>
              }
            </div>
          </div>
        )}
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => { setCartOpen(false); fetchCartCount() }} initialItems={cartItems} onRefresh={fetchCartCount} />
    </>
  )
}
