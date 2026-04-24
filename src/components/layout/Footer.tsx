import Link from 'next/link'
import { SITE } from '@/constants/site'

const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF     = 'Cormorant Garamond, Georgia, serif'

export function Footer() {
  return (
    <footer style={{ background: '#1a1d22' }} className="pt-24 pb-8">
      <div className="container mx-auto px-6">

        {/* Top accent line */}
        <div className="mb-14 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,205,212,0.25), transparent)' }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-14">

          {/* Col 1: Brand + SNS */}
          <div className="lg:col-span-1">
            <span style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 400, letterSpacing: '0.14em', color: '#e8ebee' }} className="block mb-1">
              IS<span style={{ color: '#b5a99a' }}>KIN</span>Z
            </span>
            <span className="block mb-4" style={{ fontFamily: CONDENSED, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,205,212,0.3)' }}>
              Medical Aesthetic Supply
            </span>
            <p className="text-[11px] leading-relaxed mb-5" style={{ color: 'rgba(200,205,212,0.35)' }}>
              B2B 병원 전용<br />프리미엄 메디컬 에스테틱<br />공급 플랫폼
            </p>
            <div className="flex gap-2.5">
              {/* Instagram */}
              <a href={SITE.sns.instagram} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border no-underline transition-all hover:border-[#b5a99a]"
                style={{ borderColor: 'rgba(200,205,212,0.2)', borderRadius: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="white" strokeOpacity="0.45" strokeWidth="1.8"/>
                  <circle cx="12" cy="12" r="4.2" stroke="white" strokeOpacity="0.45" strokeWidth="1.8"/>
                  <circle cx="17.5" cy="6.5" r="1.1" fill="white" fillOpacity="0.45"/>
                </svg>
              </a>
              {/* KakaoTalk */}
              <a href={SITE.sns.kakao} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border no-underline transition-all hover:border-[#b5a99a]"
                style={{ borderColor: 'rgba(200,205,212,0.2)', borderRadius: 0 }}>
                <svg width="15" height="14" viewBox="0 0 24 23" fill="none">
                  <path d="M12 1C5.925 1 1 5.028 1 10.012c0 3.276 2.064 6.153 5.19 7.822L5.1 22.1a.4.4 0 0 0 .573.44l5.63-3.29c.226.018.454.027.697.027 6.075 0 11-4.028 11-9.012C23 5.028 18.075 1 12 1Z" fill="white" fillOpacity="0.45"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Company Info */}
          <div className="lg:col-span-1">
            <p className="mb-4 text-white" style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>회사 정보</p>
            <ul className="flex flex-col gap-1.5 text-[11px]" style={{ color: 'rgba(200,205,212,0.38)' }}>
              <li><span className="text-white/20">상호</span> {SITE.companyNameKo}</li>
              <li><span className="text-white/20">대표</span> {SITE.ceoName}</li>
              <li><span className="text-white/20">사업자</span> {SITE.businessNumber}</li>
              <li className="leading-snug"><span className="text-white/20">주소</span> {SITE.address}</li>
              <li><span className="text-white/20">전화</span> {SITE.phone}</li>
            </ul>
          </div>

          {/* Col 3: Licenses */}
          <div className="lg:col-span-1">
            <p className="mb-4 text-white" style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>인허가</p>
            <ul className="flex flex-col gap-1.5 text-[10px]" style={{ color: 'rgba(200,205,212,0.38)' }}>
              <li>✓ {SITE.businessLicense}</li>
              <li>✓ {SITE.mailOrderLicense}</li>
              <li>✓ {SITE.cosmeticLicense}</li>
              <li>✓ Fillmed 정식 공급원</li>
            </ul>
          </div>

          {/* Col 4: Navigation */}
          <div className="lg:col-span-1">
            <p className="mb-4 text-white" style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>메뉴</p>
            <ul className="flex flex-col gap-2.5 list-none text-[11px]">
              {[
                { href: '/#about',    label: 'About ISKINZ' },
                { href: '/#products', label: 'Products' },
                { href: '/academy',   label: 'Academy' },
                { href: '/#contact',  label: 'Contact' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="no-underline transition-colors hover:text-white"
                    style={{ fontFamily: CONDENSED, letterSpacing: '0.08em', color: 'rgba(200,205,212,0.4)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5–6: 병원 회원가입 + 고객센터 */}
          <div className="lg:col-span-2 border p-6 flex flex-col justify-between gap-6"
            style={{ borderColor: 'rgba(200,205,212,0.08)', background: 'rgba(200,205,212,0.025)', borderRadius: 0 }}>

            <div>
              <p className="mb-3 text-white" style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>병원 회원가입</p>
              <p className="text-[12px] leading-relaxed mb-4" style={{ color: 'rgba(200,205,212,0.38)' }}>
                승인된 의료기관만 이용 가능한<br />B2B 전용 플랫폼입니다.<br />가입 신청 후 24시간 내 승인 검토.
              </p>
              <Link href="/signup"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[11px] no-underline transition-all hover:-translate-y-0.5"
                style={{ fontFamily: CONDENSED, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#e8ebee', color: '#1e2025', borderRadius: 0 }}>
                병원 회원가입하기 →
              </Link>
            </div>

            <div className="h-px" style={{ background: 'rgba(200,205,212,0.07)' }} />

            <div>
              <p className="mb-3 text-white" style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>고객센터</p>
              <p className="font-medium text-base text-white mb-0.5" style={{ fontFamily: CONDENSED, letterSpacing: '0.05em' }}>{SITE.phone}</p>
              <p className="text-[12px] mb-0.5" style={{ color: 'rgba(200,205,212,0.4)' }}>{SITE.email}</p>
              <p className="text-[11px] mb-4" style={{ color: 'rgba(200,205,212,0.25)' }}>{SITE.businessHours}</p>
              <Link href="/#contact"
                className="inline-flex items-center px-4 py-2 text-[11px] no-underline transition-all hover:-translate-y-0.5"
                style={{ fontFamily: CONDENSED, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#b5a99a', color: '#1a1d22', borderRadius: 0 }}>
                문의하기 →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-8 flex flex-wrap justify-between items-center gap-4" style={{ borderColor: 'rgba(200,205,212,0.07)' }}>
          <p className="text-[11px]" style={{ color: 'rgba(200,205,212,0.2)' }}>
            © 2026 ISKINZ ({SITE.companyNameKo}). All rights reserved.
          </p>
          <div className="flex gap-6">
            {['이용약관', '개인정보처리방침', '사업자정보확인'].map(label => (
              <Link key={label} href="#" className="text-[11px] no-underline transition-colors hover:text-white"
                style={{ fontFamily: CONDENSED, letterSpacing: '0.08em', color: 'rgba(200,205,212,0.22)' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
