import { createServiceClient } from '@/lib/supabase/service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://iskinz.com'

  if (!token) return new NextResponse('잘못된 요청입니다.', { status: 400 })

  const supabase = createServiceClient()

  // 토큰 조회
  const { data: tokenData, error: tokenError } = await supabase
    .from('approval_tokens')
    .select('*')
    .eq('token', token)
    .eq('used', false)
    .single()

  if (tokenError || !tokenData) {
    return new NextResponse('이미 사용되었거나 유효하지 않은 링크입니다.', { status: 400 })
  }

  // 유저 승인
  const { error: approveError } = await supabase
    .from('profiles')
    .update({ approved: true })
    .eq('email', tokenData.user_email)

  if (approveError) return new NextResponse('승인 처리 중 오류가 발생했습니다.', { status: 500 })

  // 토큰 사용 처리
  await supabase.from('approval_tokens').update({ used: true }).eq('token', token)

  return NextResponse.redirect(`${BASE_URL}/admin/users?status=approved`)
}
