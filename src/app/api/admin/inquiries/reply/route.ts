import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM ?? 'ISKINZ <noreply@iskinz.com>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'ceo@iskinz.com'

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { inquiryId, customerEmail, customerName, inquiryType, originalMessage, reply } = await req.json()

    // 고객에게 답변 발송 (ceo CC)
    const { error } = await resend.emails.send({
      from: FROM,
      to: customerEmail,
      cc: ADMIN_EMAIL,
      subject: `RE: [ISKINZ] ${inquiryType} 답변`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #f5f4f1; padding: 40px 20px;">
          <div style="background: #fff; border: 1px solid #c8cdd4;">
            <div style="background: #1e2025; padding: 24px 32px;">
              <p style="font-family: Georgia, serif; font-size: 22px; color: #fff; margin: 0; letter-spacing: 4px;">ISKINZ</p>
            </div>
            <div style="padding: 32px;">
              <p style="font-size: 14px; color: #1e2025; margin-bottom: 8px;">안녕하세요, <strong>${customerName}</strong>님.</p>
              <p style="font-size: 14px; color: #1e2025; margin-bottom: 24px;">문의해 주셔서 감사합니다. 아래와 같이 답변드립니다.</p>
              <div style="background: #f5f4f1; border-left: 3px solid #b5a99a; padding: 16px 20px; margin-bottom: 24px; font-size: 14px; color: #3a3d44; line-height: 1.8; white-space: pre-wrap;">${reply}</div>
              <hr style="border: none; border-top: 1px solid #e8ebee; margin: 24px 0;" />
              <p style="font-size: 11px; color: #8a9099; margin-bottom: 8px;">원본 문의</p>
              <div style="font-size: 12px; color: #8a9099; line-height: 1.7; white-space: pre-wrap;">${originalMessage}</div>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('[Inquiry Reply Error]', error)
      return NextResponse.json({ ok: false }, { status: 500 })
    }

    // 문의 상태를 replied로 업데이트
    const supabase = createServiceClient()
    await supabase.from('inquiries').update({ status: 'replied' }).eq('id', inquiryId)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Inquiry Reply API Error]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
