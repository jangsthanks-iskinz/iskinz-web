'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const C = { charcoal: '#1e2025', silver: '#c8cdd4', silverLight: '#e8ebee', silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5', warm: '#b5a99a' }
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'

export default function EditProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({ name: '', hospitalName: '', phone: '' })
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
      const { data: profile } = await supabase.from('profiles').select('name,hospital_name,phone').eq('id', user.id).single()
      if (profile) {
        setForm({ name: profile.name ?? '', hospitalName: profile.hospital_name ?? '', phone: profile.phone ?? '' })
      }
      setFetching(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch('/api/my/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, hospitalName: form.hospitalName, phone: form.phone }),
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

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: `1px solid ${C.silver}`,
    background: C.offWhite, fontSize: 13, outline: 'none', borderRadius: 0,
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
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { key: 'name',        label: '이름',   placeholder: '홍길동',        required: true },
                { key: 'hospitalName',label: '병원명', placeholder: '○○의원',       required: false },
                { key: 'phone',       label: '연락처', placeholder: '010-0000-0000', required: false },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, marginBottom: 6 }}>
                    {f.label} {f.required && '*'}
                  </label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    required={f.required}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = C.accent }}
                    onBlur={e => { e.target.style.borderColor = C.silver }}
                  />
                </div>
              ))}

              {error && (
                <div style={{ padding: '12px 16px', border: '1px solid rgba(184,74,74,0.3)', background: 'rgba(184,74,74,0.05)', fontSize: 13, color: '#B84A4A' }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ padding: '12px 16px', border: '1px solid rgba(74,111,165,0.3)', background: 'rgba(74,111,165,0.05)', fontSize: 13, color: C.accent }}>
                  저장되었습니다. 마이페이지로 이동합니다.
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 py-3 transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', background: C.charcoal, color: C.silverLight, borderRadius: 0, border: 'none', cursor: 'pointer' }}>
                  {loading ? '저장 중...' : '저장하기'}
                </button>
                <Link href="/my" style={{ padding: '12px 20px', fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', border: `1px solid ${C.silver}`, color: C.silverDark, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  취소
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white border" style={{ borderColor: C.silver }}>
          <div style={{ height: 2, background: C.accent }} />
          <div style={{ padding: '36px' }}>
            <h2 style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.charcoal, marginBottom: 24 }}>비밀번호 변경</h2>
            <form onSubmit={handlePwChange} className="space-y-5">
              <div>
                <label style={{ display: 'block', fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, marginBottom: 6 }}>새 비밀번호 *</label>
                <input type="password" placeholder="6자 이상 입력" required value={pwForm.newPw}
                  onChange={e => setPwForm(v => ({ ...v, newPw: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = C.accent }}
                  onBlur={e => { e.target.style.borderColor = C.silver }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, marginBottom: 6 }}>새 비밀번호 확인 *</label>
                <input type="password" placeholder="비밀번호 재입력" required value={pwForm.confirmPw}
                  onChange={e => setPwForm(v => ({ ...v, confirmPw: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = C.accent }}
                  onBlur={e => { e.target.style.borderColor = C.silver }}
                />
              </div>

              {pwError && (
                <div style={{ padding: '12px 16px', border: '1px solid rgba(184,74,74,0.3)', background: 'rgba(184,74,74,0.05)', fontSize: 13, color: '#B84A4A' }}>
                  {pwError}
                </div>
              )}
              {pwSuccess && (
                <div style={{ padding: '12px 16px', border: '1px solid rgba(74,111,165,0.3)', background: 'rgba(74,111,165,0.05)', fontSize: 13, color: C.accent }}>
                  비밀번호가 변경되었습니다.
                </div>
              )}

              <button type="submit" disabled={pwLoading} className="w-full py-3 transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', background: C.accent, color: '#fff', borderRadius: 0, border: 'none', cursor: 'pointer' }}>
                {pwLoading ? '변경 중...' : '비밀번호 변경'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
