import { NextResponse } from 'next/server'
import { sendSignupNotifyEmail } from '@/lib/email'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, hospitalName, phone, memberType, birthDate, licenseNumber, businessNumber, postcode, address, addressDetail } = body
    if (!email) return NextResponse.json({ ok: false }, { status: 400 })

    const supabase = createServiceClient()

    // 1회용 토큰 생성
    const { data: tokenData } = await supabase
      .from('approval_tokens')
      .insert({ user_email: email })
      .select('token')
      .single()
    const approveToken = tokenData?.token ?? null

    // admin role 유저 이메일 전체 조회
    const { data: admins } = await supabase
      .from('profiles')
      .select('email')
      .eq('role', 'admin')

    const adminEmails = admins?.map((a: any) => a.email).filter(Boolean) ?? []
    const fallbackEmail = process.env.ADMIN_EMAIL ?? 'ceo@iskinz.com'
    const toEmails = adminEmails.length > 0 ? adminEmails : [fallbackEmail]

    // 모든 관리자에게 발송
    await Promise.all(toEmails.map((toEmail: string) =>
      sendSignupNotifyEmail({ name, email, hospitalName, phone, memberType, birthDate, licenseNumber, businessNumber, postcode, address, addressDetail, approveToken, toEmail })
    ))

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Signup Notify API Error]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
