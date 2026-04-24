'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const C = { charcoal: '#1e2025', silver: '#c8cdd4', silverLight: '#e8ebee', silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5', warm: '#b5a99a' }
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { setError('비밀번호는 최소 6자 이상이어야 합니다.'); return }
    if (password !== confirm) { setError('비밀번호가 일치하지 않습니다.'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) { setError(err.message); setLoading(false); return }
    setDone(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: `1px solid ${C.silver}`,
    background: C.offWhite, fontSize: 13, outline: 'none', borderRadius: 0,
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
                <h2 style={{ fontFamily: SERIF, fontSize: '1.4rem', fontWeight: 300, color: C.charcoal, marginBottom: 12 }}>비밀번호가 변경되었습니다</h2>
                <p style={{ fontSize: 13, color: C.silverDark, lineHeight: 1.7 }}>로그인 페이지로 이동합니다...</p>
              </div>
            ) : (
              <>
                <h1 style={{ fontFamily: SERIF, fontSize: '1.6rem', fontWeight: 300, color: C.charcoal, marginBottom: 8 }}>새 비밀번호 설정</h1>
                <p style={{ fontSize: 13, color: C.silverDark, marginBottom: 28, lineHeight: 1.7 }}>
                  새로운 비밀번호를 입력해주세요.
                </p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label style={{ display: 'block', fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, marginBottom: 6 }}>
                      새 비밀번호 *
                    </label>
                    <input type="password" placeholder="6자 이상 입력" required value={password}
                      onChange={e => setPassword(e.target.value)} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = C.accent }}
                      onBlur={e => { e.target.style.borderColor = C.silver }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, marginBottom: 6 }}>
                      비밀번호 확인 *
                    </label>
                    <input type="password" placeholder="비밀번호 재입력" required value={confirm}
                      onChange={e => setConfirm(e.target.value)} style={inputStyle}
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
                    {loading ? '변경 중...' : '비밀번호 변경'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
