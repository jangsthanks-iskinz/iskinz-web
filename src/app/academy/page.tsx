import { FadeIn } from '@/components/ui/FadeIn'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = {
  title: 'ISKINZ Academy',
  description: 'ISKINZ 아카데미 — 의료진을 위한 임상 교육 자료',
}

/* ─── 탭 정의 ─── */
const TABS = [
  { id: 'nctf',     label: 'NCTF 135 HA' },
  { id: 'nanosoft', label: '나노소프트' },
  { id: 'stylage',  label: 'Stylage' },
]

/* ══════════════════════════════════════════════
   NCTF 135 HA 콘텐츠
══════════════════════════════════════════════ */
function NctfContent() {
  return (
    <div>
      {/* ① 제품 헤더 + 스탯 */}
      <section style={{ background: NS.charcoal, padding: '80px 0 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <FadeIn>
            <NSLabel dark>FLAGSHIP PRODUCT · FILLMED</NSLabel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end pb-16">
              <div>
                <h2 style={{ fontFamily: NSF.serif, fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 300, color: '#fff', lineHeight: 0.95, letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
                  NCTF<sup style={{ fontSize: '0.55em', verticalAlign: 'super' }}>®</sup> 135 HA
                </h2>
                <p style={{ fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', color: NS.silverDark, marginBottom: '2.5rem' }}>
                  CELLULAR ACTIVATOR — BY FILLMED
                </p>
                <p style={{ fontSize: 13, fontWeight: 300, color: NS.silverLight, lineHeight: 1.8, maxWidth: 400 }}>
                  <strong style={{ display: 'block', fontSize: 15, fontWeight: 300, color: NS.silver, marginBottom: 8, fontFamily: NSF.condensed, letterSpacing: '0.15em', textTransform: 'uppercase' }}>45+ YEARS OF CELLULAR SCIENCE</strong>
                  1978년 Fillmed이 창시한 세포 재생 과학. 메조테라피나 스킨부스터가 아닌, 임상으로 입증된 세포 활성화 솔루션의 새로운 기준.
                </p>
              </div>
              {/* 스탯 그리드 */}
              <div className="grid grid-cols-2 gap-px" style={{ background: 'rgba(200,205,212,0.1)' }}>
                {[
                  { num: '70+',  unit: '',    label: '판매 국가' },
                  { num: '13',   unit: '/min', label: '전세계 바이알 판매' },
                  { num: '+23', unit: '%',    label: '2025년 성장률' },
                  { num: '45',   unit: 'yr+', label: '임상 데이터 축적' },
                ].map(s => (
                  <div key={s.label} style={{ background: NS.charcoalMid, padding: '32px 28px' }}>
                    <div style={{ fontFamily: NSF.condensed, fontSize: 30, fontWeight: 200, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                      {s.num}{s.unit && <small style={{ fontSize: 14 }}>{s.unit}</small>}
                    </div>
                    <div style={{ fontFamily: NSF.condensed, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.silverDark, marginTop: 6 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
        {/* 인트로 스트립 */}
        <div style={{ background: NS.silverLight, borderTop: `1px solid ${NS.silver}`, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, overflowX: 'auto', flexWrap: 'wrap' }}>
          {['Natural Cell Environment · 자연스러운 세포 환경', 'Cellular Activation · 세포 활성화', 'Treatment Partner · 모든 시술의 파트너', 'Fostering Satisfaction · 환자 만족도 증가'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: NS.accent, flexShrink: 0 }} />
              <span style={{ fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.charcoalMid }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ② N·C·T·F 의미 — 화이트 */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <FadeIn>
            <NSLabel>WHAT IS NCTF?</NSLabel>
            <h3 style={{ fontFamily: NSF.serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: NS.charcoal, lineHeight: 1.1, marginBottom: '3rem' }}>
              이름에 담긴<br /><em style={{ fontStyle: 'italic', color: NS.warm }}>과학적 철학</em>
            </h3>
          </FadeIn>
          <div>
            {[
              { letter: 'N', title: 'Natural Cell Environment', titleKo: '자연스러운 세포 환경',
                desc: '1978년부터 세포 환경에 집중해온 60가지 필수 성분으로 구성된 독보적인 포뮬러. 45년 이상의 의료 경험을 통해 입증된 재현 가능하고 신뢰할 수 있는 결과.' },
              { letter: 'C', title: 'Cellular Activation', titleKo: '세포 활성화',
                desc: '섬유아세포 활성화로 세포 턴오버와 피부 재생 증가. 임상 시험에서 +256% 콜라겐 생성, +148% 섬유아세포 활성 입증. 피부를 Renew · Repair · Rejuvenate.' },
              { letter: 'T', title: 'Treatment Partner', titleKo: '모든 시술의 파트너',
                desc: '톡신·필러·레이저·RF·화학적 필링·수술 등 모든 미용 시술과 컴바인 가능. 시술 전·중·후 전 과정에서 피부 컨디셔닝을 높이고 시너지 효과를 극대화.' },
              { letter: 'F', title: 'Fostering Patient Satisfaction', titleKo: '환자 만족도 및 재내원 증가',
                desc: '즉각적이고 장기적으로 지속되는 가시적 결과로 환자 98% 추천 의향. 클리닉의 장기적인 비즈니스 성장을 견인하는 기반 치료 솔루션.' },
            ].map((item, i) => (
              <FadeIn key={item.letter} delay={i * 0.07}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 28, padding: '28px 0', borderBottom: `1px solid ${NS.silverLight}`, borderTop: i === 0 ? `1px solid ${NS.silverLight}` : undefined }}>
                  <div style={{ fontFamily: NSF.serif, fontSize: 56, fontWeight: 300, color: NS.silver, lineHeight: 1, paddingTop: 4 }}>{item.letter}</div>
                  <div style={{ paddingTop: 6 }}>
                    <p style={{ fontFamily: NSF.condensed, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: NS.silverDark, marginBottom: 4 }}>{item.title}</p>
                    <p style={{ fontFamily: NSF.condensed, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: NS.charcoal, fontWeight: 500, marginBottom: 8 }}>{item.titleKo}</p>
                    <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.75, color: NS.muted }}>{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ③ 임상 데이터 — 다크 */}
      <section style={{ background: NS.charcoal, padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', fontFamily: NSF.serif, fontSize: 220, fontWeight: 300, color: 'rgba(200,205,212,0.04)', lineHeight: 1, whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none' }}>NCTF</div>
        <div className="container mx-auto px-6 lg:px-14 relative">
          <FadeIn>
            <NSLabel dark>CLINICAL EVIDENCE</NSLabel>
            <h3 style={{ fontFamily: NSF.serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: '1rem' }}>
              60가지 성분<br /><em style={{ fontStyle: 'italic', color: NS.warm }}>임상 입증 효과</em>
            </h3>
            <p style={{ fontSize: 13, fontWeight: 300, color: NS.silverDark, maxWidth: 480, lineHeight: 1.7, marginBottom: '3rem' }}>
              무작위 대조 연구와 다기관 임상시험을 통해 검증된 NCTF® 135 HA의 효능. Free HA 5mg/ml 포함 60가지 필수 성분 독자적 복합 포뮬러.
            </p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 1, background: 'rgba(200,205,212,0.1)', marginBottom: 1 }}>
            {[
              { pct: '+256%', name: '콜라겐 생성 촉진', sub: 'In vitro, 섬유아세포' },
              { pct: '+148%', name: '섬유아세포 활성',  sub: 'In vitro' },
              { pct: '+119%', name: '피부 광채 개선',   sub: '3회 시술 후' },
              { pct: '+69%',  name: '피부 탄력 향상',   sub: '3회 시술 후' },
            ].map((e, i) => (
              <FadeIn key={e.name} delay={i * 0.07}>
                <div style={{ background: NS.charcoalMid, padding: '36px 24px' }}>
                  <div style={{ fontFamily: NSF.condensed, fontSize: 36, fontWeight: 200, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    <span style={{ color: NS.accent, fontSize: 22 }}>{e.pct.charAt(0)}</span>{e.pct.slice(1)}
                  </div>
                  <div style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.silverDark, marginTop: 10, lineHeight: 1.4 }}>{e.name}<br /><span style={{ color: NS.muted }}>{e.sub}</span></div>
                </div>
              </FadeIn>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 1, background: 'rgba(200,205,212,0.1)' }}>
            {[
              { pct: '+54%',  name: '진피 밀도 증가',     sub: 'HEBE2 연구, 147명' },
              { pct: '−50%',  name: '볼 주름 감소',       sub: '3회 시술 후' },
              { pct: '−77%',  name: 'RF 병행 주름 감소',  sub: '복합 시술' },
              { pct: '98%',   name: '환자 추천 의향',     sub: '임상 설문' },
            ].map((e, i) => (
              <FadeIn key={e.name} delay={i * 0.07 + 0.28}>
                <div style={{ background: NS.charcoalMid, padding: '36px 24px' }}>
                  <div style={{ fontFamily: NSF.condensed, fontSize: 36, fontWeight: 200, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    <span style={{ color: e.pct.startsWith('+') || e.pct.startsWith('9') ? NS.accent : NS.silver, fontSize: 22 }}>{e.pct.charAt(0)}</span>{e.pct.slice(1)}
                  </div>
                  <div style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.silverDark, marginTop: 10, lineHeight: 1.4 }}>{e.name}<br /><span style={{ color: NS.muted }}>{e.sub}</span></div>
                </div>
              </FadeIn>
            ))}
          </div>
          <p style={{ fontSize: 11, color: NS.muted, marginTop: 20, fontWeight: 300 }}>Prikhnenko S. Clin Cosmet Investig Dermatol. 2015;8:151–157 외</p>
        </div>
      </section>

      {/* ④ 60가지 성분 — 오프화이트 */}
      <section style={{ background: NS.offWhite, padding: '80px 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <FadeIn>
            <NSLabel>FORMULA</NSLabel>
            <h3 style={{ fontFamily: NSF.serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: NS.charcoal, lineHeight: 1.1, marginBottom: '3rem' }}>
              60가지 필수 성분<br /><em style={{ fontStyle: 'italic', color: NS.warm }}>독자적 복합 포뮬러</em>
            </h3>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ background: `rgba(200,205,212,0.3)` }}>
            {[
              { n: 'Free HA',       t: '즉각 수분·광채',      sub: '5mg/ml' },
              { n: '비타민 4종',    t: 'A·B·C·E',             sub: '콜라겐 보호·항산화' },
              { n: '아미노산 24',   t: '콜라겐·엘라스틴',     sub: '기본 구성 요소' },
              { n: '미네랄 6',      t: '세포 투과성 조절',    sub: '필수 영양 공급' },
              { n: '보조효소 6',    t: '세포 대사 유도',      sub: '대사 반응 조절' },
              { n: '뉴클레오사이드 5', t: 'DNA·RNA 합성',    sub: '유전자 발현 조절' },
              { n: '글루타티온',    t: '강력 항산화',         sub: '산화 스트레스 감소' },
              { n: '기타 5종',      t: '포뮬러 균형·안정성', sub: '정밀 배합' },
            ].map((item, i) => (
              <FadeIn key={item.n} delay={i * 0.05}>
                <div style={{ background: '#fff', padding: '28px 24px' }}>
                  <p style={{ fontFamily: NSF.condensed, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: NS.charcoal, fontWeight: 500, marginBottom: 4 }}>{item.n}</p>
                  <p style={{ fontSize: 12, color: NS.muted, marginBottom: 4 }}>{item.t}</p>
                  <p style={{ fontFamily: NSF.condensed, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.silverDark }}>{item.sub}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <p style={{ fontSize: 11, color: NS.silverDark, marginTop: 16, fontWeight: 300 }}>* CE 인증 · 세포 과학 기반 성분 선정 · 최적 용량 정밀 배합</p>
        </div>
      </section>

      {/* ⑤ 복합 시술 + 프로토콜 — 화이트 */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <NSLabel>TREATMENT PARTNER</NSLabel>
              <h3 style={{ fontFamily: NSF.serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: NS.charcoal, lineHeight: 1.1, marginBottom: '1rem' }}>
                모든 시술과<br /><em style={{ fontStyle: 'italic', color: NS.warm }}>컴바인 가능</em>
              </h3>
              <p style={{ fontSize: 13, fontWeight: 300, color: NS.silverDark, lineHeight: 1.7, marginBottom: '2rem' }}>
                NCTF® 135 HA 사용자의 <strong style={{ color: NS.charcoal }}>80%</strong>가 이미 복합 시술 적용 중
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['NCTF + 보톡스·톡신', 'NCTF + Stylage 필러', 'NCTF + 콜라겐 유도제', 'NCTF + 레이저·RF', 'NCTF + 화학적 필링', 'NCTF + 마이크로니들링', 'NCTF + 수술'].map(c => (
                  <span key={c} style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '8px 14px', border: `1px solid rgba(74,111,165,0.3)`, background: 'rgba(74,111,165,0.06)', color: NS.accent }}>
                    + {c}
                  </span>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div style={{ background: NS.charcoal, padding: 'clamp(24px, 5vw, 44px)' }}>
                <NSLabel dark>TREATMENT PROTOCOL</NSLabel>
                <h4 style={{ fontFamily: NSF.serif, fontSize: '1.6rem', fontWeight: 300, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.2 }}>3단계 시술 프로토콜</h4>
                <div>
                  {[
                    { step: '01', name: '집중기', period: '1회/주 × 3~4주', desc: '집중적 세포 활성화 · 피부 기초 영양 보충 · 즉각 수분·광채 개선' },
                    { step: '02', name: '강화기', period: '1회/2주 × 2회',  desc: '지속적 콜라겐 생성 유도 · 탄력·밀도 강화 · 치료 효과 안정화' },
                    { step: '03', name: '유지기', period: '1회/1~3개월',    desc: '장기 피부 건강 유지 · 재내원 주기 형성 · 지속적 결과 관리' },
                  ].map((p, i) => (
                    <div key={p.step} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 20, padding: '24px 0', borderBottom: i < 2 ? `1px solid rgba(200,205,212,0.1)` : 'none', borderTop: i === 0 ? `1px solid rgba(200,205,212,0.1)` : undefined }}>
                      <div style={{ fontFamily: NSF.serif, fontSize: 34, fontWeight: 300, color: NS.silver, lineHeight: 1, paddingTop: 2 }}>{p.step}</div>
                      <div>
                        <p style={{ fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', fontWeight: 500, marginBottom: 4 }}>{p.name} <span style={{ color: NS.accent, marginLeft: 8 }}>{p.period}</span></p>
                        <p style={{ fontSize: 12, fontWeight: 300, lineHeight: 1.65, color: NS.silverDark }}>{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Results Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ background: NS.charcoalMid }}>
        {[
          { pct: '256', label: '콜라겐 생성 증가' },
          { pct: '148', label: '섬유아세포 활성' },
          { pct: '98',  label: '환자 추천 의향' },
          { pct: '80',  label: '복합 시술 적용률' },
        ].map((r, i) => (
          <div key={r.label} style={{ padding: '36px 20px', borderRight: i % 2 === 0 ? '1px solid rgba(200,205,212,0.1)' : 'none', borderBottom: i < 2 ? '1px solid rgba(200,205,212,0.1)' : 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: NSF.serif, fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 300, color: '#fff', lineHeight: 1 }}>
              <span style={{ color: NS.accent }}>+{r.pct}</span>%
            </div>
            <div style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: NS.silverDark, marginTop: 8 }}>{r.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <CtaSection title="NCTF® 135 HA 도입 상담" />
    </div>
  )
}

/* ══════════════════════════════════════════════
   나노소프트 콘텐츠 — FILLMED NANOSOFT™ MICRONEEDLES
══════════════════════════════════════════════ */
const NS = {
  charcoal:    '#1e2025',
  charcoalMid: '#2d3038',
  silver:      '#c8cdd4',
  silverLight: '#e8ebee',
  silverDark:  '#8a9099',
  offWhite:    '#f5f4f1',
  accent:      '#4a6fa5',
  warm:        '#b5a99a',
  muted:       '#5a5f6a',
}
const NSF = { condensed: 'Barlow Condensed, sans-serif', serif: 'Cormorant Garamond, Georgia, serif' }

function NSLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const color = dark ? NS.silverDark : NS.accent
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
      <div style={{ width: 24, height: 1, background: color, flexShrink: 0 }} />
      <span style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color }}>{children}</span>
    </div>
  )
}

function NanosoftContent() {
  return (
    <div>
      {/* ① 제품 헤더 + 스펙 */}
      <section style={{ background: NS.charcoal, padding: '80px 0 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <FadeIn>
            <NSLabel dark>FILLMED · MICRONEEDLE DEVICE</NSLabel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end pb-16">
              <div>
                <h2 style={{ fontFamily: NSF.serif, fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 300, color: '#fff', lineHeight: 0.95, letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
                  NANO<em style={{ fontStyle: 'italic', color: NS.silver }}>SOFT</em>™
                </h2>
                <p style={{ fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', color: NS.silverDark, marginBottom: '2.5rem' }}>
                  MICRONEEDLES BY FILLMED — 3 PIN · 0.6 MM
                </p>
                <p style={{ fontSize: 13, fontWeight: 300, color: NS.silverLight, lineHeight: 1.8, maxWidth: 400 }}>
                  <strong style={{ display: 'block', fontSize: 15, fontWeight: 300, color: NS.silver, marginBottom: 8, fontFamily: NSF.condensed, letterSpacing: '0.15em', textTransform: 'uppercase' }}>BETTER RESULTS IN LESS TIME</strong>
                  특별한 기술 없이도 통증과 다운타임 없이 진피층까지 정확하게 약물을 전달하는 혁신적인 의료기기입니다.
                </p>
              </div>
              {/* 스펙 그리드 */}
              <div className="grid grid-cols-2 gap-px" style={{ background: 'rgba(200,205,212,0.1)' }}>
                {[
                  { num: '0.6', unit: 'mm', label: '마이크로니들 길이' },
                  { num: '3',   unit: 'pin', label: '트리플 핀 구성' },
                  { num: 'CE & KFDA', unit: '', label: '이중 인증' },
                  { num: '30', unit: 'ea', label: '1박스 구성' },
                ].map(s => (
                  <div key={s.label} style={{ background: NS.charcoalMid, padding: '32px 28px' }}>
                    <div style={{ fontFamily: NSF.condensed, fontSize: 30, fontWeight: 200, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                      {s.num}{s.unit && <small style={{ fontSize: 14 }}>{s.unit}</small>}
                    </div>
                    <div style={{ fontFamily: NSF.condensed, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.silverDark, marginTop: 6 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
        {/* 인트로 스트립 */}
        <div style={{ background: NS.silverLight, borderTop: `1px solid ${NS.silver}`, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, overflowX: 'auto', flexWrap: 'wrap' }}>
          {['Near Painless · 통증 최소화', 'Minimal Bruising · 멍 최소화', 'Standardised Depth · 정확한 주입 깊이', 'Quick & Easy · 빠르고 간편한 시술', 'All Syringes Compatible · 모든 주사기 호환'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: NS.accent, flexShrink: 0 }} />
              <span style={{ fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.charcoalMid }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ② About — 화이트 */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeIn>
              <NSLabel>PRODUCT OVERVIEW</NSLabel>
              <h3 style={{ fontFamily: NSF.serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: NS.charcoal, lineHeight: 1.1, marginBottom: '1.25rem' }}>
                세상에서 가장 작은<br /><em style={{ fontStyle: 'italic', color: NS.warm }}>니들의 혁신</em>
              </h3>
              <div style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: '#3a3d44' }}>
                <p>나노소프트™는 눈가, 입가, 목, 데콜테 등 가장 예민한 부위를 위해 특별히 설계된 FILLMED의 독점 마이크로니들 의료기기입니다. 0.6mm 길이의 3핀 구성으로 상부 진피층까지 NCTF® 솔루션을 정확하게 전달합니다.</p>
                <p style={{ marginTop: 14 }}>백신 주사 기술에서 영감을 받아 개발된 나노소프트™는 기존 메조테라피의 통증과 불편함을 획기적으로 줄이면서도 최적의 약물 전달 효율을 실현합니다.</p>
                <p style={{ marginTop: 14 }}>CE 및 KFDA 인증을 모두 획득한 검증된 의료기기로, 1회용 멸균 제품으로 안전성이 보장됩니다.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div>
                {[
                  { num: '01', title: '안전하고 정밀한 약물 전달', desc: '3개의 마이크로니들 0.6mm 길이로 정확한 진피층 주입. 표준화된 주입 깊이로 시술자의 숙련도에 관계없이 일관된 결과를 제공합니다.' },
                  { num: '02', title: '손쉬운 사용성', desc: '파란색 방향선이 시술 방향을 직관적으로 안내합니다. 모든 주사기에 호환 가능하여 기존 워크플로우에 즉시 통합 가능합니다.' },
                  { num: '03', title: '탁월한 환자 경험', desc: '기존 메조테라피 대비 현저히 낮은 통증 수준. 멍과 다운타임을 최소화하여 환자 만족도와 재방문율을 높입니다.' },
                  { num: '04', title: 'CE & KFDA 이중 인증', desc: '국내외 규제 기관에서 모두 인증받은 검증된 의료기기. 1회용 멸균 제품으로 교차 감염 위험을 원천 차단합니다.' },
                ].map((f, i) => (
                  <div key={f.num} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 20, padding: '24px 0', borderBottom: `1px solid ${NS.silverLight}`, borderTop: i === 0 ? `1px solid ${NS.silverLight}` : undefined }}>
                    <div style={{ fontFamily: NSF.serif, fontSize: 34, fontWeight: 300, color: NS.silver, lineHeight: 1, paddingTop: 2 }}>{f.num}</div>
                    <div>
                      <p style={{ fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.charcoal, fontWeight: 500, marginBottom: 6 }}>{f.title}</p>
                      <p style={{ fontSize: 12, fontWeight: 300, lineHeight: 1.65, color: NS.silverDark }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ③ Efficacy — 다크 */}
      <section style={{ background: NS.charcoal, padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', fontFamily: NSF.serif, fontSize: 220, fontWeight: 300, color: 'rgba(200,205,212,0.04)', lineHeight: 1, whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none' }}>NCTF</div>
        <div className="container mx-auto px-6 lg:px-14 relative">
          <FadeIn>
            <NSLabel dark>NCTF® 135HA CLINICAL DATA</NSLabel>
            <h3 style={{ fontFamily: NSF.serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: '1rem' }}>
              NCTF® 135HA<br /><em style={{ fontStyle: 'italic', color: NS.warm }}>임상 효과 데이터</em>
            </h3>
            <p style={{ fontSize: 13, fontWeight: 300, color: NS.silverDark, maxWidth: 480, lineHeight: 1.7, marginBottom: '3rem' }}>
              40년 이상의 피부과학 역사를 가진 NCTF® 135HA와 나노소프트™의 완벽한 조합. 검증된 임상 데이터로 확인된 효과.
            </p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" style={{ gap: 1, background: 'rgba(200,205,212,0.1)' }}>
            {[
              { pct: '+144%', name: '피부 광채', sub: 'Radiance' },
              { pct: '+132%', name: '수분 공급', sub: 'Hydration' },
              { pct: '+52%',  name: '피부 균일도', sub: 'Homogeneity' },
              { pct: '−43%', name: '잔주름 감소', sub: 'Fine Lines' },
              { pct: '−59%', name: '모공 크기 감소', sub: 'Pore Size' },
            ].map((e, i) => (
              <FadeIn key={e.name} delay={i * 0.07}>
                <div style={{ background: NS.charcoalMid, padding: '36px 24px' }}>
                  <div style={{ fontFamily: NSF.condensed, fontSize: 40, fontWeight: 200, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    <span style={{ color: e.pct.startsWith('+') ? NS.accent : NS.silver, fontSize: 24 }}>{e.pct.charAt(0)}</span>{e.pct.slice(1)}
                  </div>
                  <div style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.silverDark, marginTop: 10, lineHeight: 1.4 }}>{e.name}<br />{e.sub}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ④ Treatment Zones */}
      <section style={{ background: NS.offWhite, padding: '80px 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <FadeIn>
            <NSLabel>TREATMENT AREAS</NSLabel>
            <h3 style={{ fontFamily: NSF.serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: NS.charcoal, lineHeight: 1.1, marginBottom: '3rem' }}>
              예민한 부위를 위해<br /><em style={{ fontStyle: 'italic', color: NS.warm }}>특별히 설계</em>되었습니다
            </h3>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '👁',  en: 'PERIORBITAL AREA', ko: '눈가 · 다크서클', desc: '노화 증상이 가장 먼저 나타나는 눈가 부위. 다크서클 48% 개선, 눈가 잔주름 35% 감소 효과.' },
              { icon: '💋', en: 'PERIORAL AREA',     ko: '입술 주변',       desc: '끊임없이 움직이는 입술 주변의 바코드 주름과 팔자 주름을 효과적으로 개선. 35% 감소 효과.' },
              { icon: '🤍', en: 'NECK & DÉCOLLETÉ', ko: '목 · 데콜테',      desc: '기존 시술로 접근하기 어려운 목과 데콜테 부위. 탄력도 27% 개선으로 자연스러운 리프팅 효과.' },
              { icon: '🖐', en: 'HANDS',             ko: '손등',            desc: '피부 노화가 뚜렷하게 나타나는 손등 부위. 수분 공급과 피부 탄력 회복으로 젊고 건강한 손을 되찾습니다.' },
            ].map((z, i) => (
              <FadeIn key={z.en} delay={i * 0.08}>
                <div className="bg-white border transition-all duration-300 hover:-translate-y-1 hover:shadow-sm" style={{ padding: '36px 24px', borderColor: NS.silverLight }}>
                  <div style={{ width: 44, height: 44, border: `1px solid ${NS.silver}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, fontSize: 18 }}>{z.icon}</div>
                  <p style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.charcoal, fontWeight: 500, marginBottom: 5 }}>{z.en}</p>
                  <p style={{ fontSize: 14, fontWeight: 300, color: NS.charcoal, marginBottom: 10 }}>{z.ko}</p>
                  <p style={{ fontSize: 12, fontWeight: 300, lineHeight: 1.65, color: NS.silverDark }}>{z.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤ How to Use + Specs */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <NSLabel>HOW TO USE</NSLabel>
              <h3 style={{ fontFamily: NSF.serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: NS.charcoal, lineHeight: 1.1, marginBottom: '2rem' }}>
                올바른 사용법으로<br /><em style={{ fontStyle: 'italic', color: NS.warm }}>효과를 극대화</em>하세요
              </h3>
              <div>
                {[
                  { num: '1', title: '방향 확인', desc: '파란색 선이 항상 사용자(시술자) 방향을 향하도록 합니다. 주사기가 옆으로 기울거나 회전되지 않도록 유지합니다.' },
                  { num: '2', title: '피부 신축 후 45° 삽입', desc: '시술 부위의 피부를 팽팽하게 늘린 후 45도 각도로 삽입합니다. 정확한 각도가 최적의 진피층 전달을 보장합니다.' },
                  { num: '3', title: '천천히 주입 → 파퓰 형성', desc: '파퓰이 형성될 때까지 서서히 압력을 가해 주입합니다. 1cm 간격으로 시술 부위 전체에 균일하게 시술합니다.' },
                  { num: '4', title: '24시간 내 자연 흡수', desc: '형성된 파퓰은 NCTF® 솔루션의 저장소 역할을 하며, 진피층으로 서서히 확산됩니다. 24시간 이내에 완전히 흡수됩니다.' },
                ].map((s, i) => (
                  <div key={s.num} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 20, padding: '24px 0', borderBottom: `1px solid ${NS.silverLight}`, borderTop: i === 0 ? `1px solid ${NS.silverLight}` : undefined }}>
                    <div style={{ fontFamily: NSF.serif, fontSize: 38, fontWeight: 300, color: NS.silver, lineHeight: 1 }}>{s.num}</div>
                    <div>
                      <p style={{ fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.charcoal, fontWeight: 500, marginBottom: 8, paddingTop: 8 }}>{s.title}</p>
                      <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.7, color: '#3a3d44' }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div style={{ background: NS.charcoal, padding: 'clamp(24px, 5vw, 44px)' }}>
                <NSLabel dark>SPECIFICATIONS</NSLabel>
                <h4 style={{ fontFamily: NSF.serif, fontSize: '1.6rem', fontWeight: 300, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.2 }}>제품 사양</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(200,205,212,0.1)' }}>
                  {[
                    { val: '3',   unit: '',   key: '마이크로니들 핀 수' },
                    { val: '0.6', unit: 'mm', key: '니들 길이' },
                    { val: '30',  unit: '',   key: '박스 당 수량' },
                    { val: '45',  unit: '°',  key: '권장 삽입 각도' },
                  ].map(s => (
                    <div key={s.key} style={{ background: NS.charcoalMid, padding: '24px 20px' }}>
                      <div style={{ fontFamily: NSF.serif, fontSize: 32, fontWeight: 300, color: '#fff', lineHeight: 1 }}>{s.val}<span style={{ fontSize: 14 }}>{s.unit}</span></div>
                      <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.silverDark, marginTop: 5 }}>{s.key}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                  {['CE Certified', 'KFDA Certified'].map(b => (
                    <div key={b} style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.accent, background: 'rgba(74,111,165,0.12)', border: '1px solid rgba(74,111,165,0.3)', padding: '7px 12px' }}>{b}</div>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: NS.silverDark, marginTop: 16, lineHeight: 1.7, fontWeight: 300 }}>1회용 멸균 제품 · 모든 주사기 호환<br />NCTF® 135HA와 최적 호환</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ⑥ Results Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ background: NS.charcoalMid }}>
        {[
          { pct: '48', label: '다크서클 개선' },
          { pct: '35', label: '눈가 잔주름 개선' },
          { pct: '35', label: '입 주위 주름 개선' },
          { pct: '27', label: '목 탄력도 개선' },
        ].map((r, i) => (
          <div key={r.label} style={{ padding: '36px 20px', borderRight: i % 2 === 0 ? '1px solid rgba(200,205,212,0.1)' : 'none', borderBottom: i < 2 ? '1px solid rgba(200,205,212,0.1)' : 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: NSF.serif, fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 300, color: '#fff', lineHeight: 1 }}>
              <span style={{ color: NS.accent }}>{r.pct}</span>%
            </div>
            <div style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: NS.silverDark, marginTop: 8 }}>{r.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <CtaSection title="나노소프트™ 도입 상담" />
    </div>
  )
}

/* ══════════════════════════════════════════════
   Stylage 콘텐츠 — VIVACY
══════════════════════════════════════════════ */
function StyleageContent() {
  const gold   = '#B4924E'
  const goldLt = '#D4B483'
  const goldPale = 'rgba(180,146,78,0.12)'

  return (
    <div>
      {/* ① 제품 헤더 + 브랜드 소개 */}
      <section style={{ background: NS.charcoal, padding: '80px 0 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <FadeIn>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 24, height: 1, background: gold, flexShrink: 0 }} />
              <span style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: gold }}>
                PREMIUM FILLER · VIVACY
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end pb-16">
              <div>
                <h2 style={{ fontFamily: NSF.serif, fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 300, color: '#fff', lineHeight: 0.95, letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
                  STYLAGE<sup style={{ fontSize: '0.55em', verticalAlign: 'super' }}>®</sup>
                </h2>
                <p style={{ fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', color: NS.silverDark, marginBottom: '2.5rem' }}>
                  IPN-LIKE TECHNOLOGY — BY VIVACY
                </p>
                <p style={{ fontSize: 13, fontWeight: 300, color: NS.silverLight, lineHeight: 1.8, maxWidth: 400 }}>
                  <strong style={{ display: 'block', fontSize: 15, fontWeight: 300, color: NS.silver, marginBottom: 8, fontFamily: NSF.condensed, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    IPN-LIKE · MANNITOL · BI-SOFT®
                  </strong>
                  프랑스 Vivacy의 Stylage 라인. IPN-LIKE 기술로 만들어진 균일하고 자연스러운 HA 겔. Mannitol 항산화 복합체로 효과를 더 오래 유지합니다.
                </p>
              </div>
              {/* 스탯 그리드 */}
              <div className="grid grid-cols-2 gap-px" style={{ background: 'rgba(200,205,212,0.1)' }}>
                {[
                  { num: '4종',    unit: '',      label: 'Stylage 라인업' },
                  { num: '14–20', unit: 'mg/ml', label: 'HA 농도 범위' },
                  { num: '12+',   unit: '개월',  label: '효과 지속 기간' },
                  { num: '2007',  unit: 'yr',    label: 'Vivacy 설립' },
                ].map(s => (
                  <div key={s.label} style={{ background: NS.charcoalMid, padding: '32px 28px' }}>
                    <div style={{ fontFamily: NSF.condensed, fontSize: 30, fontWeight: 200, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                      {s.num}{s.unit && <small style={{ fontSize: 14 }}> {s.unit}</small>}
                    </div>
                    <div style={{ fontFamily: NSF.condensed, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.silverDark, marginTop: 6 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
        {/* 인트로 스트립 */}
        <div style={{ background: NS.silverLight, borderTop: `1px solid ${NS.silver}`, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, overflowX: 'auto', flexWrap: 'wrap' }}>
          {[
            'IPN-LIKE Technology · 균일한 겔 구조',
            'Mannitol · 항산화 보호',
            'Bi-Soft® Syringe · 시술 편의성',
            'CE Marked · 정품 인증',
            'Lidocaine 함유 · 통증 최소화',
          ].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: gold, flexShrink: 0 }} />
              <span style={{ fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.charcoalMid }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ② 핵심 기술 — 화이트 */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <FadeIn>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 24, height: 1, background: gold, flexShrink: 0 }} />
              <span style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: gold }}>KEY TECHNOLOGIES</span>
            </div>
            <h3 style={{ fontFamily: NSF.serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: NS.charcoal, lineHeight: 1.1, marginBottom: '3rem' }}>
              Stylage를 특별하게 만드는<br /><em style={{ fontStyle: 'italic', color: NS.warm }}>3가지 핵심 기술</em>
            </h3>
          </FadeIn>
          <div>
            {[
              {
                num: '01',
                title: 'IPN-LIKE Technology',
                titleKo: '균일하고 자연스러운 겔',
                desc: '기존 HA 필러와 달리 IPN-LIKE(Interpenetrating Network-Like) 기술로 제조된 Stylage는 균일한 3D 겔 구조를 형성합니다. 주입 후 겔이 고르게 분포되어 자연스러운 볼륨과 매끄러운 텍스처를 제공하며, 덩어리(lump) 형성 위험을 크게 줄입니다.',
              },
              {
                num: '02',
                title: 'Mannitol 항산화 복합체',
                titleKo: '효과 지속 시간 연장',
                desc: 'Mannitol은 강력한 항산화제로, 체내 활성산소(ROS)로부터 HA를 보호합니다. 덕분에 Stylage는 일반 HA 필러보다 분해 속도가 느리고 효과가 더 오래 지속됩니다. 염증 반응도 억제하여 시술 후 붓기와 통증이 적습니다.',
              },
              {
                num: '03',
                title: 'Bi-Soft® Syringe',
                titleKo: '최적화된 시술 편의성',
                desc: '독자적인 Bi-Soft® 시린지는 저항이 낮아 일관된 압력으로 겔을 주입할 수 있습니다. 시술자의 손 피로도를 줄이고, 정밀한 양 조절이 가능해 과주입 위험을 최소화합니다. Lidocaine 함유 제품은 시술 중 통증을 추가로 감소시킵니다.',
              },
            ].map((item, i) => (
              <FadeIn key={item.num} delay={i * 0.07}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 28, padding: '28px 0', borderBottom: `1px solid ${NS.silverLight}`, borderTop: i === 0 ? `1px solid ${NS.silverLight}` : undefined }}>
                  <div style={{ fontFamily: NSF.serif, fontSize: 56, fontWeight: 300, color: NS.silver, lineHeight: 1, paddingTop: 4 }}>{item.num}</div>
                  <div style={{ paddingTop: 6 }}>
                    <p style={{ fontFamily: NSF.condensed, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: gold, marginBottom: 4 }}>{item.title}</p>
                    <p style={{ fontFamily: NSF.condensed, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: NS.charcoal, fontWeight: 500, marginBottom: 8 }}>{item.titleKo}</p>
                    <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.75, color: NS.muted }}>{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ③ 제품 라인업 — 다크 */}
      <section style={{ background: NS.charcoal, padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', fontFamily: NSF.serif, fontSize: 220, fontWeight: 300, color: 'rgba(200,205,212,0.03)', lineHeight: 1, whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none' }}>STYLAGE</div>
        <div className="container mx-auto px-6 lg:px-14 relative">
          <FadeIn>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 24, height: 1, background: gold, flexShrink: 0 }} />
              <span style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: gold }}>PRODUCT LINEUP</span>
            </div>
            <h3 style={{ fontFamily: NSF.serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: '1rem' }}>
              적응증에 맞는<br /><em style={{ fontStyle: 'italic', color: goldLt }}>4가지 제품 라인</em>
            </h3>
            <p style={{ fontSize: 13, fontWeight: 300, color: NS.silverDark, maxWidth: 480, lineHeight: 1.7, marginBottom: '3rem' }}>
              잔주름부터 심층 볼륨 복원까지, 각 적응증에 최적화된 Stylage 제품을 선택하세요.
            </p>
          </FadeIn>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'rgba(200,205,212,0.1)' }}>
            {[
              {
                name: 'Stylage S',
                ha: '16 mg/ml HA',
                tag: '잔주름·표재성',
                color: gold,
                indication: '눈가 Crow\'s Feet · 이마 잔주름 · 구순 주변 바코드 주름',
                depth: '표피 ~ 중간 진피',
                needle: '32G',
                duration: '6~9개월',
                lidocaine: false,
                desc: '가장 표재성 적응증 전용. 눈가와 이마의 고운 잔주름, 구순 주변 미세 주름에 사용. IPN-LIKE 겔의 낮은 점도로 표피층에 자연스럽게 퍼집니다.',
                technique: '선형 레트로그레이드 · 파퓰 기법',
              },
              {
                name: 'Stylage M',
                ha: '20 mg/ml HA',
                tag: '중등도 주름 · 인기',
                color: gold,
                indication: '팔자주름(NLF) · 마리오네트 라인 · 구각',
                depth: '중간 ~ 심층 진피',
                needle: '27G',
                duration: '9~12개월',
                lidocaine: true,
                desc: '가장 많이 사용되는 중등도 주름 교정 제품. Lidocaine 함유로 시술 시 통증이 적고, Mannitol이 겔을 산화로부터 보호해 효과가 오래 지속됩니다.',
                technique: '레트로그레이드 스레딩 · 팬 기법',
              },
              {
                name: 'Stylage L',
                ha: '24 mg/ml HA',
                tag: '볼륨 복원',
                color: gold,
                indication: '광대·뺨 볼륨 복원 · V라인 · 턱',
                depth: '심층 진피 ~ 피하조직',
                needle: '25G',
                duration: '12~15개월',
                lidocaine: true,
                desc: '안면 볼륨 복원 및 윤곽 리모델링 전용. 광대와 뺨의 지방 손실을 보완하고 V라인을 만드는 데 최적화된 높은 점도의 겔.',
                technique: '볼러스 기법 · 캐뉼라 권장',
              },
              {
                name: 'Stylage XL',
                ha: '26 mg/ml HA',
                tag: '최대 볼륨',
                color: gold,
                indication: '심층 안면 함몰 · 광범위 볼륨 손실',
                depth: '피하조직 이상',
                needle: '23G',
                duration: '12개월 이상',
                lidocaine: false,
                desc: '가장 높은 교정력이 필요한 심층 안면 함몰에 사용. 대용량 볼륨 손실 복원 및 안면 구조적 지지에 적합. 반드시 깊은 층에만 주입.',
                technique: '볼러스 기법 · 심층 캐뉼라 전용',
              },
            ].map((prod, i) => (
              <FadeIn key={prod.name} delay={i * 0.07}>
                <div style={{ background: NS.charcoalMid, padding: '32px 28px' }}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* 왼쪽: 제품명 + 태그 */}
                    <div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: NSF.condensed, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '3px 8px', background: goldPale, color: gold, border: `1px solid rgba(180,146,78,0.3)` }}>
                          Vivacy
                        </span>
                        <span style={{ fontFamily: NSF.condensed, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '3px 8px', background: goldPale, color: goldLt }}>
                          {prod.tag}
                        </span>
                        {prod.lidocaine && (
                          <span style={{ fontFamily: NSF.condensed, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '3px 8px', background: 'rgba(74,111,165,0.12)', color: NS.accent, border: `1px solid rgba(74,111,165,0.25)` }}>
                            Lidocaine
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: NSF.serif, fontSize: 36, fontWeight: 300, color: '#fff', lineHeight: 1, marginBottom: 6 }}>{prod.name}</div>
                      <div style={{ fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.12em', color: gold, marginBottom: 12 }}>{prod.ha}</div>
                      <p style={{ fontSize: 12.5, fontWeight: 300, lineHeight: 1.75, color: NS.silverDark }}>{prod.desc}</p>
                    </div>
                    {/* 가운데: 적응증 + 스펙 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: '적응증',  value: prod.indication },
                        { label: '주입층',  value: prod.depth },
                        { label: '권장 니들', value: prod.needle + ' needle' },
                        { label: '지속 기간', value: prod.duration },
                      ].map(row => (
                        <div key={row.label} style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                          <span style={{ fontFamily: NSF.condensed, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: NS.silverDark, flexShrink: 0, width: 60, paddingTop: 2 }}>{row.label}</span>
                          <span style={{ fontWeight: 300, color: NS.silverLight, lineHeight: 1.5 }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                    {/* 오른쪽: 주입 기법 */}
                    <div style={{ padding: '20px', border: `1px solid rgba(180,146,78,0.15)`, background: 'rgba(180,146,78,0.04)' }}>
                      <p style={{ fontFamily: NSF.condensed, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: gold, marginBottom: 8 }}>Injection Technique</p>
                      <p style={{ fontSize: 12, fontWeight: 300, color: NS.silverLight, lineHeight: 1.7 }}>{prod.technique}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ④ 임상 데이터 — 오프화이트 */}
      <section style={{ background: NS.offWhite, padding: '80px 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <FadeIn>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 24, height: 1, background: gold, flexShrink: 0 }} />
              <span style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: gold }}>CLINICAL EVIDENCE</span>
            </div>
            <h3 style={{ fontFamily: NSF.serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: NS.charcoal, lineHeight: 1.1, marginBottom: '3rem' }}>
              Mannitol이 입증하는<br /><em style={{ fontStyle: 'italic', color: NS.warm }}>지속적 효과</em>
            </h3>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: `rgba(200,205,212,0.3)` }}>
            {[
              { pct: '3×',   name: 'HA 분해 억제',    sub: 'vs 표준 HA 겔, in vitro' },
              { pct: '12+',  name: '개월 효과 지속',  sub: 'Stylage L·XL 기준' },
              { pct: '92%',  name: '환자 만족도',      sub: '임상 설문, 6개월 후' },
              { pct: '100%', name: 'CE 인증 제품',     sub: '전 라인 유럽 인증' },
            ].map((e, i) => (
              <FadeIn key={e.name} delay={i * 0.07}>
                <div style={{ background: '#fff', padding: '36px 24px' }}>
                  <div style={{ fontFamily: NSF.condensed, fontSize: 36, fontWeight: 200, color: NS.charcoal, lineHeight: 1, letterSpacing: '-0.02em' }}>
                    <span style={{ color: gold }}>{e.pct.charAt(0)}</span>{e.pct.slice(1)}
                  </div>
                  <div style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.muted, marginTop: 10, lineHeight: 1.4 }}>
                    {e.name}<br /><span style={{ color: NS.silverDark }}>{e.sub}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤ 시술 프로토콜 + 적응증 선택 가이드 — 화이트 */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeIn>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 24, height: 1, background: gold, flexShrink: 0 }} />
                <span style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: gold }}>PRODUCT SELECTION GUIDE</span>
              </div>
              <h3 style={{ fontFamily: NSF.serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: NS.charcoal, lineHeight: 1.1, marginBottom: '1rem' }}>
                적응증에 따른<br /><em style={{ fontStyle: 'italic', color: NS.warm }}>제품 선택 가이드</em>
              </h3>
              <p style={{ fontSize: 13, fontWeight: 300, color: NS.silverDark, lineHeight: 1.7, marginBottom: '2rem' }}>
                Stylage 라인은 잔주름부터 심층 볼륨 복원까지 단계별로 선택하세요.
              </p>
              <div>
                {[
                  { prod: 'S',   zone: '눈가 · 이마 · 구순', depth: '표재성', note: '가장 섬세한 부위 전용' },
                  { prod: 'M',   zone: '팔자주름 · 마리오네트', depth: '중등도', note: 'Lidocaine 함유 · 가장 인기' },
                  { prod: 'L',  zone: '광대 · 뺨 · V라인',  depth: '볼륨층',  note: 'Lidocaine 함유 · 캐뉼라 권장' },
                  { prod: 'XL', zone: '심층 함몰 교정',      depth: '피하',   note: '최대 교정력 · 심층 전용' },
                ].map((row, i) => (
                  <div key={row.prod} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 20, padding: '20px 0', borderBottom: `1px solid ${NS.silverLight}`, borderTop: i === 0 ? `1px solid ${NS.silverLight}` : undefined }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, border: `1px solid rgba(180,146,78,0.3)`, background: goldPale }}>
                      <span style={{ fontFamily: NSF.condensed, fontSize: 12, letterSpacing: '0.1em', color: gold, fontWeight: 600 }}>{row.prod}</span>
                    </div>
                    <div>
                      <p style={{ fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.charcoal, fontWeight: 500, marginBottom: 2 }}>{row.zone}</p>
                      <p style={{ fontSize: 12, fontWeight: 300, color: NS.silverDark }}>{row.depth} · {row.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div style={{ background: NS.charcoal, padding: 'clamp(24px, 5vw, 44px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 24, height: 1, background: gold, flexShrink: 0 }} />
                  <span style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: gold }}>TREATMENT PROTOCOL</span>
                </div>
                <h4 style={{ fontFamily: NSF.serif, fontSize: '1.6rem', fontWeight: 300, color: '#fff', marginBottom: '1.5rem', lineHeight: 1.2 }}>Stylage 시술 프로토콜</h4>
                <div>
                  {[
                    { step: '01', name: '초기 교정', period: '1~2회 시술',  desc: 'Stylage 적응증 평가 후 목표 볼륨·깊이에 맞는 제품 선택. 1차 시술로 충분한 교정 효과 확인.' },
                    { step: '02', name: '보정 단계', period: '2~4주 후',    desc: '필요 시 Touch-up 시술. Mannitol로 겔이 안정화된 시점에서 최종 결과 평가 및 미세 조정.' },
                    { step: '03', name: '유지 단계', period: '6~12개월 후', desc: '효과 지속 기간 후 유지 시술. Stylage L·XL은 12개월 이상, S·M은 6~12개월 주기 권장.' },
                  ].map((p, i) => (
                    <div key={p.step} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 20, padding: '24px 0', borderBottom: i < 2 ? `1px solid rgba(200,205,212,0.1)` : 'none', borderTop: i === 0 ? `1px solid rgba(200,205,212,0.1)` : undefined }}>
                      <div style={{ fontFamily: NSF.serif, fontSize: 34, fontWeight: 300, color: NS.silver, lineHeight: 1, paddingTop: 2 }}>{p.step}</div>
                      <div>
                        <p style={{ fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', fontWeight: 500, marginBottom: 4 }}>
                          {p.name} <span style={{ color: gold, marginLeft: 8 }}>{p.period}</span>
                        </p>
                        <p style={{ fontSize: 12, fontWeight: 300, lineHeight: 1.65, color: NS.silverDark }}>{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ⑥ Results Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ background: NS.charcoalMid }}>
        {[
          { pct: '3×',  label: 'HA 분해 억제 효과' },
          { pct: '92',  label: '% 환자 만족도' },
          { pct: '12+', label: '개월 효과 지속 (X·XL)' },
          { pct: '4',   label: '가지 라인 최적 선택' },
        ].map((r, i) => (
          <div key={r.label} style={{ padding: '36px 20px', borderRight: i % 2 === 0 ? '1px solid rgba(200,205,212,0.1)' : 'none', borderBottom: i < 2 ? '1px solid rgba(200,205,212,0.1)' : 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: NSF.serif, fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 300, color: '#fff', lineHeight: 1 }}>
              <span style={{ color: gold }}>{r.pct}</span>
            </div>
            <div style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: NS.silverDark, marginTop: 8 }}>{r.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <CtaSection title="Stylage® 도입 상담" />
    </div>
  )
}

/* ══════════════════════════════════════════════
   공통 CTA
══════════════════════════════════════════════ */
function CtaSection({ title }: { title: string }) {
  return (
    <section style={{ background: NS.offWhite, padding: '80px 0', borderTop: `1px solid ${NS.silverLight}` }}>
      <FadeIn>
        <div className="container mx-auto px-6 text-center">
          <NSLabel><span style={{ margin: '0 auto' }}>CONTACT</span></NSLabel>
          <h3 style={{ fontFamily: NSF.serif, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 300, color: NS.charcoal, lineHeight: 1.1, marginBottom: '1rem' }}>{title}</h3>
          <p style={{ fontSize: 13, fontWeight: 300, color: NS.silverDark, lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
            제품 가격, 시술 프로토콜, 교육 일정 등 궁금한 점을 문의해주세요.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/#contact"
              className="inline-flex items-center no-underline transition-all hover:-translate-y-0.5"
              style={{ padding: '14px 36px', fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', background: NS.charcoal, color: NS.silverLight, borderRadius: 0 }}>
              도입 상담하기 →
            </Link>
            <Link href="/"
              className="inline-flex items-center no-underline border transition-all hover:-translate-y-0.5"
              style={{ padding: '14px 36px', fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', borderColor: NS.charcoal, color: NS.charcoal, borderRadius: 0 }}>
              홈으로
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}

/* ══════════════════════════════════════════════
   메인 페이지 (서버 컴포넌트)
══════════════════════════════════════════════ */
export default async function AcademyPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  /* 승인된 회원만 접근 */
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/')
    const { data: profile } = await supabase
      .from('profiles').select('approved').eq('id', user.id).single()
    if (!profile?.approved) redirect('/')
  } catch {
    redirect('/')
  }

  const tab = searchParams.tab ?? 'stylage'

  return (
    <main style={{ background: NS.offWhite, paddingTop: 80 }}>

      {/* 헤더 */}
      <section style={{ background: NS.charcoal, padding: '56px 0', borderBottom: '1px solid rgba(200,205,212,0.1)' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 24, height: 1, background: 'rgba(200,205,212,0.4)', flexShrink: 0 }} />
            <span style={{ fontFamily: NSF.condensed, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: NS.silverDark }}>ISKINZ ACADEMY</span>
          </div>
          <h1 style={{ fontFamily: NSF.serif, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: '0.75rem' }}>임상 교육 자료</h1>
          <p style={{ fontFamily: NSF.condensed, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: NS.silverDark }}>
            승인된 의료진 전용 · 제품 소개 및 임상 프로토콜 자료
          </p>
        </div>
      </section>

      {/* 탭 */}
      <div className="sticky top-[72px] z-30" style={{ background: NS.charcoalMid, borderBottom: '1px solid rgba(200,205,212,0.1)' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map(t => {
              const isActive = tab === t.id
              return (
                <Link
                  key={t.id}
                  href={`/academy?tab=${t.id}`}
                  className="flex-shrink-0 no-underline transition-all"
                  style={{
                    padding: '16px 24px',
                    fontFamily: NSF.condensed,
                    fontSize: 11,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    borderBottom: isActive ? `2px solid ${NS.accent}` : '2px solid transparent',
                    color: isActive ? NS.silverLight : NS.silverDark,
                  }}
                >
                  {t.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      {tab === 'nanosoft' ? <NanosoftContent /> : tab === 'stylage' ? <StyleageContent /> : <NctfContent />}

    </main>
  )
}
