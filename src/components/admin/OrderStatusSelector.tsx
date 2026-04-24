'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  orderId: string
  currentStatus: string
  options: { value: string; label: string; color: string }[]
}

export function OrderStatusSelector({ orderId, currentStatus, options }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLoading(true)
    await fetch('/api/admin/orders/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: e.target.value }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <select
      defaultValue={currentStatus}
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
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
