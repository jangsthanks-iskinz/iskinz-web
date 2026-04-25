'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

const ACCORDION_DEFAULTS = {
  product_info: `[상품정보 제공고시]
- 제품명:
- 제조국:
- 제조사:
- 성분:
- 용량:
- 사용기한:
- 보관방법:`,
  shipping: `[배송안내]
- 배송방법: 택배
- 배송비: 무료 (일부 상품 제외)
- 배송기간: 오후 2시 이전 주문 시 당일 출고
- 도서/산간 지역은 추가 배송비가 발생할 수 있습니다.`,
  refund: `[교환/반품/환불 안내]
- 교환/반품 신청: 수령 후 7일 이내
- 의약품 및 개봉된 상품은 교환/반품 불가
- 고객센터: 010-2580-4489
- 이메일: ceo@iskinz.com`,
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const thumbnailRef = useRef<HTMLInputElement>(null)

  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [accordionOpen, setAccordionOpen] = useState<Record<string, boolean>>({})

  const [form, setForm] = useState({
    name: '', name_en: '', category_id: '', description: '',
    price: '', sale_price: '', stock: '0',
    is_active: true, content: '',
    product_info: ACCORDION_DEFAULTS.product_info,
    shipping: ACCORDION_DEFAULTS.shipping,
    refund: ACCORDION_DEFAULTS.refund,
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data)
    })
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        setForm({
          name: data.name_ko ?? '',
          name_en: data.name_en ?? '',
          category_id: data.category_id ?? '',
          description: data.description ?? '',
          price: data.price?.toString() ?? '',
          sale_price: data.sale_price?.toString() ?? '',
          stock: data.stock_qty?.toString() ?? '0',
          is_active: data.is_active ?? true,
          content: data.content ?? '',
          product_info: data.product_info ?? ACCORDION_DEFAULTS.product_info,
          shipping: data.shipping ?? ACCORDION_DEFAULTS.shipping,
          refund: data.refund ?? ACCORDION_DEFAULTS.refund,
        })
        if (data.image_url) setThumbnailPreview(data.image_url)
      }
      setFetching(false)
    })
  }, [id])

  function handleChange(key: string, value: any) {
    setForm(v => ({ ...v, [key]: value }))
  }

  function calcDiscount() {
    const p = parseInt(form.price)
    const s = parseInt(form.sale_price)
    if (!p || !s || s >= p) return null
    return Math.round((1 - s / p) * 100)
  }

  async function handleThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setThumbnailFile(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) { setError('상품명을 입력해주세요.'); return }
    setLoading(true)
    setError('')

    let image_url = thumbnailPreview
    if (thumbnailFile) {
      const formData = new FormData()
      formData.append('file', thumbnailFile)
      const uploadRes = await fetch('/api/admin/products/upload', { method: 'POST', body: formData })
      if (uploadRes.ok) {
        const { url } = await uploadRes.json()
        image_url = url
      }
    }

    const res = await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name: form.name,
        name_en: form.name_en || null,
        category_id: form.category_id || null,
        description: form.description || null,
        price: form.price ? parseInt(form.price) : null,
        sale_price: form.sale_price ? parseInt(form.sale_price) : null,
        stock: parseInt(form.stock) || 0,
        is_active: form.is_active,
        content: form.content || null,
        image_url,
        product_info: form.product_info,
        shipping: form.shipping,
        refund: form.refund,
      }),
    })

    if (!res.ok) { setError('저장 중 오류가 발생했습니다.'); setLoading(false); return }
    router.push('/admin/products')
  }

  async function handleDelete() {
    const confirmed = window.confirm('이 상품을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.')
    if (!confirmed) return
    const supabase = createClient()
    await supabase.from('products').delete().eq('id', id)
    router.push('/admin/products')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    border: '1px solid #E8E4DD', borderRadius: 6,
    fontSize: 14, fontFamily: PRETENDARD,
    outline: 'none', background: '#fff',
    color: '#1e2025', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: '#8a9099', marginBottom: 6, fontFamily: PRETENDARD,
  }

  const accordions = [
    { key: 'product_info', label: '상품정보 제공고시' },
    { key: 'shipping', label: '배송안내' },
    { key: 'refund', label: '교환/반품/환불 안내' },
  ]

  if (fetching) return <div className="p-8 text-sm" style={{ color: 'var(--text-3)' }}>불러오는 중...</div>

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="text-sm no-underline" style={{ color: 'var(--text-2)' }}>← 상품 목록</Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>상품 수정</h1>
        </div>
        <button onClick={handleDelete}
          style={{ padding: '8px 16px', background: 'rgba(184,74,74,0.1)', color: '#B84A4A', border: '1px solid rgba(184,74,74,0.3)', borderRadius: 6, fontSize: 13, fontWeight: 700, fontFamily: PRETENDARD, cursor: 'pointer' }}>
          상품 삭제
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          <div className="bg-white border p-6" style={{ borderColor: '#E8E4DD', borderRadius: 8 }}>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 20, letterSpacing: 1 }}>기본 정보</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>상품명 (한글) *</label>
                  <input type="text" placeholder="예) NCTF 135HA" required
                    value={form.name} onChange={e => handleChange('name', e.target.value)}
                    style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>상품명 (영문)</label>
                  <input type="text" placeholder="예) NCTF 135HA Skin Booster"
                    value={form.name_en} onChange={e => handleChange('name_en', e.target.value)}
                    style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>카테고리</label>
                <select value={form.category_id} onChange={e => handleChange('category_id', e.target.value)} style={inputStyle}>
                  <option value="">카테고리 선택</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}{c.name_en ? ` (${c.name_en})` : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>상품 설명</label>
                <textarea placeholder="상품에 대한 간단한 설명을 입력해주세요."
                  value={form.description} onChange={e => handleChange('description', e.target.value)}
                  rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>
          </div>

          <div className="bg-white border p-6" style={{ borderColor: '#E8E4DD', borderRadius: 8 }}>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 20, letterSpacing: 1 }}>가격 정보</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>정가 (원)</label>
                <input type="number" placeholder="0" value={form.price} onChange={e => handleChange('price', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>할인가 (원)</label>
                <input type="number" placeholder="0" value={form.sale_price} onChange={e => handleChange('sale_price', e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                {calcDiscount() !== null && (
                  <div style={{ padding: '10px 16px', background: 'rgba(184,74,74,0.1)', border: '1px solid rgba(184,74,74,0.3)', borderRadius: 6 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#B84A4A', fontFamily: PRETENDARD }}>{calcDiscount()}% 할인</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border p-6" style={{ borderColor: '#E8E4DD', borderRadius: 8 }}>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 20, letterSpacing: 1 }}>재고</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>재고 수량</label>
                <input type="number" placeholder="0" value={form.stock} onChange={e => handleChange('stock', e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>판매 상태</label>
                <select value={form.is_active ? 'true' : 'false'} onChange={e => handleChange('is_active', e.target.value === 'true')} style={inputStyle}>
                  <option value="true">판매중</option>
                  <option value="false">숨김</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border p-6" style={{ borderColor: '#E8E4DD', borderRadius: 8 }}>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 20, letterSpacing: 1 }}>썸네일 이미지</h2>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              {thumbnailPreview ? (
                <div style={{ position: 'relative' }}>
                  <img src={thumbnailPreview} alt="썸네일" style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid #E8E4DD' }} />
                  <button type="button" onClick={() => { setThumbnailPreview(null); setThumbnailFile(null) }}
                    style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%', background: '#B84A4A', color: 'white', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                    ✕
                  </button>
                </div>
              ) : (
                <div onClick={() => thumbnailRef.current?.click()}
                  style={{ width: 160, height: 160, border: '2px dashed #E8E4DD', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 8 }}>
                  <span style={{ fontSize: 32 }}>📷</span>
                  <span style={{ fontSize: 12, color: '#8a9099', fontFamily: PRETENDARD }}>클릭하여 업로드</span>
                </div>
              )}
              <input ref={thumbnailRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleThumbnail} />
              <div style={{ fontSize: 13, color: '#8a9099', fontFamily: PRETENDARD, lineHeight: 1.8 }}>
                <p>• 권장 사이즈: 800 x 800px</p>
                <p>• 파일 형식: JPG, PNG, WEBP</p>
                <p>• 최대 용량: 5MB</p>
              </div>
            </div>
          </div>

          <div className="bg-white border p-6" style={{ borderColor: '#E8E4DD', borderRadius: 8 }}>
            <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 20, letterSpacing: 1 }}>상품 상세 설명</h2>
            <textarea placeholder="상품 상세 설명을 입력해주세요."
              value={form.content} onChange={e => handleChange('content', e.target.value)}
              rows={10} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div className="bg-white border" style={{ borderColor: '#E8E4DD', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #E8E4DD', background: '#F8F6F2' }}>
              <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--navy)', letterSpacing: 1 }}>하단 고정 정보</h2>
            </div>
            {accordions.map(a => (
              <div key={a.key} style={{ borderBottom: '1px solid #E8E4DD' }}>
                <button type="button"
                  onClick={() => setAccordionOpen(v => ({ ...v, [a.key]: !v[a.key] }))}
                  style={{ width: '100%', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: 'none', cursor: 'pointer', fontFamily: PRETENDARD, fontSize: 14, fontWeight: 600, color: '#1e2025' }}>
                  {a.label}
                  <span style={{ fontSize: 18, color: '#8a9099', transition: 'transform 0.2s', transform: accordionOpen[a.key] ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
                </button>
                {accordionOpen[a.key] && (
                  <div style={{ padding: '0 24px 16px' }}>
                    <textarea value={form[a.key as keyof typeof form] as string}
                      onChange={e => handleChange(a.key, e.target.value)}
                      rows={6} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div style={{ padding: '12px 16px', border: '1px solid rgba(184,74,74,0.3)', background: 'rgba(184,74,74,0.05)', fontSize: 14, color: '#B84A4A', borderRadius: 6, fontFamily: PRETENDARD }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Link href="/admin/products"
              style={{ padding: '11px 24px', border: '1px solid #E8E4DD', borderRadius: 6, fontSize: 14, fontFamily: PRETENDARD, color: '#8a9099', textDecoration: 'none' }}>
              취소
            </Link>
            <button type="submit" disabled={loading}
              style={{ padding: '11px 32px', background: 'var(--navy)', color: 'white', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, fontFamily: PRETENDARD, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? '저장 중...' : '저장하기'}
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}
