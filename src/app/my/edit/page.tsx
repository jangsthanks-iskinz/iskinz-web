'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const C = { charcoal: '#1e2025', silver: '#c8cdd4', silverLight: '#e8ebee', silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5', warm: '#b5a99a' }
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'
const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

export default function EditProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    name: '', hospitalName: '', phone: '',
    birthDate: '', licenseNumber: '', businessNumber: '',
    postcode: '', address: '', addressDetail: '', taxEmail: '',
    memberType: '',
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [pwForm, setPwForm] = useState({ newPw: '', confirmPw: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/login'); return }
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (p) {
        setForm({
          name: p.name ?? '',
          hospitalName: p.hospital_name ?? '',
          phone: p.phone ?? '',
          birthDate: p.birth_date ?? '',
          licenseNumber: p.license_number ?? '',
          businessNumber: p.business_number ?? '',
          postcode: p.postcode ?? '',
          address: p.address ?? '',
          addressDetail: p.address_detail ?? '',
          taxEmail: p.tax_email ?? '',
          memberType: p.member_type ?? '',
        })
      }
      setFetching(false)
    }
    load()
  }, [])

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
        setForm(v => ({ ...v, postcode: data.zonecode, address: data.roadAddress }))
        setTimeout(() => document.getElementById('addressDetail')?.focus(), 100)
      }
    }).open()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch('/api/my/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          hospitalName: form.hospitalName,
          phone: form.phone,
          birthDate: form.birthDate,
          licenseNumber: form.licenseNumber,
          businessNumber: form.businessNumber,
          postcode: form.postcode,
          address: form.address,
          addressDetail: form.addressDetail,
          taxEmail: form.taxEmail,
          memberType: form.memberType,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.message ?? '오류가 발생했습니다.')
      } else {
        setSuccess(true)
        setTimeout(() => router.push('/my'), 1200)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handlePwChange(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)
    if (pwForm.newPw.length < 6) { setPwError('비밀번호는 최소 6자 이상이어야 합니다.'); return }
    if (pwForm.newPw !== pwForm.confirmPw) { setPwError('비밀번호가 일치하지 않습니다.'); return }
    setPwLoading(true)
    try {
      const { error: err } = await supabase.auth.updateUser({ password: pwForm.newPw })
      if (err) { setPwError(err.message); return }
      setPwSuccess(true)
      setPwForm({ newPw: '', confirmPw: '' })
    } finally {
      setPwLoading(false)
    }
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

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.offWhite }}>
        <div style={{ width: 40, height: 1, background: C.silver }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: C.offWhite }}>
      <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      <div className="container mx-auto px-6 max-w-lg">

        <div className="flex items-center gap-4 mb-10">
          <Link href="/my" style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.silverDark, textDecoration: 'none' }}>← 마이페이지</Link>
          <div style={{ width: 1, height: 14, background: C.silver }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 20, height: 1, background: C.accent }} />
              <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.accent }}>PROFILE</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 300, color: C.charcoal }}>회원정보 수정</h1>
          </div>
        </div>

        <div className="bg-white border mb-5" style={{ borderColor: C.silver }}>
          <div style={{ height: 2, background: C.warm }} />
          <div style={{ padding: '36px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* 회원 구분 */}
                <div>
                  <label style={labelStyle}>회원 구분</label>
                  <select value={form.memberType} onChange={e => setForm(v => ({ ...v, memberType: e.target.value }))}
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
                    <input type="text" placeholder="홍길동" required value={form.name}
                      onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>생년월일</label>
                    <input type="text" placeholder="YYYY/MM/DD" maxLength={10} value={form.birthDate}
                      onChange={e => setForm(v => ({ ...v, birthDate: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                </div>

                {/* 휴대폰 + 병원명 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>휴대폰번호</label>
                    <input type="text" placeholder="010-0000-0000" maxLength={13} value={form.phone}
                      onChange={e => setForm(v => ({ ...v, phone: formatPhone(e.target.value) }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>병원명</label>
                    <input type="text" placeholder="○○의원" value={form.hospitalName}
                      onChange={e => setForm(v => ({ ...v, hospitalName: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                </div>

                {/* 면허번호 + 사업자번호 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>의사면허번호</label>
                    <input type="text" placeholder="제 000000 호" value={form.licenseNumber}
                      onChange={e => setForm(v => ({ ...v, licenseNumber: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>사업자번호</label>
                    <input type="text" placeholder="000-00-00000" maxLength={12} value={form.businessNumber}
                      onChange={e => setForm(v => ({ ...v, businessNumber: formatBiz(e.target.value) }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver}
                    />
                  </div>
                </div>

                {/* 주소 */}
                <div>
                  <label style={labelStyle}>주소</label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <input type="text" placeholder="우편번호" readOnly value={form.postcode}
                      style={{ ...inputStyle, width: 130, background: '#f5f4f1' }}
                    />
                    <button type="button" onClick={openPostcode}
                      style={{ padding: '11px 16px', background: '#fff', border: `1px solid ${C.silver}`, borderRadius: 6, fontSize: 14, fontWeight: 600, fontFamily: PRETENDARD, color: C.charcoal, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      우편번호 검색
                    </button>
                  </div>
                  <input type="text" placeholder="도로명 주소" readOnly value={form.address}
                    style={{ ...inputStyle, background: '#f5f4f1', marginBottom: 6 }}
                  />
                  <input id="addressDetail" type="text" placeholder="상세 주소 입력" value={form.addressDetail}
                    onChange={e => setForm(v => ({ ...v, addressDetail: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = C.silver}
                  />
                </div>

                {/* 세금계산서 이메일 */}
                <div>
                  <label style={labelStyle}>세금계산서 수신 이메일</label>
                  <input type="email" placeholder="tax@hospital.com" value={form.taxEmail}
                    onChange={e => setForm(v => ({ ...v, taxEmail: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = C.silver}
                  />
                </div>

                {error && (
                  <div style={{ padding: '12px 16px', border: '1px solid rgba(184,74,74,0.3)', background: 'rgba(184,74,74,0.05)', fontSize: 13, color: '#B84A4A', borderRadius: 6, fontFamily: PRETENDARD }}>
                    {error}
                  </div>
                )}
                {success && (
                  <div style={{ padding: '12px 16px', border: '1px solid rgba(74,111,165,0.3)', background: 'rgba(74,111,165,0.05)', fontSize: 13, color: C.accent, borderRadius: 6, fontFamily: PRETENDARD }}>
                    저장되었습니다. 마이페이지로 이동합니다.
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={loading} className="flex-1 py-3 transition-all hover:-translate-y-0.5 disabled:opacity-60"
                    style={{ fontFamily: PRETENDARD, fontSize: 15, fontWeight: 700, background: C.charcoal, color: C.silverLight, borderRadius: 6, border: 'none', cursor: 'pointer' }}>
                    {loading ? '저장 중...' : '저장하기'}
                  </button>
                  <Link href="/my" style={{ padding: '12px 20px', fontFamily: PRETENDARD, fontSize: 14, border: `1px solid ${C.silver}`, color: C.silverDark, textDecoration: 'none', display: 'flex', alignItems: 'center', borderRadius: 6 }}>
                    취소
                  </Link>
                </div>

              </div>
            </form>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div className="bg-white border" style={{ borderColor: C.silver }}>
          <div style={{ height: 2, background: C.accent }} />
          <div style={{ padding: '36px' }}>
            <h2 style={{ fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, color: C.charcoal, marginBottom: 24 }}>비밀번호 변경</h2>
            <form onSubmit={handlePwChange} className="space-y-5">
              <div>
                <label style={labelStyle}>새 비밀번호 <span style={{ color: '#B84A4A' }}>*</span></label>
                <input type="password" placeholder="6자 이상 입력" required value={pwForm.newPw}
                  onChange={e => setPwForm(v => ({ ...v, newPw: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = C.silver}
                />
              </div>
              <div>
                <label style={labelStyle}>새 비밀번호 확인 <span style={{ color: '#B84A4A' }}>*</span></label>
                <input type="password" placeholder="비밀번호 재입력" required value={pwForm.confirmPw}
                  onChange={e => setPwForm(v => ({ ...v, confirmPw: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = C.silver}
                />
              </div>
              {pwError && <div style={{ padding: '12px 16px', border: '1px solid rgba(184,74,74,0.3)', background: 'rgba(184,74,74,0.05)', fontSize: 13, color: '#B84A4A', borderRadius: 6 }}>{pwError}</div>}
              {pwSuccess && <div style={{ padding: '12px 16px', border: '1px solid rgba(74,111,165,0.3)', background: 'rgba(74,111,165,0.05)', fontSize: 13, color: C.accent, borderRadius: 6 }}>비밀번호가 변경되었습니다.</div>}
              <button type="submit" disabled={pwLoading} className="w-full py-3 transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ fontFamily: PRETENDARD, fontSize: 15, fontWeight: 700, background: C.accent, color: '#fff', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
                {pwLoading ? '변경 중...' : '비밀번호 변경'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
