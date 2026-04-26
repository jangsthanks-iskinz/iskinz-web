'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const C = { charcoal: '#1e2025', silver: '#c8cdd4', silverLight: '#e8ebee', silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5' }
const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"
const SERIF = 'Cormorant Garamond, Georgia, serif'

function CartContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [items, setItems] = useState<any[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState(false)

  async function fetchCart() {
    const res = await fetch('/api/cart')
    const { data } = await res.json()
    if (data) {
      setItems(data)
      setSelected(new Set<string>(data.map((i: any) => i.product_id)))
    }
    setLoading(false)
  }

  useEffect(() => {
    const addId = searchParams.get('add')
    if (addId) {
      fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: addId, quantity: 1 }) })
        .then(() => fetchCart())
    } else {
      fetchCart()
    }
  }, [])

  async function handleDelete(productIds: string[]) {
    await Promise.all(productIds.map(pid =>
      fetch('/api/cart', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: pid }) })
    ))
    fetchCart()
  }

  async function handleQuantityChange(productId: string, quantity: number) {
    if (quantity < 1) return
    await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: productId, quantity }) })
    fetchCart()
  }

  async function handleOrder(orderItems: any[]) {
    if (orderItems.length === 0) return
    setOrdering(true)
    const total_amount = orderItems.reduce((sum, i) => sum + (i.products.sale_price || i.products.price) * i.quantity, 0)
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: orderItems.map(i => ({
          product_id: i.product_id,
          product_name: i.products.name_ko,
          price: i.products.sale_price || i.products.price,
          quantity: i.quantity,
        })),
        total_amount,
      }),
    })
    const data = await res.json()
    console.log('[Order Response]', data)
    if (data.ok) router.push(`/cart/complete?order=${data.order_number}`)
    else alert('주문 오류: ' + (data.error || '알 수 없는 오류'))
    setOrdering(false)
  }

  const selectedItems = items.filter(i => selected.has(i.product_id))
  const totalPrice = selectedItems.reduce((sum, i) => sum + (i.products.sale_price || i.products.price || 0) * i.quantity, 0)

  if (loading) return <div style={{ paddingTop: 120, textAlign: 'center', fontFamily: PRETENDARD, color: C.silverDark }}>로딩 중...</div>

  return (
    <div style={{ background: C.offWhite, minHeight: '100vh', paddingTop: 100 }}>
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <h1 style={{ fontFamily: SERIF, fontSize: '2rem', fontWeight: 400, color: C.charcoal, marginBottom: 32 }}>장바구니</h1>

        {items.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid #E8E4DD', borderRadius: 12, padding: 60, textAlign: 'center' }}>
            <p style={{ fontFamily: PRETENDARD, fontSize: 15, color: C.silverDark, marginBottom: 20 }}>장바구니가 비어있습니다.</p>
            <Link href="/products" style={{ fontFamily: PRETENDARD, fontSize: 14, color: C.accent, textDecoration: 'none' }}>상품 보러가기 →</Link>
          </div>
        ) : (
          <>
            <div style={{ background: 'white', border: '1px solid #E8E4DD', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #E8E4DD', background: '#F8F6F2' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: PRETENDARD, fontSize: 13, fontWeight: 600, color: C.charcoal, cursor: 'pointer' }}>
                  <input type="checkbox"
                    checked={selected.size === items.length}
                    onChange={e => setSelected(e.target.checked ? new Set<string>(items.map(i => i.product_id)) : new Set())}
                  />
                  전체 선택 ({selected.size}/{items.length})
                </label>
                <button onClick={() => handleDelete(Array.from(selected))} disabled={selected.size === 0}
                  style={{ padding: '6px 14px', background: 'rgba(184,74,74,0.1)', color: '#B84A4A', border: '1px solid rgba(184,74,74,0.3)', borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: PRETENDARD, cursor: 'pointer', opacity: selected.size === 0 ? 0.4 : 1 }}>
                  선택 삭제
                </button>
              </div>

              {items.map(item => {
                const price = item.products.sale_price || item.products.price || 0
                const isSelected = selected.has(item.product_id)
                return (
                  <div key={item.product_id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', borderBottom: '1px solid #F0EDE8', background: isSelected ? 'white' : '#FAFAF8' }}>
                    <input type="checkbox" checked={isSelected}
                      onChange={e => {
                        const next = new Set(selected)
                        e.target.checked ? next.add(item.product_id) : next.delete(item.product_id)
                        setSelected(next)
                      }}
                    />
                    {item.products.image_url ? (
                      <img src={item.products.image_url} alt={item.products.name_ko} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid #E8E4DD', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 72, height: 72, background: '#F8F6F2', borderRadius: 8, border: '1px solid #E8E4DD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>📦</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: PRETENDARD, fontSize: 15, fontWeight: 700, color: C.charcoal, marginBottom: 4 }}>{item.products.name_ko}</p>
                      {item.products.sale_price && (
                        <p style={{ fontFamily: PRETENDARD, fontSize: 12, color: C.silverDark, textDecoration: 'line-through' }}>{item.products.price?.toLocaleString()}원</p>
                      )}
                      <p style={{ fontFamily: PRETENDARD, fontSize: 15, fontWeight: 700, color: item.products.sale_price ? '#B84A4A' : C.charcoal }}>{price.toLocaleString()}원</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                        style={{ width: 28, height: 28, border: '1px solid #E8E4DD', borderRadius: 4, background: 'white', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ fontFamily: PRETENDARD, fontSize: 14, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                        style={{ width: 28, height: 28, border: '1px solid #E8E4DD', borderRadius: 4, background: 'white', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                    <p style={{ fontFamily: PRETENDARD, fontSize: 15, fontWeight: 700, color: C.charcoal, minWidth: 100, textAlign: 'right' }}>
                      {(price * item.quantity).toLocaleString()}원
                    </p>
                    <button onClick={() => handleDelete([item.product_id])}
                      style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer', color: C.silverDark, fontSize: 18 }}>✕</button>
                  </div>
                )
              })}
            </div>

            <div style={{ background: 'white', border: '1px solid #E8E4DD', borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontFamily: PRETENDARD, fontSize: 15, color: C.silverDark }}>선택 상품 합계</span>
                <span style={{ fontFamily: PRETENDARD, fontSize: 22, fontWeight: 700, color: C.charcoal }}>{totalPrice.toLocaleString()}원</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => handleOrder(selectedItems)} disabled={ordering || selectedItems.length === 0}
                  style={{ flex: 1, padding: '14px', background: 'white', color: C.charcoal, border: '1px solid #E8E4DD', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: selectedItems.length === 0 ? 0.4 : 1 }}>
                  {ordering ? '처리 중...' : `선택 상품 주문하기 (${selectedItems.length})`}
                </button>
                <button onClick={() => handleOrder(items)} disabled={ordering || items.length === 0}
                  style={{ flex: 1, padding: '14px', background: C.accent, color: 'white', border: 'none', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  {ordering ? '처리 중...' : `전체 상품 주문하기 (${items.length})`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function CartPage() {
  return <Suspense fallback={<div style={{ paddingTop: 120, textAlign: 'center' }}>로딩 중...</div>}><CartContent /></Suspense>
}
