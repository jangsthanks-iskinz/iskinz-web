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
    name: 'NCTF 135HA', ha: '135가지 활성 성분',
    desc: 'Fillmed 대표 스킨부스터. 비타민·미네랄·아미노산 135가지 성분이 피부 세포 재생과 보습을 동시에 촉진합니다.',
    specs: ['3단계 프로토콜 (집중기·강화기·유지기)', '전안면·목·데콜테', '당일 배송 가능'],
  },
  {
    id: 're2o', brand: 'fillmed', type: 'booster', featured: false,
    brandLabel: 'Fillmed', tag: '', sub: 'Skin Booster',
    name: 'Re2O', ha: 'Retino-Filler',
    desc: '레티노이드 기반 피부 재생 부스터. 피부 결 개선 및 항노화 효과를 동시에 제공합니다.',
    specs: ['레티노이드 복합체 함유', '피부 재생 촉진', '표피~진피 동시 작용'],
  },
  {
    id: 'artf-u', brand: 'fillmed', type: 'filler', featured: false,
    brandLabel: 'Fillmed', tag: 'BESTSELLER', sub: 'Dermal Filler',
    name: 'Art Filler Universal', ha: '중등도 주름',
    desc: '팔자주름·마리오네트 라인 교정에 최적화된 Fillmed 더말필러. Lidocaine 함유.',
    specs: ['중등도 주름 교정', 'Lidocaine 함유', '중간~심층 진피 주입'],
  },
  {
    id: 'artf-v', brand: 'fillmed', type: 'filler', featured: false,
    brandLabel: 'Fillmed', tag: '', sub: 'Volumizer',
    name: 'Art Filler Volume', ha: '볼륨 복원',
    desc: '볼·광대·턱 등 대용량 볼륨 복원 전용 필러. 심층 진피~피하 조직.',
    specs: ['대용량 볼륨 복원', '안면 윤곽 리모델링', '12개월 이상 지속'],
  },
  {
    id: 'hycoox', brand: 'fillmed', type: 'device', featured: false,
    brandLabel: 'Fillmed', tag: 'NEW', sub: 'Auto Injector',
    name: 'HYCOOX', ha: '자동 주입',
    desc: 'NCTF 시술용 자동 멀티포인트 인젝터. 시술 시간 단축 및 균일한 주입량 보장.',
    specs: ['자동 주입 깊이 조절', 'NCTF와 최적 호환', '시술 효율 극대화'],
  },
  /* ── Vivacy ── */
  {
    id: 'hydromax', brand: 'vivacy', type: 'booster', featured: true,
    brandLabel: 'Vivacy', tag: '⭐ HERO', sub: 'Skin Booster',
    name: 'HydroMax', ha: 'Skin3 Complex',
    desc: 'Vivacy 시그니처 스킨 부스터. Skin3 Complex가 피부 세 개 층에서 동시에 수분·탄력·재생을 촉진합니다.',
    specs: ['진피 메조테라피', '전안면·목·데콜테', 'NCTF와 병행 시술 가능'],
  },
  {
    id: 'sty-s', brand: 'vivacy', type: 'filler', featured: false,
    brandLabel: 'Vivacy', tag: '', sub: 'Fine Lines',
    name: 'Stylage S', ha: '14 mg/ml HA',
    desc: '눈가·이마·구순 주변 표재성 잔주름 교정 전용. IPN-LIKE 기술·Mannitol 함유.',
    specs: ['눈가·이마 잔주름', 'Crow\'s Feet', '표피~중간 진피'],
  },
  {
    id: 'sty-m', brand: 'vivacy', type: 'filler', featured: false,
    brandLabel: 'Vivacy', tag: 'POPULAR', sub: 'Moderate Wrinkles',
    name: 'Stylage M', ha: '20 mg/ml HA',
    desc: '팔자주름·마리오네트 라인 교정. Lidocaine 함유로 시술 편의성 향상.',
    specs: ['팔자주름·마리오네트', 'Lidocaine 함유', '중간~심층 진피'],
  },
  {
    id: 'sty-xl', brand: 'vivacy', type: 'volume', featured: false,
    brandLabel: 'Vivacy', tag: '', sub: 'Volume Restore',
    name: 'Stylage XL', ha: '20 mg/ml HA',
    desc: '광대·뺨·V라인 대용량 볼륨 복원. 안면 윤곽 리모델링에 이상적입니다.',
    specs: ['광대·뺨·턱라인', '안면 윤곽 리모델링', '피하조직 이상 주입'],
  },
  {
    id: 'sty-xxl', brand: 'vivacy', type: 'volume', featured: false,
    brandLabel: 'Vivacy', tag: '', sub: 'Maximum Volume',
    name: 'Stylage XXL', ha: '20 mg/ml HA',
    desc: '심층 안면 함몰 최고 교정력. 대용량 볼륨 손실 복원 및 12개월 이상 지속.',
    specs: ['심층 안면 함몰 교정', '12개월 이상 지속', '심층 진피·피하조직'],
  },
  {
    id: 'skinperf', brand: 'fillmed', type: 'dermo', featured: false,
    brandLabel: 'Fillmed', tag: '', sub: '더마코스메틱',
    name: 'Skin Perfusion', ha: '홈케어',
    desc: 'Fillmed 병원 전용 홈케어 라인. 시술 후 회복·유지를 위한 전문 스킨케어.',
    specs: ['시술 후 케어 최적화', '병원 처방 전용', '다양한 기능성 라인'],
  },
]

const TABS = [
  { id: 'all',     label: '전체' },
  { id: 'fillmed', label: 'Fillmed' },
  { id: 'vivacy',  label: 'Vivacy' },
  { id: 'booster', label: '스킨부스터' },
  { id: 'filler',  label: '필러' },
  { id: 'volume',  label: '볼류마이저' },
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
              <div style={{ fontFamily: SERIF, fontSize: p.featured ? 36 : 30, fontWeight: 300, color: textColor, lineHeight: 1, marginBottom: 8 }}>{p.name}</div>
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
