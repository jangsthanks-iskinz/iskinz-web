'use client'
import { useState } from 'react'
import { ProductCard } from './ProductCard'
import { CATEGORIES } from '@/constants/products'
import { FadeIn } from '@/components/ui/FadeIn'
import type { Product } from '@/types'

interface Props { products: Product[] }

export function ProductsSection({ products }: Props) {
  const [active, setActive] = useState<string>('전체')

  const filtered = active === '전체' ? products : products.filter(p => p.category === active)

  return (
    <section id="products" className="py-28" style={{ background: '#F8F9FC' }}>
      <div className="container mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-14">
            <span className="section-label">ISKINZ Collection</span>
            <h2 className="font-serif text-4xl font-semibold text-gray-900 mb-4">메디컬 스킨케어 라인</h2>
            <p className="text-gray-500 max-w-[480px] mx-auto mb-8">
              임상 검증된 성분으로 설계된 ISKINZ의 프리미엄 제품 라인업을 만나보세요.
            </p>
            {/* Filter Tabs */}
            <div className="flex gap-2.5 justify-center flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className="px-6 py-2.5 rounded-full border-[1.5px] text-[13px] font-semibold transition-all"
                  style={{
                    background: active === cat ? 'var(--navy2)' : 'white',
                    color: active === cat ? 'white' : '#64748B',
                    borderColor: active === cat ? 'var(--navy2)' : '#E2E8F1',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.07}>
              <ProductCard product={p} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
