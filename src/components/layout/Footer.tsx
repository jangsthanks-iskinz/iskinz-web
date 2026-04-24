import Link from 'next/link'
import { SITE } from '@/constants/site'

export function Footer() {
  return (
    <footer style={{ background: '#1757C2' }} className="pt-16 pb-8">
      <div className="container mx-auto px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">

          {/* Col 1: Brand */}
          <div className="lg:col-span-2">
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.12em', color: '#ffffff' }} className="block mb-1">
              ISKINZ
            </span>
            <span className="block mb-4" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
              Medical Aesthetic Supply
            </span>
            <p className="text-sm leading-relaxed mb-5" style={{ fontFamily: "'Pretendard', sans-serif", color: 'rgba(255,255,255,0.6)', lineHeight: 1.9 }}>
              B2B 병원 전용<br />프리미엄 메디컬 에스테틱<br />공급 플랫폼
            </p>
            <div className="flex gap-2.5">
              <a href={SITE.sns.instagram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center no-underline transition-all hover:opacity-70"
                style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="white" strokeOpacity="0.8" strokeWidth="1.8"/>
                  <circle cx="12" cy="12" r="4.2" stroke="white" strokeOpacity="0.8" strokeWidth="1.8"/>
                  <circle cx="17.5" cy="6.5" r="1.1" fill="white" fillOpacity="0.8"/>
                </svg>
              </a>
              <a href={SITE.sns.kakao} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center no-underline transition-all hover:opacity-70"
                style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 6 }}>
                <svg width="15" height="14" viewBox="0 0 24 23" fill="none">
                  <path d="M12 1C5.925 1 1 5.028 1 10.012c0 3.276 2.064 6.153 5.19 7.822L5.1 22.1a.4.4 0 0 0 .573.44l5.63-3.29c.226.018.454.027.697.027 6.075 0 11-4.028 11-9.012C23 5.028 18.075 1 12 1Z" fill="white" fillOpacity="0.8"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Company Info */}
          <div className="lg:col-span-1">
            <p className="mb-4" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 13, fontWeight: 700, color: '#ffffff', letterSpacing: '0.08em' }}>회사 정보</p>
            <ul className="flex flex-col gap-2" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              <li><span style={{ color: 'rgba(255,255,255,0.35)' }}>상호 </span>{SITE.companyNameKo}</li>
              <li><span style={{ color: 'rgba(255,255,255,0.35)' }}>대표 </span>{SITE.ceoName}</li>
              <li><span style={{ color: 'rgba(255,255,255,0.35)' }}>사업자 </span>{SITE.businessNumber}</li>
              <li className="leading-snug"><span style={{ color: 'rgba(255,255,255,0.35)' }}>주소 </span>{SITE.address}</li>
              <li><span style={{ color: 'rgba(255,255,255,0.35)' }}>전화 </span>{SITE.phone}</li>
            </ul>
          </div>

          {/* Col 3: Licenses */}
          <div className="lg:col-span-1">
            <p className="mb-4" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 13, fontWeight: 700, color: '#ffffff', letterSpacing: '0.08em' }}>인허가</p>
            <ul className="flex flex-col gap-2" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              <li>✓ {SITE.businessLicense}</li>
              <li>✓ {SITE.mailOrderLicense}</li>
              <li>✓ {SITE.cosmeticLicense}</li>
              <li>✓ Fillmed 정식 공급원</li>
            </ul>
          </div>

          {/* Col 4: Nav + 고객센터 */}
          <div className="lg:col-span-1">
            <p className="mb-4" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 13, fontWeight: 700, color: '#ffffff', letterSpacing: '0.08em' }}>메뉴</p>
            <ul className="flex flex-col gap-2 list-none mb-8" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 13 }}>
              {[
                { href: '/#about',    label: 'About ISKINZ' },
                { href: '/#products', label: 'Products' },
                { href: '/academy',   label: 'Academy' },
                { href: '/#contact',  label: 'Contact' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="no-underline transition-opacity hover:opacity-100"
                    style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: 고객센터 */}
          <div className="lg:col-span-1">
            <p className="mb-4" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 13, fontWeight: 700, color: '#ffffff', letterSpacing: '0.08em' }}>고객센터</p>
            <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>{SITE.phone}</p>
            <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{SITE.email}</p>
            <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{SITE.businessHours}</p>
            <Link href="/#contact"
              className="inline-flex items-center px-4 py-2 text-sm no-underline transition-all hover:opacity-90"
              style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 700, background: '#fff', color: '#1757C2', borderRadius: 6 }}>
              문의하기 →
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-8 flex flex-wrap justify-between items-center gap-4" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            © 2026 ISKINZ ({SITE.companyNameKo}). All rights reserved.
          </p>
          <div className="flex gap-6">
            {['이용약관', '개인정보처리방침', '사업자정보확인'].map(label => (
              <Link key={label} href="#" className="no-underline transition-opacity hover:opacity-100"
                style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
