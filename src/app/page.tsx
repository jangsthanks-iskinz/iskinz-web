import { FadeIn } from '@/components/ui/FadeIn'
import { ContactSection } from '@/components/home/ContactSection'
import { HomeLoginForm } from '@/components/home/HomeLoginForm'
import { createClient } from '@/lib/supabase/server'
import { SITE } from '@/constants/site'

const BLUE = '#1757C2'
const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

function GuestPage({ isPending }: { isPending: boolean }) {
  return (
    <div className="min-h-screen flex items-stretch" style={{ background: '#ffffff', paddingTop: 100, paddingBottom: 80 }}>

      {/* 왼쪽: 브랜드 소개 */}
      <div className="hidden lg:flex flex-col justify-center px-16 xl:px-24 flex-1">
        <div className="mb-10">
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 'clamp(1.8rem, 2.8vw, 2.6rem)', fontWeight: 600, letterSpacing: '0.12em', color: '#111827' }}>
            ISKINZ
          </span>
          <span className="block mt-2" style={{ fontFamily: PRETENDARD, fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase', color: '#9CA3AF' }}>
            Medical Aesthetic Supply
          </span>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div style={{ width: 28, height: 1, background: BLUE, flexShrink: 0 }} />
          <span style={{ fontFamily: PRETENDARD, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: BLUE }}>
            B2B Hospital Exclusive
          </span>
        </div>

        <h1 style={{ fontFamily: PRETENDARD, fontSize: 'clamp(2rem, 3.2vw, 3rem)', fontWeight: 700, lineHeight: 1.2, color: '#111827', marginBottom: '1.5rem' }}>
          미용성형 시술 병원과<br />
          함께 성장하는 파트너<br />
          <span style={{ color: BLUE }}>아이스킨즈</span>
        </h1>

        <p className="text-sm leading-relaxed mb-10" style={{ fontFamily: PRETENDARD, color: '#6B7280', maxWidth: 440, lineHeight: 1.9 }}>
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
            <div key={t} className="flex items-center gap-3 text-sm" style={{ fontFamily: PRETENDARD, color: '#374151' }}>
              <span style={{ color: BLUE, fontWeight: 700 }}>—</span> {t}
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 flex gap-6 text-xs" style={{ borderTop: '1px solid #F3F4F6', fontFamily: PRETENDARD, color: '#9CA3AF' }}>
          <span>{SITE.phone}</span>
          <span>{SITE.email}</span>
        </div>
      </div>

      {/* 오른쪽: 로그인 카드 */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[440px] xl:w-[480px] flex-shrink-0 px-8 py-12">

        {/* 모바일 로고 */}
        <div className="lg:hidden mb-8 text-center">
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.12em', color: '#111827' }}>ISKINZ</span>
          <span className="block mt-1" style={{ fontFamily: PRETENDARD, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9CA3AF' }}>Medical Aesthetic Supply</span>
        </div>

        <div className="w-full max-w-sm p-8" style={{ background: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 10 }}>
          {isPending ? (
            <div className="text-center py-6">
              <div className="w-11 h-11 mx-auto mb-5 flex items-center justify-center"
                style={{ border: `1px solid rgba(23,87,194,0.4)`, background: 'rgba(23,87,194,0.08)', borderRadius: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke={BLUE} strokeWidth="1.5"/>
                  <path d="M12 7v6" stroke={BLUE} strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="16.5" r="1" fill={BLUE}/>
                </svg>
              </div>
              <h2 className="font-medium text-base mb-2" style={{ fontFamily: PRETENDARD, color: '#111827' }}>승인 검토 중</h2>
              <p className="text-sm leading-relaxed mb-5" style={{ fontFamily: PRETENDARD, color: '#6B7280' }}>
                회원가입 신청이 완료되었습니다.<br />
                담당자 검토 후 <strong style={{ color: '#111827' }}>24시간 이내</strong>에 연락드립니다.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 text-[11px]"
                style={{ fontFamily: PRETENDARD, background: 'rgba(23,87,194,0.08)', color: BLUE, border: `1px solid rgba(23,87,194,0.25)`, borderRadius: 6 }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: BLUE }} />
                승인 대기 중
              </div>
              <p className="mt-5 text-xs" style={{ fontFamily: PRETENDARD, color: '#9CA3AF' }}>문의: {SITE.phone}</p>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <p style={{ fontFamily: PRETENDARD, fontSize: '0.75rem', fontWeight: 400, color: '#9CA3AF', marginBottom: '0.25rem' }}>환영합니다</p>
                <h2 style={{ fontFamily: PRETENDARD, fontSize: '1.25rem', fontWeight: 700, color: BLUE, marginBottom: '0.25rem', letterSpacing: '0.04em' }}>
                  PARTNER LOGIN
                </h2>
                <p style={{ fontFamily: PRETENDARD, fontSize: '0.7rem', color: '#9CA3AF' }}>
                  승인된 의료기관 및 파트너 전용 서비스입니다.
                </p>
              </div>
              <HomeLoginForm />
            </>
          )}
        </div>

        <div className="mt-5 text-center text-xs" style={{ fontFamily: PRETENDARD, color: '#9CA3AF' }}>
          <p>{SITE.phone}</p>
        </div>
      </div>
    </div>
  )
}

function ApprovedPage() {
  return (
    <>
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-center px-6"
        style={{ paddingTop: 100, paddingBottom: 100, background: '#ffffff' }}>
        <div className="relative z-10 max-w-4xl w-full">
          <div className="inline-flex items-center gap-3 px-6 py-2 mb-12 text-[10px]"
            style={{ fontFamily: PRETENDARD, letterSpacing: '0.35em', textTransform: 'uppercase', color: BLUE, border: `1px solid rgba(23,87,194,0.2)`, background: 'rgba(23,87,194,0.05)', borderRadius: 6 }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
            B2B 병원 전용 프리미엄 메디컬 에스테틱
          </div>

          <h1 style={{ fontFamily: PRETENDARD, fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', fontWeight: 700, lineHeight: 1.08, color: '#111827', letterSpacing: '-0.01em', marginBottom: '1.5rem' }}>
            병원이 믿고 맡기는<br />
            <span style={{ color: BLUE }}>메디컬 에스테틱 파트너</span>
          </h1>

          <p className="text-base leading-relaxed max-w-[500px] mx-auto mb-3" style={{ fontFamily: PRETENDARD, color: '#6B7280' }}>
            정품 보증 · 임상 교육 · 당일 배송 · 맞춤 제안
          </p>
          <p className="text-[11px] mb-12" style={{ fontFamily: PRETENDARD, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9CA3AF' }}>
            Fillmed 정식 공급원 · CE Marked Products
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#products" className="inline-flex items-center gap-2 px-8 py-3.5 text-[12px] no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ fontFamily: PRETENDARD, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, background: BLUE, color: '#fff', borderRadius: 6 }}>
              제품 보기
            </a>
            <a href="#contact" className="inline-flex items-center px-8 py-3.5 text-[12px] no-underline transition-all hover:-translate-y-0.5"
              style={{ fontFamily: PRETENDARD, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, background: 'transparent', color: BLUE, border: `1.5px solid ${BLUE}`, borderRadius: 6 }}>
              견적 문의
            </a>
          </div>
        </div>
      </section>

      <section className="py-3.5 border-y" style={{ background: BLUE, borderColor: BLUE }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-x-5 sm:gap-x-10 md:gap-x-14 gap-y-2 items-center">
            {['의료기기판매업 신고 업체', 'Fillmed 정식 공급원', '오후 2시 이전 주문 당일 배송', '임상 프로토콜 무상 제공'].map(t => (
              <span key={t} className="text-[11px]" style={{ fontFamily: PRETENDARD, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="py-28" style={{ background: '#F9FAFB' }}>
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div style={{ width: 28, height: 1, background: BLUE }} />
                <span style={{ fontFamily: PRETENDARD, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: BLUE }}>OUR PRODUCTS</span>
                <div style={{ width: 28, height: 1, background: BLUE }} />
              </div>
              <h2 style={{ fontFamily: PRETENDARD, fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>
                병원을 위한 프리미엄<br />메디컬 에스테틱 라인업
              </h2>
              <p className="text-sm" style={{ fontFamily: PRETENDARD, color: '#6B7280' }}>가격 정보는 병원 회원 승인 후 공개됩니다</p>
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
                <div className="p-8 bg-white border transition-all duration-300 hover:-translate-y-1 hover:shadow-sm" style={{ borderColor: '#E5E7EB', borderRadius: 10 }}>
                  <span className="block mb-2" style={{ fontFamily: PRETENDARD, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9CA3AF' }}>{cat.label}</span>
                  <h3 style={{ fontFamily: PRETENDARD, fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1.25rem' }}>{cat.labelKo}</h3>
                  <ul className="space-y-2">
                    {cat.products.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm" style={{ fontFamily: PRETENDARD, color: '#6B7280' }}>
                        <span style={{ color: BLUE }}>—</span> {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
                    <span style={{ fontFamily: PRETENDARD, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: BLUE, fontWeight: 600 }}>자세히 보기 →</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  )
}

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
