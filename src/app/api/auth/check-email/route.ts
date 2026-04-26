import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const createServiceClient() = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ exists: false })

  const { data } = await createServiceClient().auth.admin.listUsers()
  const exists = data?.users?.some(u => u.email === email) ?? false
  return NextResponse.json({ exists })
}
