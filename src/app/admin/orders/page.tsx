import { createServiceClient } from '@/lib/supabase/server'
import { OrderStatusSelector } from '@/components/admin/OrderStatusSelector'

const STATUS_OPTIONS = [
  { value: 'pending',    label: '결제 대기', color: '#C6A052' },
  { value: 'paid',       label: '결제 완료', color: '#1A3055' },
  { value: 'preparing',  label: '준비 중',   color: '#3B82F6' },
  { value: 'shipped',    label: '배송 중',   color: '#8B5CF6' },
  { value: 'delivered',  label: '배송 완료', color: '#4A7C59' },
  { value: 'cancelled',  label: '취소',      color: '#B84A4A' },
]

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = createServiceClient()
  const statusFilter = searchParams.status ?? 'all'

  let query = supabase
    .from('orders')
    .select('*, profiles(name, hospital_name, email), order_items(*)')
    .order('created_at', { ascending: false })

  if (statusFilter !== 'all') query = query.eq('status', statusFilter)

  const { data: orders } = await query

  const tabs = [{ key: 'all', label: '전체' }, ...STATUS_OPTIONS.map(s => ({ key: s.value, label: s.label }))]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>주문 관리</h1>
        <p className="text-sm" style={{ color: 'var(--text-2)' }}>전체 주문 내역 조회 및 상태 관리</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6">
        {tabs.map(t => (
          <a key={t.key} href={`/admin/orders?status=${t.key}`}
            className="px-4 py-2 text-[11px] font-bold no-underline transition-colors"
            style={{
              background: statusFilter === t.key ? 'var(--navy)' : 'white',
              color: statusFilter === t.key ? 'white' : 'var(--text-2)',
              fontFamily: 'Montserrat, sans-serif',
              border: '1px solid',
              borderColor: statusFilter === t.key ? 'var(--navy)' : 'var(--border)',
              letterSpacing: 0.5,
            }}>
            {t.label}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F8F6F2' }}>
                {['주문번호', '회원', '병원명', '이메일', '금액', '상태', '주문일', '상태 변경'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold tracking-[1px] uppercase whitespace-nowrap"
                    style={{ color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!orders || orders.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-sm" style={{ color: 'var(--text-3)' }}>주문이 없습니다</td></tr>
              ) : orders.map((o: any) => {
                const s = STATUS_OPTIONS.find(x => x.value === o.status)
                return (
                  <tr key={o.id} className="border-t hover:bg-[#FAFAF7] transition-colors" style={{ borderColor: '#F0EDE8' }}>
                    <td className="px-5 py-4 font-bold text-xs whitespace-nowrap" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>
                      {o.order_number}
                    </td>
                    <td className="px-5 py-4 font-semibold" style={{ color: 'var(--navy)' }}>{o.profiles?.name ?? '-'}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-2)' }}>{o.profiles?.hospital_name ?? '-'}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-2)' }}>{o.profiles?.email ?? '-'}</td>
                    <td className="px-5 py-4 font-semibold whitespace-nowrap" style={{ color: 'var(--navy)' }}>
                      ₩{o.total_amount?.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block text-[10px] font-bold px-2.5 py-1 whitespace-nowrap"
                        style={{ background: s ? `${s.color}18` : '#F0EDE8', color: s?.color ?? 'var(--text-2)', fontFamily: 'Montserrat, sans-serif' }}>
                        {s?.label ?? o.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs whitespace-nowrap" style={{ color: 'var(--text-3)' }}>
                      {new Date(o.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-5 py-4">
                      <OrderStatusSelector orderId={o.id} currentStatus={o.status} options={STATUS_OPTIONS} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
