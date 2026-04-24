import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendApproveNotifyEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 })

    const { email, name, approved } = await req.json()
    if (!email) return NextResponse.json({ ok: false }, { status: 400 })

    const { error } = await sendApproveNotifyEmail({ email, name, approved })
    if (error) console.error('[Approve Notify Email Error]', error)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Approve Notify API Error]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
