'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function DeleteUserButton({ userId, userName }: { userId: string; userName?: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    const confirmed = window.confirm(`"${userName ?? '이 회원'}"을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)
    if (!confirmed) return
    setLoading(true)
    await fetch('/api/admin/users/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    router.push('/admin/users')
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 text-[11px] font-bold transition-all hover:opacity-70 disabled:opacity-40 whitespace-nowrap"
      style={{
        background: 'rgba(184,74,74,0.1)',
        color: 'var(--error)',
        border: '1px solid rgba(184,74,74,0.3)',
        fontFamily: 'Montserrat, sans-serif',
        letterSpacing: 0.5,
      }}
    >
      {loading ? '삭제 중...' : '회원 삭제'}
    </button>
  )
}
