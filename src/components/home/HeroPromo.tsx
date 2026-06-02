'use client'

import { useEffect, useState } from 'react'

const SERIF     = 'Cormorant Garamond, Georgia, serif'
const CONDENSED = 'Barlow Condensed, sans-serif'

const SLIDES = [
  {
    brand: 'FILLMED',
    brandSub: 'FRANCE · SINCE 1978',
    headline: '45+',
    headlineSub: 'YEARS',
    title: 'Years of\nCellular Science',
    desc: '1978년 프랑스에서 시작된 세포 재생 과학.\n세계 70개국 병원에서 선택한 스킨부스터.',
    accent: '#4a6fa5',
    accentLight: 'rgba(74,111,165,0.15)',
    tags: ['NCTF 135 HA', 'Nanosoft™', 'CE Marked'],
    stats: [
      { num: '70+', label: '판매 국가' },
      { num: '13/min', label: '바이알 판매' },
      { num: '45yr', label: '임상 축적' },
    ],
  },
  {
    brand: 'FILLMED',
    brandSub: 'NCTF 135 HA · CELLULAR ACTIVATOR',
    headline: '+256%',
    headlineSub: '',
    title: '콜라겐 생성\n임상 입증',
    desc: '60가지 활성 성분 + Free HA 5mg/ml.\n피부 세포 재생·수분·탄력을 동시에 촉진.',
    accent: '#4a6fa5',
    accentLight: 'rgba(74,111,165,0.15)',
    tags: ['콜라겐 +256%', '섬유아세포 +148%', '탄력 +69%'],
    stats: [
      { num: '+256%', label: '콜라겐 생성' },
      { num: '+148%', label: '섬유아세포' },
      { num: '98%', label: '환자 추천' },
    ],
  },
  {
    brand: 'VIVACY',
    brandSub: 'FRANCE · IPN-LIKE TECHNOLOGY',
    headline: 'STYLAGE',
    headlineSub: '®',
    title: 'S · M · L · XL\n4가지 라인',
    desc: 'IPN-LIKE 기술 + Mannitol 항산화 복합체.\n잔주름부터 심층 볼륨 복원까지.',
    accent: '#B4924E',
    accentLight: 'rgba(180,146,78,0.15)',
    tags: ['Stylage S 16mg/ml', 'Stylage M 20mg/ml', 'Stylage XL 26mg/ml'],
    stats: [
      { num: '16–26', label: 'mg/ml HA 범위' },
      { num: '18+', label: '개월 XL 지속' },
      { num: '3×', label: 'HA 분해 억제' },
    ],
  },
  {
    brand: 'VIVACY',
    brandSub: 'STYLAGE XL · DEEP VOLUMIZING',
    headline: '18+',
    headlineSub: '개월',
    title: 'Published Study\n입증된 지속력',
    desc: 'Mannitol이 HA를 산화로부터 보호.\nJuvederm·Restylane 대비 우위 임상 확인.',
    accent: '#B4924E',
    accentLight: 'rgba(180,146,78,0.15)',
    tags: ['XL 최대 18개월', 'L vs Juvederm 우위', 'CE Marked'],
    stats: [
      { num: '85%', label: 'S 12개월 유지' },
      { num: '93%', label: 'M NLF 교정' },
      { num: '18+', label: 'XL 개월 지속' },
    ],
  },
  {
    brand: 'ISKINZ',
    brandSub: 'FILLMED · VIVACY 공식 공급원',
    headline: '정품',
    headlineSub: '보증',
    title: '프랑스 프리미엄\n국내 공식 공급원',
    desc: '정품 인증부터 임상 교육, 당일 배송까지.\n승인된 의료기관 전용 B2B 공급.',
    accent: '#B4924E',
    accentLight: 'rgba(180,146,78,0.12)',
    tags: ['Fillmed 정식 공급원', 'Vivacy 정식 공급원', '오후 2시 당일 배송'],
    stats: [
      { num: '100%', label: '정품 보증' },
      { num: '2시', label: '당일 배송 마감' },
      { num: 'B2B', label: '병원 전용 공급' },
    ],
  },
]

