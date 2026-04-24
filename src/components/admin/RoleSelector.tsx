'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ROLES = [
  { value: 'user',    label: '일반' },
  { value: 'vip',     label: 'VIP' },
  { value: 'partner', label: '파트너' },
  { value: 'admin',   label: '관리자' },
]

export function RoleSelector({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true)
    await fetch('/api/admin/users/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: e.target.value }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <select
      defaultValue={currentRole}
      onChange={handleChange}
      disabled={loading}
      className="text-[11px] font-bold px-2 py-1.5 border outline-none transition-opacity disabled:opacity-50 cursor-pointer"
      style={{
        borderColor: 'var(--border)',
        color: 'var(--navy)',
        background: 'var(--off-white)',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {ROLES.map(r => (
        <option key={r.value} value={r.value}>{r.label}</option>
      ))}
    </select>
  )
}
