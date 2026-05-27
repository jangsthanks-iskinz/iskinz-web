'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

const COURIER_OPTIONS = ['직접배송', 'CJ대한통운', '한진택배', '롯데택배', '우체국택배', '로젠택배', '카카오T택배', 'DHL', 'FedEx']

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
  const [adminMemo, setAdminMemo] = useState('')
  const [memoSaving, setMemoSaving] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelItems, setCancelItems] = useState<Set<string>>(new Set())
  const [refundBank, setRefundBank] = useState('')
  const [refundAccount, setRefundAccount] = useState('')
  const [refundHolder, setRefundHolder] = useState('')
  const [cancelQty, setCancelQty] = useState<Record<string, number>>({})

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

  async function saveMemo() {
    if (!detailOrder) return
    setMemoSaving(true)
    await fetch('/api/admin/orders/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: detailOrder.id, status: detailOrder.status, memo: adminMemo }),
    })
    setMemoSaving(false)
    router.refresh()
  }

  async function handleCancel() {
    if (!detailOrder) return
    const isBankTransfer = detailOrder.payment_method === 'bank_transfer'
    if (isBankTransfer && (!refundBank || !refundAccount || !refundHolder)) {
      alert('환불 계좌 정보를 모두 입력해주세요.')
      return
    }
    const cancelledItems = (detailOrder.order_items ?? [])
      .filter((i: any) => cancelItems.has(i.id))
      .map((i: any) => ({
        product_name: i.product_name,
        quantity: cancelQty[i.id] ?? i.quantity,
        unit_price: i.unit_price,
        subtotal: (i.unit_price || 0) * (cancelQty[i.id] ?? i.quantity),
      }))
    const refundTotal = cancelledItems.reduce((sum: number, i: any) => sum + i.subtotal, 0)
    const isPartial = (detailOrder.order_items ?? []).some((i: any) => {
      if (!cancelItems.has(i.id)) return true  // 선택 안된 상품 있으면 부분취소
      const cancelledQty = cancelQty[i.id] ?? i.quantity
      return cancelledQty < i.quantity  // 수량이 부분이면 부분취소
    })
    const cancelType = isPartial ? 'partial' : 'full'
    const cancelLabel = isPartial ? '부분취소' : '전체취소'
    const memo = isBankTransfer
      ? `[${cancelLabel}] 환불계좌: ${refundBank} ${refundAccount} (${refundHolder}) 환불금액: ${refundTotal.toLocaleString()}원`
      : `[${cancelLabel}] 카드/토스 취소 처리 필요 환불금액: ${refundTotal.toLocaleString()}원`
    const newStatus = isPartial ? detailOrder.status : 'cancelled'
    await fetch('/api/admin/orders/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: detailOrder.id, status: newStatus, memo, cancel_items: cancelledItems, cancel_type: cancelType }),
    })
    setDetailOrder({ ...detailOrder, status: newStatus, memo, cancel_items: cancelledItems, cancel_type: cancelType })
    setShowCancelModal(false)
    setCancelItems(new Set())
    setCancelQty({})
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
                {['주문번호', '회원', '병원명', '주문 상품', '총 결제금액', '상태'].map(h => (
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
                    <td className="px-5 py-4 font-bold text-xs whitespace-nowrap" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }} onClick={() => { setDetailOrder(o); setAdminMemo(o.memo ?? '') }}>
                      {o.order_number}
                    </td>
                    <td className="px-5 py-4 font-semibold" style={{ color: 'var(--navy)' }} onClick={() => { setDetailOrder(o); setAdminMemo(o.memo ?? '') }}>{o.profiles?.name ?? '-'}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-2)' }} onClick={() => { setDetailOrder(o); setAdminMemo(o.memo ?? '') }}>{o.profiles?.hospital_name ?? '-'}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-2)', maxWidth: 200 }} onClick={() => { setDetailOrder(o); setAdminMemo(o.memo ?? '') }}>
                      {items.slice(0, 2).map((item: any, i: number) => (
                        <div key={i} style={{ fontFamily: PRETENDARD, fontSize: 12, color: '#3a3d44', lineHeight: 1.6 }}>{item.product_name}</div>
                      ))}
                      {items.length > 2 && <div style={{ fontFamily: PRETENDARD, fontSize: 11, color: '#8a9099' }}>외 {items.length - 2}건</div>}
                    </td>
                    <td className="px-5 py-4 font-semibold whitespace-nowrap" style={{ color: 'var(--navy)' }} onClick={() => { setDetailOrder(o); setAdminMemo(o.memo ?? '') }}>
                      {o.total_amount?.toLocaleString()}원
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                        <select value={o.status} onChange={e => handleSingleStatus(o.id, e.target.value)}
                          style={{ padding: '6px 10px', border: `1.5px solid ${s?.color ?? '#E8E4DD'}`, borderRadius: 6, fontSize: 12, fontFamily: PRETENDARD, background: s ? `${s.color}10` : 'white', color: s?.color ?? '#1e2025', fontWeight: 700 }}>
                          {statusOptions.map(st => (
                            <option key={st.value} value={st.value}>{st.label}</option>
                          ))}
                        </select>
                        {o.cancel_type && (
                          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: PRETENDARD, color: '#B84A4A', background: 'rgba(184,74,74,0.08)', padding: '2px 6px', borderRadius: 4 }}>
                            {o.cancel_type === 'full' ? '전체취소' : '부분취소'}
                          </span>
                        )}
                      </div>
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
              <select value={courierInput} onChange={e => setCourierInput(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #C8CDD4', borderRadius: 6, fontSize: 14, fontFamily: PRETENDARD, boxSizing: 'border-box' as const }}>
                <option value="">택배사 선택</option>
                {COURIER_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: '#8a9099', marginBottom: 6 }}>송장번호 *</label>
              <input type="text" placeholder="송장번호 입력" value={trackingInput}
                onChange={e => setTrackingInput(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #C8CDD4', borderRadius: 6, fontSize: 14, fontFamily: PRETENDARD, boxSizing: 'border-box' as const }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => { setShowTrackingModal(false); setCourierInput(''); setTrackingInput('') }}
                style={{ flex: 1, padding: '12px', border: '1px solid #C8CDD4', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 14, cursor: 'pointer', background: 'white' }}>취소</button>
              <button disabled={!courierInput || !trackingInput}
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
                style={{ flex: 1, padding: '12px', background: '#1A3055', color: 'white', border: 'none', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, cursor: !courierInput || !trackingInput ? 'not-allowed' : 'pointer', opacity: !courierInput || !trackingInput ? 0.5 : 1 }}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 취소/환불 모달 */}
      {showCancelModal && detailOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 32, width: '100%', maxWidth: 480 }}>
            <h3 style={{ fontFamily: PRETENDARD, fontSize: 16, fontWeight: 700, marginBottom: 20 }}>주문 취소/환불</h3>

            {/* 주문 취소 */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <span style={{ padding: '4px 12px', background: '#F8F6F2', color: '#8a9099', borderRadius: 4, fontSize: 12, fontFamily: PRETENDARD, fontWeight: 600, cursor: 'pointer' }}
                onClick={() => {
                  const allIds = new Set<string>((detailOrder.order_items ?? []).map((i: any) => i.id as string))
                  setCancelItems(allIds)
                  const fullQty: Record<string, number> = {}
                  ;(detailOrder.order_items ?? []).forEach((i: any) => { fullQty[i.id] = i.quantity })
                  setCancelQty(fullQty)
                }}>전체취소</span>
            </div>
            <p style={{ fontFamily: PRETENDARD, fontSize: 13, fontWeight: 600, color: '#8a9099', marginBottom: 10 }}>주문 취소</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
              <thead>
                <tr style={{ background: '#F8F6F2' }}>
                  <th style={{ padding: '8px 12px', fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: '#8a9099', textAlign: 'left' }}></th>
                  <th style={{ padding: '8px 12px', fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: '#8a9099', textAlign: 'left' }}>상품명</th>
                  <th style={{ padding: '8px 12px', fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: '#8a9099', textAlign: 'center', width: 50 }}>수량</th>
                  <th style={{ padding: '8px 12px', fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: '#8a9099', textAlign: 'right', width: 100 }}>금액</th>
                </tr>
              </thead>
              <tbody>
                {(detailOrder.order_items ?? []).map((item: any) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F0EDE8' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <input type="checkbox" checked={cancelItems.has(item.id)}
                        onChange={e => {
                          const next = new Set(cancelItems)
                          e.target.checked ? next.add(item.id) : next.delete(item.id)
                          setCancelItems(next)
                        }} />
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: PRETENDARD, fontSize: 13, color: '#1e2025' }}>{item.product_name}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <button onClick={() => setCancelQty(q => ({ ...q, [item.id]: Math.max(1, (q[item.id] ?? item.quantity) - 1) }))}
                          style={{ width: 24, height: 24, border: '1px solid #E8E4DD', borderRadius: 4, background: 'white', cursor: 'pointer', fontSize: 14 }}>−</button>
                        <span style={{ fontFamily: PRETENDARD, fontSize: 13, minWidth: 20, textAlign: 'center' }}>{cancelQty[item.id] ?? item.quantity}</span>
                        <button onClick={() => setCancelQty(q => ({ ...q, [item.id]: Math.min(item.quantity, (q[item.id] ?? item.quantity) + 1) }))}
                          style={{ width: 24, height: 24, border: '1px solid #E8E4DD', borderRadius: 4, background: 'white', cursor: 'pointer', fontSize: 14 }}>+</button>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: PRETENDARD, fontSize: 13, color: '#1e2025', textAlign: 'right' }}>{item.subtotal?.toLocaleString()}원</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {cancelItems.size > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, padding: '10px 12px', background: '#F8F6F2', borderRadius: 6, marginBottom: 12 }}>
                <span style={{ fontFamily: PRETENDARD, fontSize: 13, fontWeight: 700, color: '#1e2025' }}>총 환불금액</span>
                <span style={{ fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, color: '#B84A4A' }}>
                  {(detailOrder.order_items ?? []).filter((i: any) => cancelItems.has(i.id)).reduce((sum: number, i: any) => sum + (i.unit_price || 0) * (cancelQty[i.id] ?? i.quantity), 0).toLocaleString()}원
                </span>
              </div>
            )}

            {/* 무통장입금 환불 계좌 */}
            {detailOrder.payment_method === 'bank_transfer' && (
              <div style={{ marginTop: 20, padding: 16, background: '#F8F6F2', borderRadius: 8 }}>
                <p style={{ fontFamily: PRETENDARD, fontSize: 13, fontWeight: 600, color: '#1e2025', marginBottom: 12 }}>환불 계좌 정보</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input type="text" placeholder="은행명" value={refundBank} onChange={e => setRefundBank(e.target.value)}
                    style={{ padding: '10px 12px', border: '1px solid #C8CDD4', borderRadius: 6, fontSize: 14, fontFamily: PRETENDARD }} />
                  <input type="text" placeholder="계좌번호" value={refundAccount} onChange={e => setRefundAccount(e.target.value)}
                    style={{ padding: '10px 12px', border: '1px solid #C8CDD4', borderRadius: 6, fontSize: 14, fontFamily: PRETENDARD }} />
                  <input type="text" placeholder="예금주" value={refundHolder} onChange={e => setRefundHolder(e.target.value)}
                    style={{ padding: '10px 12px', border: '1px solid #C8CDD4', borderRadius: 6, fontSize: 14, fontFamily: PRETENDARD }} />
                </div>
              </div>
            )}

            {detailOrder.payment_method !== 'bank_transfer' && (
              <div style={{ marginTop: 16, padding: 12, background: '#FFF3F3', borderRadius: 6 }}>
                <p style={{ fontFamily: PRETENDARD, fontSize: 13, color: '#B84A4A' }}>카드/토스페이 취소는 PG사 연동 후 처리됩니다.</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => { setShowCancelModal(false); setCancelItems(new Set()); setRefundBank(''); setRefundAccount(''); setRefundHolder('') }}
                style={{ flex: 1, padding: '12px', border: '1px solid #C8CDD4', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 14, cursor: 'pointer', background: 'white' }}>닫기</button>
              <button onClick={handleCancel} disabled={cancelItems.size === 0}
                style={{ flex: 1, padding: '12px', background: '#B84A4A', color: 'white', border: 'none', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, cursor: cancelItems.size === 0 ? 'not-allowed' : 'pointer', opacity: cancelItems.size === 0 ? 0.5 : 1 }}>
                취소 처리
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 주문 세부내역 모달 */}
      {detailOrder && !showTrackingModal && !showCancelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 32, width: '100%', maxWidth: 640, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: PRETENDARD, fontSize: 18, fontWeight: 700, color: '#1e2025' }}>주문 세부내역</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowCancelModal(true)}
                  style={{ padding: '8px 16px', background: '#B84A4A', color: 'white', border: 'none', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  취소/환불
                </button>
                <button onClick={() => setDetailOrder(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#8a9099' }}>✕</button>
              </div>
            </div>

            {(() => {
              const s = statusOptions.find(x => x.value === detailOrder.status)
              return (
                <>
                  {/* 주문 상품 */}
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontFamily: PRETENDARD, fontSize: 13, fontWeight: 700, color: '#8a9099', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>주문 상품</p>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#F8F6F2' }}>
                          <th style={{ padding: '8px 12px', fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: '#8a9099', textAlign: 'left' }}>상품명</th>
                          <th style={{ padding: '8px 12px', fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: '#8a9099', textAlign: 'center', width: 60 }}>수량</th>
                          <th style={{ padding: '8px 12px', fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: '#8a9099', textAlign: 'right', width: 100 }}>상품금액</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(detailOrder.order_items ?? []).map((item: any, i: number) => (
                          <tr key={i} style={{ borderBottom: '1px solid #F0EDE8' }}>
                            <td style={{ padding: '10px 12px', fontFamily: PRETENDARD, fontSize: 13, color: '#1e2025' }}>{item.product_name}</td>
                            <td style={{ padding: '10px 12px', fontFamily: PRETENDARD, fontSize: 13, color: '#1e2025', textAlign: 'center' }}>{item.quantity}</td>
                            <td style={{ padding: '10px 12px', fontFamily: PRETENDARD, fontSize: 13, color: '#1e2025', textAlign: 'right' }}>{item.subtotal?.toLocaleString()}원</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, marginTop: 12, paddingTop: 12, borderTop: '1px solid #E8E4DD' }}>
                      <div style={{ display: 'flex', gap: 24, fontFamily: PRETENDARD, fontSize: 13 }}>
                        <span style={{ color: '#8a9099' }}>총 상품금액</span>
                        <span style={{ color: '#1e2025', fontWeight: 600 }}>{(detailOrder.order_items ?? []).reduce((sum: number, i: any) => sum + (i.subtotal || 0), 0).toLocaleString()}원</span>
                      </div>
                      <div style={{ display: 'flex', gap: 24, fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700 }}>
                        <span style={{ color: '#1e2025' }}>총 결제금액</span>
                        <span style={{ color: '#4a6fa5' }}>{detailOrder.total_amount?.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>

                  {/* 주문 정보 */}
                  <div style={{ marginBottom: 24 }}>
                    <p style={{ fontFamily: PRETENDARD, fontSize: 13, fontWeight: 700, color: '#8a9099', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>주문 정보</p>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        {[
                          { label: '주문일자', value: new Date(detailOrder.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) },
                          { label: '주문번호', value: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{detailOrder.order_number}<span style={{ background: s ? `${s.color}18` : '#F0EDE8', color: s?.color, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>{s?.label ?? detailOrder.status}</span></span> },
                          { label: '주문자', value: detailOrder.profiles?.name ?? '-' },
                          { label: '병원명', value: detailOrder.profiles?.hospital_name ?? '-' },
                          { label: '총 상품금액', value: `${detailOrder.subtotal_amount?.toLocaleString() ?? '-'}원` },
                          { label: '총 결제금액', value: `${detailOrder.total_amount?.toLocaleString() ?? '-'}원` },
                          { label: '결제 수단', value: detailOrder.payment_method === 'bank_transfer' ? '무통장입금' : detailOrder.payment_method === 'credit_card' ? '신용카드' : detailOrder.payment_method === 'toss_pay' ? '토스페이' : '-' },
                        ].map(r => (
                          <tr key={r.label} style={{ borderBottom: '1px solid #F0EDE8' }}>
                            <td style={{ padding: '10px 0', fontFamily: PRETENDARD, fontSize: 12, color: '#8a9099', width: 120, verticalAlign: 'top' }}>{r.label}</td>
                            <td style={{ padding: '10px 0', fontFamily: PRETENDARD, fontSize: 13, color: '#1e2025' }}>{r.value}</td>
                          </tr>
                        ))}
                        {/* 관리자 메모 */}
                        <tr style={{ borderBottom: '1px solid #F0EDE8' }}>
                          <td style={{ padding: '10px 0', fontFamily: PRETENDARD, fontSize: 12, color: '#8a9099', width: 120, verticalAlign: 'top' }}>관리자 메모</td>
                          <td style={{ padding: '10px 0' }}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="text" value={adminMemo} onChange={e => setAdminMemo(e.target.value)}
                                placeholder="메모 입력"
                                style={{ flex: 1, padding: '8px 10px', border: '1px solid #C8CDD4', borderRadius: 6, fontSize: 13, fontFamily: PRETENDARD }} />
                              <button onClick={saveMemo} disabled={memoSaving}
                                style={{ padding: '8px 14px', background: '#1A3055', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, fontFamily: PRETENDARD, cursor: 'pointer' }}>
                                {memoSaving ? '저장중' : '저장'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 취소 내역 */}
                  {detailOrder.cancel_items && detailOrder.cancel_items.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <p style={{ fontFamily: PRETENDARD, fontSize: 13, fontWeight: 700, color: '#B84A4A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>취소 내역</p>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#FFF3F3' }}>
                            <th style={{ padding: '8px 12px', fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: '#B84A4A', textAlign: 'left' }}>상품명</th>
                            <th style={{ padding: '8px 12px', fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: '#B84A4A', textAlign: 'center', width: 60 }}>수량</th>
                            <th style={{ padding: '8px 12px', fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: '#B84A4A', textAlign: 'right', width: 100 }}>금액</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailOrder.cancel_items.map((item: any, i: number) => (
                            <tr key={i} style={{ borderBottom: '1px solid #FFE4E4' }}>
                              <td style={{ padding: '10px 12px', fontFamily: PRETENDARD, fontSize: 13, color: '#1e2025' }}>{item.product_name}</td>
                              <td style={{ padding: '10px 12px', fontFamily: PRETENDARD, fontSize: 13, color: '#1e2025', textAlign: 'center' }}>{item.quantity}</td>
                              <td style={{ padding: '10px 12px', fontFamily: PRETENDARD, fontSize: 13, color: '#B84A4A', textAlign: 'right' }}>{item.subtotal?.toLocaleString()}원</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, padding: '10px 12px', background: '#FFF3F3', borderRadius: '0 0 6px 6px' }}>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <span style={{ fontFamily: PRETENDARD, fontSize: 13, fontWeight: 700, color: '#1e2025' }}>총 환불금액</span>
                          <span style={{ fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, color: '#B84A4A' }}>
                            {detailOrder.cancel_items.reduce((sum: number, i: any) => sum + (i.subtotal || 0), 0).toLocaleString()}원
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <span style={{ fontFamily: PRETENDARD, fontSize: 13, fontWeight: 700, color: '#1e2025' }}>최종 실 결제금액</span>
                          <span style={{ fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, color: '#4a6fa5' }}>
                            {Math.max(0, (detailOrder.total_amount || 0) - detailOrder.cancel_items.reduce((sum: number, i: any) => sum + (i.subtotal || 0), 0)).toLocaleString()}원
                          </span>
                        </div>
                      </div>
                      {detailOrder.memo && (
                        <div style={{ marginTop: 8, padding: '10px 12px', background: '#F8F6F2', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 12, color: '#8a9099' }}>
                          {detailOrder.memo}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 배송 정보 */}
                  <div>
                    <p style={{ fontFamily: PRETENDARD, fontSize: 13, fontWeight: 700, color: '#8a9099', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>배송 정보</p>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        {[
                          { label: '수령인', value: detailOrder.recipient_name ?? '-' },
                          { label: '연락처', value: detailOrder.recipient_phone ?? '-' },
                          { label: '배송지', value: detailOrder.shipping_address1 ? `(${detailOrder.shipping_zipcode}) ${detailOrder.shipping_address1} ${detailOrder.shipping_address2 ?? ''}` : '-' },
                          { label: '배송 메시지', value: detailOrder.shipping_memo ?? '-' },
                        ].map(r => (
                          <tr key={r.label} style={{ borderBottom: '1px solid #F0EDE8' }}>
                            <td style={{ padding: '10px 0', fontFamily: PRETENDARD, fontSize: 12, color: '#8a9099', width: 120 }}>{r.label}</td>
                            <td style={{ padding: '10px 0', fontFamily: PRETENDARD, fontSize: 13, color: '#1e2025' }}>{r.value}</td>
                          </tr>
                        ))}
                        {/* 택배사 */}
                        <tr style={{ borderBottom: '1px solid #F0EDE8' }}>
                          <td style={{ padding: '10px 0', fontFamily: PRETENDARD, fontSize: 12, color: '#8a9099', width: 120 }}>택배사</td>
                          <td style={{ padding: '10px 0' }}>
                            <select value={detailOrder.courier_name ?? ''}
                              onChange={async e => {
                                const newVal = e.target.value
                                setDetailOrder({ ...detailOrder, courier_name: newVal })
                                await fetch('/api/admin/orders/status', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ orderId: detailOrder.id, status: detailOrder.status, courier_name: newVal }),
                                })
                              }}
                              style={{ padding: '8px 10px', border: '1px solid #C8CDD4', borderRadius: 6, fontSize: 13, fontFamily: PRETENDARD }}>
                              <option value="">택배사 선택</option>
                              {COURIER_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </td>
                        </tr>
                        {/* 송장번호 */}
                        <tr style={{ borderBottom: '1px solid #F0EDE8' }}>
                          <td style={{ padding: '10px 0', fontFamily: PRETENDARD, fontSize: 12, color: '#8a9099', width: 120 }}>송장번호</td>
                          <td style={{ padding: '10px 0' }}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input type="text" value={detailOrder.tracking_number ?? ''}
                                onChange={e => setDetailOrder({ ...detailOrder, tracking_number: e.target.value })}
                                placeholder="송장번호 입력"
                                style={{ flex: 1, padding: '8px 10px', border: '1px solid #C8CDD4', borderRadius: 6, fontSize: 13, fontFamily: PRETENDARD }} />
                              <button onClick={async () => {
                                await fetch('/api/admin/orders/status', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ orderId: detailOrder.id, status: detailOrder.status, tracking_number: detailOrder.tracking_number }),
                                })
                                router.refresh()
                              }}
                                style={{ padding: '8px 14px', background: '#1A3055', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, fontFamily: PRETENDARD, cursor: 'pointer' }}>저장</button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
