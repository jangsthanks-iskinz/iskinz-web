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
  borderLight: 'rgba(180,146,78,0.1)',
}

const SERIF     = 'Cormorant Garamond, Georgia, serif'
const CONDENSED = 'Barlow Condensed, sans-serif'

const PRODUCTS = [
  {
    id: 'nctf', type: 'booster', featured: true,
    tag: '⭐ FLAGSHIP', sub: 'Skin Booster', name: 'NCTF 135HA',
    desc: '프랑스 Fillmed 대표 스킨부스터. 135가지 활성 성분으로 피부 세포 재생과 수분 보충을 동시에 촉진합니다.',
    specs: ['3단계 프로토콜 (집중기·강화기·유지기)', '전안면·목·데콜테 적용 가능', '당일 배송 가능'],
  },
  {
    id: 're2o', type: 'booster', featured: false,
    tag: '', sub: 'Skin Booster', name: 'Re2O',
    desc: '레티노이드 기반 피부 재생 부스터. 피부 결 개선 및 항노화 효과를 동시에 제공합니다.',
    specs: ['레티노이드 복합체 함유', '피부 재생 촉진', '표피~진피 동시 작용'],
  },
  {
    id: 'inhilo', type: 'booster', featured: false,
    tag: '', sub: 'Bio Remodelling', name: 'INHILO+',
    desc: '고농도 히알루론산 바이오 리모델링. 피부 전체 탄력 회복 및 자연스러운 리프팅 효과.',
    specs: ['고농도 64mg HA', '전안면 바이오 리모델링', '자연스러운 리프팅'],
  },
  {
    id: 'artf-u', type: 'filler', featured: false,
    tag: 'BESTSELLER', sub: 'Dermal Filler', name: 'Art Filler Universal',
    desc: '중간 깊이 주름 교정용 더말필러. 팔자주름·마리오네트 라인 교정에 최적화되어 있습니다.',
    specs: ['중등도 주름 교정', 'Lidocaine 함유', '중간~심층 진피 주입'],
  },
  {
    id: 'artf-v', type: 'filler', featured: false,
    tag: '', sub: 'Volumizer', name: 'Art Filler Volume',
    desc: '볼·광대·턱 등 볼륨 복원 전용 필러. 안면 윤곽 리모델링에 이상적입니다.',
    specs: ['대용량 볼륨 복원', '안면 윤곽 리모델링', '12개월 이상 지속 효과'],
  },
  {
    id: 'architech', type: 'filler', featured: false,
    tag: '', sub: 'Structural Filler', name: 'ARCHITECH 30',
    desc: '구조적 윤곽 교정 전용 고밀도 필러. 코·턱·광대뼈 등 입체적 조형에 사용합니다.',
    specs: ['고밀도 가교 구조', '골막 위·피하 조직 주입', '안면 구조 조형'],
  },
  {
    id: 'hycoox', type: 'device', featured: false,
    tag: 'NEW', sub: 'Auto Injector', name: 'HYCOOX',
    desc: '자동 멀티포인트 인젝터. NCTF 시술 시간을 단축하고 균일한 주입량을 보장합니다.',
    specs: ['자동 주입 깊이 조절', 'NCTF와 최적 호환', '시술 효율 극대화'],
  },
  {
    id: 'skinperf', type: 'dermo', featured: false,
    tag: '', sub: '더마코스메틱', name: 'Skin Perfusion',
    desc: 'Fillmed 병원 전용 홈케어 라인. 시술 후 회복·유지를 위한 전문 스킨케어 시스템.',
    specs: ['시술 후 케어 최적화', '병원 처방 전용 라인', '다양한 기능성 제품군'],
  },
  {
    id: 'homecare', type: 'dermo', featured: false,
    tag: '', sub: '더마코스메틱', name: 'NCTF 홈케어',
    desc: '병원 전용 NCTF 연계 홈케어. 시술 효과를 집에서 연장하는 전문 케어 라인.',
    specs: ['NCTF 시너지 케어', '의원 처방 전용', '피부 장벽 강화 포뮬라'],
  },
]

const TABS = [
  { id: 'all',     label: '전체' },
  { id: 'booster', label: '스킨부스터' },
  { id: 'filler',  label: '더말필러' },
  { id: 'device',  label: '의료기기' },
  { id: 'dermo',   label: '더마코스메틱' },
]

export function ProductTabs() {
  const [active, setActive] = useState('all')

  const list = active === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.type === active)

  return (
    <div>
      {/* ── Tab bar ── */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 40, borderBottom: `1px solid rgba(180,146,78,0.2)` }}>
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
              padding: '12px 24px',
              marginBottom: -1,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Product grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 2,
      }}>
        {list.map(p => (
          <div
            key={p.id}
            style={{
              background: p.featured ? C.charcoal : C.warmWhite,
              border: `1px solid ${p.featured ? 'rgba(180,146,78,0.3)' : C.borderLight}`,
              padding: '32px 28px',
              position: 'relative',
              transition: 'border-color 0.3s',
            }}
          >
            {p.tag && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: CONDENSED, fontSize: 9, fontWeight: 500,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: p.featured ? '#fff' : C.gold,
                background: p.featured ? 'rgba(180,146,78,0.2)' : C.goldPale,
                padding: '4px 10px', marginBottom: 16,
              }}>
                {p.tag}
              </div>
            )}

            <div style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: p.featured ? C.goldLight : C.gold, marginBottom: 8 }}>
              {p.sub}
            </div>

            <div style={{ fontFamily: SERIF, fontSize: p.featured ? 38 : 30, fontWeight: 300, color: p.featured ? '#fff' : C.charcoal, lineHeight: 1, marginBottom: 16 }}>
              {p.name}
            </div>

            <div style={{ height: 1, background: p.featured ? 'rgba(255,255,255,0.07)' : C.borderLight, marginBottom: 16 }} />

            <p style={{ fontSize: 12.5, fontWeight: 300, lineHeight: 1.8, color: p.featured ? 'rgba(255,255,255,0.55)' : C.mid, marginBottom: 16 }}>
              {p.desc}
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {p.specs.map(s => (
                <li key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: p.featured ? 'rgba(255,255,255,0.4)' : C.muted }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.gold, flexShrink: 0, marginTop: 6 }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
