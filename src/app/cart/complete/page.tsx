'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"
const SERIF = 'Cormorant Garamond, Georgia, serif'

function CompleteContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh', background: '#f5f4f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', border: '1px solid #E8E4DD', borderRadius: 12, padding: 48, textAlign: 'center', maxWidth: 480, width: '100%' }}>
        <div style={{ width: 56, height: 56, background: 'rgba(74,111,165,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 24 }}>✓</div>
        <h1 style={{ fontFamily: SERIF, fontSize: '1.8rem', fontWeight: 400, color: '#1e2025', marginBottom: 12 }}>주문이 접수되었습니다</h1>
        <p style={{ fontFamily: PRETENDARD, fontSize: 14, color: '#8a9099', marginBottom: 8 }}>주문번호</p>
        <p style={{ fontFamily: PRETENDARD, fontSize: 20, fontWeight: 700, color: '#4a6fa5', marginBottom: 24 }}>{orderNumber}</p>
        <p style={{ fontFamily: PRETENDARD, fontSize: 13, color: '#8a9099', lineHeight: 1.8, marginBottom: 32 }}>
          담당자가 확인 후 연락드리겠습니다.<br />문의: 010-2580-4489
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/products" style={{ flex: 1, padding: '12px', background: 'white', color: '#1e2025', border: '1px solid #E8E4DD', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            쇼핑 계속하기
          </Link>
          <Link href="/my" style={{ flex: 1, padding: '12px', background: '#1e2025', color: '#e8ebee', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            주문 내역 보기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CompletePage() {
  return <Suspense><CompleteContent /></Suspense>
}
