'use client'

import { useState } from 'react'
import Link from 'next/link'

const C = {
  ivory:      '#F7F3EE',
  warmWhite:  '#FDFBF8',
  charcoal:   '#1A1A1C',
  mid:        '#4B4B4D',
  muted:      '#8A8A8D',
  gold:       '#B4924E',
  goldLight:  '#D4B483',
  goldPale:   'rgba(180,146,78,0.12)',
  navy:       '#1B3868',
  navyPale:   'rgba(27,56,104,0.08)',
  border:     'rgba(180,146,78,0.15)',
  silver:     '#c8cdd4',
}
const SERIF     = 'Cormorant Garamond, Georgia, serif'
const CONDENSED = 'Barlow Condensed, sans-serif'

/* ─── 제품 데이터 ─── */
const PRODUCTS = [
  /* NCTF */
  {
    id: 'nctf-1x1',
    category: 'nctf',
    brand: 'Fillmed',
    brandColor: C.navy,
    name: 'NCTF® 135 HA',
    sub: '1 × 1ml',
    tag: 'FLAGSHIP',
    desc: '135가지 활성 성분 + Free HA 5mg/ml. 피부 세포 재생·수분·탄력 동시 개선.',
    specs: ['HA 5 mg/ml + 60 active ingredients', '1×1ml prefilled syringe', 'CE Marked · Fillmed 정품'],
    bg: 'linear-gradient(145deg, #1B3868 0%, #0D1E3A 100%)',
  },
  {
    id: 'nctf-5x1',
    category: 'nctf',
    brand: 'Fillmed',
    brandColor: C.navy,
    name: 'NCTF® 135 HA',
    sub: '5 × 1ml',
    tag: 'PACK',
    desc: '집중 프로토콜용 5본 팩. 3단계 시술 (집중기·강화기·유지기) 에 최적화.',
    specs: ['5×1ml 멀티 팩', '집중기 4주 프로토콜 대응', 'CE Marked · Fillmed 정품'],
    bg: 'linear-gradient(145deg, #243E70 0%, #1B3868 100%)',
  },
  /* 나노소프트 */
  {
    id: 'nanosoft-30',
    category: 'nanosoft',
    brand: 'Fillmed',
    brandColor: C.navy,
    name: 'Nanosoft™',
    sub: '30ea / Box',
    tag: 'CE & KFDA',
    desc: '0.6mm 3핀 마이크로니들. 눈가·입가·목·데콜테 표재성 시술 전용 의료기기.',
    specs: ['0.6mm 3-pin microneedle', '30ea 멸균 1회용', 'CE + KFDA 이중 인증'],
    bg: 'linear-gradient(145deg, #2A4F8A 0%, #1B3868 100%)',
  },
  /* Stylage */
  {
    id: 'stylage-s',
    category: 'stylage',
    brand: 'Vivacy',
    brandColor: C.gold,
    name: 'Stylage® S',
    sub: '14 mg/ml HA',
    tag: '잔주름',
    desc: '눈가·이마·구순 주변 표재성 잔주름. IPN-LIKE + Mannitol 항산화.',
    specs: ['14 mg/ml HA', '32G 표재성 주입', 'CE Marked · Vivacy 정품'],
    bg: 'linear-gradient(145deg, #8A6830 0%, #B4924E 100%)',
  },
  {
    id: 'stylage-m',
    category: 'stylage',
    brand: 'Vivacy',
    brandColor: C.gold,
    name: 'Stylage® M',
    sub: '20 mg/ml HA',
    tag: 'POPULAR',
    desc: '팔자주름·마리오네트 라인. Lidocaine 함유로 통증 최소화.',
    specs: ['20 mg/ml HA + Lidocaine', '27G 중간~심층 진피', 'CE Marked · Vivacy 정품'],
    bg: 'linear-gradient(145deg, #9A7838 0%, #C4A256 100%)',
  },
  {
    id: 'stylage-xl',
    category: 'stylage',
    brand: 'Vivacy',
    brandColor: C.gold,
    name: 'Stylage® XL',
    sub: '20 mg/ml HA',
    tag: '볼륨 복원',
    desc: '광대·뺨·V라인 볼륨 복원. Lidocaine 함유. 캐뉼라 시술 권장.',
    specs: ['20 mg/ml HA + Lidocaine', '25G 심층 진피~피하', '12~15개월 지속'],
    bg: 'linear-gradient(145deg, #AA8840 0%, #D4A866 100%)',
  },
  {
    id: 'stylage-xxl',
    category: 'stylage',
    brand: 'Vivacy',
    brandColor: C.gold,
    name: 'Stylage® XXL',
    sub: '20 mg/ml HA',
    tag: 'MAX 볼륨',
    desc: '심층 안면 함몰 최대 교정. 대용량 볼륨 손실 복원. 12개월 이상 지속.',
    specs: ['20 mg/ml HA', '23G 피하조직 이상', '12개월 이상 지속'],
    bg: 'linear-gradient(145deg, #B89848 0%, #E4B870 100%)',
  },
]

