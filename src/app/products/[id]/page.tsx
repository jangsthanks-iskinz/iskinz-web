import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

const C = {
  charcoal: '#1e2025', silver: '#c8cdd4', silverLight: '#e8ebee',
  silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5', warm: '#b5a99a',
}
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'
const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  const { data: profile } = await supabase.from('profiles').select('approved').eq('id', user.id).single()
  if (!profile?.approved) redirect('/')

  const service = createServiceClient()
  const { data: p } = await service
    .from('products')
    .select('*, categories(name, name_en)')
    .eq('id', params.id)
    .single()

  if (!p) notFound()

  const discount = p.price && p.sale_price ? Math.round((1 - p.sale_price / p.price) * 100) : null

  const accordions = [
    { key: 'product_info', label: '상품정보 제공고시' },
    { key: 'shipping', label: '배송안내' },
    { key: 'refund', label: '교환/반품/환불 안내' },
  ]

  return (
    <div style={{ background: C.offWhite, minHeight: '100vh', paddingTop: 100 }}>
      <div className="container mx-auto px-6 py-16 max-w-5xl">

        <Link href="/products" style={{ fontFamily: PRETENDARD, fontSize: 13, color: C.silverDark, textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>
          ← 상품 목록으로
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* 썸네일 */}
          <div style={{ background: 'white', border: '1px solid #E8E4DD', borderRadius: 12, overflow: 'hidden', aspectRatio: '1' }}>
            {p.image_url ? (
              <img src={p.image_url} alt={p.name_ko} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>📦</div>
            )}
          </div>

          {/* 상품 정보 */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: 12, color: C.accent, fontFamily: CONDENSED, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
              {(p.categories as any)?.name ?? ''}
            </p>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400, color: C.charcoal, marginBottom: 8, lineHeight: 1.2 }}>
              {p.name_ko}
            </h1>
            {p.name_en && (
              <p style={{ fontFamily: CONDENSED, fontSize: 14, color: C.silverDark, letterSpacing: '0.1em', marginBottom: 16 }}>{p.name_en}</p>
            )}
            {p.description && (
              <p style={{ fontFamily: PRETENDARD, fontSize: 14, color: C.silverDark, lineHeight: 1.8, marginBottom: 24 }}>{p.description}</p>
            )}

            {/* 가격 */}
            <div style={{ padding: '20px 0', borderTop: '1px solid #E8E4DD', borderBottom: '1px solid #E8E4DD', marginBottom: 24 }}>
              {p.sale_price ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: C.silverDark, textDecoration: 'line-through', fontFamily: PRETENDARD }}>
                      정가 {p.price?.toLocaleString()}원
                    </span>
                    {discount && (
                      <span style={{ background: '#B84A4A', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 700, fontFamily: PRETENDARD }}>
                        {discount}% 할인
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 700, color: '#B84A4A', fontFamily: PRETENDARD }}>
                    {p.sale_price.toLocaleString()}원
                  </p>
                </div>
              ) : p.price ? (
                <p style={{ fontSize: 28, fontWeight: 700, color: C.charcoal, fontFamily: PRETENDARD }}>
                  {p.price.toLocaleString()}원
                </p>
              ) : null}
            </div>

            {/* 버튼 영역 */}
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href={`/contact?productName=${encodeURIComponent(p.name_ko)}`}
                style={{ flex: 1, padding: '14px 16px', background: 'white', color: C.charcoal, border: 'none', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                문의하기
              </Link>
              <button
                style={{ flex: 1, padding: '14px 24px', background: C.accent, color: 'white', border: 'none', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                장바구니
              </button>
            </div>
          </div>
        </div>

        {/* 상품 상세 설명 */}
        {p.content && (
          <div className="bg-white border mb-6 product-content" style={{ borderColor: '#E8E4DD', borderRadius: 12, padding: 32 }}>
            <style>{`
              .product-content h1 { font-size: 2em; font-weight: 700; margin: 0.5em 0; }
              .product-content h2 { font-size: 1.5em; font-weight: 700; margin: 0.5em 0; }
              .product-content h3 { font-size: 1.2em; font-weight: 700; margin: 0.5em 0; }
              .product-content p { margin: 0.5em 0; line-height: 1.8; }
              .product-content strong { font-weight: 700; }
              .product-content em { font-style: italic; }
              .product-content s { text-decoration: line-through; }
              .product-content ul { padding-left: 1.5em; list-style: disc; margin: 0.5em 0; }
              .product-content ol { padding-left: 1.5em; list-style: decimal; margin: 0.5em 0; }
              .product-content li { margin: 0.25em 0; }
              .product-content img { max-width: 100%; border-radius: 6px; margin: 8px 0; }
              .product-content hr { border: none; border-top: 1px solid #E8E4DD; margin: 16px 0; }
            `}</style>
            <div style={{ fontFamily: PRETENDARD, fontSize: 14, lineHeight: 1.8, color: C.charcoal }}
              dangerouslySetInnerHTML={{ __html: p.content }} />
          </div>
        )}

        {/* 하단 아코디언 */}
        <div className="bg-white border" style={{ borderColor: '#E8E4DD', borderRadius: 12, overflow: 'hidden' }}>
          {accordions.map((a, i) => (
            p[a.key as keyof typeof p] && (
              <details key={a.key} style={{ borderTop: i > 0 ? '1px solid #E8E4DD' : 'none' }}>
                <summary style={{ padding: '18px 24px', cursor: 'pointer', fontFamily: PRETENDARD, fontSize: 15, fontWeight: 600, color: C.charcoal, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {a.label}
                  <span style={{ fontSize: 18, color: C.silverDark }}>›</span>
                </summary>
                <div style={{ padding: '0 24px 20px', whiteSpace: 'pre-wrap', fontFamily: PRETENDARD, fontSize: 13, color: C.silverDark, lineHeight: 1.8 }}>
                  {p[a.key as keyof typeof p] as string}
                </div>
              </details>
            )
          ))}
        </div>

      </div>
    </div>
  )
}
