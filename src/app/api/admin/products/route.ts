import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('products').insert({
      name_ko: body.name,
      name_en: body.name_en || null,
      category_id: body.category_id || null,
      description: body.description || null,
      price: body.price || null,
      sale_price: body.sale_price || null,
      stock_qty: body.stock || 0,
      in_stock: (body.stock || 0) > 0,
      is_active: body.is_active,
      content: body.content || null,
      image_url: body.image_url || null,
      product_info: body.product_info || null,
      shipping: body.shipping || null,
      refund: body.refund || null,
    }).select()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, data })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...body } = await req.json()
    const supabase = createServiceClient()
    const { error } = await supabase.from('products').update({
      name_ko: body.name,
      name_en: body.name_en || null,
      category_id: body.category_id || null,
      description: body.description || null,
      price: body.price || null,
      sale_price: body.sale_price || null,
      stock_qty: body.stock || 0,
      in_stock: (body.stock || 0) > 0,
      is_active: body.is_active,
      content: body.content || null,
      image_url: body.image_url || null,
      product_info: body.product_info || null,
      shipping: body.shipping || null,
      refund: body.refund || null,
    }).eq('id', id)
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