const TABS = [
  { id: 'all',      label: '전체' },
  { id: 'nctf',     label: 'NCTF' },
  { id: 'nanosoft', label: '나노소프트' },
  { id: 'stylage',  label: 'Stylage' },
]

export default function ProductsPage() {
  const [active, setActive] = useState('all')
  const list = active === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === active)

  return (
    <div style={{ background: C.ivory, minHeight: '100vh', paddingTop: 100 }}>
      <div className="container mx-auto px-6 py-16">

        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: C.gold }} />
            <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold }}>
              OUR PRODUCTS
            </span>
            <div style={{ width: 28, height: 1, background: C.gold }} />
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 300, color: C.charcoal, marginBottom: 8 }}>
            프리미엄 메디컬 에스테틱
          </h1>
          <p style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted }}>
            Fillmed · Vivacy 정식 공급 · 가격은 문의 후 안내
          </p>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, marginBottom: 48, borderBottom: `1px solid ${C.border}`, justifyContent: 'center' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              style={{
                fontFamily: CONDENSED,
                fontSize: 11,
                fontWeight: 400,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: active === tab.id ? C.gold : C.muted,
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${active === tab.id ? C.gold : 'transparent'}`,
                padding: '12px 28px',
                marginBottom: -1,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 제품 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {list.map(p => (
            <div
              key={p.id}
              style={{
                background: C.warmWhite,
                border: `1px solid ${C.border}`,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* 제품 이미지 영역 */}
              <div style={{ background: p.bg, padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6 }}>
                  <span style={{ fontFamily: CONDENSED, fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '3px 7px', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {p.brand}
                  </span>
                  <span style={{ fontFamily: CONDENSED, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '3px 7px', background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                    {p.tag}
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                    {p.category === 'nanosoft' ? 'Microneedle Device' : p.category === 'nctf' ? 'Skin Booster' : 'Dermal Filler'}
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: '#fff', lineHeight: 1, marginBottom: 6 }}>
                    {p.name}
                  </div>
                  <div style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.65)' }}>
                    {p.sub}
                  </div>
                </div>
              </div>

              {/* 카드 본문 */}
              <div style={{ padding: '20px 20px 0', flex: 1 }}>
                <p style={{ fontSize: 12.5, fontWeight: 300, lineHeight: 1.75, color: C.mid, marginBottom: 14 }}>
                  {p.desc}
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                  {p.specs.map(s => (
                    <li key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11.5, color: C.muted }}>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: p.brandColor, flexShrink: 0, marginTop: 5 }} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 구매하기 버튼 */}
              <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ height: 1, background: C.border, marginBottom: 4 }} />
                <p style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted }}>
                  가격 · 병원 회원 승인 후 개별 안내
                </p>
                <Link
                  href={`/contact?productName=${encodeURIComponent(p.name + ' ' + p.sub)}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px 16px',
                    background: p.brandColor === C.gold
                      ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`
                      : C.navy,
                    color: '#fff',
                    fontFamily: CONDENSED,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}
                >
                  구매하기 →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 안내 */}
        <div style={{ marginTop: 64, textAlign: 'center', padding: '40px 32px', border: `1px solid ${C.border}`, background: C.warmWhite }}>
          <p style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 12 }}>
            B2B 병원 전용 공급
          </p>
          <p style={{ fontFamily: SERIF, fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontWeight: 300, color: C.charcoal, marginBottom: 20 }}>
            가격 및 상세 사양은 담당자가 직접 안내드립니다
          </p>
          <Link
            href="/#contact"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 32px', fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', background: C.charcoal, color: '#fff', textDecoration: 'none' }}
          >
            견적 문의하기
          </Link>
        </div>

      </div>
    </div>
  )
}
