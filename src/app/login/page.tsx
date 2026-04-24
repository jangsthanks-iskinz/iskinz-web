'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function LoginContent() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ type: 'user_not_found' | 'wrong_password' | 'other'; msg: string } | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 1) 이메일 존재 여부 먼저 확인 (서버 API)
    const checkRes = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => null)

    if (checkRes && checkRes.ok) {
      const { exists } = await checkRes.json()
      if (!exists) {
        setError({ type: 'user_not_found', msg: '회원 정보를 찾을 수 없습니다.' })
        setLoading(false)
        return
      }
    }

    // 2) 비밀번호 확인
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError({ type: 'wrong_password', msg: '비밀번호가 일치하지 않습니다.' })
      setLoading(false)
      return
    }

    router.replace(redirect)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16" style={{ background: 'var(--off-white)' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-4xl font-bold tracking-widest no-underline" style={{ color: 'var(--navy)' }}>
            IS<span style={{ color: 'var(--gold)' }}>KIN</span>Z
          </Link>
          <p className="text-sm mt-2" style={{ color: 'var(--text-2)', fontFamily: 'Montserrat, sans-serif' }}>
            병원 회원 로그인
          </p>
        </div>

        <div className="bg-white p-6 sm:p-10 border" style={{ borderColor: 'var(--border)' }}>
          {/* Gold top accent */}
          <div className="h-0.5 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-8" style={{ background: 'var(--gold)' }} />

          <h1 className="font-display text-2xl font-semibold mb-7" style={{ color: 'var(--navy)' }}>로그인</h1>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[12px] font-bold tracking-[1px] uppercase mb-2" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>
                이메일
              </label>
              <input
                type="email"
                placeholder="example@hospital.com"
                required
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null) }}
                className="w-full px-4 py-3.5 border text-sm outline-none transition-all"
                style={{
                  borderColor: error?.type === 'user_not_found' ? 'var(--error)' : 'var(--border)',
                  background: '#FAFAF7',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--navy)' }}
                onBlur={e => { e.target.style.borderColor = error?.type === 'user_not_found' ? 'var(--error)' : 'var(--border)' }}
              />
            </div>

            {/* Password with eye icon */}
            <div>
              <label className="block text-[12px] font-bold tracking-[1px] uppercase mb-2" style={{ color: 'var(--navy)', fontFamily: 'Montserrat, sans-serif' }}>
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(null) }}
                  className="w-full px-4 py-3.5 pr-12 border text-sm outline-none transition-all"
                  style={{
                    borderColor: error?.type === 'wrong_password' ? 'var(--error)' : 'var(--border)',
                    background: '#FAFAF7',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--navy)' }}
                  onBlur={e => { e.target.style.borderColor = error?.type === 'wrong_password' ? 'var(--error)' : 'var(--border)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
                  style={{ color: 'var(--text-3)' }}
                  tabIndex={-1}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-4 py-3 text-sm border" style={{ background: 'rgba(184,74,74,0.05)', borderColor: 'rgba(184,74,74,0.3)', color: 'var(--error)' }}>
                <p className="font-semibold">{error.msg}</p>
                {error.type === 'user_not_found' && (
                  <p className="text-xs mt-1.5" style={{ color: 'var(--text-2)' }}>
                    계정이 없으신가요?{' '}
                    <Link href="/signup" className="font-bold no-underline hover:underline" style={{ color: 'var(--navy)' }}>
                      병원 회원가입 →
                    </Link>
                  </p>
                )}
                {error.type === 'wrong_password' && (
                  <p className="text-xs mt-1.5" style={{ color: 'var(--text-2)' }}>
                    비밀번호를 잊으셨나요? 고객센터로 문의해 주세요.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
              style={{ background: 'var(--navy)', color: 'white', fontFamily: 'Montserrat, sans-serif', letterSpacing: 1 }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}>
            아직 계정이 없으신가요?{' '}
            <Link href="/signup" className="font-bold no-underline hover:underline" style={{ color: 'var(--gold)' }}>
              병원 회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse" style={{ color: 'var(--text-3)' }}>Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  )
}
