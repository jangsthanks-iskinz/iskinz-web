'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { STATUS_OPTIONS } from './constants'
const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

export function AdminOrdersContent({ orders, statusFilter, statusOptions }: {
  orders: any[]
  statusFilter: string
  statusOptions: { value: string, label: string, color: string }[]
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkStatus, setBulkStatus] = useState('')
  const [bulkLoading, setBulkLoading] = useState(false)
  const [detailOrder, setDetailOrder] = useState<any>(null)
  const [courierInput, setCourierInput] = useState('')
  const [trackingInput, setTrackingInput] = useState('')
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [pendingBulkStatus, setPendingBulkStatus] = useState('')

  const tabs = [{ key: 'all', label: '전체' }, ...statusOptions.map(s => ({ key: s.value, label: s.label }))]

  function toggleSelect(id: string) {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(orders.map(o => o.id)) : new Set())
  }

  async function handleBulkStatusChange() {
    if (!bulkStatus || selected.size === 0) return
    if (bulkStatus === 'shipped') {
      setPendingBulkStatus('shipped')
      setShowTrackingModal(true)
      return
    }
    await applyBulkStatus(bulkStatus, '', '')
  }

  async function applyBulkStatus(status: string, courier: string, tracking: string) {
    setBulkLoading(true)
    await Promise.all(Array.from(selected).map(id =>
      fetch('/api/admin/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, status, courier_name: courier || null, tracking_number: tracking || null }),
      })
    ))
    setBulkLoading(false)
    setSelected(new Set())
    setBulkStatus('')
    setShowTrackingModal(false)
    router.refresh()
  }

  async function handleSingleStatus(orderId: string, status: string) {
    if (status === 'shipped') {
      setDetailOrder(orders.find(o => o.id === orderId))
      setShowTrackingModal(true)
      setPendingBulkStatus('')
      return
    }
    await fetch('/api/admin/orders/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    })
    router.refresh()
  }

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
            }}>
            {t.label}
          </a>
        ))}
      </div>

      {/* 일괄 상태 변경 */}
      {selected.size > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '12px 16px', background: '#EEF2F8', borderRadius: 8 }}>
          <span style={{ fontFamily: PRETENDARD, fontSize: 13, fontWeight: 600, color: '#1A3055' }}>{selected.size}건 선택됨</span>
          <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #C8CDD4', borderRadius: 6, fontSize: 13, fontFamily: PRETENDARD }}>
            <option value="">상태 선택</option>
            {statusOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button onClick={handleBulkStatusChange} disabled={!bulkStatus || bulkLoading}
            style={{ padding: '8px 20px', background: '#1A3055', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, fontFamily: PRETENDARD, cursor: 'pointer', opacity: !bulkStatus ? 0.5 : 1 }}>
            {bulkLoading ? '처리 중...' : '확인'}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F8F6F2' }}>
                <th className="px-4 py-3">
                  <input type="checkbox" checked={selected.size === orders.length && orders.length > 0}
                    onChange={e => toggleAll(e.target.checked)} />
                </th>
                {['주문번호', '회원', '병원명', '주문 상품', '금액', '상태', '상태 변경'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold tracking-[1px] uppercase whitespace-nowrap"
                    style={{ color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-sm" style={{ color: 'var(--text-3)' }}>주문이 없습니다</td></tr>
              ) : orders.map((o: any) => {
                const s = statusOptions.find(x => x.value === o.status)
                const items = o.order_items ?? []
                return (
                  <tr key={o.id} className="border-t hover:bg-[#FAFAF7] transition-colors" style={{ borderColor: '#F0EDE8', cursor: 'pointer' }}>
                    <td className="px-4 py-4" onClick={e => { e.stopPropagation(); toggleSelect(o.id) }}>
                      <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleSelect(o.id)} onClick={e => e.stopPropagation()} />
                    </td>
                    <td className="px-5 py-4 font-bold text-xs whitespace-nowrap" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}
                      onClick={() => setDetailOrder(o)}>
                      {o.order_number}
                    </td>
                    <td className="px-5 py-4 font-semibold" style={{ color: 'var(--navy)' }} onClick={() => setDetailOrder(o)}>{o.profiles?.name ?? '-'}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-2)' }} onClick={() => setDetailOrder(o)}>{o.profiles?.hospital_name ?? '-'}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-2)', maxWidth: 200 }} onClick={() => setDetailOrder(o)}>
                      {items.slice(0, 2).map((item: any, i: number) => (
                        <div key={i} style={{ fontFamily: PRETENDARD, fontSize: 12, color: '#3a3d44', lineHeight: 1.6 }}>
                          {item.product_name}
                        </div>
                      ))}
                      {items.length > 2 && (
                        <div style={{ fontFamily: PRETENDARD, fontSize: 11, color: '#8a9099' }}>외 {items.length - 2}건</div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-semibold whitespace-nowrap" style={{ color: 'var(--navy)' }} onClick={() => setDetailOrder(o)}>
                      ₩{o.total_amount?.toLocaleString()}
                    </td>
                    <td className="px-5 py-4" onClick={() => setDetailOrder(o)}>
                      <span className="inline-block text-[10px] font-bold px-2.5 py-1 whitespace-nowrap"
                        style={{ background: s ? `${s.color}18` : '#F0EDE8', color: s?.color ?? 'var(--text-2)', fontFamily: 'Montserrat, sans-serif' }}>
                        {s?.label ?? o.status}
                      </span>
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <select value={o.status}
                        onChange={e => handleSingleStatus(o.id, e.target.value)}
                        style={{ padding: '6px 10px', border: '1px solid #E8E4DD', borderRadius: 6, fontSize: 12, fontFamily: PRETENDARD, background: 'white' }}>
                        {statusOptions.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 배송 정보 입력 모달 */}
      {showTrackingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 32, width: 400 }}>
            <h3 style={{ fontFamily: PRETENDARD, fontSize: 16, fontWeight: 700, marginBottom: 20 }}>배송 정보 입력</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: '#8a9099', marginBottom: 6 }}>택배사 *</label>
              <input type="text" placeholder="예: CJ대한통운" value={courierInput}
                onChange={e => setCourierInput(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #C8CDD4', borderRadius: 6, fontSize: 14, fontFamily: PRETENDARD, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: '#8a9099', marginBottom: 6 }}>송장번호 *</label>
              <input type="text" placeholder="송장번호 입력" value={trackingInput}
                onChange={e => setTrackingInput(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #C8CDD4', borderRadius: 6, fontSize: 14, fontFamily: PRETENDARD, boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => { setShowTrackingModal(false); setCourierInput(''); setTrackingInput('') }}
                style={{ flex: 1, padding: '12px', border: '1px solid #C8CDD4', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 14, cursor: 'pointer', background: 'white' }}>
                취소
              </button>
              <button
                disabled={!courierInput || !trackingInput}
                onClick={() => {
                  if (pendingBulkStatus) {
                    applyBulkStatus('shipped', courierInput, trackingInput)
                  } else if (detailOrder) {
                    fetch('/api/admin/orders/status', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ orderId: detailOrder.id, status: 'shipped', courier_name: courierInput, tracking_number: trackingInput }),
                    }).then(() => { setShowTrackingModal(false); setCourierInput(''); setTrackingInput(''); router.refresh() })
                  }
                }}
                style={{ flex: 1, padding: '12px', background: '#1A3055', color: 'white', border: 'none', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, cursor: !courierInput || !trackingInput ? 'not-allowed' : 'pointer', opacity: !courierInput || !trackingInput ? 0.5 : 1 }}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 주문 세부내역 모달 */}
      {detailOrder && !showTrackingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 32, width: '100%', maxWidth: 600, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: PRETENDARD, fontSize: 18, fontWeight: 700, color: '#1e2025' }}>주문 세부내역</h3>
              <button onClick={() => setDetailOrder(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#8a9099' }}>✕</button>
            </div>

            {(() => {
              const s = statusOptions.find(x => x.value === detailOrder.status)
              const rows = [
                { label: '주문일자', value: new Date(detailOrder.created_at).toLocaleString('ko-KR') },
                { label: '주문번호', value: detailOrder.order_number },
                { label: '주문 상태', value: <span style={{ color: s?.color, fontWeight: 700 }}>{s?.label ?? detailOrder.status}</span> },
                { label: '주문자', value: detailOrder.profiles?.name ?? '-' },
                { label: '병원명', value: detailOrder.profiles?.hospital_name ?? '-' },
                { label: '이메일', value: detailOrder.profiles?.email ?? '-' },
                { label: '수령인', value: detailOrder.recipient_name ?? '-' },
                { label: '연락처', value: detailOrder.recipient_phone ?? '-' },
                { label: '배송지', value: detailOrder.shipping_address1 ? `(${detailOrder.shipping_zipcode}) ${detailOrder.shipping_address1} ${detailOrder.shipping_address2 ?? ''}` : '-' },
                { label: '배송 메시지', value: detailOrder.shipping_memo ?? '-' },
                { label: '결제 수단', value: detailOrder.payment_method === 'bank_transfer' ? '무통장입금' : detailOrder.payment_method === 'credit_card' ? '신용카드' : detailOrder.payment_method === 'toss_pay' ? '토스페이' : '-' },
                { label: '결제일', value: detailOrder.paid_at ? new Date(detailOrder.paid_at).toLocaleString('ko-KR') : '-' },
                { label: '총 상품금액', value: `₩${detailOrder.subtotal_amount?.toLocaleString() ?? '-'}` },
                { label: '총 결제금액', value: `₩${detailOrder.total_amount?.toLocaleString() ?? '-'}` },
                { label: '택배사', value: detailOrder.courier_name ?? '-' },
                { label: '송장번호', value: detailOrder.tracking_number ?? '-' },
                { label: '메모', value: detailOrder.memo ?? '-' },
              ]
              return (
                <>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                    {rows.map(r => (
                      <tr key={r.label} style={{ borderBottom: '1px solid #F0EDE8' }}>
                        <td style={{ padding: '10px 0', fontFamily: PRETENDARD, fontSize: 12, color: '#8a9099', width: 120, verticalAlign: 'top' }}>{r.label}</td>
                        <td style={{ padding: '10px 0', fontFamily: PRETENDARD, fontSize: 13, color: '#1e2025' }}>{r.value}</td>
                      </tr>
                    ))}
                  </table>

                  <p style={{ fontFamily: PRETENDARD, fontSize: 13, fontWeight: 700, color: '#1e2025', marginBottom: 12 }}>주문 상품</p>
                  {(detailOrder.order_items ?? []).map((item: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0EDE8', fontFamily: PRETENDARD, fontSize: 13 }}>
                      <span style={{ color: '#1e2025' }}>{item.product_name}</span>
                      <span style={{ color: '#8a9099' }}>{item.quantity}개 · ₩{item.subtotal?.toLocaleString()}</span>
                    </div>
                  ))}
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
