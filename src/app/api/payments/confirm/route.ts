import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendOrderConfirmEmail } from '@/lib/email'

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY!
// 토스페이먼츠 승인 API 엔드포인트
const TOSS_CONFIRM_URL = 'https://api.tosspayments.com/v1/payments/confirm'

function generateOrderNumber() {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ISK-${date}-${rand}`
}

export async function POST(req: Request) {
  try {
    const { paymentKey, orderId, amount, shipping, items } = await req.json()

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ message: '필수 파라미터 누락' }, { status: 400 })
    }

    // ① 토스페이먼츠에 결제 승인 요청
    //    - Secret Key를 Base64로 인코딩하여 Basic Auth 헤더에 삽입
    const authHeader = `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`

    const tossRes = await fetch(TOSS_CONFIRM_URL, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    })

    const tossData = await tossRes.json()

    if (!tossRes.ok) {
      console.error('[Toss Confirm Error]', tossData)
      return NextResponse.json(
        { message: tossData.message ?? '결제 승인 실패' },
        { status: tossRes.status }
      )
    }

    // ② Supabase에 주문 저장
    const supabase = createServiceClient()
    const orderNumber = generateOrderNumber()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        status: 'paid',
        total_amount: amount,
        shipping_fee: 0,
        shipping_name: shipping?.name ?? '',
        shipping_phone: shipping?.phone ?? '',
        shipping_zipcode: shipping?.zipcode ?? '',
        shipping_address1: shipping?.address1 ?? '',
        shipping_address2: shipping?.address2 ?? null,
        payment_key: paymentKey,
        payment_method: tossData.method,
        paid_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (orderError) {
      console.error('[Order Insert Error]', orderError)
      // 결제는 됐지만 DB 저장 실패 → 주문번호는 반환 (수동 처리 필요)
    }

    // ③ 주문 아이템 저장
    if (order && items?.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.qty,
        subtotal: item.price * item.qty,
      }))
      await supabase.from('order_items').insert(orderItems)
    }

    // ④ 주문 확인 이메일 발송
    if (order && shipping?.email) {
      try {
        await sendOrderConfirmEmail(order, shipping.email)
      } catch (emailErr) {
        console.error('[Order Email Error]', emailErr)
      }
    }

    return NextResponse.json({ ok: true, orderNumber })
  } catch (err) {
    console.error('[Payment Confirm Error]', err)
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
