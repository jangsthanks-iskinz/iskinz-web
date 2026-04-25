import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ ok: false }, { status: 400 })
    const supabase = createServiceClient()
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    const { error } = await supabase.storage.from('products').upload(path, buffer, {
      contentType: file.type,
    })
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    const { data } = supabase.storage.from('products').getPublicUrl(path)
    return NextResponse.json({ ok: true, url: data.publicUrl })
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
