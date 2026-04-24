'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const C = { charcoal: '#1e2025', silver: '#c8cdd4', silverLight: '#e8ebee', silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5' }
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'

function FailContent() {
  const params = useSearchParams()
  const message = params.get('message') ?? '결제가 취소되었거나 오류가 발생했습니다.'
  const code = params.get('code')

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: C.offWhite }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ width: 52, height: 52, border: `1px solid rgba(184,74,74,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B84A4A" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 20, height: 1, background: '#B84A4A' }} />
          <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#B84A4A' }}>PAYMENT FAILED</span>
          <div style={{ width: 20, height: 1, background: '#B84A4A' }} />
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 300, color: C.charcoal, marginBottom: '0.75rem' }}>결제에 실패했습니다</h1>
        {code && <p style={{ fontFamily: CONDENSED, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.silverDark, marginBottom: 6 }}>오류 코드: {code}</p>}
        <p style={{ fontSize: 13, color: C.silverDark, fontWeight: 300, lineHeight: 1.7, marginBottom: '2.5rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/checkout"
            style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', padding: '13px 28px', background: C.charcoal, color: C.silverLight, textDecoration: 'none' }}>
            다시 시도 →
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

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.offWhite }}>
        <div style={{ width: 48, height: 1, background: C.silver }} />
      </div>
    }>
      <FailContent />
    </Suspense>
  )
}
