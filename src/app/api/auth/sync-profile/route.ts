import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// 회원가입 후 profile에 email 저장 (trigger가 email을 안 채우는 경우 보완)
export async function POST(req: Request) {
  try {
    const { email, name } = await req.json()
    if (!email) return NextResponse.json({ ok: false }, { status: 400 })

    const supabase = createServiceClient()

    // auth.users에서 해당 이메일의 user id 찾기
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const authUser = users.find((u: any) => u.email === email)
    if (!authUser) return NextResponse.json({ ok: false, message: 'user not found' }, { status: 404 })

    // profile에 email, name 업데이트
    const { error } = await supabase
      .from('profiles')
      .update({ email, name: name || authUser.user_metadata?.name })
      .eq('id', authUser.id)

    if (error) {
      console.error('[sync-profile error]', error)
      return NextResponse.json({ ok: false }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[sync-profile error]', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
