import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 })

    const { name, hospitalName, phone } = await req.json()
    if (!name) return NextResponse.json({ message: '이름은 필수입니다.' }, { status: 400 })

    const { error } = await supabase
      .from('profiles')
      .update({ name, hospital_name: hospitalName, phone })
      .eq('id', user.id)

    if (error) return NextResponse.json({ message: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
