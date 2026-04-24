import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ ok: false }, { status: 400 })
    const supabase = createServiceClient()
    await supabase.from('profiles').delete().eq('id', userId)
    await supabase.auth.admin.deleteUser(userId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
