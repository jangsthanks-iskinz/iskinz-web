'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadPaymentWidget, type PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk'
import { nanoid } from 'nanoid'
import { useCartStore } from '@/store/cartStore'
import type { ShippingInfo } from '@/types'

const C = { charcoal: '#1e2025', charcoalMid: '#2d3038', silver: '#c8cdd4', silverLight: '#e8ebee', silverDark: '#8a9099', offWhite: '#f5f4f1', accent: '#4a6fa5', warm: '#b5a99a' }
const CONDENSED = 'Barlow Condensed, sans-serif'
const SERIF = 'Cormorant Garamond, Georgia, serif'

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
const SHIPPING_FEE = 0

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalAmount, clearCart } = useCartStore()
  const total = totalAmount() + SHIPPING_FEE

  const widgetRef = useRef<PaymentWidgetInstance | null>(null)
  const orderIdRef = useRef(nanoid())

  const [shipping, setShipping] = useState<ShippingInfo>({
    name: '', phone: '', zipcode: '', address1: '', address2: '', email: '',
  })
  const [loading, setLoading] = useState(false)
  const [widgetReady, setWidgetReady] = useState(false)

  useEffect(() => {
    if (items.length === 0) router.replace('/')
  }, [items, router])

  useEffect(() => {
    if (items.length === 0) return
    async function initWidget() {
      const widget = await loadPaymentWidget(CLIENT_KEY, nanoid())
      widgetRef.current = widget
      await widget.renderPaymentMethods('#payment-widget', { value: total }, { variantKey: 'DEFAULT' })
      await widget.renderAgreement('#agreement-widget', { variantKey: 'AGREEMENT' })
      setWidgetReady(true)
    }
    initWidget()
  }, [total, items.length])

  function setField(field: keyof ShippingInfo, value: string) {
    setShipping(v => ({ ...v, [field]: value }))
  }

  async function handlePay() {
    if (!widgetRef.current) return
    setLoading(true)
    try {
      const orderName = items.length === 1 ? items[0].name_ko : `${items[0].name_ko} 외 ${items.length - 1}건`
      sessionStorage.setItem('pendingOrder', JSON.stringify({
        orderId: orderIdRef.current, shipping,
        items: items.map(i => ({ id: i.id, name: i.name_ko, price: i.price, qty: i.quantity })),
        totalAmount: total,
      }))
      await widgetRef.current.requestPayment({
        orderId: orderIdRef.current, orderName,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
        customerName: shipping.name,
        customerEmail: shipping.email,
        customerMobilePhone: shipping.phone.replace(/-/g, ''),
      })
    } catch (err: any) {
      if (err?.code !== 'USER_CANCEL') alert(`결제 오류: ${err?.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return null

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: `1px solid ${C.silver}`,
    background: C.offWhite, fontSize: 13, outline: 'none', borderRadius: 0,
  }

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: C.offWhite }}>
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Page title */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ width: 22, height: 1, background: C.accent }} />
            <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.accent }}>CHECKOUT</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 300, color: C.charcoal }}>주문 / 결제</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left: Shipping + Payment */}
          <div className="lg:col-span-3 space-y-4">

            {/* Shipping */}
            <div className="bg-white border" style={{ borderColor: C.silver }}>
              <div style={{ padding: '20px 28px', borderBottom: `1px solid ${C.silverLight}`, background: C.offWhite }}>
                <span style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal }}>배송지 정보</span>
              </div>
              <div style={{ padding: '28px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {[
                    { field: 'name' as const, label: '받는 분', type: 'text', placeholder: '홍길동' },
                    { field: 'phone' as const, label: '연락처', type: 'tel', placeholder: '010-0000-0000' },
                  ].map(f => (
                    <div key={f.field}>
                      <label style={{ display: 'block', fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, marginBottom: 6 }}>{f.label} *</label>
                      <input type={f.type} placeholder={f.placeholder} required value={shipping[f.field]}
                        onChange={e => setField(f.field, e.target.value)} style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = C.accent }}
                        onBlur={e => { e.target.style.borderColor = C.silver }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <label style={{ display: 'block', fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal, marginBottom: 6 }}>이메일 *</label>
                  <input type="email" placeholder="example@hospital.com" required value={shipping.email}
                    onChange={e => setField('email', e.target.value)} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = C.accent }}
                    onBlur={e => { e.target.style.borderColor = C.silver }}
                  />
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                  <input type="text" placeholder="우편번호" value={shipping.zipcode}
                    onChange={e => setField('zipcode', e.target.value)}
                    style={{ ...inputStyle, width: '100%', maxWidth: 140 }}
                    onFocus={e => { e.target.style.borderColor = C.accent }}
                    onBlur={e => { e.target.style.borderColor = C.silver }}
                  />
                  <button type="button"
                    style={{ padding: '10px 16px', fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', background: C.charcoal, color: C.silverLight, borderRadius: 0, whiteSpace: 'nowrap', cursor: 'pointer', border: 'none' }}
                    onClick={() => alert('카카오 우편번호 API를 연동해주세요')}>
                    주소 검색
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { field: 'address1' as const, placeholder: '도로명/지번 주소' },
                    { field: 'address2' as const, placeholder: '상세 주소 (동/호수)' },
                  ].map(f => (
                    <input key={f.field} type="text" placeholder={f.placeholder} value={shipping[f.field]}
                      onChange={e => setField(f.field, e.target.value)} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = C.accent }}
                      onBlur={e => { e.target.style.borderColor = C.silver }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Widget */}
            <div className="bg-white border" style={{ borderColor: C.silver }}>
              <div style={{ padding: '20px 28px', borderBottom: `1px solid ${C.silverLight}`, background: C.offWhite }}>
                <span style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal }}>결제 수단</span>
              </div>
              <div style={{ padding: '28px' }}>
                <div id="payment-widget" />
                <div id="agreement-widget" className="mt-4" />
                {!widgetReady && (
                  <div style={{ textAlign: 'center', padding: '32px', fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.silverDark }}>
                    결제 수단 로딩 중...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border sticky top-28" style={{ borderColor: C.silver }}>
              <div style={{ padding: '20px 28px', borderBottom: `1px solid ${C.silverLight}`, background: C.offWhite }}>
                <span style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.charcoal }}>주문 요약</span>
              </div>
              <div style={{ padding: '28px' }}>

                <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, background: C.offWhite, border: `1px solid ${C.silverLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
                        {item.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.1em', color: C.charcoal, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name_ko}</p>
                        <p style={{ fontSize: 11, color: C.silverDark, marginTop: 2 }}>수량 {item.quantity}개</p>
                      </div>
                      <p style={{ fontFamily: CONDENSED, fontSize: 12, color: C.charcoal, whiteSpace: 'nowrap' }}>₩{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: `1px solid ${C.silverLight}`, paddingTop: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: C.silverDark }}>
                    <span>상품 금액</span><span>₩{totalAmount().toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.silverDark }}>
                    <span>배송비</span>
                    <span style={{ fontFamily: CONDENSED, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.accent }}>무료</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24, paddingTop: 16, borderTop: `1px solid ${C.silver}` }}>
                  <span style={{ fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.charcoal }}>총 결제 금액</span>
                  <span style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 300, color: C.charcoal }}>₩{total.toLocaleString()}</span>
                </div>

                <button onClick={handlePay}
                  disabled={loading || !widgetReady || !shipping.name || !shipping.email}
                  className="w-full transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ padding: '14px', fontFamily: CONDENSED, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', background: C.charcoal, color: C.silverLight, borderRadius: 0, border: 'none', cursor: 'pointer' }}>
                  {loading ? '처리 중...' : `₩${total.toLocaleString()} 결제하기`}
                </button>

                <p style={{ textAlign: 'center', fontSize: 11, color: C.silverDark, marginTop: 10 }}>
                  토스페이먼츠를 통해 안전하게 결제됩니다
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
