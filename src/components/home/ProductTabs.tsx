'use client'

import { useState } from 'react'

const C = {
  ivory:       '#F7F3EE',
  warmWhite:   '#FDFBF8',
  charcoal:    '#1A1A1C',
  mid:         '#4B4B4D',
  muted:       '#8A8A8D',
  gold:        '#B4924E',
  goldLight:   '#D4B483',
  goldPale:    'rgba(180,146,78,0.12)',
  navy:        '#1B3868',
  navyPale:    'rgba(27,56,104,0.08)',
  borderLight: 'rgba(180,146,78,0.1)',
}

const SERIF     = 'Cormorant Garamond, Georgia, serif'
const CONDENSED = 'Barlow Condensed, sans-serif'

const PRODUCTS = [
  /* ── Fillmed ── */
  {
    id: 'nctf', brand: 'fillmed', type: 'booster', featured: true,
    brandLabel: 'Fillmed', tag: '⭐ FLAGSHIP', sub: 'Skin Booster',
    name: 'NCTF 135HA Boost', ha: '10 × 3ml 바이알',
    desc: 'Fillmed 대표 스킨부스터. 비타민·미네랄·아미노산 60가지 성분이 피부 세포 재생과 보습을 동시에 촉진합니다.',
    specs: ['3단계 프로토콜 (집중기·강화기·유지기)', '전안면·목·데콜테', '당일 배송 가능'],
  },
  /* ── Fillmed ── */
  {
    id: 'nanosoft', brand: 'fillmed', type: 'device', featured: true,
    brandLabel: 'Fillmed', tag: 'CE & KFDA', sub: 'Microneedle Device',
    name: 'Nanosoft™', ha: '30ea / Box',
    desc: '0.6mm 3핀 마이크로니들. 눈가·입가·목·데콜테 표재성 시술 전용 의료기기. 통증 최소·정확한 진피층 전달.',
    specs: ['0.6mm 3-pin microneedle', '멸균 1회용 30ea', 'CE + KFDA 이중 인증'],
  },
  /* ── Vivacy ── */
  {
    id: 'stylage', brand: 'vivacy', type: 'filler', featured: true,
    brandLabel: 'Vivacy', tag: 'IPN-LIKE', sub: 'Dermal Filler',
    name: 'Stylage', ha: 'S · M · L · XL',
    desc: 'IPN-LIKE 기술 + Mannitol 항산화. 잔주름부터 심층 볼륨 복원까지 적응증별 4가지 라인.',
    specs: ['Stylage S — 잔주름 16 mg/ml', 'Stylage M — 팔자주름 20 mg/ml', 'Stylage L — 볼륨 복원 24 mg/ml', 'Stylage XL — 심층 볼륨 26 mg/ml'],
  },
]

const TABS = [
  { id: 'all',     label: '전체' },
  { id: 'fillmed', label: 'Fillmed' },
  { id: 'vivacy',  label: 'Vivacy' },
  { id: 'filler',  label: '필러' },
]

export function ProductTabs() {
  const [active, setActive] = useState('all')

  const list = active === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.brand === active || p.type === active)

  return (
    <div>
      {/* ── 탭 바 ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, marginBottom: 40, borderBottom: `1px solid rgba(180,146,78,0.2)` }}>
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
              padding: '12px 22px',
              marginBottom: -1,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── 제품 그리드 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 2 }}>
        {list.map(p => {
          const isVivacy = p.brand === 'vivacy'
          const cardBg = p.featured ? C.charcoal : C.warmWhite
          const textColor = p.featured ? '#fff' : C.charcoal
          const subColor = p.featured ? (isVivacy ? C.goldLight : 'rgba(255,255,255,0.6)') : (isVivacy ? C.gold : C.navy)
          const descColor = p.featured ? 'rgba(255,255,255,0.55)' : C.mid
          const specColor = p.featured ? 'rgba(255,255,255,0.4)' : C.muted
          const divColor = p.featured ? 'rgba(255,255,255,0.07)' : 'rgba(180,146,78,0.1)'

          return (
            <div key={p.id} style={{ background: cardBg, border: `1px solid ${p.featured ? 'rgba(180,146,78,0.3)' : 'rgba(180,146,78,0.1)'}`, padding: '32px 28px', transition: 'border-color 0.3s' }}>
              {/* 브랜드 뱃지 */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '3px 8px', background: isVivacy ? C.goldPale : C.navyPale, color: isVivacy ? C.gold : C.navy, border: `1px solid ${isVivacy ? 'rgba(180,146,78,0.25)' : 'rgba(27,56,104,0.2)'}` }}>
                  {p.brandLabel}
                </span>
                {p.tag && (
                  <span style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '3px 8px', background: p.featured ? 'rgba(180,146,78,0.2)' : C.goldPale, color: p.featured ? '#fff' : C.gold }}>
                    {p.tag}
                  </span>
                )}
              </div>

              <div style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: subColor, marginBottom: 8 }}>{p.sub}</div>
              <div style={{ fontFamily: SERIF, fontSize: p.featured ? 36 : 30, fontWeight: 300, color: textColor, lineHeight: 1, marginBottom: 8 }}
                dangerouslySetInnerHTML={{ __html: p.name.replace(/®/g, '<sup style="font-size:0.55em;vertical-align:super;">®</sup>') }}
              />
              <div style={{ fontFamily: CONDENSED, fontSize: 12, letterSpacing: '0.1em', color: p.featured ? C.goldLight : C.gold, marginBottom: 16 }}>{p.ha}</div>
              <div style={{ height: 1, background: divColor, marginBottom: 16 }} />
              <p style={{ fontSize: 12.5, fontWeight: 300, lineHeight: 1.8, color: descColor, marginBottom: 16 }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {p.specs.map(s => (
                  <li key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: specColor }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: isVivacy ? C.gold : C.navy, flexShrink: 0, marginTop: 6 }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
