import { Resend } from 'resend'
import { ContactEmail } from '@/emails/ContactEmail'
import { OrderConfirmEmail } from '@/emails/OrderConfirmEmail'
import { SignupNotifyEmail } from '@/emails/SignupNotifyEmail'
import { ApproveNotifyEmail } from '@/emails/ApproveNotifyEmail'
import type { Order } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM ?? 'ISKINZ <noreply@iskinz.com>'
const CONTACT_TO = process.env.CONTACT_TO ?? 'ceo@iskinz.com'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'ceo@iskinz.com'

// 문의 이메일 발송
export async function sendContactEmail(data: {
  name: string
  phone: string
  email: string
  inquiryType: string
  message: string
}) {
  return resend.emails.send({
    from: FROM,
    to: CONTACT_TO,
    subject: `[ISKINZ 문의] ${data.inquiryType} - ${data.name}`,
    react: ContactEmail(data),
  })
}

// 주문 확인 이메일 (고객용)
export async function sendOrderConfirmEmail(order: Order, customerEmail: string) {
  return resend.emails.send({
    from: FROM,
    to: customerEmail,
    subject: `[ISKINZ] 주문이 완료되었습니다 (${order.order_number})`,
    react: OrderConfirmEmail({ order }),
  })
}

// 신규 회원가입 알림 → 관리자
export async function sendSignupNotifyEmail(data: {
  name: string; email: string; hospitalName?: string; phone?: string
}) {
  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `[ISKINZ] 새 회원 승인 요청 — ${data.name} (${data.hospitalName ?? '-'})`,
    react: SignupNotifyEmail(data),
  })
}

// 승인 완료 알림 → 회원
export async function sendApproveNotifyEmail(data: {
  name: string; email: string; approved: boolean
}) {
  return resend.emails.send({
    from: FROM,
    to: data.email,
    subject: data.approved ? '[ISKINZ] 회원 승인이 완료되었습니다' : '[ISKINZ] 회원 승인이 취소되었습니다',
    react: ApproveNotifyEmail(data),
  })
}
