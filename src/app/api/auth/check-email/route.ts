import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ exists: false })
  const supabase = createServiceClient()
  const { data } = await supabase.auth.admin.listUsers()
  const exists = data?.users?.some(u => u.email === email) ?? false
  return NextResponse.json({ exists })
}
