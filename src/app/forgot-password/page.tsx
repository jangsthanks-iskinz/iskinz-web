'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const C = { charcoal: '#1e2025', silver: '#c8cdd4', silverLight: '#e8ebee', silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5', warm: '#b5a99a' }
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (err) { setError(err.message); setLoading(false); return }
    setDone(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: C.offWhite }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" style={{ fontFamily: SERIF, fontSize: '2.5rem', fontWeight: 400, letterSpacing: '0.1em', color: C.charcoal, textDecoration: 'none' }}>
            IS<span style={{ color: C.warm }}>KIN</span>Z
          </Link>
          <p style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.silverDark, marginTop: 8 }}>
            비밀번호 재설정
          </p>
        </div>

        <div className="bg-white border" style={{ borderColor: C.silver }}>
          <div style={{ height: 2, background: C.warm }} />
          <div style={{ padding: '36px' }}>
            {done ? (
              <div className="text-center py-4">
                <div style={{ width: 48, height: 48, border: `1px solid rgba(74,111,165,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', background: 'rgba(74,111,165,0.05)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <h2 style={{ fontFamily: SERIF, fontSize: '1.4rem', fontWeight: 300, color: C.charcoal, marginBottom: 12 }}>이메일을 확인해주세요</h2>
                <p style={{ fontSize: 13, color: C.silverDark, lineHeight: 1.7, marginBottom: 24 }}>
                  {email}로 비밀번호 재설정 링크를 발송했습니다.
                </p>
                <Link href="/login" style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, textDecoration: 'none' }}>
                  로그인으로 돌아가기 →
                </Link>
              </div>
            ) : (
              <>
                <h1 style={{ fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 300, color: C.charcoal, marginBottom: 8 }}>비밀번호 찾기</h1>
                <p style={{ fontSize: 13, color: C.silverDark, marginBottom: 28, lineHeight: 1.7 }}>
                  가입하신 이메일 주소를 입력하시면<br />비밀번호 재설정 링크를 보내드립니다.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label style={{ display: 'block', fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, marginBottom: 6 }}>
                      이메일 *
                    </label>
                    <input
                      type="email"
                      placeholder="example@hospital.com"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: `1px solid ${C.silver}`, background: C.offWhite, fontSize: 13, outline: 'none', borderRadius: 0 }}
                      onFocus={e => { e.target.style.borderColor = C.accent }}
                      onBlur={e => { e.target.style.borderColor = C.silver }}
                    />
                  </div>

                  {error && (
                    <div style={{ padding: '12px 16px', border: '1px solid rgba(184,74,74,0.3)', background: 'rgba(184,74,74,0.05)', fontSize: 13, color: '#B84A4A' }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    style={{ width: '100%', padding: '12px', fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', background: C.charcoal, color: C.silverLight, border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                    {loading ? '발송 중...' : '재설정 링크 발송'}
                  </button>
                </form>
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  <Link href="/login" style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.silverDark, textDecoration: 'none' }}>
                    ← 로그인으로 돌아가기
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
