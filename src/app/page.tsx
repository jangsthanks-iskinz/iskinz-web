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
          프랑스 Fillmed · Vivacy 공식 공급원.<br />
          미용성형 병원을 위한 프리미엄 스킨부스터·필러를<br />
          정품 보증부터 임상 교육, 당일 배송까지 책임집니다.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            'Fillmed 정식 공급원 (프랑스)',
            'Vivacy 정식 공급원 (프랑스)',
            '의료기기판매업 신고 업체',
            '오후 2시 이전 주문 당일 배송',
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
            프랑스 프리미엄<br />
            <em style={{ fontStyle: 'italic', color: C.navy }}>Fillmed × Vivacy</em><br />
            정식 공급원
          </h1>

          {/* 설명 */}
          <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.9, color: C.mid, maxWidth: 420, marginBottom: 48 }}>
            정품 보증 · 임상 교육 · 당일 배송 · 맞춤 제안<br />
            <strong style={{ fontWeight: 500, color: C.charcoal }}>Fillmed · Vivacy 공식 공급원</strong> · CE Marked Products
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
                'Fillmed 정식 공급원 (France)',
                'Vivacy 정식 공급원 (France)',
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
              { text: '의료기기판매업 신고 업체',     hi: false },
              { text: 'Fillmed 정식 공급원',           hi: true  },
              { text: 'Vivacy 정식 공급원',            hi: true  },
              { text: '오후 2시 이전 주문 당일 배송', hi: false },
              { text: '임상 프로토콜 무상 제공',       hi: false },
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
              { icon: '🏆', title: '프랑스 직공급',    desc: 'Fillmed · Vivacy 제조사 직계약 공식 루트 단독 입고. NCTF 135HA, Stylage 전 라인 100% 정품 보증.' },
              { icon: '🚚', title: '오후 2시 당일 배송', desc: '오후 2시 이전 주문 시 전국 병원 당일 배송. 긴급 시술 준비도 문제없습니다.' },
              { icon: '💉', title: '임상 교육 지원',    desc: 'Fillmed Asia Masterclass, Vivacy 시술 프로토콜 교육. 시술 프로토콜·임상 가이드 무상 제공.' },
              { icon: '📋', title: '인허가 완비',        desc: '의료기기판매업·통신판매업·화장품책임판매업 신고 완료. 안심하고 거래하세요.' },
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
                  { name: '의료기기판매업',     desc: '신고 완료' },
                  { name: '통신판매업',          desc: '신고 완료' },
                  { name: '화장품책임판매업',    desc: '등록 완료' },
                  { name: 'Fillmed 정식 공급원', desc: '공식 계약' },
                  { name: 'Vivacy 정식 공급원',  desc: '공식 계약' },
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

      {/* ⑤ Our Brands — Fillmed × Vivacy */}
      <section id="brands" style={{ background: C.charcoal, padding: '100px 0' }}>
        <div className="container mx-auto px-6">
          <FadeIn>
            <Eyebrow light>Our Brands</Eyebrow>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 300, lineHeight: 1.15, color: C.silverLight, marginBottom: 16 }}>
              프랑스가 인정한<br />
              <em style={{ fontStyle: 'italic', color: C.goldLight }}>두 개의 프리미엄 브랜드</em>
            </h2>
            <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: 'rgba(200,205,212,0.55)', marginBottom: 56, maxWidth: 520 }}>
              아이스킨즈는 프랑스 메디컬 에스테틱을 대표하는 Fillmed와 Vivacy의 국내 공식 공급원입니다.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Fillmed 카드 */}
            <FadeIn delay={0}>
              <div style={{ padding: '40px 36px', border: `1px solid rgba(27,56,104,0.5)`, background: 'rgba(27,56,104,0.12)', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                  <div>
                    <div style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.4)', marginBottom: 6 }}>France · Since 1994</div>
                    <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 300, color: C.silverLight, lineHeight: 1 }}>FILLMED</div>
                  </div>
                  <div style={{ padding: '4px 10px', background: 'rgba(27,56,104,0.4)', border: '1px solid rgba(27,56,104,0.6)', fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.6)' }}>
                    Official Supplier
                  </div>
                </div>

                <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.85, color: 'rgba(200,205,212,0.6)', marginBottom: 28 }}>
                  Science &amp; Art of Skin. 135가지 활성 성분을 담은 NCTF 135HA로 전 세계 스킨부스터 시장을 선도하는 프랑스 메디컬 에스테틱 브랜드.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {[
                    { label: '대표 제품', value: 'NCTF 135HA · HYCOOX · Skin Perfusion' },
                    { label: '핵심 기술', value: '135 Active Ingredients Complex' },
                    { label: '적응증',   value: '스킨부스터 · 더말필러 · 자동 인젝터' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                      <span style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.35)', flexShrink: 0, width: 56, paddingTop: 2 }}>{row.label}</span>
                      <span style={{ fontWeight: 300, color: 'rgba(200,205,212,0.65)', lineHeight: 1.6 }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 24, height: 1, background: `rgba(27,56,104,0.8)` }} />
                  <span style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.35)' }}>Fillmed 전 라인 정식 공급</span>
                </div>
              </div>
            </FadeIn>

            {/* Vivacy 카드 */}
            <FadeIn delay={0.1}>
              <div style={{ padding: '40px 36px', border: `1px solid rgba(180,146,78,0.3)`, background: 'rgba(180,146,78,0.06)', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                  <div>
                    <div style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.4)', marginBottom: 6 }}>France · Since 2007</div>
                    <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 300, color: C.silverLight, lineHeight: 1 }}>VIVACY</div>
                  </div>
                  <div style={{ padding: '4px 10px', background: 'rgba(180,146,78,0.15)', border: `1px solid rgba(180,146,78,0.35)`, fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.goldLight }}>
                    Official Supplier
                  </div>
                </div>

                <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.85, color: 'rgba(200,205,212,0.6)', marginBottom: 28 }}>
                  IPN-LIKE 기술과 Mannitol 항산화 복합체로 차별화된 Stylage 라인. Bi-Soft® 시린지로 시술 편의성을 혁신한 프랑스 하이알루론산 필러 전문 브랜드.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {[
                    { label: '대표 제품', value: 'Stylage S · M · X · XL' },
                    { label: '핵심 기술', value: 'IPN-LIKE Tech · Mannitol · Bi-Soft®' },
                    { label: '적응증',   value: '잔주름 · 중등도 주름 · 볼륨 복원 · 심층 볼륨' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                      <span style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.35)', flexShrink: 0, width: 56, paddingTop: 2 }}>{row.label}</span>
                      <span style={{ fontWeight: 300, color: 'rgba(200,205,212,0.65)', lineHeight: 1.6 }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 24, height: 1, background: C.gold }} />
                  <span style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.35)' }}>Vivacy Stylage 전 라인 정식 공급</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ⑥ 제품 라인업 — 탭 필터 */}
      <section id="products" style={{ background: C.warmWhite, padding: '100px 0' }}>
        <div className="container mx-auto px-6">
          <FadeIn>
            <Eyebrow>Product Line</Eyebrow>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 300, lineHeight: 1.15, color: C.charcoal, marginBottom: 8 }}>
              Fillmed · Vivacy<br />
              <em style={{ fontStyle: 'italic', color: C.navy }}>전 라인 공식 공급</em>
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

      {/* ⑦ Academy — 6 프로토콜 카드 */}
      <section id="academy" style={{ background: C.ivory, padding: '100px 0' }}>
        <div className="container mx-auto px-6">
          <FadeIn>
            <Eyebrow>ISKINZ Academy</Eyebrow>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', fontWeight: 300, lineHeight: 1.15, color: C.charcoal, marginBottom: 16 }}>
              의료진을 위한<br />
              <em style={{ fontStyle: 'italic', color: C.navy }}>임상 프로토콜 교육</em>
            </h2>
            <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: C.mid, marginBottom: 56, maxWidth: 520 }}>
              Fillmed · Vivacy 양사의 시술 프로토콜 교육을 아이스킨즈 아카데미에서 제공합니다. 제품별 적응증·주입 기법·병합 시술 전략을 임상 전문가와 함께 배웁니다.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                brand: 'Fillmed',
                brandColor: C.navy,
                brandPale: 'rgba(27,56,104,0.08)',
                accentBorder: C.navy,
                name: 'NCTF 135HA',
                sub: '스킨부스터',
                tag: '⭐ FLAGSHIP',
                desc: '3단계 집중 부스터 프로토콜 (집중기 → 강화기 → 유지기). 135가지 활성 성분의 최적 주입 기법 및 환자별 맞춤 스케줄링.',
                points: ['전안면·목·데콜테 적용법', 'NCTF + 필러 병합 시술', '집중기 주 1회 × 4주'],
              },
              {
                brand: 'Fillmed',
                brandColor: C.navy,
                brandPale: 'rgba(27,56,104,0.08)',
                accentBorder: C.navy,
                name: '나노소프트',
                sub: '나노채널 부스터',
                tag: 'NCTF 변형',
                desc: '나노채널 기반 진피 전달 기술. 미세 주입으로 표피 자극 최소화 · 생체 흡수 극대화 프로토콜.',
                points: ['초미세 32G 나노니들', '눈가·이마 정밀 시술', '민감 피부 적합 프로토콜'],
              },
              {
                brand: 'Vivacy',
                brandColor: C.gold,
                brandPale: C.goldPale,
                accentBorder: C.gold,
                name: 'Stylage S',
                sub: '잔주름 교정',
                tag: '14 mg/ml HA',
                desc: '눈가 Crow\'s Feet · 이마 · 구순 주변 표재성 잔주름 교정. IPN-LIKE 기술 + Mannitol 항산화 복합체.',
                points: ['눈가·이마 표재성 주름', '32G 니들 표피~중간 진피', 'Mannitol 항산화 지속'],
              },
              {
                brand: 'Vivacy',
                brandColor: C.gold,
                brandPale: C.goldPale,
                accentBorder: C.gold,
                name: 'Stylage M',
                sub: '중등도 주름 교정',
                tag: '20 mg/ml HA · POPULAR',
                desc: '팔자주름 · 마리오네트 라인 중등도 교정. Lidocaine 함유로 시술 편의성 향상. Bi-Soft® 시린지.',
                points: ['팔자주름·마리오네트 주력', 'Lidocaine 포함 시술 편의', '중간~심층 진피 주입'],
              },
              {
                brand: 'Vivacy',
                brandColor: C.gold,
                brandPale: C.goldPale,
                accentBorder: C.gold,
                name: 'Stylage XL',
                sub: '볼륨 복원',
                tag: '20 mg/ml HA',
                desc: '광대 · 뺨 · V라인 대용량 볼륨 복원. 안면 윤곽 리모델링 프로토콜. 피하조직 이상 주입.',
                points: ['광대·뺨·V라인 볼륨 복원', '안면 윤곽 리모델링', '피하조직~심층 진피'],
              },
              {
                brand: 'Vivacy',
                brandColor: C.gold,
                brandPale: C.goldPale,
                accentBorder: C.gold,
                name: 'Stylage XXL',
                sub: '최대 볼륨 교정',
                tag: '20 mg/ml HA · MAX',
                desc: '심층 안면 함몰 최고 교정력. 대용량 볼륨 손실 복원 및 12개월 이상 지속 효과 프로토콜.',
                points: ['심층 안면 함몰 교정', '12개월 이상 지속', '심층 진피·피하조직'],
              },
            ].map((card, i) => (
              <FadeIn key={card.name} delay={i * 0.07}>
                <div style={{ padding: '32px 28px', border: `1px solid rgba(180,146,78,0.12)`, borderTop: `3px solid ${card.accentBorder}`, background: C.warmWhite, height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* 브랜드 뱃지 */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '3px 8px', background: card.brandPale, color: card.brandColor, border: `1px solid ${card.brandColor === C.navy ? 'rgba(27,56,104,0.2)' : 'rgba(180,146,78,0.25)'}` }}>
                      {card.brand}
                    </span>
                    <span style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '3px 8px', background: card.brandPale, color: card.brandColor }}>
                      {card.tag}
                    </span>
                  </div>

                  {/* 제품명 */}
                  <div>
                    <div style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>{card.sub}</div>
                    <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 300, color: C.charcoal, lineHeight: 1 }}>{card.name}</div>
                  </div>

                  <div style={{ height: 1, background: 'rgba(180,146,78,0.1)' }} />

                  {/* 설명 */}
                  <p style={{ fontSize: 12.5, fontWeight: 300, lineHeight: 1.8, color: C.mid, flex: 1 }}>{card.desc}</p>

                  {/* 핵심 포인트 */}
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {card.points.map(pt => (
                      <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12, color: C.muted }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: card.accentBorder, flexShrink: 0, marginTop: 6 }} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* CTA */}
          <FadeIn>
            <div style={{ marginTop: 48, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 28px', fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', background: C.charcoal, color: '#fff', textDecoration: 'none' }}>
                교육 문의하기
              </a>
              <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 28px', fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', background: 'transparent', color: C.charcoal, border: `1px solid rgba(26,26,28,0.28)`, textDecoration: 'none' }}>
                전체 일정 보기
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ⑧ About — 다크 차콜 (대비 섹션) */}
      <section id="about" style={{ background: C.charcoal, padding: '100px 0' }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeIn>
              <Eyebrow light>About ISKINZ</Eyebrow>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 300, lineHeight: 1.2, color: C.silverLight, marginBottom: '1.5rem' }}>
                두 브랜드를 잇는<br />
                <em style={{ fontStyle: 'italic', color: C.goldLight }}>공식 공급원의 신뢰</em>
              </h2>
              <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: 'rgba(200,205,212,0.65)', marginBottom: 16, maxWidth: 440 }}>
                아이스킨즈(ISKINZ)는 프랑스 프리미엄 메디컬 에스테틱 브랜드 Fillmed · Vivacy의 국내 공식 공급업체입니다. 피부과·성형외과·의원급 의료기관에 스킨부스터, 더말필러, 의료기기를 직공급합니다.
              </p>
              <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.9, color: 'rgba(200,205,212,0.65)', marginBottom: 40, maxWidth: 440 }}>
                프랑스 Fillmed의 NCTF 135HA와 Vivacy의 Stylage 전 라인을 제조사 직계약 공식 루트로만 공급합니다. 100% 정품 보증, 당일 배송, 임상 교육까지 함께합니다.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: '정품 보증',        text: '제조사 직계약 공식 공급 루트' },
                  { title: 'Fillmed 파트너',   text: 'Fillmed 공식 계약 공급원' },
                  { title: 'Vivacy 파트너',    text: 'Vivacy Stylage 공식 공급원' },
                  { title: '교육 지원',         text: '임상 프로토콜·Academy 프로그램 운영' },
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
                  { num: '2개',  label: '프랑스 브랜드 공식 공급' },
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

      {/* ⑨ B2B CTA — 네이비 그라디언트 */}
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

      {/* ⑩ Contact */}
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
