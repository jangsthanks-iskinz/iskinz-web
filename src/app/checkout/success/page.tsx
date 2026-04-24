'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

const C = { charcoal: '#1e2025', silver: '#c8cdd4', silverLight: '#e8ebee', silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5', warm: '#b5a99a' }
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'

type Status = 'loading' | 'success' | 'error'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCartStore()
  const [status, setStatus] = useState<Status>('loading')
  const [orderNumber, setOrderNumber] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey')
    const orderId    = searchParams.get('orderId')
    const amount     = searchParams.get('amount')
    if (!paymentKey || !orderId || !amount) { router.replace('/'); return }

    const pending = JSON.parse(sessionStorage.getItem('pendingOrder') ?? '{}')
    async function confirm() {
      try {
        const res = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount), shipping: pending.shipping, items: pending.items }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message ?? '결제 승인 실패')
        setOrderNumber(data.orderNumber)
        setStatus('success')
        clearCart()
        sessionStorage.removeItem('pendingOrder')
      } catch (e: unknown) {
        setErrorMsg(e instanceof Error ? e.message : '오류가 발생했습니다')
        setStatus('error')
      }
    }
    confirm()
  }, [searchParams, router, clearCart])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.charcoal }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 1, background: C.accent, margin: '0 auto 24px', animation: 'pulse 1.5s infinite' }} />
          <p style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.silverDark }}>결제 승인 중...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: C.offWhite }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 48, height: 48, border: `1px solid rgba(184,74,74,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B84A4A" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: '1.8rem', fontWeight: 300, color: C.charcoal, marginBottom: '0.75rem' }}>결제 오류가 발생했습니다</h1>
          <p style={{ fontSize: 13, color: C.silverDark, fontWeight: 300, marginBottom: '2.5rem' }}>{errorMsg}</p>
          <Link href="/checkout"
            style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '14px 32px', background: C.charcoal, color: C.silverLight, textDecoration: 'none', display: 'inline-block' }}>
            다시 시도하기 →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: C.offWhite }}>
      <div style={{ textAlign: 'center', maxWidth: 440 }}>
        <div style={{ width: 56, height: 56, border: `1px solid rgba(74,111,165,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 20, height: 1, background: C.accent }} />
          <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.accent }}>ORDER COMPLETE</span>
          <div style={{ width: 20, height: 1, background: C.accent }} />
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, color: C.charcoal, marginBottom: '0.75rem' }}>주문이 완료되었습니다</h1>
        <p style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.silverDark, marginBottom: 6 }}>주문번호: <span style={{ color: C.charcoal }}>{orderNumber}</span></p>
        <p style={{ fontSize: 13, color: C.silverDark, fontWeight: 300, lineHeight: 1.7, marginBottom: '2.5rem' }}>
          주문 확인 이메일이 발송되었습니다.<br />배송은 영업일 기준 2~3일 소요됩니다.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/my/orders"
            style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '13px 28px', background: C.charcoal, color: C.silverLight, textDecoration: 'none' }}>
            주문 내역 보기
          </Link>
          <Link href="/"
            style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '13px 28px', border: `1px solid ${C.charcoal}`, color: C.charcoal, textDecoration: 'none' }}>
            홈으로
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.charcoal }}>
        <div style={{ width: 48, height: 1, background: C.accent }} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
