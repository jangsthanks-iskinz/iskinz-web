import { NextResponse } from 'next/server'
import { sendSignupNotifyEmail } from '@/lib/email'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, hospitalName, phone, memberType, birthDate, licenseNumber, businessNumber, postcode, address, addressDetail } = body
    if (!email) return NextResponse.json({ ok: false }, { status: 400 })

    // 1회용 토큰 생성
    const supabase = createServiceClient()
    const { data: tokenData } = await supabase
      .from('approval_tokens')
      .insert({ user_email: email })
      .select('token')
      .single()

    const approveToken = tokenData?.token ?? null

    const { error } = await sendSignupNotifyEmail({ name, email, hospitalName, phone, memberType, birthDate, licenseNumber, businessNumber, postcode, address, addressDetail, approveToken })
    if (error) console.error('[Signup Notify Email Error]', error)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Signup Notify API Error]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
