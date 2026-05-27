import { FadeIn } from '@/components/ui/FadeIn'
import { ContactSection } from '@/components/home/ContactSection'
import { HomeLoginForm } from '@/components/home/HomeLoginForm'
import { ProductTabs } from '@/components/home/ProductTabs'
import { createClient } from '@/lib/supabase/server'
import { SITE } from '@/constants/site'
import { NewsFeed } from '@/components/NewsFeed'

/* ─── Design Tokens — Ivory · Gold · Navy ─── */
const C = {
  ivory:       '#F7F3EE',
  warmWhite:   '#FDFBF8',
  charcoal:    '#1A1A1C',
  charcoalDeep:'#08111F',
  mid:         '#4B4B4D',
  muted:       '#8A8A8D',
  gold:        '#B4924E',
  goldLight:   '#D4B483',
  goldPale:    'rgba(180,146,78,0.12)',
  navy:        '#1B3868',
  navyMid:     '#2A4F8A',
  silver:      '#c8cdd4',
  silverLight: '#e8ebee',
  border:      'rgba(180,146,78,0.2)',
  borderLight: 'rgba(180,146,78,0.1)',
}

const SERIF     = 'Cormorant Garamond, Georgia, serif'
const CONDENSED = 'Barlow Condensed, sans-serif'

