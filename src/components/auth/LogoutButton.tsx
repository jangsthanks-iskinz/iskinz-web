'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 transition-all hover:opacity-70 disabled:opacity-40"
      style={{
        padding: '9px 16px',
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: 10,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        border: '1px solid #c8cdd4',
        color: '#8a9099',
        background: 'white',
        borderRadius: 0,
        cursor: 'pointer',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      {loading ? '로그아웃 중...' : '로그아웃'}
    </button>
  )
}
