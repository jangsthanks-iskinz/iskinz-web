'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const C = { charcoal: '#1e2025', charcoalMid: '#2d3038', silver: '#c8cdd4', silverLight: '#e8ebee', silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5', warm: '#b5a99a' }
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
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
    // profile에 email 동기화 + 관리자 알림 이메일 발송
    fetch('/api/auth/sync-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, name: form.name }),
    }).catch(() => null)
    fetch('/api/auth/signup-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email }),
    }).catch(() => null)
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: C.charcoal }}>
        <div className="text-center max-w-md">
          <div style={{ width: 48, height: 48, border: `1px solid rgba(200,205,212,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: '1.8rem', fontWeight: 300, color: '#fff', marginBottom: '0.75rem' }}>이메일을 확인해주세요</h2>
          <p style={{ fontSize: 13, fontWeight: 300, color: C.silverDark, lineHeight: 1.7, marginBottom: '2rem' }}>
            {form.email}로 인증 메일을 발송했습니다.<br />메일의 링크를 클릭하면 가입이 완료됩니다.
          </p>
          <Link href="/login" style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.accent, textDecoration: 'none' }}>
            로그인 페이지로 →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16" style={{ background: C.offWhite }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" style={{ fontFamily: SERIF, fontSize: '2.5rem', fontWeight: 400, letterSpacing: '0.1em', color: C.charcoal, textDecoration: 'none' }}>
            IS<span style={{ color: C.warm }}>KIN</span>Z
          </Link>
          <p style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.silverDark, marginTop: 8 }}>
            HOSPITAL SIGNUP
          </p>
        </div>

        <div className="bg-white border" style={{ borderColor: C.silver }}>
          <div style={{ height: 2, background: C.warm }} />
          <div className="p-5 sm:p-10">
            <h1 style={{ fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 300, color: C.charcoal, marginBottom: '1.75rem' }}>회원가입</h1>

            <form onSubmit={handleSignup} className="space-y-4">
              {[
                { id: 'name',    label: '이름',       type: 'text',     placeholder: '홍길동' },
                { id: 'email',   label: '이메일',     type: 'email',    placeholder: 'example@hospital.com' },
                { id: 'password',label: '비밀번호',   type: 'password', placeholder: '6자 이상 입력' },
                { id: 'confirm', label: '비밀번호 확인', type: 'password', placeholder: '비밀번호 재입력' },
              ].map(f => (
                <div key={f.id}>
                  <label style={{ display: 'block', fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, marginBottom: 6 }}>
                    {f.label} *
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    required
                    value={form[f.id as keyof typeof form]}
                    onChange={e => setForm(v => ({ ...v, [f.id]: e.target.value }))}
                    className="w-full px-3 py-2.5 border text-sm outline-none transition-all"
                    style={{ borderColor: C.silver, background: C.offWhite, borderRadius: 0 }}
                    onFocus={e => { e.target.style.borderColor = C.accent }}
                    onBlur={e => { e.target.style.borderColor = C.silver }}
                  />
                </div>
              ))}

              {error && (
                <div style={{ padding: '12px 16px', border: `1px solid rgba(184,74,74,0.3)`, background: 'rgba(184,74,74,0.05)', fontSize: 13, color: '#B84A4A' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', background: C.charcoal, color: C.silverLight, borderRadius: 0, marginTop: 8 }}
              >
                {loading ? '처리 중...' : '회원가입'}
              </button>
            </form>

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${C.silver}`, textAlign: 'center', fontSize: 13, color: C.silverDark }}>
              이미 계정이 있으신가요?{' '}
              <Link href="/login" style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent, textDecoration: 'none', fontWeight: 500 }}>
                로그인 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
