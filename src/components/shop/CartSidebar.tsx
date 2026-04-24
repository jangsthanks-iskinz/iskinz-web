'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalAmount } = useCartStore()
  const total = totalAmount()

  // 열릴 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[1999] transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none' }}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-[420px] z-[2000] bg-white flex flex-col"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(.22,1,.36,1)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-gray-100">
          <h3 className="font-serif text-2xl font-semibold">🛒 장바구니</h3>
          <button onClick={closeCart} className="text-2xl text-gray-400 hover:text-gray-700 transition-colors">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-7 py-5">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🛍️</div>
              <p className="text-sm">장바구니가 비어있습니다</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100">
                {/* Img */}
                <div className="w-[72px] h-[72px] rounded-xl bg-gray-50 flex items-center justify-center text-3xl flex-shrink-0">
                  {item.emoji}
                </div>
                {/* Info */}
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900 mb-1">{item.name_ko}</p>
                  <p className="font-bold text-sm">₩{(item.price * item.quantity).toLocaleString()}</p>
                  <div className="flex items-center gap-2.5 mt-2">
                    <button
                      className="w-7 h-7 rounded-lg border-[1.5px] border-gray-200 flex items-center justify-center text-base hover:border-cyan-400 hover:text-cyan-500 transition-colors"
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                    >−</button>
                    <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button
                      className="w-7 h-7 rounded-lg border-[1.5px] border-gray-200 flex items-center justify-center text-base hover:border-cyan-400 hover:text-cyan-500 transition-colors"
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                    >+</button>
                    <button
                      className="ml-auto text-gray-300 hover:text-red-400 transition-colors text-lg"
                      onClick={() => removeItem(item.id)}
                    >🗑</button>
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
              <span className="text-sm text-gray-500">합계</span>
              <span className="text-xl font-extrabold">₩{total.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-4 rounded-full text-center text-white font-bold text-[15px] no-underline transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}
            >
              구매하기 →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
