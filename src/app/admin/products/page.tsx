import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'

export default async function AdminProductsPage() {
  const supabase = createServiceClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>상품 관리</h1>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>상품 등록 및 관리</p>
        </div>
        <Link href="/admin/products/new"
          className="px-5 py-2.5 text-sm font-bold no-underline transition-all hover:opacity-80"
          style={{ background: 'var(--navy)', color: 'white', fontFamily: 'Montserrat, sans-serif' }}>
          + 상품 등록
        </Link>
      </div>

      <div className="bg-white border" style={{ borderColor: '#E8E4DD' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F8F6F2' }}>
                {['썸네일', '상품명', '카테고리', '정가', '할인가', '재고', '상태', '등록일', '관리'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold tracking-[1px] uppercase whitespace-nowrap"
                    style={{ color: 'var(--text-3)', fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!products || products.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-12 text-center text-sm" style={{ color: 'var(--text-3)' }}>등록된 상품이 없습니다</td></tr>
              ) : products.map((p: any) => (
                <tr key={p.id} className="border-t hover:bg-[#FAFAF7] transition-colors" style={{ borderColor: '#F0EDE8' }}>
                  <td className="px-5 py-4">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #E8E4DD' }} />
                    ) : (
                      <div style={{ width: 48, height: 48, background: '#F8F6F2', borderRadius: 6, border: '1px solid #E8E4DD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</div>
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold" style={{ color: 'var(--navy)' }}>
                    <Link href={`/admin/products/${p.id}`} className="no-underline hover:underline" style={{ color: 'var(--navy)' }}>
                      {p.name}
                    </Link>
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
                  <td className="px-5 py-4">
                    <Link href={`/admin/products/${p.id}`}
                      className="px-3 py-1.5 text-[11px] font-bold no-underline transition-all hover:opacity-70"
                      style={{ background: 'rgba(74,111,165,0.1)', color: 'var(--accent)', border: '1px solid rgba(74,111,165,0.3)', fontFamily: 'Montserrat, sans-serif' }}>
                      수정
                    </Link>
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
