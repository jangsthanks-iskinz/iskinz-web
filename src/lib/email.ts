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

export async function sendContactEmail(data: { name: string; phone: string; email: string; inquiryType: string; message: string }) {
  return resend.emails.send({ from: FROM, to: CONTACT_TO, subject: `[ISKINZ 문의] ${data.inquiryType} - ${data.name}`, react: ContactEmail(data) })
}

export async function sendOrderConfirmEmail(order: Order, customerEmail: string) {
  return resend.emails.send({ from: FROM, to: customerEmail, subject: `[ISKINZ] 주문이 완료되었습니다 (${order.order_number})`, react: OrderConfirmEmail({ order }) })
}

export async function sendSignupNotifyEmail(data: {
  name: string; email: string; hospitalName?: string; phone?: string;
  memberType?: string; birthDate?: string; licenseNumber?: string;
  businessNumber?: string; postcode?: string; address?: string; addressDetail?: string;
  approveToken?: string;
}) {
  return resend.emails.send({
    from: FROM, to: ADMIN_EMAIL,
    subject: `신규가입 승인 대기_${data.hospitalName ?? data.name}`,
    react: SignupNotifyEmail(data),
  })
}

export async function sendApproveNotifyEmail(data: { name: string; email: string; approved: boolean }) {
  return resend.emails.send({
    from: FROM, to: data.email,
    subject: data.approved ? '[ISKINZ] 회원 승인이 완료되었습니다' : '[ISKINZ] 회원 승인이 취소되었습니다',
    react: ApproveNotifyEmail(data),
  })
}
