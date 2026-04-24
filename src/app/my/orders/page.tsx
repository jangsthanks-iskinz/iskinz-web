import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ORDER_STATUS_LABEL } from '@/types'

const C = { charcoal: '#1e2025', silver: '#c8cdd4', silverLight: '#e8ebee', silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5', warm: '#b5a99a' }
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'

export default async function OrdersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: C.offWhite }}>
      <div className="container mx-auto px-6 max-w-3xl">

        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          <Link href="/my" style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.silverDark, textDecoration: 'none' }}>← 마이페이지</Link>
          <div style={{ width: 1, height: 16, background: C.silver }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 20, height: 1, background: C.accent }} />
              <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.accent }}>ORDERS</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 300, color: C.charcoal }}>주문 내역</h1>
          </div>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="bg-white border" style={{ borderColor: C.silver, padding: '80px 32px', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, border: `1px solid ${C.silver}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.silverDark} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            </div>
            <p style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, marginBottom: 6 }}>주문 내역이 없습니다</p>
            <p style={{ fontSize: 12, color: C.silverDark, fontWeight: 300, marginBottom: 24 }}>아직 주문하신 제품이 없어요</p>
            <Link href="/#products"
              style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '12px 28px', background: C.charcoal, color: C.silverLight, textDecoration: 'none', display: 'inline-block' }}>
              제품 둘러보기 →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white border" style={{ borderColor: C.silver }}>
                {/* Order header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', borderBottom: `1px solid ${C.silverLight}`, background: C.offWhite }}>
                  <div>
                    <p style={{ fontFamily: CONDENSED, fontSize: 12, letterSpacing: '0.15em', color: C.charcoal, marginBottom: 3 }}>{order.order_number}</p>
                    <p style={{ fontSize: 11, color: C.silverDark, fontWeight: 300 }}>
                      {new Date(order.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <span style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '4px 10px', background: C.charcoal, color: C.warm }}>
                    {ORDER_STATUS_LABEL[order.status as keyof typeof ORDER_STATUS_LABEL]}
                  </span>
                </div>

                {/* Items */}
                <div style={{ padding: '20px 28px', borderBottom: `1px solid ${C.silverLight}` }}>
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.silverLight}` }}>
                      <span style={{ fontSize: 13, color: C.charcoal, fontWeight: 300 }}>{item.product_name}</span>
                      <span style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.1em', color: C.silverDark }}>
                        ₩{item.unit_price.toLocaleString()} × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px' }}>
                  <p style={{ fontSize: 12, color: C.silverDark, fontWeight: 300 }}>
                    {order.shipping_name} · {order.shipping_address1}
                  </p>
                  <p style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 300, color: C.charcoal }}>
                    ₩{order.total_amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
