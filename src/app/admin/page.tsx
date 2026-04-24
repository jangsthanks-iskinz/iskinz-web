import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = createServiceClient()

  const [
    { count: totalUsers },
    { count: pendingUsers },
    { count: totalOrders },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).or('approved.eq.false,approved.is.null'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders')
      .select('*, profiles(name, hospital_name)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    { label: '전체 회원', value: totalUsers ?? 0, icon: '👥', color: 'var(--navy)', href: '/admin/users' },
    { label: '승인 대기 회원', value: pendingUsers ?? 0, icon: '⏳', color: '#C6A052', alert: (pendingUsers ?? 0) > 0, href: '/admin/users?status=pending' },
    { label: '전체 주문', value: totalOrders ?? 0, icon: '📦', color: 'var(--navy)', href: '/admin/orders' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>Dashboard</h1>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>ISKINZ 관리자 대시보드</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="no-underline block">
            <div className="bg-white border p-6 relative cursor-pointer hover:shadow-md transition-shadow" style={{ borderColor: s.alert ? '#C6A052' : '#E8E4DD', borderLeftWidth: s.alert ? 4 : 1 }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[1px] uppercase mb-2" style={{ color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }}>{s.label}</p>
                  <p className="text-4xl font-bold" style={{ color: s.color, fontFamily: 'Montserrat, sans-serif' }}>{s.value}</p>
                </div>
                <span className="text-2xl">{s.icon}</span>
              </div>
              {s.alert && (
                <p className="text-xs mt-2 font-semibold" style={{ color: '#C6A052' }}>⚠ 승인 처리 필요</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white border" style={{ borderColor: '#E8E4DD' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E8E4DD' }}>
          <h2 className="font-bold text-sm" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>최근 주문</h2>
          <a href="/admin/orders" className="text-xs font-bold no-underline hover:underline" style={{ color: 'var(--gold)' }}>전체 보기 →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F8F6F2' }}>
                {['주문번호', '회원', '병원명', '금액', '상태', '주문일'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[11px] font-bold tracking-[1px] uppercase" style={{ color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!recentOrders || recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-sm" style={{ color: 'var(--text-3)' }}>주문 내역이 없습니다</td></tr>
              ) : recentOrders.map((o: any) => (
                <tr key={o.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#F0EDE8' }}>
                  <td className="px-6 py-4 font-bold text-xs" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>{o.order_number}</td>
                  <td className="px-6 py-4" style={{ color: 'var(--text-2)' }}>{o.profiles?.name ?? '-'}</td>
                  <td className="px-6 py-4" style={{ color: 'var(--text-2)' }}>{o.profiles?.hospital_name ?? '-'}</td>
                  <td className="px-6 py-4 font-semibold" style={{ color: 'var(--navy)' }}>₩{o.total_amount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block text-[10px] font-bold tracking-[1px] px-2.5 py-1" style={{ background: 'var(--navy)', color: 'white', fontFamily: 'Montserrat, sans-serif' }}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-xs" style={{ color: 'var(--text-3)' }}>{new Date(o.created_at).toLocaleDateString('ko-KR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
