'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ApproveButton({ userId, approved, userEmail, userName }: {
  userId: string; approved: boolean; userEmail?: string; userName?: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    await fetch('/api/admin/users/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, approved: !approved }),
    })
    // 회원에게 승인/취소 이메일 발송
    if (userEmail) {
      await fetch('/api/admin/users/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, name: userName ?? '원장님', approved: !approved }),
      }).catch(() => null)
    }
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="px-3 py-1.5 text-[11px] font-bold transition-all hover:opacity-70 disabled:opacity-40 whitespace-nowrap"
      style={{
        background: approved ? 'rgba(184,74,74,0.1)' : 'rgba(74,124,89,0.1)',
        color: approved ? 'var(--error)' : 'var(--success)',
        border: `1px solid ${approved ? 'rgba(184,74,74,0.3)' : 'rgba(74,124,89,0.3)'}`,
        fontFamily: 'Montserrat, sans-serif',
        letterSpacing: 0.5,
      }}
    >
      {loading ? '처리 중...' : approved ? '승인 취소' : '승인'}
    </button>
  )
}
