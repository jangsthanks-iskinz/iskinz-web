import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const C = {
  charcoal: '#1e2025', silver: '#c8cdd4', silverLight: '#e8ebee',
  silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5', warm: '#b5a99a',
}
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'
const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  // 승인 회원만 접근 가능
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  const { data: profile } = await supabase.from('profiles').select('approved').eq('id', user.id).single()
  if (!profile?.approved) redirect('/')

  // 상품 + 카테고리 데이터
  const service = createServiceClient()
  const { data: categories } = await service
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .is('parent_id', null)
    .order('sort_order')

  let productQuery = service
    .from('products')
    .select('*, categories(name, name_en)')
    .eq('is_active', true)
    .order('product_code', { ascending: true })

  if (searchParams.category) {
    productQuery = productQuery.eq('category_id', searchParams.category)
  }

  const { data: products } = await productQuery

  return (
    <div style={{ background: C.offWhite, minHeight: '100vh', paddingTop: 100 }}>
      <div className="container mx-auto px-6 py-16">

        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div style={{ width: 28, height: 1, background: C.accent }} />
            <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.accent }}>OUR PRODUCTS</span>
            <div style={{ width: 28, height: 1, background: C.accent }} />
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 400, color: C.charcoal }}>
            프리미엄 메디컬 에스테틱
          </h1>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          <Link href="/products"
            style={{
              padding: '8px 20px', borderRadius: 4, fontSize: 13, fontFamily: PRETENDARD, fontWeight: 600,
              textDecoration: 'none', border: '1px solid',
              background: !searchParams.category ? C.charcoal : 'white',
              color: !searchParams.category ? C.silverLight : C.charcoal,
              borderColor: !searchParams.category ? C.charcoal : '#E8E4DD',
            }}>
            전체
          </Link>
          {categories?.map(cat => (
            <Link key={cat.id} href={`/products?category=${cat.id}`}
              style={{
                padding: '8px 20px', borderRadius: 4, fontSize: 13, fontFamily: PRETENDARD, fontWeight: 600,
                textDecoration: 'none', border: '1px solid',
                background: searchParams.category === cat.id ? C.charcoal : 'white',
                color: searchParams.category === cat.id ? C.silverLight : C.charcoal,
                borderColor: searchParams.category === cat.id ? C.charcoal : '#E8E4DD',
              }}>
              {cat.name}
            </Link>
          ))}
        </div>

        {/* 상품 그리드 */}
        {!products || products.length === 0 ? (
          <div className="text-center py-24" style={{ color: C.silverDark, fontFamily: PRETENDARD }}>
            등록된 상품이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => {
              const discount = p.price && p.sale_price ? Math.round((1 - p.sale_price / p.price) * 100) : null
              return (
                <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div className="bg-white border transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ borderColor: '#E8E4DD', borderRadius: 8, overflow: 'hidden' }}>
                    {/* 썸네일 */}
                    <div style={{ width: '100%', aspectRatio: '1', background: '#F8F6F2', position: 'relative', overflow: 'hidden' }}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name_ko} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>📦</div>
                      )}
                      {discount && (
                        <div style={{ position: 'absolute', top: 10, left: 10, background: '#B84A4A', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 700, fontFamily: PRETENDARD }}>
                          {discount}% 할인
                        </div>
                      )}
                    </div>

                    {/* 상품 정보 */}
                    <div style={{ padding: '16px' }}>
                      <p style={{ fontSize: 11, color: C.accent, fontFamily: CONDENSED, letterSpacing: '0.1em', marginBottom: 4 }}>
                        {(p.categories as any)?.name ?? ''}
                      </p>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: C.charcoal, fontFamily: PRETENDARD, marginBottom: 4, lineHeight: 1.4 }}>
                        {p.name_ko}
                      </h3>
                      {p.name_en && (
                        <p style={{ fontSize: 12, color: C.silverDark, fontFamily: CONDENSED, marginBottom: 8 }}>{p.name_en}</p>
                      )}
                      <div style={{ marginTop: 8 }}>
                        {p.sale_price ? (
                          <>
                            <p style={{ fontSize: 12, color: C.silverDark, textDecoration: 'line-through', fontFamily: PRETENDARD }}>
                              {p.price?.toLocaleString()}원
                            </p>
                            <p style={{ fontSize: 18, fontWeight: 700, color: '#B84A4A', fontFamily: PRETENDARD }}>
                              {p.sale_price.toLocaleString()}원
                            </p>
                          </>
                        ) : p.price ? (
                          <p style={{ fontSize: 18, fontWeight: 700, color: C.charcoal, fontFamily: PRETENDARD }}>
                            {p.price.toLocaleString()}원
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
