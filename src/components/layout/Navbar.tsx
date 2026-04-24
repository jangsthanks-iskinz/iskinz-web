'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface NavbarProps {
  isApproved?: boolean
}

export function Navbar({ isApproved = false }: NavbarProps) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [user, setUser]           = useState<User | null>(null)
  const { totalCount, toggleCart } = useCartStore()
  const count = totalCount()

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

  const navLinks = isApproved
    ? [
        { href: '/#about',    label: 'ABOUT' },
        { href: '/#products', label: 'PRODUCTS' },
        { href: '/#nctf',     label: 'NCTF 135HA' },
        { href: '/academy',   label: 'ACADEMY' },
        { href: '/#contact',  label: 'CONTACT' },
      ]
    : [
        { href: '/#contact', label: 'CONTACT' },
      ]

  const bg = scrolled ? 'rgba(23,87,194,0.98)' : '#1757C2'

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          padding: scrolled ? '10px 0' : '16px 0',
          background: bg,
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="no-underline flex-shrink-0">
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.12em', color: '#ffffff' }}>
              ISKINZ
            </span>
            <span className="block mt-0.5" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              Medical Aesthetic Supply
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8 list-none">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[12px] no-underline transition-opacity hover:opacity-100"
                  style={{ fontFamily: "'Pretendard', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleCart}
              className="relative p-2 transition-opacity hover:opacity-70"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 text-[9px] font-bold flex items-center justify-center rounded-full"
                  style={{ background: '#fff', color: '#1757C2' }}>
                  {count}
                </span>
              )}
            </button>

            {user ? (
              <Link href="/my" className="hidden md:block text-[12px] no-underline transition-opacity hover:opacity-70"
                style={{ fontFamily: "'Pretendard', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>
                MY
              </Link>
            ) : (
              <Link href="/login" className="hidden md:block text-[12px] no-underline transition-opacity hover:opacity-70"
                style={{ fontFamily: "'Pretendard', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>
                LOGIN
              </Link>
            )}

            <Link href="/#contact"
              className="hidden md:inline-flex items-center px-5 py-2.5 text-[12px] no-underline transition-all hover:opacity-90"
              style={{ fontFamily: "'Pretendard', sans-serif", letterSpacing: '0.08em', background: '#fff', color: '#1757C2', fontWeight: 700, borderRadius: 6 }}>
              견적 문의
            </Link>

            <button className="lg:hidden p-2 transition-opacity hover:opacity-70"
              style={{ color: 'rgba(255,255,255,0.75)' }}
              onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="lg:hidden border-t" style={{ background: '#1757C2', borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="container mx-auto px-6 py-5 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className="text-[12px] no-underline"
                  style={{ fontFamily: "'Pretendard', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>
                  {link.label}
                </Link>
              ))}
              {user
                ? <Link href="/my" onClick={() => setMenuOpen(false)} className="text-[12px] no-underline" style={{ fontFamily: "'Pretendard', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>MY PAGE</Link>
                : <Link href="/login" onClick={() => setMenuOpen(false)} className="text-[12px] no-underline" style={{ fontFamily: "'Pretendard', sans-serif", letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>LOGIN</Link>
              }
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
