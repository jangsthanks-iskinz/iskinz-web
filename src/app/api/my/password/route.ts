import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 })

    const { currentPassword, newPassword } = await req.json()
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ message: '새 비밀번호는 6자 이상이어야 합니다.' }, { status: 400 })
    }

    // Re-authenticate with current password to verify identity
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    })
    if (signInError) {
      return NextResponse.json({ message: '현재 비밀번호가 올바르지 않습니다.' }, { status: 400 })
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    if (updateError) {
      return NextResponse.json({ message: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
