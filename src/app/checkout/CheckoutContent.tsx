'use client'
import Script from 'next/script'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const C = { charcoal: '#1e2025', silver: '#c8cdd4', silverLight: '#e8ebee', silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5' }
const PRETENDARD = "'Pretendard', 'Apple SD Gothic Neo', sans-serif"
const SERIF = 'Cormorant Garamond, Georgia, serif'

type PaymentMethod = 'bank_transfer' | 'credit_card' | 'toss_pay'

export function CheckoutContent({ cartItems, profile }: { cartItems: any[], profile: any }) {
  const router = useRouter()
  const [useSameAsProfile, setUseSameAsProfile] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer')
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState({ all: false, privacy: false, third_party: false, payment: false, access: false })
  const [shipping, setShipping] = useState<any>({
    name: profile?.name ?? '',
    phone: profile?.phone ?? '',
    zipcode: profile?.postcode ?? '',
    address1: profile?.address ?? '',
    address2: profile?.address_detail ?? '',
    memo: '',
    customMemo: '',
  })

  function handleAgreeAll(checked: boolean) {
    setAgreed({ all: checked, privacy: checked, third_party: checked, payment: checked, access: checked })
  }

  function handleAgree(key: keyof typeof agreed, checked: boolean) {
    const next = { ...agreed, [key]: checked }
    next.all = next.privacy && next.third_party && next.payment && next.access
    setAgreed(next)
  }

  function handleUseSameAsProfile(checked: boolean) {
    setUseSameAsProfile(checked)
    if (checked) {
      setShipping({
        name: profile?.name ?? '',
        phone: profile?.phone ?? '',
        zipcode: profile?.postcode ?? '',
        address1: profile?.address ?? '',
        address2: profile?.address_detail ?? '',
        memo: '',
        customMemo: '',
      })
    } else {
      setShipping({ name: '', phone: '', zipcode: '', address1: '', address2: '', memo: '', customMemo: '' })
    }
  }

  const subtotalAmount = cartItems.reduce((sum, i) => sum + (i.products.price || 0) * i.quantity, 0)
  const discountAmount = cartItems.reduce((sum, i) => sum + ((i.products.price || 0) - (i.products.sale_price || i.products.price || 0)) * i.quantity, 0)
  const totalAmount = subtotalAmount - discountAmount

  const allAgreed = agreed.privacy && agreed.third_party && agreed.payment && agreed.access
  const canOrder = shipping.name && shipping.phone && shipping.address1 && allAgreed

  async function handleOrder() {
    if (!canOrder) return
    if (paymentMethod !== 'bank_transfer') {
      alert('신용카드 및 토스페이는 준비 중입니다.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(i => ({
            product_id: i.product_id,
            product_name: i.products.name_ko,
            price: i.products.sale_price || i.products.price,
            quantity: i.quantity,
          })),
          subtotal_amount: subtotalAmount,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          status: 'pending',
          recipient_name: shipping.name,
          recipient_phone: shipping.phone,
          shipping_zipcode: shipping.zipcode,
          shipping_address1: shipping.address1,
          shipping_address2: shipping.address2,
          shipping_memo: (!shipping.memo || shipping.memo === '') ? null : shipping.memo === 'custom' ? (shipping.customMemo || null) : shipping.memo,
        }),
      })
      const data = await res.json()
      if (data.ok) router.push(`/checkout/success?order=${data.order_number}&method=${paymentMethod}`)
      else alert('주문 오류: ' + (data.error || '알 수 없는 오류'))
    } finally {
      setLoading(false)
    }
  }

  function formatPhone(v: string) {
    v = v.replace(/[^0-9]/g, '')
    if (v.length >= 4) v = v.slice(0,3) + '-' + v.slice(3)
    if (v.length >= 9) v = v.slice(0,8) + '-' + v.slice(8)
    return v.slice(0,13)
  }

  function openPostcode() {
    if (typeof window === 'undefined') return
    new (window as any).daum.Postcode({
      oncomplete: function(data: any) {
        setShipping((v: any) => ({ ...v, zipcode: data.zonecode, address1: data.roadAddress, address2: '' }))
        setTimeout(() => document.getElementById('address2')?.focus(), 100)
      }
    }).open()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: `1px solid ${C.silver}`,
    background: C.offWhite, fontSize: 14, outline: 'none', borderRadius: 6,
    fontFamily: PRETENDARD, boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 600,
    color: C.silverDark, marginBottom: 6, fontFamily: PRETENDARD,
  }

  return (
    <>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />
    <div style={{ background: C.offWhite, minHeight: '100vh', paddingTop: 100 }}>
      <div className="container mx-auto px-6 py-12 max-w-5xl">

        <div style={{ marginBottom: 32 }}>
          <Link href="/cart" style={{ fontFamily: PRETENDARD, fontSize: 13, color: C.silverDark, textDecoration: 'none' }}>← 장바구니로</Link>
          <h1 style={{ fontFamily: SERIF, fontSize: '2rem', fontWeight: 400, color: C.charcoal, marginTop: 8 }}>주문/결제</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* 왼쪽 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* 주문 상품 */}
            <div style={{ background: 'white', border: `1px solid ${C.silver}`, borderRadius: 8, padding: 24 }}>
              <p style={{ fontFamily: PRETENDARD, fontSize: 15, fontWeight: 700, color: C.charcoal, marginBottom: 16 }}>주문 상품</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {cartItems.map(item => (
                  <div key={item.product_id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {item.products.image_url ? (
                      <img src={item.products.image_url} alt={item.products.name_ko} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: `1px solid ${C.silverLight}`, flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 64, height: 64, background: C.offWhite, borderRadius: 6, border: `1px solid ${C.silverLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>📦</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: PRETENDARD, fontSize: 14, fontWeight: 600, color: C.charcoal, marginBottom: 4 }}>{item.products.name_ko}</p>
                      <p style={{ fontFamily: PRETENDARD, fontSize: 13, color: C.silverDark }}>{item.quantity}개</p>
                    </div>
                    <p style={{ fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, color: item.products.sale_price ? '#B84A4A' : C.charcoal }}>
                      {((item.products.sale_price || item.products.price) * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 배송지 정보 */}
            <div style={{ background: 'white', border: `1px solid ${C.silver}`, borderRadius: 8, padding: 24 }}>
              <p style={{ fontFamily: PRETENDARD, fontSize: 15, fontWeight: 700, color: C.charcoal, marginBottom: 16 }}>배송지 정보</p>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <button onClick={() => handleUseSameAsProfile(true)}
                  style={{ flex: 1, padding: '10px', border: useSameAsProfile ? `2px solid ${C.accent}` : `1px solid ${C.silver}`, borderRadius: 6, background: useSameAsProfile ? 'rgba(74,111,165,0.08)' : 'white', color: useSameAsProfile ? C.accent : C.silverDark, fontFamily: PRETENDARD, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  주문자 정보와 동일
                </button>
                <button onClick={() => handleUseSameAsProfile(false)}
                  style={{ flex: 1, padding: '10px', border: !useSameAsProfile ? `2px solid ${C.accent}` : `1px solid ${C.silver}`, borderRadius: 6, background: !useSameAsProfile ? 'rgba(74,111,165,0.08)' : 'white', color: !useSameAsProfile ? C.accent : C.silverDark, fontFamily: PRETENDARD, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  직접 입력
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>수령인 이름 *</label>
                    <input type="text" placeholder="홍길동" value={shipping.name}
                      onChange={e => setShipping((v: any) => ({ ...v, name: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver} />
                  </div>
                  <div>
                    <label style={labelStyle}>연락처 *</label>
                    <input type="text" placeholder="010-0000-0000" value={shipping.phone}
                      onChange={e => setShipping((v: any) => ({ ...v, phone: formatPhone(e.target.value) }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.accent}
                      onBlur={e => e.target.style.borderColor = C.silver} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>주소 *</label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input type="text" placeholder="우편번호" value={shipping.zipcode} readOnly
                      style={{ ...inputStyle, width: 130, background: '#f5f4f1' }} />
                    <button type="button" onClick={openPostcode}
                      style={{ padding: '10px 16px', background: 'white', border: `1px solid ${C.silver}`, borderRadius: 6, fontSize: 13, fontFamily: PRETENDARD, cursor: 'pointer' }}>
                      우편번호 검색
                    </button>
                  </div>
                  <input type="text" placeholder="도로명 주소" value={shipping.address1} readOnly
                    style={{ ...inputStyle, background: '#f5f4f1', marginBottom: 8 }} />
                  <input id="address2" type="text" placeholder="상세주소 입력" value={shipping.address2}
                    onChange={e => setShipping((v: any) => ({ ...v, address2: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = C.silver} />
                </div>

                <div>
                  <label style={labelStyle}>배송 메시지</label>
                  <select value={shipping.memo} onChange={e => setShipping((v: any) => ({ ...v, memo: e.target.value }))}
                    style={{ ...inputStyle, background: 'white' }}>
                    <option value="">배송 메시지를 선택해주세요</option>
                    <option value="부재 시 경비실에 맡겨주세요">부재 시 경비실에 맡겨주세요</option>
                    <option value="직접 받겠습니다">직접 받겠습니다</option>
                    <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                    <option value="custom">직접 입력</option>
                  </select>
                  {shipping.memo === 'custom' && (
                    <input type="text" placeholder="배송 메시지를 입력해주세요"
                      value={shipping.customMemo}
                      onChange={e => setShipping((v) => ({ ...v, customMemo: e.target.value }))}
                      style={inputStyle} />
                  )}
                </div>
              </div>
            </div>

            {/* 결제 수단 */}
            <div style={{ background: 'white', border: `1px solid ${C.silver}`, borderRadius: 8, padding: 24 }}>
              <p style={{ fontFamily: PRETENDARD, fontSize: 15, fontWeight: 700, color: C.charcoal, marginBottom: 16 }}>결제 수단</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {([
                  { value: 'bank_transfer', label: '무통장입금' },
                  { value: 'credit_card', label: '신용카드' },
                  { value: 'toss_pay', label: '토스페이' },
                ] as { value: PaymentMethod, label: string }[]).map(m => (
                  <button key={m.value} onClick={() => setPaymentMethod(m.value)}
                    style={{ flex: 1, padding: '12px', border: paymentMethod === m.value ? `2px solid ${C.accent}` : `1px solid ${C.silver}`, borderRadius: 6, background: paymentMethod === m.value ? 'rgba(74,111,165,0.08)' : 'white', color: paymentMethod === m.value ? C.accent : C.silverDark, fontFamily: PRETENDARD, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    {m.label}
                    {(m.value === 'credit_card' || m.value === 'toss_pay') && (
                      <span style={{ display: 'block', fontSize: 11, fontWeight: 400, marginTop: 2, color: C.silverDark }}>준비 중</span>
                    )}
                  </button>
                ))}
              </div>
              {paymentMethod === 'bank_transfer' && (
                <div style={{ padding: 16, background: C.offWhite, borderRadius: 6 }}>
                  <p style={{ fontFamily: PRETENDARD, fontSize: 13, color: C.silverDark, marginBottom: 4 }}>입금 계좌</p>
                  <p style={{ fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, color: C.charcoal }}>국민은행 123-456-789012 (주)아이스킨즈</p>
                  <p style={{ fontFamily: PRETENDARD, fontSize: 12, color: C.silverDark, marginTop: 8 }}>주문 후 3일 이내 입금하지 않으면 주문이 자동 취소됩니다.</p>
                </div>
              )}
            </div>

            {/* 주문 동의 */}
            <div style={{ background: 'white', border: `1px solid ${C.silver}`, borderRadius: 8, padding: 24 }}>
              <p style={{ fontFamily: PRETENDARD, fontSize: 15, fontWeight: 700, color: C.charcoal, marginBottom: 16 }}>주문 내용 확인 및 결제 동의</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: PRETENDARD, fontSize: 14, fontWeight: 700, color: C.charcoal, cursor: 'pointer' }}>
                  <input type="checkbox" checked={agreed.all} onChange={e => handleAgreeAll(e.target.checked)} />
                  전체 동의
                </label>
                <div style={{ borderTop: `1px solid ${C.silverLight}`, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { key: 'privacy' as const, label: '(필수) 개인정보 수집·이용 동의' },
                    { key: 'third_party' as const, label: '(필수) 개인정보 제3자 정보 제공 동의' },
                    { key: 'payment' as const, label: '(필수) 결제대행 서비스 이용약관 동의' },
                    { key: 'access' as const, label: '(필수) 공동현관비밀번호 개인정보 수집·이용 동의' },
                  ].map(a => (
                    <label key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: PRETENDARD, fontSize: 13, color: C.silverDark, cursor: 'pointer' }}>
                      <input type="checkbox" checked={agreed[a.key]} onChange={e => handleAgree(a.key, e.target.checked)} />
                      {a.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* 오른쪽 결제 금액 */}
          <div style={{ position: 'sticky', top: 100, background: 'white', border: `1px solid ${C.silver}`, borderRadius: 8, padding: 24 }}>
            <p style={{ fontFamily: PRETENDARD, fontSize: 15, fontWeight: 700, color: C.charcoal, marginBottom: 16 }}>결제 금액</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: PRETENDARD, fontSize: 13, color: C.silverDark }}>총 상품금액</span>
                <span style={{ fontFamily: PRETENDARD, fontSize: 13, color: C.charcoal }}>{subtotalAmount.toLocaleString()}원</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: PRETENDARD, fontSize: 13, color: C.silverDark }}>할인금액</span>
                <span style={{ fontFamily: PRETENDARD, fontSize: 13, color: '#B84A4A' }}>-{discountAmount.toLocaleString()}원</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: PRETENDARD, fontSize: 13, color: C.silverDark }}>배송비</span>
                <span style={{ fontFamily: PRETENDARD, fontSize: 13, color: C.charcoal }}>0원</span>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${C.silver}`, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: PRETENDARD, fontSize: 15, fontWeight: 700, color: C.charcoal }}>총 결제금액</span>
              <span style={{ fontFamily: PRETENDARD, fontSize: 22, fontWeight: 700, color: C.accent }}>{totalAmount.toLocaleString()}원</span>
            </div>
            <button onClick={handleOrder} disabled={loading || !canOrder}
              style={{ width: '100%', padding: '14px', background: canOrder ? C.charcoal : C.silverDark, color: C.silverLight, border: 'none', borderRadius: 6, fontFamily: PRETENDARD, fontSize: 15, fontWeight: 700, cursor: canOrder ? 'pointer' : 'not-allowed', opacity: loading ? 0.6 : 1 }}>
              {loading ? '처리 중...' : '결제하기'}
            </button>
            {!canOrder && (
              <p style={{ fontFamily: PRETENDARD, fontSize: 12, color: '#B84A4A', marginTop: 8, textAlign: 'center' }}>
                배송지 정보와 필수 동의를 확인해주세요
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
    </>
  )
}
