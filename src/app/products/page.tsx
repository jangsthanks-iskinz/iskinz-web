import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const C = {
  charcoal: '#1e2025', silver: '#c8cdd4', silverLight: '#e8ebee',
  silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5', warm: '#b5a99a',
  gold: '#B4924E', navy: '#1B3868',
}
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'
const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

/* ─── 3개 카테고리 정의 ─── */
const CATEGORIES = [
  { id: 'all',      label: '전체',    brand: 'ISKINZ' },
  { id: 'nctf',     label: 'NCTF',    brand: 'Fillmed' },
  { id: 'nanosoft', label: '나노소프트', brand: 'Fillmed' },
  { id: 'stylage',  label: 'Stylage', brand: 'Vivacy' },
]

function matchCategory(p: { name_en?: string | null; name_ko?: string | null }, cat: string): boolean {
  const en = (p.name_en ?? '').toLowerCase()
  const ko = (p.name_ko ?? '')
  switch (cat) {
    case 'nctf':     return en.includes('nctf')
    case 'nanosoft': return en.includes('nano') || ko.includes('나노소프트')
    case 'stylage':  return en.includes('stylage') || ko.includes('스타일에이지')
    default:         return true
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  const { data: profile } = await supabase.from('profiles').select('approved').eq('id', user.id).single()
  if (!profile?.approved) redirect('/')

  const service = createServiceClient()
  const { data: allProducts } = await service
    .from('products')
    .select('*, categories(name, name_en)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  const cat = searchParams.category ?? 'all'

  /* 3개 카테고리에 해당하는 제품만 표시 (그 외 숨김) */
  const products = (allProducts ?? []).filter(p =>
    (matchCategory(p, 'nctf') || matchCategory(p, 'nanosoft') || matchCategory(p, 'stylage')) &&
    (cat === 'all' || matchCategory(p, cat))
  )

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
          <p style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', color: C.silverDark, marginTop: 8, textTransform: 'uppercase' }}>
            Fillmed · Vivacy 정식 공급
          </p>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {CATEGORIES.map(c => {
            const isActive = cat === c.id
            return (
              <Link
                key={c.id}
                href={c.id === 'all' ? '/products' : `/products?category=${c.id}`}
                style={{
                  padding: '8px 20px',
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: PRETENDARD,
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '1px solid',
                  background: isActive ? C.charcoal : 'white',
                  color: isActive ? C.silverLight : C.charcoal,
                  borderColor: isActive ? C.charcoal : '#E8E4DD',
                  transition: 'all 0.2s',
                }}
              >
                {c.label}
              </Link>
            )
          })}
        </div>

        {/* 상품 그리드 */}
        {products.length === 0 ? (
          <div className="text-center py-24" style={{ color: C.silverDark, fontFamily: PRETENDARD }}>
            등록된 상품이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {products.map(p => (
              <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
                <div
                  className="bg-white border transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  style={{ borderColor: '#E8E4DD', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  {/* 이미지 영역 */}
                  <div style={{ width: '100%', aspectRatio: '1', background: '#F8F6F2', position: 'relative', overflow: 'hidden' }}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name_ko} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>📦</div>
                    )}
                  </div>

                  {/* 카드 텍스트 */}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontSize: 11, color: C.accent, fontFamily: CONDENSED, letterSpacing: '0.1em', marginBottom: 4 }}>
                      {(p.categories as any)?.name ?? ''}
                    </p>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: C.charcoal, fontFamily: PRETENDARD, marginBottom: 4, lineHeight: 1.4 }}>
                      {p.name_ko}
                    </h3>
                    {p.name_en && (
                      <p style={{ fontSize: 12, color: C.silverDark, fontFamily: CONDENSED, marginBottom: 8 }}>{p.name_en}</p>
                    )}
                    {/* 가격 표시 제거 — 문의 안내로 대체 */}
                    <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                      <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent }}>
                        가격 문의 →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
