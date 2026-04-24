'use client'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

interface Props { product: Product }

const BADGE_STYLE: Record<string, string> = {
  'SALE': 'bg-yellow-50 text-yellow-700',
  '베스트': 'bg-yellow-50 text-yellow-700',
  'BEST': 'bg-red-50 text-red-500',
  'NEW': 'bg-red-50 text-red-500',
  '임상인증': 'bg-cyan-50 text-cyan-600',
  'PREMIUM': 'bg-cyan-50 text-cyan-600',
}

export function ProductCard({ product }: Props) {
  const { addItem, openCart } = useCartStore()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
    openCart()
  }

  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
      {/* Image Area */}
      <div
        className="h-[260px] flex items-center justify-center relative overflow-hidden"
        style={{ background: product.gradient_bg }}
      >
        <span className="text-[4rem]" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>
          {product.emoji}
        </span>
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
          {product.badges.map(badge => (
            <span
              key={badge}
              className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${BADGE_STYLE[badge] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-[11px] font-bold tracking-[2px] uppercase text-cyan-500 mb-2">
          {product.category}
        </p>
        <h3 className="font-serif text-xl font-semibold text-gray-900 leading-tight mb-1">
          {product.name_en}
        </h3>
        <p className="text-sm text-gray-500 mb-1">{product.name_ko}</p>
        <p className="text-[13px] text-gray-500 leading-relaxed mb-5">{product.description}</p>

        {/* Price + Add */}
        <div className="flex items-center justify-between">
          <div>
            {product.price_original && (
              <s className="text-sm text-gray-300 mr-1">₩{product.price_original.toLocaleString()}</s>
            )}
            <span className="text-xl font-extrabold text-gray-900">
              ₩{product.price.toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleAdd}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-xl transition-all duration-200 hover:scale-110"
            style={{
              background: added
                ? '#10B981'
                : 'linear-gradient(135deg, #2563EB, #06B6D4)',
              boxShadow: added ? '0 4px 16px rgba(16,185,129,0.4)' : undefined,
            }}
            title="장바구니 담기"
          >
            {added ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  )
}
