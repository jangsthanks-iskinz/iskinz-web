'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

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

    // 1) 이메일 존재 여부 확인
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

    // 2) 로그인 시도
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
    padding: '13px 16px',
    border: '1px solid #D1D5DB',
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    background: '#F9FAFB',
    color: '#111827',
    transition: 'border-color 0.15s',
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* 이메일 */}
      <input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = '#1e3a5f')}
        onBlur={e => (e.target.style.borderColor = '#D1D5DB')}
      />

      {/* 비밀번호 */}
      <div className="relative">
        <input
          type={showPw ? 'text' : 'password'}
          placeholder="비밀번호 입력"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ ...inputStyle, paddingRight: 44 }}
          onFocus={e => (e.target.style.borderColor = '#1e3a5f')}
          onBlur={e => (e.target.style.borderColor = '#D1D5DB')}
        />
        <button
          type="button"
          onClick={() => setShowPw(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
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

      {/* 에러 */}
      {error && (
        <p className="text-xs px-1" style={{ color: '#B91C1C' }}>
          {error}
          {error.includes('찾을 수 없습니다') && (
            <> &nbsp;
              <Link href="/signup" className="underline font-semibold" style={{ color: '#1e3a5f' }}>
                회원가입하기
              </Link>
            </>
          )}
        </p>
      )}

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 text-sm font-bold text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: '#1e3a5f', letterSpacing: 0.5 }}
      >
        {loading ? '로그인 중…' : '로그인'}
      </button>

      {/* 구분선 */}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px" style={{ background: '#E5E7EB' }} />
        <span className="text-[11px]" style={{ color: '#9CA3AF' }}>또는</span>
        <div className="flex-1 h-px" style={{ background: '#E5E7EB' }} />
      </div>

      {/* 병원 회원가입 버튼 */}
      <Link
        href="/signup"
        className="w-full py-3.5 text-sm font-bold rounded-lg text-center no-underline transition-all hover:opacity-90 block"
        style={{ background: '#2563EB', color: '#ffffff', letterSpacing: 0.5 }}
      >
        간편 회원가입
      </Link>

      {/* 비밀번호 찾기 */}
      <div className="text-center pt-1">
        <Link href="/login" className="text-xs no-underline" style={{ color: '#9CA3AF' }}>
          비밀번호 찾기
        </Link>
      </div>
    </form>
  )
}
