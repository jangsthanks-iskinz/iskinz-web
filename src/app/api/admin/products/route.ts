import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('[products API] body:', JSON.stringify(body).slice(0, 200))
    
    const supabase = createServiceClient()
    console.log('[products API] supabase url:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    const { data, error } = await supabase.from('products').insert(body).select()
    console.log('[products API] result:', { data, error })
    
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, data })
  } catch (err: any) {
    console.error('[products API] catch error:', err?.message)
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...body } = await req.json()
    const supabase = createServiceClient()
    const { error } = await supabase.from('products').update(body).eq('id', id)
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
