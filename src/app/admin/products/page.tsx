'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

export default function AdminProductsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('products')
      .select('*, categories(name)')
      .order('product_code', { ascending: true })
      .then(({ data }) => { if (data) setProducts(data) })
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>상품 관리</h1>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>상품 등록 및 관리</p>
        </div>
        <button onClick={() => router.push('/admin/products/new')}
          style={{ padding: '10px 20px', background: 'var(--navy)', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: PRETENDARD }}>
          + 상품 등록
        </button>
      </div>

      <div className="bg-white border" style={{ borderColor: '#E8E4DD', borderRadius: 8, overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F8F6F2' }}>
                {['No.', '썸네일', '상품명', '카테고리', '정가', '할인가', '재고', '상태', '등록일'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold tracking-[1px] uppercase whitespace-nowrap"
                    style={{ color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-12 text-center text-sm" style={{ color: 'var(--text-3)' }}>등록된 상품이 없습니다</td></tr>
              ) : products.map((p: any) => (
                <tr key={p.id}
                  onClick={() => router.push(`/admin/products/${p.id}`)}
                  className="border-t transition-colors cursor-pointer"
                  style={{ borderColor: '#F0EDE8' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8F6F2')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                  <td className="px-5 py-4 text-xs font-bold" style={{ color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }}>
                    #{p.product_code}
                  </td>
                  <td className="px-5 py-4">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #E8E4DD' }} />
                    ) : (
                      <div style={{ width: 48, height: 48, background: '#F8F6F2', borderRadius: 6, border: '1px solid #E8E4DD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold" style={{ color: 'var(--navy)' }}>
                    {p.name}
                    {p.name_en && <span className="block text-xs font-normal mt-0.5" style={{ color: 'var(--text-3)' }}>{p.name_en}</span>}
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-2)' }}>{p.categories?.name ?? '-'}</td>
                  <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-2)' }}>
                    {p.price ? `₩${p.price.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-5 py-4 font-semibold" style={{ color: '#B84A4A' }}>
                    {p.sale_price ? `₩${p.sale_price.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: p.stock === 0 ? '#B84A4A' : 'var(--text-2)' }}>
                    {p.stock} {p.unit}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-block text-[10px] font-bold px-2.5 py-1"
                      style={{
                        background: p.is_active ? 'rgba(74,124,89,0.12)' : 'rgba(184,74,74,0.12)',
                        color: p.is_active ? '#4A7C59' : '#B84A4A',
                        fontFamily: 'Montserrat, sans-serif',
                      }}>
                      {p.is_active ? '판매중' : '숨김'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-3)' }}>
                    {new Date(p.created_at).toLocaleDateString('ko-KR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
