import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ORDER_STATUS_LABEL } from '@/types'
import { LogoutButton } from '@/components/auth/LogoutButton'

const C = { charcoal: '#1e2025', charcoalMid: '#2d3038', silver: '#c8cdd4', silverLight: '#e8ebee', silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5', warm: '#b5a99a' }
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'

export default async function MyPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const initial = (profile?.name ?? user.email ?? '?')[0].toUpperCase()
  const roleBadge = profile?.role === 'admin'   ? { label: '관리자', color: '#B84A4A' }
    : profile?.role === 'vip'     ? { label: 'VIP',   color: C.warm }
    : profile?.role === 'partner' ? { label: '파트너', color: '#4A7C59' }
    : { label: '병원 회원', color: C.accent }

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: C.offWhite }}>
      <div className="container mx-auto px-6 max-w-3xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{ width: 22, height: 1, background: C.accent }} />
              <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.accent }}>MY PAGE</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, color: C.charcoal }}>마이페이지</h1>
          </div>
          <LogoutButton />
        </div>

        {/* Profile Card */}
        <div className="bg-white border mb-5" style={{ borderColor: C.silver }}>
          <div style={{ height: 2, background: C.warm }} />
          <div style={{ padding: '32px' }}>
            <div className="flex items-center gap-5">
              <div style={{ width: 56, height: 56, background: C.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: CONDENSED, fontSize: 22, color: C.silverLight, letterSpacing: '0.05em' }}>{initial}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <p style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 400, color: C.charcoal }}>{profile?.name ?? '이름 없음'}</p>
                  <span style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '3px 8px', background: roleBadge.color, color: '#fff' }}>
                    {roleBadge.label}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: C.silverDark }}>{user.email}</p>
                {profile?.hospital_name && (
                  <p style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.silverDark, marginTop: 4 }}>{profile.hospital_name}</p>
                )}
              </div>
            </div>

            {profile?.approved === false && (
              <div style={{ marginTop: 20, padding: '12px 16px', border: `1px solid rgba(181,169,154,0.4)`, background: 'rgba(181,169,154,0.06)', fontSize: 13, color: '#8B6914' }}>
                <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>승인 대기 중</span>
                <p style={{ fontWeight: 300, marginTop: 4, color: C.silverDark }}>승인 완료 후 가격 정보 및 주문 기능이 활성화됩니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-5" style={{ background: `rgba(200,205,212,0.3)` }}>
          {[
            { href: '/my/edit',   icon: '↗', label: '정보 수정' },
            { href: '/my/orders', icon: '↗', label: '주문 내역' },
            { href: '/#products', icon: '↗', label: '제품 둘러보기' },
            { href: '/#contact',  icon: '↗', label: '문의하기' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white no-underline hover:-translate-y-0.5 transition-all"
              style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <span style={{ fontFamily: CONDENSED, fontSize: 18, color: C.accent }}>{item.icon}</span>
              <p style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal }}>{item.label}</p>
            </Link>
          ))}
        </div>

        {/* Admin shortcut */}
        {profile?.role === 'admin' && (
          <Link href="/admin"
            className="flex items-center justify-between w-full bg-white border no-underline hover:-translate-y-0.5 transition-all mb-5"
            style={{ borderColor: '#B84A4A', borderLeftWidth: 3, padding: '20px 24px' }}>
            <div>
              <p style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B84A4A', marginBottom: 2 }}>관리자 페이지</p>
              <p style={{ fontSize: 12, color: C.silverDark, fontWeight: 300 }}>회원·주문 관리 대시보드</p>
            </div>
            <span style={{ color: '#B84A4A', fontFamily: CONDENSED }}>→</span>
          </Link>
        )}

        {/* Recent Orders */}
        <div className="bg-white border" style={{ borderColor: C.silver }}>
          <div style={{ padding: '28px 32px', borderBottom: `1px solid ${C.silverLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal }}>최근 주문 내역</span>
            <Link href="/my/orders" style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, textDecoration: 'none' }}>
              전체 보기 →
            </Link>
          </div>

          {!orders || orders.length === 0 ? (
            <div style={{ padding: '64px 32px', textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, border: `1px solid ${C.silver}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.silverDark} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="0"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              </div>
              <p style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.silverDark, marginBottom: 12 }}>주문 내역이 없습니다</p>
              <Link href="/#products" style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, textDecoration: 'none' }}>
                제품 둘러보기 →
              </Link>
            </div>
          ) : (
            <div>
              {orders.map((order: any) => (
                <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: `1px solid ${C.silverLight}` }}>
                  <div>
                    <p style={{ fontFamily: CONDENSED, fontSize: 12, letterSpacing: '0.1em', color: C.charcoal, marginBottom: 4 }}>{order.order_number}</p>
                    <p style={{ fontSize: 11, color: C.silverDark, fontWeight: 300 }}>
                      {new Date(order.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: CONDENSED, fontSize: 13, color: C.charcoal, marginBottom: 4 }}>₩{order.total_amount.toLocaleString()}</p>
                    <span style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '3px 8px', background: C.charcoal, color: C.warm }}>
                      {ORDER_STATUS_LABEL[order.status as keyof typeof ORDER_STATUS_LABEL]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
