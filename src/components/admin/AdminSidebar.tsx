'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin',              icon: '📊', label: 'Dashboard' },
  { href: '/admin/users',        icon: '👥', label: '회원 관리' },
  { href: '/admin/products',     icon: '🛍️', label: '상품 관리' },
  { href: '/admin/categories',   icon: '🗂️', label: '카테고리 관리' },
  { href: '/admin/orders',       icon: '📦', label: '주문 관리' },
  { href: '/admin/inquiries',    icon: '💬', label: '문의 관리' },
]

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col min-h-screen border-r"
      style={{ background: 'var(--navy-dark)', borderColor: 'rgba(198,160,82,0.15)' }}>

      {/* Logo */}
      <div className="px-6 py-7 border-b" style={{ borderColor: 'rgba(198,160,82,0.15)' }}>
        <Link href="/" className="no-underline">
          <span className="font-display text-xl font-bold text-white tracking-widest">
            IS<span style={{ color: 'var(--gold)' }}>KIN</span>Z
          </span>
        </Link>
        <div className="mt-1.5 text-[9px] font-bold tracking-[2px] uppercase"
          style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif' }}>
          Admin Panel
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-1 list-none">
          {navItems.map(item => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-[13px] font-semibold no-underline transition-all"
                  style={{
                    background: active ? 'rgba(198,160,82,0.12)' : 'transparent',
                    color: active ? 'var(--gold)' : 'rgba(255,255,255,0.6)',
                    borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom: user + logout */}
      <div className="px-4 py-5 border-t" style={{ borderColor: 'rgba(198,160,82,0.15)' }}>
        <p className="text-[11px] truncate mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{userEmail}</p>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold transition-colors hover:opacity-70 border"
          style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontFamily: 'Montserrat, sans-serif', background: 'transparent', letterSpacing: 1 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          로그아웃
        </button>
      </div>
    </aside>
  )
}
