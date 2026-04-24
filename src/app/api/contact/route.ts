import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { sendContactEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, email, inquiryType, message } = body

    // 유효성 검사
    if (!name || !email || !message) {
      return NextResponse.json({ message: '필수 항목을 입력해주세요.' }, { status: 400 })
    }

    // Supabase에 문의 저장
    const supabase = createServiceClient()
    const { error: dbError } = await supabase.from('inquiries').insert({
      name, phone, email,
      inquiry_type: inquiryType,
      message,
      status: 'unread',
    })
    if (dbError) console.error('[Contact DB Error]', dbError)

    // Resend로 이메일 발송
    const { error: emailError } = await sendContactEmail({ name, phone, email, inquiryType, message })
    if (emailError) console.error('[Contact Email Error]', emailError)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Contact API Error]', err)
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
