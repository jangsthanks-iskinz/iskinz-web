'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { FadeIn } from '@/components/ui/FadeIn'
import { SITE } from '@/constants/site'

const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF     = 'Cormorant Garamond, Georgia, serif'

export function ContactSection() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', inquiryType: '', message: '', productName: '' })
  const searchParams = useSearchParams()

  useEffect(() => {
    const productName = searchParams.get('productName')
    if (productName) {
      setForm(v => ({ ...v, inquiryType: '상품 문의', productName, message: `[상품 문의] ${productName}\n\n` }))
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  const contactItems = [
    { label: 'TEL',     value: SITE.phone },
    { label: 'EMAIL',   value: SITE.email },
    { label: 'ADDRESS', value: SITE.address },
    { label: 'HOURS',   value: SITE.businessHours },
  ]

  return (
    <section id="contact" className="py-20" style={{ background: '#f0ede8' }}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── 연락처 정보 ── */}
          <FadeIn className="lg:col-span-2">
            {/* Section label */}
            <div className="flex items-center gap-4 mb-5">
              <div style={{ width: 28, height: 1, background: '#4a6fa5', flexShrink: 0 }} />
              <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#4a6fa5' }}>
                CONTACT US
              </span>
            </div>

            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 2.8vw, 2.4rem)', fontWeight: 400, color: '#1e2025', lineHeight: 1.2, marginBottom: '1rem' }}>
              병원 전용<br />상담 문의
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#8a9099', lineHeight: 1.9 }}>
              제품 구매 문의, 클리닉 납품 상담, 브랜드 파트너십까지 —<br />전문 상담팀이 빠르게 답변드립니다.
            </p>

            <div className="flex flex-col gap-4">
              {contactItems.map(item => (
                <div key={item.label} className="flex gap-4 items-start">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border text-xs"
                    style={{ borderColor: 'rgba(74,111,165,0.25)', background: 'rgba(74,111,165,0.05)', borderRadius: 0, color: '#4a6fa5', fontFamily: CONDENSED, letterSpacing: '0.15em' }}>
                    {item.label.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#4a6fa5', marginBottom: '0.15rem' }}>
                      {item.label}
                    </p>
                    <p className="text-sm font-medium" style={{ color: '#1e2025' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* ── 문의 폼 ── */}
          <FadeIn delay={0.15} className="lg:col-span-3">
            <div className="bg-white border p-5 sm:p-8" style={{ borderColor: '#d8dce2', borderRadius: 0 }}>
              {/* Top accent line */}
              <div className="h-px -mx-5 sm:-mx-8 -mt-5 sm:-mt-8 mb-6" style={{ background: '#4a6fa5' }} />

              <h3 style={{ fontFamily: SERIF, fontSize: '1.35rem', fontWeight: 400, color: '#1e2025', marginBottom: '0.25rem' }}>상담 신청하기</h3>
              <p className="text-xs mb-6" style={{ color: '#8a9099' }}>양식을 작성하시면 24시간 내에 담당자가 연락드립니다.</p>

              {success ? (
                <div className="text-center py-10">
                  <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center border"
                    style={{ borderColor: 'rgba(74,111,165,0.4)', background: 'rgba(74,111,165,0.06)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a6fa5" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p className="font-medium text-base mb-1" style={{ fontFamily: CONDENSED, letterSpacing: '0.08em', color: '#1e2025' }}>문의가 접수되었습니다</p>
                  <p className="text-sm" style={{ color: '#8a9099' }}>24시간 내에 연락드리겠습니다.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'name',  label: '담당자명', type: 'text', placeholder: '홍길동' },
                      { id: 'phone', label: '연락처',   type: 'tel',  placeholder: '010-0000-0000' },
                    ].map(f => (
                      <div key={f.id}>
                        <label className="block mb-1.5"
                          style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3a3d44' }}>
                          {f.label} *
                        </label>
                        <input
                          type={f.type}
                          placeholder={f.placeholder}
                          required
                          value={form[f.id as keyof typeof form]}
                          onChange={e => setForm(v => ({ ...v, [f.id]: e.target.value }))}
                          className="w-full px-3 py-2.5 border text-sm outline-none transition-all"
                          style={{ borderColor: '#d8dce2', background: '#f5f4f1', borderRadius: 0 }}
                          onFocus={e => { e.target.style.borderColor = '#4a6fa5' }}
                          onBlur={e => { e.target.style.borderColor = '#d8dce2' }}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block mb-1.5"
                      style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3a3d44' }}>
                      이메일 *
                    </label>
                    <input
                      type="email"
                      placeholder="example@hospital.com"
                      required
                      value={form.email}
                      onChange={e => setForm(v => ({ ...v, email: e.target.value }))}
                      className="w-full px-3 py-2.5 border text-sm outline-none transition-all"
                      style={{ borderColor: '#d8dce2', background: '#f5f4f1', borderRadius: 0 }}
                      onFocus={e => { e.target.style.borderColor = '#4a6fa5' }}
                      onBlur={e => { e.target.style.borderColor = '#d8dce2' }}
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5"
                      style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3a3d44' }}>
                      문의 유형
                    </label>
                    <select
                      value={form.inquiryType}
                      onChange={e => setForm(v => ({ ...v, inquiryType: e.target.value }))}
                      className="w-full px-3 py-2.5 border text-sm outline-none transition-all cursor-pointer"
                      style={{ borderColor: '#d8dce2', background: '#f5f4f1', borderRadius: 0 }}
                    >
                      <option value="">선택해 주세요</option>
                      {['상품 문의', 'NCTF 135HA 구매 문의', '더말필러 구매 문의', '의료기기 문의', '병원 납품 상담', '브랜드 파트너십', 'Academy 신청', '기타 문의'].map(o => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1.5"
                      style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#3a3d44' }}>
                      문의 내용 *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="병원명, 구매 희망 제품, 수량 등을 함께 적어주시면 빠르게 안내해 드립니다."
                      required
                      value={form.message}
                      onChange={e => setForm(v => ({ ...v, message: e.target.value }))}
                      className="w-full px-3 py-2.5 border text-sm outline-none transition-all resize-none"
                      style={{ borderColor: '#d8dce2', background: '#f5f4f1', borderRadius: 0 }}
                      onFocus={e => { e.target.style.borderColor = '#4a6fa5' }}
                      onBlur={e => { e.target.style.borderColor = '#d8dce2' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 text-[11px] transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                    style={{ fontFamily: CONDENSED, letterSpacing: '0.25em', textTransform: 'uppercase', background: '#1e2025', color: '#e8ebee', borderRadius: 0 }}
                  >
                    {loading ? '전송 중...' : '문의 보내기 →'}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
