import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { CheckoutContent } from './CheckoutContent'

export default async function CheckoutPage({ searchParams }: { searchParams: { items?: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, phone, address, address_detail, postcode, approved')
    .eq('id', user.id)
    .single()

  if (!profile?.approved) redirect('/')

  const service = createServiceClient()
  const selectedIds = searchParams.items ? searchParams.items.split(',') : null

  let cartQuery = service
    .from('cart_items')
    .select('id, product_id, quantity, products(id, name_ko, name_en, image_url, price, sale_price)')
    .eq('user_id', user.id)

  if (selectedIds) cartQuery = cartQuery.in('product_id', selectedIds)

  const { data: cartItems } = await cartQuery

  if (!cartItems || cartItems.length === 0) redirect('/cart')

  return <CheckoutContent cartItems={cartItems} profile={profile} />
}
