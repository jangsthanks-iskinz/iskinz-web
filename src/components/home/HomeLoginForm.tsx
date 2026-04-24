'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const BLUE = '#1757C2'
const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"

export function HomeLoginForm() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const checkRes = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const { exists } = await checkRes.json()
    if (!exists) {
      setError('회원 정보를 찾을 수 없습니다.')
      setLoading(false)
      return
    }
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #E5E7EB',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    background: '#F9FAFB',
    color: '#111827',
    fontFamily: PRETENDARD,
    transition: 'border-color 0.15s',
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = BLUE)}
        onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
      />

      <div className="relative">
        <input
          type={showPw ? 'text' : 'password'}
          placeholder="비밀번호 입력"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ ...inputStyle, paddingRight: 44 }}
          onFocus={e => (e.target.style.borderColor = BLUE)}
          onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
        />
        <button type="button" onClick={() => setShowPw(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-60"
          style={{ color: '#9CA3AF' }} tabIndex={-1}>
          {showPw ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs px-1" style={{ fontFamily: PRETENDARD, color: '#DC2626' }}>
          {error}
          {error.includes('찾을 수 없습니다') && (
            <> &nbsp;
              <Link href="/signup" className="underline font-semibold" style={{ color: BLUE }}>회원가입하기</Link>
            </>
          )}
        </p>
      )}

      {/* 로그인 — 연한 파랑 */}
      <button type="submit" disabled={loading}
        className="w-full py-3 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-60"
        style={{ fontFamily: PRETENDARD, background: '#EBF2FF', color: BLUE, borderRadius: 6, border: 'none' }}>
        {loading ? '로그인 중…' : '로그인'}
      </button>

      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px" style={{ background: '#E5E7EB' }} />
        <span className="text-[11px]" style={{ fontFamily: PRETENDARD, color: '#9CA3AF' }}>또는</span>
        <div className="flex-1 h-px" style={{ background: '#E5E7EB' }} />
      </div>

      {/* 간편 회원가입 — 진한 파랑 */}
      <Link href="/signup"
        className="w-full py-3 text-sm font-bold text-center no-underline transition-all hover:opacity-90 block"
        style={{ fontFamily: PRETENDARD, background: BLUE, color: '#ffffff', borderRadius: 6 }}>
        간편 회원가입
      </Link>

      <div className="text-center pt-1">
        <Link href="/login" className="text-xs no-underline" style={{ fontFamily: PRETENDARD, color: '#9CA3AF' }}>
          비밀번호 찾기
        </Link>
      </div>
    </form>
  )
}
