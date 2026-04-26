'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchCart() {
    setLoading(true)
    const res = await fetch('/api/cart')
    const { data } = await res.json()
    if (data) setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    if (isOpen) fetchCart()
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  async function handleRemove(productId: string) {
    await fetch('/api/cart', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: productId }) })
    fetchCart()
  }

  async function handleUpdateQty(productId: string, quantity: number) {
    if (quantity < 1) { handleRemove(productId); return }
    await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: productId, quantity }) })
    fetchCart()
  }

  const total = items.reduce((sum, i) => sum + (i.products.sale_price || i.products.price || 0) * i.quantity, 0)

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[1999] transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none' }}
        onClick={onClose} />

      <div className="fixed top-0 right-0 h-full w-full max-w-[420px] z-[2000] bg-white flex flex-col"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.35s cubic-bezier(.22,1,.36,1)', boxShadow: '-8px 0 40px rgba(0,0,0,0.15)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-gray-100">
          <h3 style={{ fontFamily: PRETENDARD, fontSize: 20, fontWeight: 700, color: '#1e2025' }}>장바구니</h3>
          <button onClick={onClose} className="text-2xl text-gray-400 hover:text-gray-700 transition-colors">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-7 py-5">
          {loading ? (
            <div className="text-center py-16 text-gray-400" style={{ fontFamily: PRETENDARD }}>로딩 중...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🛍️</div>
              <p className="text-sm" style={{ fontFamily: PRETENDARD }}>장바구니가 비어있습니다</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product_id} className="flex gap-4 py-4 border-b border-gray-100">
                {item.products.image_url ? (
                  <img src={item.products.image_url} alt={item.products.name_ko} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 72, height: 72, background: '#F8F6F2', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>📦</div>
                )}
                <div className="flex-1">
                  <p style={{ fontFamily: PRETENDARD, fontSize: 14, fontWeight: 600, color: '#1e2025', marginBottom: 4 }}>{item.products.name_ko}</p>
                  <p style={{ fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, color: item.products.sale_price ? '#B84A4A' : '#1e2025' }}>
                    ₩{(item.products.sale_price || item.products.price || 0).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => handleUpdateQty(item.product_id, item.quantity - 1)}
                      style={{ width: 28, height: 28, border: '1px solid #E8E4DD', borderRadius: 6, background: 'white', cursor: 'pointer', fontSize: 16 }}>−</button>
                    <span style={{ fontFamily: PRETENDARD, fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => handleUpdateQty(item.product_id, item.quantity + 1)}
                      style={{ width: 28, height: 28, border: '1px solid #E8E4DD', borderRadius: 6, background: 'white', cursor: 'pointer', fontSize: 16 }}>+</button>
                    <button onClick={() => handleRemove(item.product_id)}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#c8cdd4', fontSize: 16 }}>🗑</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-7 py-6 border-t border-gray-100">
            <div className="flex justify-between mb-5">
              <span style={{ fontFamily: PRETENDARD, fontSize: 14, color: '#8a9099' }}>합계</span>
              <span style={{ fontFamily: PRETENDARD, fontSize: 20, fontWeight: 700, color: '#1e2025' }}>₩{total.toLocaleString()}</span>
            </div>
            <Link href="/cart" onClick={onClose}
              className="block w-full py-4 text-center text-white font-bold no-underline transition-all hover:-translate-y-0.5"
              style={{ background: '#4a6fa5', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 15, fontWeight: 700 }}>
              장바구니 보기 →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
