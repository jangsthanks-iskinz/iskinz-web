import { NextResponse } from 'next/server'
import { sendSignupNotifyEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { name, email, hospitalName, phone } = await req.json()
    if (!email) return NextResponse.json({ ok: false }, { status: 400 })
    const { error } = await sendSignupNotifyEmail({ name, email, hospitalName, phone })
    if (error) console.error('[Signup Notify Email Error]', error)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Signup Notify API Error]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
