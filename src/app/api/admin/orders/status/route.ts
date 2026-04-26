import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const ALLOWED_STATUSES = ['pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded']

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { orderId, status } = await req.json()
  if (!ALLOWED_STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  const service = createServiceClient()
  const { error } = await service.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
