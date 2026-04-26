import { createServiceClient } from '@/lib/supabase/service'
import { AdminOrdersContent } from './AdminOrdersContent'

export const STATUS_OPTIONS = [
  { value: 'pending',   label: '결제 대기', color: '#C6A052' },
  { value: 'paid',      label: '결제 완료', color: '#1A3055' },
  { value: 'preparing', label: '준비 중',   color: '#3B82F6' },
  { value: 'shipped',   label: '배송 중',   color: '#8B5CF6' },
  { value: 'delivered', label: '배송 완료', color: '#4A7C59' },
  { value: 'cancelled', label: '취소',      color: '#B84A4A' },
  { value: 'refunded',  label: '환불',      color: '#6B7280' },
]

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