export function HeroPromo() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % SLIDES.length)
        setVisible(true)
      }, 600)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const s = SLIDES[idx]

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(150deg, #0D1E3A 0%, #111827 55%, #1a1f2e 100%)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 48px',
    }}>

      {/* 배경 격자 패턴 */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(180,146,78,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(180,146,78,0.04) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      {/* 배경 글로우 */}
      <div style={{
        position: 'absolute',
        width: 400, height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${s.accentLight} 0%, transparent 70%)`,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        transition: 'background 0.8s ease',
        pointerEvents: 'none',
      }} />

      {/* 콘텐츠 */}
      <div style={{
        position: 'relative', zIndex: 1,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        width: '100%', maxWidth: 440,
        textAlign: 'center',
      }}>

        {/* 브랜드 레이블 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${s.accent})` }} />
          <span style={{
            fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em',
            textTransform: 'uppercase', color: s.accent,
          }}>{s.brand}</span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${s.accent})` }} />
        </div>

        {/* 큰 숫자/텍스트 */}
        <div style={{ marginBottom: 8 }}>
          <span style={{
            fontFamily: SERIF,
            fontSize: s.headline.length > 6 ? 'clamp(2.8rem,5vw,4.5rem)' : 'clamp(4rem,7vw,6.5rem)',
            fontWeight: 300, color: '#fff', lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            {s.headline}
          </span>
          {s.headlineSub && (
            <span style={{
              fontFamily: CONDENSED, fontSize: 18, color: s.accent,
              marginLeft: 4, verticalAlign: 'super',
            }}>{s.headlineSub}</span>
          )}
        </div>

        {/* 부제목 */}
        <p style={{
          fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: 'rgba(200,205,212,0.4)',
          marginBottom: 24,
        }}>{s.brandSub}</p>

        {/* 타이틀 */}
        <h3 style={{
          fontFamily: SERIF,
          fontSize: 'clamp(1.4rem,2.2vw,2rem)',
          fontWeight: 300, color: '#e8ebee', lineHeight: 1.3,
          marginBottom: 20,
          whiteSpace: 'pre-line',
        }}>{s.title}</h3>

        {/* 설명 */}
        <p style={{
          fontSize: 12.5, fontWeight: 300, lineHeight: 1.85,
          color: 'rgba(200,205,212,0.55)', marginBottom: 32,
          whiteSpace: 'pre-line',
        }}>{s.desc}</p>

        {/* 통계 3개 */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: 1, background: 'rgba(200,205,212,0.06)',
          marginBottom: 24, border: `1px solid rgba(200,205,212,0.06)`,
        }}>
          {s.stats.map(st => (
            <div key={st.label} style={{ padding: '16px 8px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 300, color: s.accent, lineHeight: 1 }}>{st.num}</div>
              <div style={{ fontFamily: CONDENSED, fontSize: 8.5, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.35)', marginTop: 5 }}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* 태그 */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {s.tags.map(t => (
            <span key={t} style={{
              fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em',
              textTransform: 'uppercase', padding: '5px 10px',
              border: `1px solid ${s.accent}33`,
              color: 'rgba(200,205,212,0.45)',
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* 슬라이드 인디케이터 */}
      <div style={{
        position: 'absolute', bottom: 28,
        display: 'flex', gap: 8,
        zIndex: 2,
      }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setVisible(false); setTimeout(() => { setIdx(i); setVisible(true) }, 300) }}
            style={{
              width: i === idx ? 24 : 6,
              height: 2,
              background: i === idx ? SLIDES[i].accent : 'rgba(200,205,212,0.2)',
              border: 'none', padding: 0, cursor: 'pointer',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>

    </div>
  )
}
