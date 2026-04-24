import { FadeIn } from '@/components/ui/FadeIn'

const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF     = 'Cormorant Garamond, Georgia, serif'
const C = {
  charcoal:    '#1e2025',
  charcoalMid: '#2d3038',
  charcoalLt:  '#363a44',
  silver:      '#c8cdd4',
  silverLight: '#e8ebee',
  silverDark:  '#8a9099',
  offWhite:    '#f5f4f1',
  accent:      '#4a6fa5',
  warm:        '#b5a99a',
  muted:       '#5a5f6a',
}

function Label({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const color = dark ? C.silverDark : C.accent
  return (
    <div className="flex items-center gap-4 mb-5">
      <div style={{ width: 24, height: 1, background: color, flexShrink: 0 }} />
      <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color }}>
        {children}
      </span>
    </div>
  )
}

export function NanosoftSection() {
  return (
    <>
      {/* ── NANOSOFT 헤더 / 히어로 ── */}
      <section id="nanosoft" style={{ background: C.charcoal, padding: '100px 0 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <FadeIn>
            <Label dark>ACADEMY · PRODUCT SPOTLIGHT</Label>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end pb-16">
              <div>
                <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(3.5rem, 7vw, 6rem)', fontWeight: 300, color: '#fff', lineHeight: 0.95, letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
                  NANO<em style={{ fontStyle: 'italic', color: C.silver }}>SOFT</em>™
                </h2>
                <p style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.silverDark, marginBottom: '2.5rem' }}>
                  MICRONEEDLES BY FILLMED — 3 PIN · 0.6 MM
                </p>
                <p style={{ fontSize: 13, fontWeight: 300, color: C.silverLight, lineHeight: 1.8, maxWidth: 420, marginBottom: '0.75rem' }}>
                  <strong style={{ display: 'block', fontSize: 16, fontWeight: 300, color: C.silver, marginBottom: 8 }}>BETTER RESULTS IN LESS TIME</strong>
                  특별한 기술 없이도 통증과 다운타임 없이 진피층까지 정확하게 약물을 전달하는 혁신적인 의료기기입니다.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-px" style={{ background: 'rgba(200,205,212,0.1)' }}>
                {[
                  { num: '0.6', unit: 'mm',  label: '마이크로니들 길이' },
                  { num: '3',   unit: 'pin', label: '트리플 핀 구성' },
                  { num: 'CE & KFDA', unit: '', label: '이중 인증' },
                  { num: '30',  unit: 'ea',  label: '1박스 구성' },
                ].map(s => (
                  <div key={s.label} style={{ background: C.charcoalMid, padding: '32px 28px' }}>
                    <div style={{ fontFamily: CONDENSED, fontSize: 32, fontWeight: 200, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                      {s.num}
                      {s.unit && <small style={{ fontSize: 14 }}>{s.unit}</small>}
                    </div>
                    <div style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.silverDark, marginTop: 6 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* ── 인트로 스트립 ── */}
        <div style={{ background: C.silverLight, borderTop: `1px solid ${C.silver}`, borderBottom: `1px solid ${C.silver}`, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, overflowX: 'auto' }}>
          {[
            'Near Painless · 통증 최소화',
            'Minimal Bruising · 멍 최소화',
            'Standardised Depth · 정확한 주입 깊이',
            'Quick & Easy · 빠르고 간편한 시술',
            'All Syringes Compatible · 모든 주사기 호환',
          ].map(t => (
            <div key={t} className="flex items-center gap-3 whitespace-nowrap">
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.accent, flexShrink: 0 }} />
              <span style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.charcoalMid }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT — 화이트 ── */}
      <section style={{ background: '#fff', padding: '100px 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <FadeIn>
              <Label>PRODUCT OVERVIEW</Label>
              <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 300, color: C.charcoal, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                세상에서 가장 작은<br /><em style={{ fontStyle: 'italic', color: C.warm }}>니들의 혁신</em>
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
                  <div key={f.num} style={{
                    display: 'grid', gridTemplateColumns: '52px 1fr', gap: 20,
                    padding: '24px 0',
                    borderBottom: `1px solid ${C.silverLight}`,
                    borderTop: i === 0 ? `1px solid ${C.silverLight}` : undefined,
                  }}>
                    <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 300, color: C.silver, lineHeight: 1, paddingTop: 2 }}>{f.num}</div>
                    <div>
                      <p style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, fontWeight: 500, marginBottom: 6 }}>{f.title}</p>
                      <p style={{ fontSize: 12, fontWeight: 300, lineHeight: 1.65, color: C.silverDark }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── EFFICACY — 다크 ── */}
      <section style={{ background: C.charcoal, padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
        {/* Watermark */}
        <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', fontFamily: SERIF, fontSize: 260, fontWeight: 300, color: 'rgba(200,205,212,0.04)', lineHeight: 1, whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none' }}>
          NCTF
        </div>
        <div className="container mx-auto px-6 lg:px-14 relative">
          <FadeIn>
            <Label dark>NCTF® 135HA CLINICAL DATA</Label>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: '1rem' }}>
              NCTF® 135HA<br /><em style={{ fontStyle: 'italic', color: C.warm }}>임상 효과 데이터</em>
            </h3>
            <p style={{ fontSize: 13, fontWeight: 300, color: C.silverDark, maxWidth: 480, lineHeight: 1.7, marginBottom: '3.5rem' }}>
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
                <div className="group relative overflow-hidden" style={{ background: C.charcoalMid, padding: '24px 20px', cursor: 'default', transition: 'background 0.4s' }}>
                  <div style={{ fontFamily: CONDENSED, fontSize: 'clamp(32px, 6vw, 46px)', fontWeight: 200, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    <span style={{ color: e.pct.startsWith('+') ? C.accent : C.silver, fontSize: 28, fontWeight: 200 }}>{e.pct.charAt(0)}</span>
                    {e.pct.slice(1)}
                  </div>
                  <div style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.silverDark, marginTop: 10, lineHeight: 1.4 }}>
                    {e.name}<br />{e.sub}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TREATMENT ZONES ── */}
      <section style={{ background: C.offWhite, padding: '100px 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <FadeIn>
            <Label>TREATMENT AREAS</Label>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 300, color: C.charcoal, lineHeight: 1.1, marginBottom: '3.5rem' }}>
              예민한 부위를 위해<br /><em style={{ fontStyle: 'italic', color: C.warm }}>특별히 설계</em>되었습니다
            </h3>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '👁',  en: 'PERIORBITAL AREA', ko: '눈가 · 다크서클', desc: '노화 증상이 가장 먼저 나타나는 눈가 부위. 다크서클 48% 개선, 눈가 잔주름 35% 감소 효과.' },
              { icon: '💋', en: 'PERIORAL AREA',     ko: '입술 주변',        desc: '끊임없이 움직이는 입술 주변의 바코드 주름과 팔자 주름을 효과적으로 개선. 35% 감소 효과.' },
              { icon: '🤍', en: 'NECK & DÉCOLLETÉ', ko: '목 · 데콜테',       desc: '기존 시술로 접근하기 어려운 목과 데콜테 부위. 탄력도 27% 개선으로 자연스러운 리프팅 효과.' },
              { icon: '🖐', en: 'HANDS',             ko: '손등',             desc: '피부 노화가 뚜렷하게 나타나는 손등 부위. 수분 공급과 피부 탄력 회복으로 젊고 건강한 손을 되찾습니다.' },
            ].map((z, i) => (
              <FadeIn key={z.en} delay={i * 0.08}>
                <div className="bg-white border transition-all duration-300 hover:-translate-y-1 hover:shadow-md" style={{ padding: '40px 28px', borderColor: C.silverLight, borderRadius: 0 }}>
                  <div style={{ width: 44, height: 44, border: `1px solid ${C.silver}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, fontSize: 18 }}>{z.icon}</div>
                  <p style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, fontWeight: 500, marginBottom: 6 }}>{z.en}</p>
                  <p style={{ fontSize: 14, fontWeight: 300, color: C.charcoal, marginBottom: 10 }}>{z.ko}</p>
                  <p style={{ fontSize: 12, fontWeight: 300, lineHeight: 1.65, color: C.silverDark }}>{z.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW TO USE + SPECS ── */}
      <section style={{ background: '#fff', padding: '100px 0' }}>
        <div className="container mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <FadeIn>
              <Label>HOW TO USE</Label>
              <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 300, color: C.charcoal, lineHeight: 1.1, marginBottom: '2.5rem' }}>
                올바른 사용법으로<br /><em style={{ fontStyle: 'italic', color: C.warm }}>효과를 극대화</em>하세요
              </h3>
              <div>
                {[
                  { num: '1', title: '방향 확인',               desc: '파란색 선이 항상 사용자(시술자) 방향을 향하도록 합니다. 주사기가 옆으로 기울거나 회전되지 않도록 유지합니다.' },
                  { num: '2', title: '피부 신축 후 45° 삽입',   desc: '시술 부위의 피부를 팽팽하게 늘린 후 45도 각도로 삽입합니다. 정확한 각도가 최적의 진피층 전달을 보장합니다.' },
                  { num: '3', title: '천천히 주입 → 파퓰 형성', desc: '파퓰이 형성될 때까지 서서히 압력을 가해 주입합니다. 1cm 간격으로 시술 부위 전체에 균일하게 시술합니다.' },
                  { num: '4', title: '24시간 내 자연 흡수',      desc: '형성된 파퓰은 NCTF® 솔루션의 저장소 역할을 하며, 진피층으로 서서히 확산됩니다. 24시간 이내에 완전히 흡수됩니다.' },
                ].map((s, i) => (
                  <div key={s.num} style={{
                    display: 'grid', gridTemplateColumns: '48px 1fr', gap: 20,
                    padding: '28px 0',
                    borderBottom: `1px solid ${C.silverLight}`,
                    borderTop: i === 0 ? `1px solid ${C.silverLight}` : undefined,
                  }}>
                    <div style={{ fontFamily: SERIF, fontSize: 38, fontWeight: 300, color: C.silver, lineHeight: 1 }}>{s.num}</div>
                    <div>
                      <p style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, fontWeight: 500, marginBottom: 8, paddingTop: 8 }}>{s.title}</p>
                      <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.7, color: '#3a3d44' }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div style={{ background: C.charcoal, padding: 'clamp(24px, 5vw, 48px)' }}>
                <Label dark>SPECIFICATIONS</Label>
                <h4 style={{ fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 300, color: '#fff', marginBottom: '1.75rem', lineHeight: 1.2 }}>제품 사양</h4>
                <div className="grid grid-cols-2" style={{ gap: 1, background: 'rgba(200,205,212,0.1)' }}>
                  {[
                    { val: '3',     unit: '',    key: '마이크로니들 핀 수' },
                    { val: '0.6',   unit: 'mm',  key: '니들 길이' },
                    { val: '30',    unit: '',    key: '박스 당 수량' },
                    { val: '45',    unit: '°',   key: '권장 삽입 각도' },
                  ].map(s => (
                    <div key={s.key} style={{ background: C.charcoalMid, padding: '28px 24px' }}>
                      <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 300, color: '#fff', lineHeight: 1 }}>
                        {s.val}<span style={{ fontSize: 16 }}>{s.unit}</span>
                      </div>
                      <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.silverDark, marginTop: 6 }}>{s.key}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  {['CE Certified', 'KFDA Certified'].map(b => (
                    <div key={b} style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, background: 'rgba(74,111,165,0.12)', border: '1px solid rgba(74,111,165,0.3)', padding: '8px 14px' }}>{b}</div>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: C.silverDark, marginTop: 18, lineHeight: 1.7, fontWeight: 300 }}>
                  1회용 멸균 제품 · 모든 주사기 호환<br />NCTF® 135HA와 최적 호환
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── RESULTS BANNER ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ background: C.charcoalMid }}>
        {[
          { pct: '48', label: '다크서클 개선' },
          { pct: '35', label: '눈가 잔주름 개선' },
          { pct: '35', label: '입 주위 주름 개선' },
          { pct: '27', label: '목 탄력도 개선' },
        ].map((r, i) => (
          <div key={r.label} style={{ padding: '36px 20px', borderRight: i % 2 === 0 ? '1px solid rgba(200,205,212,0.1)' : 'none', borderBottom: i < 2 ? '1px solid rgba(200,205,212,0.1)' : 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
              <span style={{ color: C.accent }}>{r.pct}</span>%
            </div>
            <div style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.silverDark, marginTop: 10 }}>{r.label}</div>
          </div>
        ))}
      </div>
    </>
  )
}
