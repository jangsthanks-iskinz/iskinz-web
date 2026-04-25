import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })
  const service = createServiceClient()
  const { data } = await service.from('cart_items').select('*, products(id, name_ko, name_en, image_url, price, sale_price)').eq('user_id', user.id)
  return NextResponse.json({ ok: true, data })
}

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })
  const { product_id, quantity = 1 } = await req.json()
  const service = createServiceClient()
  const { error } = await service.from('cart_items').upsert({ user_id: user.id, product_id, quantity }, { onConflict: 'user_id,product_id' })
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })
  const { product_id } = await req.json()
  const service = createServiceClient()
  await service.from('cart_items').delete().eq('user_id', user.id).eq('product_id', product_id)
  return NextResponse.json({ ok: true })
}