/* ─── 섹션 아이브로우 ─── */
function Eyebrow({ children, light = false }: { children: string; light?: boolean }) {
  const color = light ? C.goldLight : C.gold
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
      <span style={{ fontFamily: CONDENSED, fontSize: 10, fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase' as const, color }}>
        {children}
      </span>
      <div style={{ width: 36, height: 1, background: color, flexShrink: 0 }} />
    </div>
  )
}

/* ════════════════════════════════════════════════
   게스트 페이지 (비로그인 / 미승인)
════════════════════════════════════════════════ */
function GuestPage({ isPending }: { isPending: boolean }) {
  return (
    <div className="min-h-screen flex flex-col lg:grid" style={{ gridTemplateColumns: '1fr 420px', background: C.ivory }}>

      {/* 왼쪽: 브랜드 소개 */}
      <div className="hidden lg:flex flex-col justify-center" style={{ padding: '100px 56px 80px 80px' }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: SERIF, fontSize: 'clamp(1.5rem, 2vw, 2rem)', letterSpacing: '0.16em', color: C.charcoal, marginBottom: 6 }}>
            ISKINZ
          </div>
          <div style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: C.muted }}>
            Medical Aesthetic Supply
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 28, height: 1, background: C.gold }} />
          <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.gold }}>
            B2B Hospital Exclusive
          </span>
        </div>

        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 3.2vw, 3rem)', fontWeight: 400, lineHeight: 1.2, color: C.charcoal, marginBottom: '1.5rem' }}>
          미용성형 시술 병원과<br />
          함께 성장하는 파트너<br />
          <em style={{ color: C.navy, fontStyle: 'italic' }}>아이스킨즈</em>
        </h1>

        <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: C.mid, maxWidth: 420, marginBottom: 40 }}>
          미용성형 병원을 위한 프리미엄 에스테틱 제품,<br />
          의약품, 의료기기, 의료소모품을 전문적으로 공급합니다.<br />
          정품 보증부터 임상 교육, 맞춤 제안까지.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            'Fillmed 정식 공급원 (프랑스)',
            '의료기기판매업 신고 업체',
            '오후 2시 이전 주문 당일 배송',
            '임상 프로토콜 무상 제공',
          ].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: C.mid }}>
              <span style={{ color: C.gold, fontFamily: CONDENSED }}>—</span> {t}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 24, fontSize: 12, color: C.muted }}>
          <span>{SITE.phone}</span>
          <span>{SITE.email}</span>
        </div>
      </div>

      {/* 오른쪽: 로그인 카드 */}
      <div className="flex flex-col justify-center items-center" style={{ padding: 'clamp(100px,10vw,120px) 40px 80px', background: C.warmWhite, borderLeft: `1px solid ${C.borderLight}` }}>

        {/* 모바일 로고 */}
        <div className="lg:hidden mb-10 text-center">
          <div style={{ fontFamily: SERIF, fontSize: '2rem', letterSpacing: '0.14em', color: C.charcoal }}>ISKINZ</div>
          <div style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginTop: 4 }}>Medical Aesthetic Supply</div>
        </div>

        <div style={{ width: '100%', maxWidth: 340, padding: 40, background: '#fff', border: `1px solid ${C.borderLight}` }}>
          {isPending ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 44, height: 44, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.border}`, background: C.goldPale }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke={C.gold} strokeWidth="1.5"/>
                  <path d="M12 7v6" stroke={C.gold} strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="16.5" r="1" fill={C.gold}/>
                </svg>
              </div>
              <h2 style={{ fontFamily: CONDENSED, letterSpacing: '0.1em', fontSize: 15, color: C.charcoal, marginBottom: 8 }}>승인 검토 중</h2>
              <p style={{ fontSize: 13, fontWeight: 300, color: C.mid, lineHeight: 1.8, marginBottom: 20 }}>
                회원가입 신청이 완료되었습니다.<br />
                담당자 검토 후 <strong style={{ color: C.charcoal }}>24시간 이내</strong>에 연락드립니다.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', background: C.goldPale, color: C.gold, border: `1px solid ${C.border}` }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.gold }} />
                승인 대기 중
              </div>
              <p style={{ marginTop: 20, fontSize: 12, color: C.muted }}>문의: {SITE.phone}</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, marginBottom: 8 }}>Partner Login</div>
                <h2 style={{ fontFamily: SERIF, fontSize: '1.8rem', fontWeight: 400, color: C.charcoal, marginBottom: 6 }}>환영합니다</h2>
                <p style={{ fontSize: 12, fontWeight: 300, color: C.muted }}>승인된 의료기관 및 파트너 전용 서비스입니다.</p>
              </div>
              <HomeLoginForm />
            </>
          )}
        </div>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12, color: C.muted }}>
          <p>{SITE.phone}</p>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   승인 회원 — 전체 홈페이지
════════════════════════════════════════════════ */
function ApprovedPage() {
  return (
    <>
      {/* ① 히어로 — 2컬럼 스플릿 */}
      <section
        className="flex flex-col lg:grid min-h-screen"
        style={{ gridTemplateColumns: '55% 45%', paddingTop: 72 }}
      >
        {/* ── 왼쪽: 아이보리 텍스트 패널 ── */}
        <div
          className="flex flex-col justify-center"
          style={{ background: C.ivory, padding: 'clamp(48px,8vw,80px) clamp(32px,5vw,56px) clamp(48px,8vw,80px) clamp(32px,7vw,80px)' }}
        >
          {/* 레이블 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
            <div style={{ width: 32, height: 1, background: C.gold }} />
            <span style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold }}>
              B2B Hospital Exclusive
            </span>
          </div>

          {/* 헤드라인 */}
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(2.8rem, 5vw, 5rem)', fontWeight: 300, lineHeight: 1.06, color: C.charcoal, marginBottom: 28 }}>
            병원이 믿고 맡기는<br />
            <em style={{ fontStyle: 'italic', color: C.navy }}>메디컬 에스테틱</em><br />
            파트너
          </h1>

          {/* 설명 */}
          <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.9, color: C.mid, maxWidth: 420, marginBottom: 48 }}>
            정품 보증 · 임상 교육 · 당일 배송 · 맞춤 제안<br />
            <strong style={{ fontWeight: 500, color: C.charcoal }}>Fillmed 정식 공급원</strong> · CE Marked Products
          </p>

          {/* 통계 */}
          <div style={{ display: 'flex', gap: 36, paddingTop: 28, borderTop: `1px solid ${C.border}`, marginBottom: 48 }}>
            {[
              { num: '500+',  label: '납품 병원·클리닉' },
              { num: '100%',  label: '정품 보증' },
              { num: '오후 2시', label: '당일배송 마감' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: C.navy, lineHeight: 1, marginBottom: 6 }}>{s.num}</div>
                <div style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
            <a
              href="#products"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: CONDENSED, fontSize: 11, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', background: C.navy, padding: '14px 36px', textDecoration: 'none', transition: 'background 0.25s' }}
            >
              제품 보기 →
            </a>
            <a
              href="#contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: CONDENSED, fontSize: 11, fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, textDecoration: 'none' }}
            >
              견적 문의 ↗
            </a>
          </div>
        </div>

        {/* ── 오른쪽: 다크 비주얼 패널 ── */}
        <div
          className="hidden lg:flex flex-col items-center justify-center"
          style={{ background: `linear-gradient(150deg, ${C.navy} 0%, #0D1E3A 45%, ${C.charcoalDeep} 100%)`, padding: '60px 50px', position: 'relative', overflow: 'hidden' }}
        >
          {/* 도트 패턴 */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B4924E' fill-opacity='0.04'%3E%3Cpath d='M20 20.5V18h-1v2.5H16.5v1H19v2.5h1V21h2.5v-1H20z'/%3E%3C/g%3E%3C/svg%3E")` }} />
          {/* 그라디언트 오버레이 */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 30% 60%, rgba(180,146,78,0.07) 0%, transparent 70%)' }} />

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            {/* 장식 오브 */}
            <div style={{ width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(180,146,78,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 14, borderRadius: '50%', border: '1px solid rgba(180,146,78,0.12)' }} />
              <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '1px solid rgba(180,146,78,0.06)' }} />
              <div style={{ width: 130, height: 130, borderRadius: '50%', background: 'linear-gradient(145deg, rgba(180,146,78,0.18), rgba(180,146,78,0.04))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>iSkinz</span>
                <span style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 300, color: C.goldLight, lineHeight: 1 }}>ISKINZ</span>
              </div>
            </div>

            <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', marginBottom: 32, letterSpacing: '0.03em' }}>
              Medical Aesthetic Supply
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Fillmed 정식 공급원',
                'CE Marked · 정품 인증',
                '당일 배송 · 냉장 보관',
                '임상 교육 · 프로토콜 지원',
              ].map(spec => (
                <div key={spec} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: CONDENSED, fontSize: 10, fontWeight: 300, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.42)' }}>
                  <div style={{ width: 18, height: 1, background: C.gold, flexShrink: 0 }} />
                  {spec}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ② 뉴스 피드 */}
      <NewsFeed />

      {/* ③ 신뢰 바 */}
      <section style={{ padding: '14px 0', borderBottom: `1px solid ${C.borderLight}`, background: C.warmWhite }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center" style={{ gap: '8px 40px' }}>
            {[
              { text: '의료기기판매업 신고 업체', hi: false },
              { text: 'Fillmed 정식 공급원',        hi: true  },
              { text: '오후 2시 이전 주문 당일 배송', hi: false },
              { text: '임상 프로토콜 무상 제공',     hi: false },
            ].map(({ text, hi }) => (
              <span key={text} style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: hi ? C.gold : C.muted }}>
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ④ 브랜드 필라 — 아이스킨즈 핵심 강점 */}
      <section style={{ background: C.ivory, padding: '100px 0' }}>
        <div className="container mx-auto px-6">
          <FadeIn>
            <Eyebrow>Why ISKINZ</Eyebrow>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 300, lineHeight: 1.15, color: C.charcoal, marginBottom: 56 }}>
              병원이 아이스킨즈를<br />
              <em style={{ fontStyle: 'italic', color: C.navy }}>선택하는 이유</em>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '🏆', title: 'Fillmed 정식 공급원', desc: '제조사 직계약 공식 루트로만 입고. Art Filler, NCTF 135HA 등 전 품목 100% 정품 보증.' },
              { icon: '🚚', title: '오후 2시 당일 배송', desc: '오후 2시 이전 주문 시 전국 병원 당일 배송. 긴급 시술 준비도 문제없습니다.' },
              { icon: '💉', title: '임상 교육 지원',     desc: 'Fillmed Asia Masterclass, 시술 프로토콜·임상 가이드 무상 제공. 전문성 향상 지원.' },
              { icon: '📋', title: '인허가 완비',         desc: '의료기기판매업·통신판매업·화장품책임판매업 신고 완료. 안심하고 거래하세요.' },
            ].map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.08}>
                <div style={{ padding: 28, border: `1px solid ${C.borderLight}`, background: C.warmWhite, height: '100%', transition: 'border-color 0.25s' }}>
                  <div style={{ fontSize: 22, marginBottom: 14 }}>{p.icon}</div>
                  <h3 style={{ fontFamily: CONDENSED, fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.navy, marginBottom: 10 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.75, color: C.mid }}>
                    {p.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* 인허가 인증 바 */}
          <FadeIn>
            <div style={{ marginTop: 56, paddingTop: 40, borderTop: `1px solid ${C.border}` }}>
              <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
                {[
                  { name: '의료기기판매업',   desc: '신고 완료' },
                  { name: '통신판매업',        desc: '신고 완료' },
                  { name: '화장품책임판매업',  desc: '등록 완료' },
                  { name: 'Fillmed 정식 공급원', desc: '공식 계약' },
                ].map(c => (
                  <div key={c.name} style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: CONDENSED, fontSize: 12, letterSpacing: '0.05em', color: C.charcoal }}>{c.name}</p>
                    <p style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.1em', color: C.gold, marginTop: 4 }}>✓ {c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ⑤ 제품 라인업 — 탭 필터 */}
      <section id="products" style={{ background: C.warmWhite, padding: '100px 0' }}>
        <div className="container mx-auto px-6">
          <FadeIn>
            <Eyebrow>Product Line</Eyebrow>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 300, lineHeight: 1.15, color: C.charcoal, marginBottom: 8 }}>
              병원을 위한 프리미엄<br />
              <em style={{ fontStyle: 'italic', color: C.navy }}>메디컬 에스테틱 라인업</em>
            </h2>
            <p style={{ fontSize: 13, fontWeight: 300, color: C.muted, marginBottom: 48 }}>
              가격 정보는 병원 회원 승인 후 공개됩니다
            </p>
          </FadeIn>

          <ProductTabs />

          <FadeIn>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <a
                href="/products"
                style={{ display: 'inline-flex', alignItems: 'center', fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '13px 32px', color: C.charcoal, border: `1px solid rgba(26,26,28,0.3)`, textDecoration: 'none', transition: 'all 0.25s' }}
              >
                전체 제품 보기
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ⑥ Academy — 아이보리 */}
      <section id="academy" style={{ background: C.ivory, padding: '100px 0' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <Eyebrow>ISKINZ Academy</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, lineHeight: 1.2, color: C.charcoal, marginBottom: '1.25rem' }}>
                의료진의 전문성을<br />한 단계 높이는<br />
                <em style={{ fontStyle: 'italic', color: C.navy }}>교육 프로그램</em>
              </h2>
              <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: C.mid, marginBottom: 36, maxWidth: 420 }}>
                Fillmed Train The Trainers, Asia Masterclass, 국내 세미나·웨비나까지 — 아이스킨즈 아카데미는 의료진의 지속적인 성장을 지원합니다.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 28px', fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', background: C.charcoal, color: '#fff', textDecoration: 'none' }}>
                  전체 일정 보기
                </a>
                <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 28px', fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', background: 'transparent', color: C.charcoal, border: `1px solid rgba(26,26,28,0.28)`, textDecoration: 'none' }}>
                  신청하기
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { date: '2026. 06', tag: 'INTERNATIONAL', title: 'Fillmed Asia Masterclass 2026',    location: '서울 · Grand InterContinental', desc: 'Fillmed 본사 전문가와 함께하는 아시아 최대 규모 스킨부스터 마스터클래스' },
                  { date: '2026. 05', tag: 'WEBINAR',       title: 'NCTF 135HA 시술 프로토콜 웨비나', location: 'Online · Zoom',                  desc: '3단계 프로토콜(집중기 → 강화기 → 유지기) 심화 교육 및 Q&A' },
                  { date: '2026. 07', tag: 'SYMPOSIUM',     title: '콤비네이션 테라피 심포지엄',       location: '부산 · 벡스코',                 desc: 'NCTF + 필러 + PLLA 조합 치료 최신 트렌드 및 임상 발표' },
                ].map((ev, i) => (
                  <div key={ev.title} style={{ display: 'flex', gap: 20, padding: '20px 24px', background: C.warmWhite, border: `1px solid ${C.borderLight}`, borderLeftWidth: 3, borderLeftColor: i === 0 ? C.gold : 'transparent' }}>
                    <div style={{ flexShrink: 0, textAlign: 'center', width: 48 }}>
                      <p style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted }}>{ev.date.split('. ')[0]}</p>
                      <p style={{ fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 400, color: C.gold, lineHeight: 1.1 }}>{ev.date.split('. ')[1]}</p>
                    </div>
                    <div>
                      <span style={{ display: 'inline-block', fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', background: C.goldPale, color: C.gold, padding: '3px 8px', marginBottom: 8 }}>
                        {ev.tag}
                      </span>
                      <h4 style={{ fontSize: 14, fontWeight: 500, color: C.charcoal, marginBottom: 4 }}>{ev.title}</h4>
                      <p style={{ fontSize: 12, fontFamily: CONDENSED, letterSpacing: '0.05em', color: C.gold, marginBottom: 6 }}>↳ {ev.location}</p>
                      <p style={{ fontSize: 12, fontWeight: 300, lineHeight: 1.6, color: C.mid }}>{ev.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ⑦ About — 다크 차콜 (대비 섹션) */}
      <section id="about" style={{ background: C.charcoal, padding: '100px 0' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeIn>
              <Eyebrow light>About ISKINZ</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 300, lineHeight: 1.2, color: C.silverLight, marginBottom: '1.5rem' }}>
                공식 공급원으로서의<br />
                <em style={{ fontStyle: 'italic', color: C.goldLight }}>신뢰와 전문성</em>
              </h2>
              <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: 'rgba(200,205,212,0.65)', marginBottom: 16, maxWidth: 440 }}>
                아이스킨즈(ISKINZ)는 인천 소재 B2B 의료기기·화장품 도매 업체로, 피부과·성형외과·의원급 의료기관에 스킨부스터, 더말필러, 의료기기, 더마코스메틱을 공급합니다.
              </p>
              <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: 'rgba(200,205,212,0.65)', marginBottom: 40, maxWidth: 440 }}>
                주력 품목은 프랑스 Fillmed社의 NCTF 135HA 스킨부스터이며, Art Filler 및 HYCOOX 등 프리미엄 의료기기를 함께 취급합니다.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: '정품 보증',   text: '제조사 직계약 공식 공급 루트' },
                  { title: '공식 파트너', text: 'Fillmed 공식 계약 공급원' },
                  { title: '인허가 완비', text: '의료기기·통신판매·화장품 판매 신고' },
                  { title: '교육 지원',   text: '임상 프로토콜·Academy 프로그램 운영' },
                ].map(v => (
                  <div key={v.title} style={{ paddingLeft: 16, borderLeft: `1px solid ${C.gold}` }}>
                    <p style={{ fontFamily: CONDENSED, fontSize: 12, letterSpacing: '0.05em', color: C.silverLight, marginBottom: 4 }}>{v.title}</p>
                    <p style={{ fontSize: 12, fontWeight: 300, lineHeight: 1.6, color: 'rgba(200,205,212,0.5)' }}>{v.text}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[
                  { num: '500+', label: '납품 병원·클리닉' },
                  { num: '100%', label: 'Fillmed 정식 공급 정품' },
                  { num: '2시',  label: '오후 당일 배송 마감 기준' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '24px 32px', background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(180,146,78,0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: SERIF, fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 300, color: C.gold, lineHeight: 1 }}>{s.num}</div>
                    <div style={{ fontSize: 13, fontWeight: 300, textAlign: 'right', color: 'rgba(200,205,212,0.55)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ⑧ B2B CTA — 네이비 그라디언트 */}
      <section style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #0D1E3A 100%)`, padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40%', right: '-15%', width: 600, height: 600, borderRadius: '50%', border: '1px solid rgba(180,146,78,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-20%', right: '-5%',  width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(180,146,78,0.06)', pointerEvents: 'none' }} />
        <FadeIn>
          <div className="container mx-auto px-6 text-center" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 28, height: 1, background: C.goldLight }} />
              <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.goldLight }}>B2B 병원 전용</span>
              <div style={{ width: 28, height: 1, background: C.goldLight }} />
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 300, color: '#fff', lineHeight: 1.15, marginBottom: '1rem' }}>
              지금, 병원 전용 공급 파트너가<br />되어보세요
            </h2>
            <p style={{ fontSize: 14, fontWeight: 300, margin: '0 auto 48px', maxWidth: 480, color: 'rgba(255,255,255,0.5)', lineHeight: 1.9 }}>
              아이스킨즈는 의료기기판매업 신고 병원 및 의료기관에만 공급합니다.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/signup" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 36px', fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', background: C.gold, color: '#fff', textDecoration: 'none', transition: 'background 0.25s' }}>
                병원 회원가입
              </a>
              <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 36px', fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', textDecoration: 'none' }}>
                견적 문의
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ⑨ Contact */}
      <ContactSection />
    </>
  )
}

/* ════════════════════════════════════════════════
   메인 페이지 (서버 컴포넌트)
════════════════════════════════════════════════ */
export default async function HomePage() {
  let isApproved = false
  let isLoggedIn = false
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      isLoggedIn = true
      const { data: profile } = await supabase
        .from('profiles')
        .select('approved')
        .eq('id', user.id)
        .single()
      isApproved = profile?.approved === true
    }
  } catch {}

  if (isApproved) return <ApprovedPage />
  return <GuestPage isPending={isLoggedIn && !isApproved} />
}
