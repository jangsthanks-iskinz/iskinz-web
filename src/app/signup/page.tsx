'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const C = { charcoal: '#1e2025', silver: '#c8cdd4', silverLight: '#e8ebee', silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5', warm: '#b5a99a' }
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'
const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    email: '', password: '', confirm: '',
    memberType: '', name: '', birthDate: '',
    phone: '', hospitalName: '', licenseNumber: '',
    businessNumber: '', postcode: '', address: '', addressDetail: '',
    taxEmailType: 'same', taxEmail: '',
    agreeTerms: false, agreePrivacy: false, agreeMarketing: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  function handleChange(key: string, value: string | boolean) {
    setForm(v => ({ ...v, [key]: value }))
  }

  function formatBirth(v: string) {
    v = v.replace(/[^0-9]/g, '')
    if (v.length >= 5) v = v.slice(0,4) + '/' + v.slice(4)
    if (v.length >= 8) v = v.slice(0,7) + '/' + v.slice(7)
    return v.slice(0,10)
  }

  function formatPhone(v: string) {
    v = v.replace(/[^0-9]/g, '')
    if (v.length >= 4) v = v.slice(0,3) + '-' + v.slice(3)
    if (v.length >= 9) v = v.slice(0,8) + '-' + v.slice(8)
    return v.slice(0,13)
  }

  function formatBiz(v: string) {
    v = v.replace(/[^0-9]/g, '')
    if (v.length >= 4) v = v.slice(0,3) + '-' + v.slice(3)
    if (v.length >= 7) v = v.slice(0,6) + '-' + v.slice(6)
    return v.slice(0,12)
  }

  function openPostcode() {
    if (typeof window === 'undefined') return
    new (window as any).daum.Postcode({
      oncomplete: function(data: any) {
        handleChange('postcode', data.zonecode)
        handleChange('address', data.roadAddress)
        setTimeout(() => {
          document.getElementById('addressDetail')?.focus()
        }, 100)
      }
    }).open()
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!form.agreeTerms || !form.agreePrivacy) { setError('필수 약관에 동의해주세요.'); return }
    if (form.password !== form.confirm) { setError('비밀번호가 일치하지 않습니다.'); return }
    if (form.password.length < 6) { setError('비밀번호는 최소 6자 이상이어야 합니다.'); return }
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name } },
    })
    if (err) { setError(err.message); setLoading(false); return }

    const taxEmail = form.taxEmailType === 'same' ? form.email : form.taxEmail

    fetch('/api/auth/sync-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        name: form.name,
        phone: form.phone,
        hospital_name: form.hospitalName,
        member_type: form.memberType,
        birth_date: form.birthDate,
        license_number: form.licenseNumber,
        business_number: form.businessNumber,
        postcode: form.postcode,
        address: form.address,
        address_detail: form.addressDetail,
        tax_email: taxEmail,
        marketing_agreed: form.agreeMarketing,
      }),
    }).catch(() => null)

    fetch('/api/auth/signup-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email }),
    }).catch(() => null)

    setDone(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    border: `1px solid ${C.silver}`,
    background: C.offWhite, fontSize: 15,
    fontFamily: PRETENDARD, outline: 'none', borderRadius: 6,
    boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: PRETENDARD,
    fontSize: 13, fontWeight: 600,
    color: C.silverDark, marginBottom: 7,
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: C.offWhite }}>
        <div className="text-center max-w-md">
          <div style={{ width: 48, height: 48, border: `1px solid rgba(74,111,165,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', borderRadius: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h2 style={{ fontFamily: PRETENDARD, fontSize: '1.4rem', fontWeight: 700, color: C.charcoal, marginBottom: 12 }}>이메일을 확인해주세요</h2>
          <p style={{ fontFamily: PRETENDARD, fontSize: 14, color: C.silverDark, lineHeight: 1.7, marginBottom: 24 }}>
            {form.email}로 인증 메일을 발송했습니다.<br />메일의 링크를 클릭하면 가입이 완료됩니다.
          </p>
          <Link href="/login" style={{ fontFamily: PRETENDARD, fontSize: 13, color: C.accent, textDecoration: 'none' }}>
            로그인 페이지로 →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: C.offWhite }}>
      <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <Link href="/" style={{ fontFamily: PRETENDARD, fontSize: '1.8rem', fontWeight: 700, letterSpacing: '0.08em', color: C.charcoal, textDecoration: 'none' }}>
            ISKINZ
          </Link>
          <p style={{ fontFamily: PRETENDARD, fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.silverDark, marginTop: 8 }}>
            병원 회원가입
          </p>
        </div>

        <div className="bg-white border" style={{ borderColor: C.silver, borderRadius: 10 }}>
          <div style={{ height: 2, background: C.warm, borderRadius: '10px 10px 0 0' }} />
          <div style={{ padding: '32px' }}>
            <form onSubmit={handleSignup}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* 이메일 */}
                <div>
                  <label style={labelStyle}>로그인 이메일 <span style={{ color: '#B84A4A' }}>*</span></label>
                  <input type="email" placeholder="example@hospital.com" required
                    value={form.email} onChange={e => handleChange('email', e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = C.silver}
                  />
                </div>

                {/* 비밀번호 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>비밀번호 <span style={{ color: '#B84A4A' }}>*</span></label>
                    <input type="password" placeholder="6자 이상 입력" required
                      value={form.password} onChange={e => handleChange('password', e.target.value)}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>비밀번호 확인 <span style={{ color: '#B84A4A' }}>*</span></label>
                    <input type="password" placeholder="비밀번호 재입력" required
                      value={form.confirm} onChange={e => handleChange('confirm', e.target.value)}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${C.silver}`, paddingTop: 16 }}>
                  <div style={{ fontFamily: PRETENDARD, fontSize: 12, fontWeight: 600, color: C.silverDark, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.15em' }}>기본 정보</div>
                </div>

                {/* 회원 구분 */}
                <div>
                  <label style={labelStyle}>회원 구분 <span style={{ color: '#B84A4A' }}>*</span></label>
                  <select required value={form.memberType} onChange={e => handleChange('memberType', e.target.value)}
                    style={{ ...inputStyle, background: '#fff' }}>
                    <option value="">선택해주세요</option>
                    <option value="대표원장">대표원장</option>
                    <option value="개원예정의">개원예정의</option>
                    <option value="봉직의">봉직의</option>
                    <option value="의료기관 직원">의료기관 직원</option>
                  </select>
                </div>

                {/* 성명 + 생년월일 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>성명 <span style={{ color: '#B84A4A' }}>*</span></label>
                    <input type="text" placeholder="홍길동" required
                      value={form.name} onChange={e => handleChange('name', e.target.value)}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>생년월일 <span style={{ color: '#B84A4A' }}>*</span></label>
                    <input type="text" placeholder="YYYY/MM/DD" required maxLength={10}
                      value={form.birthDate}
                      onChange={e => handleChange('birthDate', formatBirth(e.target.value))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                </div>

                {/* 휴대폰 + 병원명 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>휴대폰번호 <span style={{ color: '#B84A4A' }}>*</span></label>
                    <input type="text" placeholder="010-0000-0000" required maxLength={13}
                      value={form.phone}
                      onChange={e => handleChange('phone', formatPhone(e.target.value))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>병원명 <span style={{ color: '#B84A4A' }}>*</span></label>
                    <input type="text" placeholder="○○의원" required
                      value={form.hospitalName} onChange={e => handleChange('hospitalName', e.target.value)}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                </div>

                {/* 면허번호 + 사업자번호 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>의사면허번호 <span style={{ color: '#B84A4A' }}>*</span></label>
                    <input type="text" placeholder="제 000000 호" required
                      value={form.licenseNumber} onChange={e => handleChange('licenseNumber', e.target.value)}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>사업자번호 <span style={{ color: '#B84A4A' }}>*</span></label>
                    <input type="text" placeholder="000-00-00000" required maxLength={12}
                      value={form.businessNumber}
                      onChange={e => handleChange('businessNumber', formatBiz(e.target.value))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                </div>

                {/* 주소 */}
                <div>
                  <label style={labelStyle}>주소 <span style={{ color: '#B84A4A' }}>*</span></label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <input type="text" placeholder="우편번호" readOnly
                      value={form.postcode}
                      style={{ ...inputStyle, width: 130, background: '#f5f4f1' }}
                    />
                    <button type="button" onClick={openPostcode}
                      style={{ padding: '11px 16px', background: '#fff', border: `1px solid ${C.silver}`, borderRadius: 6, fontSize: 14, fontWeight: 600, fontFamily: PRETENDARD, color: C.charcoal, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      우편번호 검색
                    </button>
                  </div>
                  <input type="text" placeholder="도로명 주소" readOnly
                    value={form.address}
                    style={{ ...inputStyle, background: '#f5f4f1', marginBottom: 6 }}
                  />
                  <input id="addressDetail" type="text" placeholder="상세 주소 입력"
                    value={form.addressDetail} onChange={e => handleChange('addressDetail', e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = C.silver}
                  />
                </div>

                {/* 세금계산서 이메일 */}
                <div>
                  <label style={labelStyle}>세금계산서 수신 이메일 <span style={{ color: '#B84A4A' }}>*</span></label>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 8 }}>
                    {['same', 'direct'].map(v => (
                      <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, fontFamily: PRETENDARD, color: C.charcoal, cursor: 'pointer' }}>
                        <input type="radio" name="taxEmail" value={v}
                          checked={form.taxEmailType === v}
                          onChange={() => handleChange('taxEmailType', v)}
                        />
                        {v === 'same' ? '가입 이메일과 동일' : '직접 입력'}
                      </label>
                    ))}
                  </div>
                  {form.taxEmailType === 'direct' && (
                    <input type="email" placeholder="tax@hospital.com"
                      value={form.taxEmail} onChange={e => handleChange('taxEmail', e.target.value)}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  )}
                </div>

                {/* 약관 */}
                <div style={{ borderTop: `1px solid ${C.silver}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { key: 'agreeTerms', label: '이용약관 동의', required: true },
                    { key: 'agreePrivacy', label: '개인정보 수집 및 이용 동의', required: true },
                    { key: 'agreeMarketing', label: '가입 혜택 및 이벤트 안내 수신 동의', required: false },
                  ].map(item => (
                    <label key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, fontFamily: PRETENDARD, color: C.charcoal, cursor: 'pointer' }}>
                      <input type="checkbox" style={{ marginTop: 3, flexShrink: 0 }}
                        checked={form[item.key as keyof typeof form] as boolean}
                        onChange={e => handleChange(item.key, e.target.checked)}
                      />
                      <span>
                        <strong>{item.label}</strong>{' '}
                        <span style={{ color: item.required ? '#B84A4A' : C.silverDark }}>
                          [{item.required ? '필수' : '선택'}]
                        </span>
                      </span>
                    </label>
                  ))}
                </div>

                {error && (
                  <div style={{ padding: '12px 16px', border: '1px solid rgba(184,74,74,0.3)', background: 'rgba(184,74,74,0.05)', fontSize: 14, color: '#B84A4A', borderRadius: 6, fontFamily: PRETENDARD }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '14px', fontSize: 16, fontWeight: 700, fontFamily: PRETENDARD, background: C.charcoal, color: C.silverLight, border: 'none', borderRadius: 6, cursor: 'pointer', opacity: loading ? 0.6 : 1, marginTop: 4 }}>
                  {loading ? '처리 중...' : '회원가입'}
                </button>

                <div style={{ textAlign: 'center', fontSize: 14, fontFamily: PRETENDARD, color: C.silverDark }}>
                  이미 계정이 있으신가요?{' '}
                  <Link href="/login" style={{ color: C.accent, textDecoration: 'none', fontWeight: 600 }}>
                    로그인 →
                  </Link>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
