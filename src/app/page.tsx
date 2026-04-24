import { FadeIn } from '@/components/ui/FadeIn'
import { ContactSection } from '@/components/home/ContactSection'
import { HomeLoginForm } from '@/components/home/HomeLoginForm'
import { createClient } from '@/lib/supabase/server'
import { SITE } from '@/constants/site'

/* ─── Shared style tokens ─── */
const C = {
  charcoal:      '#1e2025',
  charcoalMid:   '#2d3038',
  charcoalDeep:  '#1a1d22',
  silver:        '#c8cdd4',
  silverLight:   '#e8ebee',
  silverDark:    '#8a9099',
  offWhite:      '#f5f4f1',
  accent:        '#4a6fa5',
  warm:          '#b5a99a',
  text:          '#3a3d44',
  muted:         '#5a5f6a',
}

const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF     = 'Cormorant Garamond, Georgia, serif'

function Label({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const color = dark ? C.silverDark : C.accent
  return (
    <div className="flex items-center gap-4 mb-5">
      <div style={{ width: 28, height: 1, background: color, flexShrink: 0 }} />
      <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color }}>
        {children}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   게스트 (비로그인 / 미승인) — 다크 럭셔리 스플릿 레이아웃
───────────────────────────────────────────────────────────── */
function GuestPage({ isPending }: { isPending: boolean }) {
  return (
    <div className="min-h-screen flex items-stretch" style={{ background: C.charcoal, paddingTop: 100, paddingBottom: 80 }}>

      {/* ── 왼쪽: 브랜드 소개 ── */}
      <div className="hidden lg:flex flex-col justify-center px-16 xl:px-24 flex-1">

        <div className="mb-10">
          <span style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 2.8vw, 2.6rem)', fontWeight: 400, letterSpacing: '0.14em', color: C.silverLight }}>
            ISKINZ
          </span>
          <span className="block mt-2" style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: C.silverDark }}>
            Medical Aesthetic Supply
          </span>
        </div>

        <Label>B2B Hospital Exclusive</Label>

        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 3.2vw, 3rem)', fontWeight: 400, lineHeight: 1.2, color: C.silverLight, marginBottom: '1.5rem' }}>
          미용성형 시술 병원과<br />
          함께 성장하는 파트너<br />
          <em style={{ color: C.accent, fontStyle: 'italic' }}>아이스킨즈</em>
        </h1>

        <p className="text-sm leading-relaxed mb-10" style={{ color: C.silverDark, maxWidth: 440, lineHeight: 1.9 }}>
          미용성형 병원을 위한 프리미엄 에스테틱 제품,<br />
          의약품, 의료기기, 의료소모품을 전문적으로 공급합니다.<br />
          정품 보증부터 임상 교육, 맞춤 제안까지.
        </p>

        <div className="flex flex-col gap-3">
          {[
            'Fillmed 정식 공급원 (프랑스)',
            '의료기기판매업 신고 업체',
            '오후 2시 이전 주문 당일 배송',
            '임상 프로토콜 무상 제공',
          ].map(t => (
            <div key={t} className="flex items-center gap-3 text-sm" style={{ color: C.silver }}>
              <span style={{ color: C.accent, fontFamily: CONDENSED }}>—</span> {t}
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 flex gap-6 text-xs" style={{ borderTop: `1px solid rgba(200,205,212,0.1)`, color: C.muted }}>
          <span>{SITE.phone}</span>
          <span>{SITE.email}</span>
        </div>
      </div>

      {/* ── 오른쪽: 로그인 카드 ── */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[440px] xl:w-[480px] flex-shrink-0 px-8 py-12">

        {/* 모바일 로고 */}
        <div className="lg:hidden mb-8 text-center">
          <span style={{ fontFamily: SERIF, fontSize: '2rem', fontWeight: 400, letterSpacing: '0.14em', color: C.silverLight }}>ISKINZ</span>
          <span className="block mt-1" style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.silverDark }}>Medical Aesthetic Supply</span>
        </div>

        <div className="w-full max-w-sm p-8" style={{ background: C.charcoalMid, border: `1px solid rgba(200,205,212,0.12)` }}>
          {isPending ? (
            <div className="text-center py-6">
              <div className="w-11 h-11 mx-auto mb-5 flex items-center justify-center"
                style={{ border: `1px solid rgba(74,111,165,0.4)`, background: 'rgba(74,111,165,0.08)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke={C.accent} strokeWidth="1.5"/>
                  <path d="M12 7v6" stroke={C.accent} strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="16.5" r="1" fill={C.accent}/>
                </svg>
              </div>
              <h2 className="font-medium text-base mb-2" style={{ fontFamily: CONDENSED, letterSpacing: '0.1em', color: C.silverLight }}>승인 검토 중</h2>
              <p className="text-sm leading-relaxed mb-5" style={{ color: C.silverDark }}>
                회원가입 신청이 완료되었습니다.<br />
                담당자 검토 후 <strong style={{ color: C.silver }}>24시간 이내</strong>에 연락드립니다.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 text-[10px]"
                style={{ fontFamily: CONDENSED, letterSpacing: '0.22em', textTransform: 'uppercase', background: 'rgba(74,111,165,0.1)', color: C.accent, border: `1px solid rgba(74,111,165,0.3)` }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.accent }} />
                승인 대기 중
              </div>
              <p className="mt-5 text-xs" style={{ color: C.muted }}>문의: {SITE.phone}</p>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <div style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '1rem', fontWeight: 400, color: '#e8ebee', marginBottom: '0.5rem' }}>환영합니다</div>
                <h2 style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#2563EB', marginBottom: '0.25rem' }}>
                  PARTNER LOGIN
                </h2>
                <p className="text-xs" style={{ color: C.muted }}>
                  승인된 의료기관 및 파트너 전용 서비스입니다.
                </p>
              </div>
              <HomeLoginForm />
            </>
          )}
        </div>

        <div className="mt-5 text-center text-xs" style={{ color: C.muted }}>
          <p>{SITE.phone}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   승인 회원 — 전체 홈페이지 (FILLMED 럭셔리 다크 에스테틱)
───────────────────────────────────────────────────────────── */
function ApprovedPage() {
  return (
    <>
      {/* ① 히어로 — 다크 차콜 */}
      <section
        id="hero"
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-center px-6"
        style={{ paddingTop: 100, paddingBottom: 100, background: C.charcoal }}
      >
        {/* 미세 그리드 오버레이 */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035]" style={{
          backgroundImage: `linear-gradient(rgba(200,205,212,1) 1px,transparent 1px),linear-gradient(90deg,rgba(200,205,212,1) 1px,transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />

        <div className="relative z-10 max-w-4xl w-full">
          {/* 배지 */}
          <div className="inline-flex items-center gap-3 px-6 py-2 mb-12 text-[10px]"
            style={{ fontFamily: CONDENSED, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.silverDark, border: `1px solid rgba(200,205,212,0.16)`, background: 'rgba(200,205,212,0.04)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.accent }} />
            B2B 병원 전용 프리미엄 메디컬 에스테틱
          </div>

          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', fontWeight: 400, lineHeight: 1.08, color: C.silverLight, letterSpacing: '-0.01em', marginBottom: '1.5rem' }}>
            병원이 믿고 맡기는<br />
            <em style={{ color: C.accent, fontStyle: 'italic' }}>메디컬 에스테틱 파트너</em>
          </h1>

          <p className="text-base leading-relaxed max-w-[500px] mx-auto mb-3" style={{ color: C.silverDark }}>
            정품 보증 · 임상 교육 · 당일 배송 · 맞춤 제안
          </p>
          <p className="text-[11px] mb-12" style={{ fontFamily: CONDENSED, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.muted }}>
            Fillmed 정식 공급원 · CE Marked Products
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#products"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-[11px] no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ fontFamily: CONDENSED, letterSpacing: '0.25em', textTransform: 'uppercase', background: C.silverLight, color: C.charcoal, border: `1px solid ${C.silverLight}` }}>
              제품 보기
            </a>
            <a href="#contact"
              className="inline-flex items-center px-8 py-3.5 text-[11px] no-underline transition-all hover:-translate-y-0.5"
              style={{ fontFamily: CONDENSED, letterSpacing: '0.25em', textTransform: 'uppercase', background: 'transparent', color: C.silverLight, border: `1px solid rgba(232,235,238,0.3)` }}>
              견적 문의
            </a>
          </div>
        </div>
      </section>

      {/* ② 신뢰 바 */}
      <section className="py-3.5 border-y" style={{ background: C.charcoalMid, borderColor: 'rgba(200,205,212,0.08)' }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-x-5 sm:gap-x-10 md:gap-x-14 gap-y-2 items-center">
            {[
              '의료기기판매업 신고 업체',
              'Fillmed 정식 공급원',
              '오후 2시 이전 주문 당일 배송',
              '임상 프로토콜 무상 제공',
            ].map(t => (
              <span key={t} className="text-[11px]"
                style={{ fontFamily: CONDENSED, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.45)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ③ 제품 카테고리 — 오프화이트 */}
      <section id="products" className="py-28" style={{ background: C.offWhite }}>
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div style={{ width: 28, height: 1, background: C.accent }} />
                <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.accent }}>OUR PRODUCTS</span>
                <div style={{ width: 28, height: 1, background: C.accent }} />
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 400, color: C.charcoal, marginBottom: '0.75rem' }}>
                병원을 위한 프리미엄<br />메디컬 에스테틱 라인업
              </h2>
              <p className="text-sm" style={{ color: C.silverDark }}>가격 정보는 병원 회원 승인 후 공개됩니다</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Skin Boosters',   labelKo: '스킨부스터',   products: ['NCTF Boost 135 HA', 'Re2O (Retino-Filler)', 'INHILO+'] },
              { label: 'Dermal Fillers',  labelKo: '더말필러',     products: ['Art Filler Universal', 'Art Filler Volume', 'ARCHITECH 30'] },
              { label: 'Medical Devices', labelKo: '의료기기',     products: ['HYCOOX 자동 인젝터', '기타 시술 장비'] },
              { label: 'Dermocosmetics',  labelKo: '더마코스메틱', products: ['Fillmed Skin Perfusion', '병원 전용 홈케어', 'NCTF 홈케어 라인'] },
            ].map((cat, i) => (
              <FadeIn key={cat.label} delay={i * 0.08}>
                <div className="p-8 bg-white border transition-all duration-300 hover:-translate-y-1 hover:shadow-sm"
                  style={{ borderColor: '#d8dce2', borderRadius: 0 }}>
                  <span className="block mb-2" style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.silverDark }}>{cat.label}</span>
                  <h3 style={{ fontFamily: SERIF, fontSize: '1.25rem', fontWeight: 500, color: C.charcoal, marginBottom: '1.25rem' }}>{cat.labelKo}</h3>
                  <ul className="space-y-2">
                    {cat.products.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm" style={{ color: C.silverDark }}>
                        <span style={{ color: C.accent }}>—</span> {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4" style={{ borderTop: `1px solid #e8ebee` }}>
                    <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.accent }}>자세히 보기 →</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center mt-12">
              <a href="#contact"
                className="inline-flex items-center px-8 py-3.5 text-[11px] no-underline transition-all hover:-translate-y-0.5"
                style={{ fontFamily: CONDENSED, letterSpacing: '0.25em', textTransform: 'uppercase', background: 'transparent', color: C.charcoal, border: `1px solid rgba(30,32,37,0.35)` }}>
                전체 제품 및 가격 문의하기
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ④ Why ISKINZ — 다크 차콜 */}
      <section id="why" className="py-28" style={{ background: C.charcoal }}>
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div style={{ width: 28, height: 1, background: C.silverDark }} />
                <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.silverDark }}>WHY ISKINZ</span>
                <div style={{ width: 28, height: 1, background: C.silverDark }} />
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 400, color: C.silverLight }}>
                병원이 아이스킨즈를<br />선택하는 이유
              </h2>
            </div>
          </FadeIn>

          {/* 갭-1px 그리드 (FILLMED 패턴) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(200,205,212,0.08)' }}>
            {[
              { num: '01', title: '100% 정품 보증',    desc: '제조사 공식 공급 채널을 통해 입고된 정품만 공급합니다. Fillmed 정식 계약 공급원.' },
              { num: '02', title: '오후 2시 당일 배송', desc: '오후 2시 이전 주문 시 전국 병원 대상 당일 배송. 긴급 시술 준비도 문제없습니다.' },
              { num: '03', title: '임상 지원',          desc: '시술 프로토콜·임상 가이드 무상 제공. Fillmed Asia Masterclass 교육 자료 지원.' },
              { num: '04', title: '교육 프로그램',      desc: 'ISKINZ Academy 트레이닝·웨비나·국내 세미나 운영. 의료진 전문성 향상 지원.' },
            ].map((w, i) => (
              <FadeIn key={w.title} delay={i * 0.1}>
                <div className="p-6 sm:p-9" style={{ background: C.charcoal }}>
                  <span className="block mb-6" style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.accent }}>{w.num}</span>
                  <div style={{ width: 28, height: 1, background: 'rgba(200,205,212,0.18)', marginBottom: '1.25rem' }} />
                  <h3 style={{ fontFamily: SERIF, fontSize: '1.2rem', fontWeight: 500, color: C.silver, marginBottom: '0.75rem' }}>{w.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{w.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="mt-16 pt-12" style={{ borderTop: `1px solid rgba(200,205,212,0.08)` }}>
              <div className="flex items-center justify-center gap-3 mb-8">
                <div style={{ width: 28, height: 1, background: C.muted }} />
                <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.muted }}>인허가 및 인증</span>
                <div style={{ width: 28, height: 1, background: C.muted }} />
              </div>
              <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-16">
                {[
                  { name: '의료기기판매업',     desc: '신고 완료' },
                  { name: '통신판매업',         desc: '신고 완료' },
                  { name: '화장품책임판매업',   desc: '등록 완료' },
                  { name: 'Fillmed 정식 공급원', desc: '공식 계약' },
                ].map(c => (
                  <div key={c.name} className="text-center">
                    <p style={{ fontFamily: CONDENSED, fontSize: '0.875rem', letterSpacing: '0.05em', color: C.silver }}>{c.name}</p>
                    <p className="text-xs mt-1" style={{ fontFamily: CONDENSED, letterSpacing: '0.1em', color: C.accent }}>✓ {c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ⑤ Academy — 화이트 */}
      <section id="academy" className="py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <Label>ISKINZ ACADEMY</Label>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 400, color: C.charcoal, lineHeight: 1.2, marginBottom: '1.25rem' }}>
                의료진의 전문성을<br />한 단계 높이는<br />교육 프로그램
              </h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: C.silverDark, lineHeight: 1.9 }}>
                Fillmed Train The Trainers, Asia Masterclass, 국내 세미나·웨비나까지 — 아이스킨즈 아카데미는 의료진의 지속적인 성장을 지원합니다.
              </p>
              <div className="flex gap-4 flex-wrap">
                <a href="#contact"
                  className="inline-flex items-center px-7 py-3.5 text-[11px] no-underline transition-all hover:-translate-y-0.5"
                  style={{ fontFamily: CONDENSED, letterSpacing: '0.25em', textTransform: 'uppercase', background: C.charcoal, color: C.silverLight }}>
                  전체 일정 보기
                </a>
                <a href="#contact"
                  className="inline-flex items-center px-7 py-3.5 text-[11px] no-underline transition-all hover:-translate-y-0.5"
                  style={{ fontFamily: CONDENSED, letterSpacing: '0.25em', textTransform: 'uppercase', background: 'transparent', color: C.charcoal, border: `1px solid rgba(30,32,37,0.28)` }}>
                  신청하기
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex flex-col gap-3">
                {[
                  { date: '2026. 06', tag: 'INTERNATIONAL', title: 'Fillmed Asia Masterclass 2026',     location: '서울 · Grand InterContinental', desc: 'Fillmed 본사 전문가와 함께하는 아시아 최대 규모 스킨부스터 마스터클래스' },
                  { date: '2026. 05', tag: 'WEBINAR',       title: 'NCTF 135HA 시술 프로토콜 웨비나', location: 'Online · Zoom',                desc: '3단계 프로토콜(집중기 → 강화기 → 유지기) 심화 교육 및 Q&A' },
                  { date: '2026. 07', tag: 'SYMPOSIUM',     title: '콤비네이션 테라피 심포지엄',       location: '부산 · 벡스코',               desc: 'NCTF + 필러 + PLLA 조합 치료 최신 트렌드 및 임상 발표' },
                ].map((ev, i) => (
                  <div key={ev.title}
                    className="flex gap-5 p-6 bg-white border transition-all hover:shadow-sm"
                    style={{ borderColor: '#e8ebee', borderLeftWidth: 3, borderLeftColor: i === 0 ? C.accent : 'transparent' }}>
                    <div className="flex-shrink-0 text-center w-12">
                      <p style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.silverDark }}>{ev.date.split('. ')[0]}</p>
                      <p style={{ fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 500, color: C.accent, lineHeight: 1.1 }}>{ev.date.split('. ')[1]}</p>
                    </div>
                    <div>
                      <span className="inline-block text-[9px] px-2 py-0.5 mb-2"
                        style={{ fontFamily: CONDENSED, letterSpacing: '0.2em', textTransform: 'uppercase', background: 'rgba(74,111,165,0.07)', color: C.accent }}>
                        {ev.tag}
                      </span>
                      <h4 className="font-medium text-sm mb-1" style={{ color: C.charcoal }}>{ev.title}</h4>
                      <p className="text-xs mb-1.5" style={{ color: C.accent, fontFamily: CONDENSED, letterSpacing: '0.05em' }}>↳ {ev.location}</p>
                      <p className="text-xs leading-relaxed" style={{ color: C.silverDark }}>{ev.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ⑥ About — 오프화이트 */}
      <section id="about" className="py-28" style={{ background: C.offWhite }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeIn>
              <Label>ABOUT ISKINZ</Label>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 400, color: C.charcoal, lineHeight: 1.2, marginBottom: '1.5rem' }}>
                공식 공급원으로서의<br />신뢰와 전문성
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: C.silverDark, lineHeight: 1.9 }}>
                아이스킨즈(ISKINZ)는 인천 소재 B2B 의료기기·화장품 도매 업체로, 피부과·성형외과·의원급 의료기관에 스킨부스터, 더말필러, 의료기기, 더마코스메틱을 공급합니다.
              </p>
              <p className="text-sm leading-relaxed mb-10" style={{ color: C.silverDark, lineHeight: 1.9 }}>
                주력 품목은 프랑스 Fillmed社의 NCTF 135HA 스킨부스터이며, Art Filler 및 HYCOOX 등 프리미엄 의료기기를 함께 취급합니다.
              </p>
              <div className="grid grid-cols-2 gap-5">
                {[
                  { title: '정품 보증',   text: '제조사 직계약 공식 공급 루트' },
                  { title: '공식 파트너', text: 'Fillmed 공식 계약 공급원' },
                  { title: '인허가 완비', text: '의료기기·통신판매·화장품 판매 신고' },
                  { title: '교육 지원',   text: '임상 프로토콜·Academy 프로그램 운영' },
                ].map(v => (
                  <div key={v.title} className="pl-4" style={{ borderLeft: `1px solid ${C.accent}` }}>
                    <p className="text-sm font-medium mb-1" style={{ fontFamily: CONDENSED, letterSpacing: '0.05em', color: C.charcoal }}>{v.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: C.silverDark }}>{v.text}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex flex-col gap-3">
                {[
                  { num: '500+', label: '납품 병원·클리닉' },
                  { num: '100%', label: 'Fillmed 정식 공급 정품' },
                  { num: '2시',  label: '오후 당일 배송 마감 기준' },
                ].map(s => (
                  <div key={s.label} className="p-5 sm:p-7 bg-white border flex items-center justify-between"
                    style={{ borderColor: '#d8dce2', borderRadius: 0 }}>
                    <div style={{ fontFamily: SERIF, fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 400, color: C.accent, lineHeight: 1 }}>{s.num}</div>
                    <div className="text-sm text-right" style={{ color: C.silverDark }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ⑦ B2B CTA — 딥 차콜 */}
      <section className="py-24 relative overflow-hidden" style={{ background: C.charcoalDeep }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(74,111,165,0.07) 0%, transparent 70%)' }} />
        <FadeIn>
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div style={{ width: 28, height: 1, background: C.muted }} />
              <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.muted }}>B2B 병원 전용</span>
              <div style={{ width: 28, height: 1, background: C.muted }} />
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 400, color: C.silverLight, lineHeight: 1.15, marginBottom: '1rem' }}>
              지금, 병원 전용 공급 파트너가<br />되어보세요
            </h2>
            <p className="text-sm mb-12 max-w-[480px] mx-auto" style={{ color: C.muted, lineHeight: 1.9 }}>
              아이스킨즈는 의료기기판매업 신고 병원 및 의료기관에만 공급합니다.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="/signup"
                className="inline-flex items-center px-8 py-3.5 text-[11px] no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ fontFamily: CONDENSED, letterSpacing: '0.25em', textTransform: 'uppercase', background: C.silverLight, color: C.charcoal }}>
                병원 회원가입
              </a>
              <a href="#contact"
                className="inline-flex items-center px-8 py-3.5 text-[11px] no-underline transition-all hover:-translate-y-0.5"
                style={{ fontFamily: CONDENSED, letterSpacing: '0.25em', textTransform: 'uppercase', background: 'transparent', color: C.silverLight, border: `1px solid rgba(232,235,238,0.25)` }}>
                견적 문의
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ⑧ Contact */}
      <ContactSection />
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   메인 페이지 (서버 컴포넌트)
───────────────────────────────────────────────────────────── */
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
