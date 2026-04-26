import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

function generateOrderNumber() {
  const now = new Date()
  const date = `${String(now.getFullYear()).slice(2)}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
  return `${date}-${seq}`
}

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: false }, { status: 401 })
    const { items, total_amount, memo } = await req.json()
    const service = createServiceClient()
    const order_number = generateOrderNumber()

    const { data: order, error: orderErr } = await service.from('orders').insert({
      user_id: user.id,
      order_number,
      total_amount,
      status: 'pending',
      memo: memo || null,
      shipping_name: '',
      shipping_phone: '',
      shipping_zipcode: '',
      shipping_address1: '',
    }).select().single()

    if (orderErr) return NextResponse.json({ ok: false, error: orderErr.message }, { status: 500 })

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      unit_price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }))

    await service.from('order_items').insert(orderItems)
    await service.from('cart_items').delete().eq('user_id', user.id).in('product_id', items.map((i: any) => i.product_id))

    return NextResponse.json({ ok: true, order_number })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
