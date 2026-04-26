import { createServiceClient } from '@/lib/supabase/service'
import { AdminOrdersContent } from './AdminOrdersContent'
import { STATUS_OPTIONS } from './constants'

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = createServiceClient()
  const statusFilter = searchParams.status ?? 'all'

  let query = supabase
    .from('orders')
    .select('*, profiles(name, hospital_name, email), order_items(*, products(name_ko, image_url))')
    .order('created_at', { ascending: false })

  if (statusFilter !== 'all') query = query.eq('status', statusFilter)

  const { data: orders } = await query

  return <AdminOrdersContent orders={orders ?? []} statusFilter={statusFilter} statusOptions={STATUS_OPTIONS} />
}
