import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { CartContent } from './CartContent'

export default async function CartPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const service = createServiceClient()
  const { data: initialItems } = await service
    .from('cart_items')
    .select('id, user_id, product_id, quantity, products(id, name_ko, name_en, image_url, price, sale_price)')
    .eq('user_id', user.id)

  return <CartContent initialItems={initialItems ?? []} />
}
